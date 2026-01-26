#!/usr/bin/env python3
"""
Nano Banana Image Generator
============================
Generates culturally personalized profile images using Google's Gemini API
(Nano Banana / Nano Banana Pro models).

This script takes YOUR photo and transforms it into culturally-dressed versions
for each country/region.

Usage:
    # Set your API key
    export GEMINI_API_KEY="your-api-key-here"
    
    # Generate all images using your photo
    python generate_images.py --all --image kiran_img.jpg
    
    # Generate specific country
    python generate_images.py --country JP --image kiran_img.jpg
    
    # Use Nano Banana Pro (higher quality, slower)
    python generate_images.py --all --image kiran_img.jpg --pro

Requirements:
    pip install google-genai pillow

Author: Vincent's Website Generator
"""

import os
import sys
import json
import time
import base64
import argparse
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from datetime import datetime

try:
    from PIL import Image
except ImportError:
    print("❌ PIL not found. Install with: pip install pillow")
    sys.exit(1)


# =============================================================================
# CONFIGURATION
# =============================================================================

@dataclass
class Config:
    """Configuration for the image generator."""
    api_key: str
    model: str
    output_dir: Path
    prompts_file: Path
    reference_image: Path
    delay_between_requests: float
    max_retries: int
    retry_delay: float


# Correct model names for Nano Banana
MODELS = {
    "standard": "gemini-2.5-flash-image",      # Nano Banana (fast)
    "pro": "gemini-3-pro-image-preview",        # Nano Banana Pro (higher quality)
}

DEFAULT_CONFIG = {
    "delay_between_requests": 3.0,  # Be nice to the API
    "max_retries": 3,
    "retry_delay": 10.0,
}


# =============================================================================
# PROMPT TRANSFORMER
# =============================================================================

def transform_prompt_for_editing(original_prompt: str, style_notes: str) -> str:
    """
    Transform the generation prompt into an editing prompt that works
    with a reference image.
    """
    # Extract the key clothing/style description from the original prompt
    # The original prompts have "wearing X" descriptions we want to keep
    
    editing_prompt = f"""Transform this person's photo into a professional portrait 
where they are wearing the following attire while maintaining their exact facial features, 
expression, and likeness:

{original_prompt}

CRITICAL INSTRUCTIONS:
- Keep the person's face, facial features, and expression EXACTLY the same
- Only change the clothing/attire as described
- Maintain professional portrait lighting and composition
- Keep the background clean and neutral
- The result should look like a high-quality professional headshot
- Do NOT change the person's appearance, only their attire

Style guidance: {style_notes}
"""
    return editing_prompt


# =============================================================================
# GEMINI API CLIENT
# =============================================================================

class GeminiImageGenerator:
    """Client for generating images using Google's Gemini API."""
    
    def __init__(self, config: Config):
        self.config = config
        self._client = None
        self._setup_client()
        self._load_reference_image()
    
    def _setup_client(self):
        """Initialize the Gemini client."""
        try:
            from google import genai
            from google.genai import types
            self._genai = genai
            self._types = types
            self._client = genai.Client(api_key=self.config.api_key)
            print(f"✅ Gemini client initialized")
            print(f"   Model: {self.config.model}")
        except ImportError:
            print("❌ Error: google-genai package not installed.")
            print("   Install with: pip install google-genai pillow")
            sys.exit(1)
    
    def _load_reference_image(self):
        """Load the reference image."""
        if not self.config.reference_image.exists():
            print(f"❌ Reference image not found: {self.config.reference_image}")
            sys.exit(1)
        
        self._reference_image = Image.open(self.config.reference_image)
        print(f"   Reference image: {self.config.reference_image}")
        print(f"   Image size: {self._reference_image.size}")
    
    def generate_image(
        self,
        prompt: str,
        style_notes: str,
        filename: str = "output.png"
    ) -> Optional[Path]:
        """
        Generate an edited image from the reference photo.
        
        Args:
            prompt: The original generation prompt (will be transformed)
            style_notes: Additional style guidance
            filename: Output filename
            
        Returns:
            Path to the saved image, or None if generation failed
        """
        # Transform the prompt for image editing
        editing_prompt = transform_prompt_for_editing(prompt, style_notes)
        
        for attempt in range(self.config.max_retries):
            try:
                print(f"   🎨 Generating image (attempt {attempt + 1}/{self.config.max_retries})...")
                
                # Make the API call with image + text
                response = self._client.models.generate_content(
                    model=self.config.model,
                    contents=[editing_prompt, self._reference_image],
                )
                
                # Extract and save the image
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'inline_data') and part.inline_data is not None:
                        # Get as PIL Image and save
                        try:
                            generated_image = part.as_image()
                        except:
                            # Fallback: decode manually
                            image_data = part.inline_data.data
                            if isinstance(image_data, str):
                                image_data = base64.b64decode(image_data)
                            
                            import io
                            generated_image = Image.open(io.BytesIO(image_data))
                        
                        # Determine output path
                        output_path = self.config.output_dir / filename
                        
                        # Create directories if needed
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        
                        # Save as PNG for quality
                        if not str(output_path).endswith(('.png', '.jpg', '.webp')):
                            output_path = output_path.with_suffix('.png')
                        
                        generated_image.save(output_path)
                        print(f"   ✅ Saved: {output_path}")
                        return output_path
                    
                    elif hasattr(part, 'text') and part.text:
                        # Model returned text instead of image
                        print(f"   ℹ️  Model response: {part.text[:200]}...")
                
                print(f"   ⚠️  No image in response, retrying...")
                time.sleep(self.config.retry_delay)
                
            except Exception as e:
                error_msg = str(e)
                print(f"   ❌ Error: {error_msg}")
                
                # Check for rate limiting
                if "429" in error_msg or "quota" in error_msg.lower() or "rate" in error_msg.lower():
                    wait_time = self.config.retry_delay * (attempt + 2)
                    print(f"   ⏳ Rate limited. Waiting {wait_time}s...")
                    time.sleep(wait_time)
                elif "safety" in error_msg.lower() or "blocked" in error_msg.lower():
                    print(f"   🚫 Content blocked by safety filters. Skipping.")
                    return None
                elif "not found" in error_msg.lower() or "not supported" in error_msg.lower():
                    print(f"   ❌ Model not available. Check your API access.")
                    print(f"      Try: --pro flag for gemini-3-pro-image-preview")
                    return None
                else:
                    time.sleep(self.config.retry_delay)
        
        print(f"   ❌ Failed after {self.config.max_retries} attempts")
        return None


# =============================================================================
# BATCH PROCESSOR
# =============================================================================

class BatchImageGenerator:
    """Processes all prompts and generates images."""
    
    def __init__(self, config: Config, prompts_data: dict):
        self.config = config
        self.prompts = prompts_data
        self.generator = GeminiImageGenerator(config)
        
        self.results = {
            "successful": [],
            "failed": [],
            "skipped": [],
        }
    
    def process_single(self, code: str, data: dict, category: str = "country") -> bool:
        """Process a single prompt."""
        print(f"\n{'='*60}")
        print(f"🌍 {data['name']} ({code})")
        print(f"{'='*60}")
        print(f"   📁 Output: {data['filename']}")
        print(f"   👔 Style: {data['traditional_dress']}")
        
        result = self.generator.generate_image(
            prompt=data["prompt"],
            style_notes=data.get("style_notes", ""),
            filename=data["filename"]
        )
        
        if result:
            self.results["successful"].append({
                "code": code,
                "name": data["name"],
                "path": str(result)
            })
            return True
        else:
            self.results["failed"].append({
                "code": code,
                "name": data["name"],
                "filename": data["filename"]
            })
            return False
    
    def process_all(self, include_countries: bool = True, include_regions: bool = True, include_default: bool = True):
        """Process all prompts."""
        total = 0
        
        if include_countries:
            total += len(self.prompts.get("countries", {}))
        if include_regions:
            total += len(self.prompts.get("regions", {}))
        if include_default:
            total += 1
        
        print(f"\n🚀 Starting batch generation of {total} images")
        print(f"   Model: {self.config.model}")
        print(f"   Output: {self.config.output_dir}")
        print(f"   Reference: {self.config.reference_image}")
        print(f"   Delay between requests: {self.config.delay_between_requests}s")
        
        current = 0
        start_time = datetime.now()
        
        # Process countries
        if include_countries:
            for code, data in self.prompts.get("countries", {}).items():
                current += 1
                print(f"\n[{current}/{total}] Processing country: {code}")
                self.process_single(code, data, "country")
                time.sleep(self.config.delay_between_requests)
        
        # Process regions
        if include_regions:
            for code, data in self.prompts.get("regions", {}).items():
                current += 1
                print(f"\n[{current}/{total}] Processing region: {code}")
                self.process_single(code, data, "region")
                time.sleep(self.config.delay_between_requests)
        
        # Process default
        if include_default and self.prompts.get("default"):
            current += 1
            print(f"\n[{current}/{total}] Processing default")
            self.process_single("DEFAULT", self.prompts["default"], "default")
        
        # Summary
        elapsed = datetime.now() - start_time
        self.print_summary(elapsed)
    
    def process_country(self, code: str):
        """Process a single country."""
        code = code.upper()
        if code not in self.prompts.get("countries", {}):
            print(f"❌ Country code '{code}' not found in prompts")
            print("   Available:", ", ".join(self.prompts.get("countries", {}).keys()))
            return
        
        self.process_single(code, self.prompts["countries"][code], "country")
    
    def process_region(self, code: str):
        """Process a single region."""
        code = code.upper()
        if code not in self.prompts.get("regions", {}):
            print(f"❌ Region code '{code}' not found in prompts")
            print("   Available:", ", ".join(self.prompts.get("regions", {}).keys()))
            return
        
        self.process_single(code, self.prompts["regions"][code], "region")
    
    def print_summary(self, elapsed):
        """Print generation summary."""
        print("\n" + "=" * 60)
        print("📊 GENERATION SUMMARY")
        print("=" * 60)
        print(f"   ⏱️  Total time: {elapsed}")
        print(f"   ✅ Successful: {len(self.results['successful'])}")
        print(f"   ❌ Failed: {len(self.results['failed'])}")
        print(f"   ⏭️  Skipped: {len(self.results['skipped'])}")
        
        if self.results["successful"]:
            print("\n   ✅ Successfully generated:")
            for item in self.results["successful"]:
                print(f"      - {item['name']} ({item['code']})")
        
        if self.results["failed"]:
            print("\n   ❌ Failed items:")
            for item in self.results["failed"]:
                print(f"      - {item['name']} ({item['code']})")
        
        # Save results log
        log_path = self.config.output_dir / "generation_log.json"
        with open(log_path, "w") as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "model": self.config.model,
                "reference_image": str(self.config.reference_image),
                "elapsed_seconds": elapsed.total_seconds(),
                **self.results
            }, f, indent=2)
        print(f"\n   📝 Log saved to: {log_path}")


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Generate culturally personalized profile images using Gemini/Nano Banana API"
    )
    parser.add_argument(
        "--image", "-i",
        type=str,
        required=True,
        help="Path to your reference photo (e.g., kiran_img.jpg)"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Generate all images (countries, regions, and default)"
    )
    parser.add_argument(
        "--country", "-c",
        type=str,
        help="Generate image for a specific country code (e.g., US, IN, JP)"
    )
    parser.add_argument(
        "--region", "-r",
        type=str,
        help="Generate image for a specific region code (e.g., MIDDLE_EAST)"
    )
    parser.add_argument(
        "--countries-only",
        action="store_true",
        help="Generate only country images (no regions)"
    )
    parser.add_argument(
        "--regions-only",
        action="store_true",
        help="Generate only region images (no countries)"
    )
    parser.add_argument(
        "--pro",
        action="store_true",
        help="Use Nano Banana Pro model (gemini-3-pro-image-preview) - higher quality, slower"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="./profile-images",
        help="Output directory for generated images"
    )
    parser.add_argument(
        "--prompts", "-p",
        type=str,
        default="./prompts.json",
        help="Path to prompts.json file"
    )
    parser.add_argument(
        "--api-key", "-k",
        type=str,
        help="Gemini API key (or set GEMINI_API_KEY env var)"
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=3.0,
        help="Delay between API requests in seconds (default: 3.0)"
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List available country and region codes"
    )
    
    args = parser.parse_args()
    
    # Load prompts file
    prompts_path = Path(args.prompts)
    if not prompts_path.exists():
        print(f"❌ Prompts file not found: {prompts_path}")
        print("   Generate it first with: python generate_profile_prompts.py --all --output prompts.json")
        sys.exit(1)
    
    with open(prompts_path, "r") as f:
        prompts_data = json.load(f)
    
    # Handle --list
    if args.list:
        print("\n🌍 AVAILABLE COUNTRY CODES:")
        print("-" * 40)
        for code, data in sorted(prompts_data.get("countries", {}).items()):
            print(f"  {code:4} - {data['name']}")
        
        print("\n🗺️  AVAILABLE REGION CODES:")
        print("-" * 40)
        for code, data in sorted(prompts_data.get("regions", {}).items()):
            print(f"  {code:20} - {data['name']}")
        
        print("\n📋 MODELS:")
        print("-" * 40)
        print(f"  Standard: {MODELS['standard']} (faster)")
        print(f"  Pro:      {MODELS['pro']} (higher quality, use --pro)")
        return
    
    # Check reference image
    if not args.image:
        print("❌ Reference image required!")
        print("   Use: --image kiran_img.jpg")
        sys.exit(1)
    
    reference_image = Path(args.image)
    if not reference_image.exists():
        print(f"❌ Reference image not found: {reference_image}")
        sys.exit(1)
    
    # Get API key
    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ No API key provided!")
        print("   Set GEMINI_API_KEY environment variable or use --api-key flag")
        print("\n   Example:")
        print("   export GEMINI_API_KEY='your-key-here'")
        print("   python generate_images.py --all --image kiran_img.jpg")
        sys.exit(1)
    
    # Select model
    model = MODELS["pro"] if args.pro else MODELS["standard"]
    
    # Create config
    config = Config(
        api_key=api_key,
        model=model,
        output_dir=Path(args.output),
        prompts_file=prompts_path,
        reference_image=reference_image,
        delay_between_requests=args.delay,
        max_retries=DEFAULT_CONFIG["max_retries"],
        retry_delay=DEFAULT_CONFIG["retry_delay"],
    )
    
    # Create output directory
    config.output_dir.mkdir(parents=True, exist_ok=True)
    (config.output_dir / "regions").mkdir(parents=True, exist_ok=True)
    
    # Initialize batch processor
    batch = BatchImageGenerator(config, prompts_data)
    
    # Process based on arguments
    if args.country:
        batch.process_country(args.country)
    elif args.region:
        batch.process_region(args.region)
    elif args.all:
        batch.process_all(
            include_countries=True,
            include_regions=True,
            include_default=True
        )
    elif args.countries_only:
        batch.process_all(
            include_countries=True,
            include_regions=False,
            include_default=False
        )
    elif args.regions_only:
        batch.process_all(
            include_countries=False,
            include_regions=True,
            include_default=False
        )
    else:
        parser.print_help()
        print("\n" + "=" * 60)
        print("💡 QUICK START")
        print("=" * 60)
        print("\n1. Set your API key:")
        print("   export GEMINI_API_KEY='your-key-here'")
        print("\n2. Generate a single test image:")
        print("   python generate_images.py --country JP --image kiran_img.jpg")
        print("\n3. Generate all images:")
        print("   python generate_images.py --all --image kiran_img.jpg")
        print("\n4. Use higher quality model:")
        print("   python generate_images.py --all --image kiran_img.jpg --pro")


if __name__ == "__main__":
    main()
