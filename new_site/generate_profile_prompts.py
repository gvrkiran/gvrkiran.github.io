#!/usr/bin/env python3
"""
Nano Banana Image Generation Prompts
=====================================
Generates prompts for creating culturally personalized profile images
for Vincent's academic website.

Target countries:
- Top 20 OECD countries by significance
- India, China, Brazil (major emerging markets)
- Regional fallbacks for rest of world

Usage:
    python generate_profile_prompts.py --output prompts.json
    python generate_profile_prompts.py --country US --preview
    python generate_profile_prompts.py --all --save-to-file
"""

import json
import argparse
from dataclasses import dataclass
from typing import Optional
from pathlib import Path


@dataclass
class ImagePrompt:
    """Structured prompt data for image generation."""
    code: str
    name: str
    filename: str
    prompt: str
    negative_prompt: str
    style_notes: str
    traditional_dress: str
    color_palette: list[str]


# =============================================================================
# BASE PROMPT TEMPLATE
# =============================================================================

BASE_PROMPT_TEMPLATE = """
Professional portrait photograph of a South Asian man in his early 30s, 
{dress_description}, 
warm genuine smile, intelligent and approachable expression,
soft studio lighting with subtle rim light,
clean neutral background with very subtle {background_hint},
high-end editorial photography style,
shot on medium format camera, shallow depth of field,
color grading with {color_mood},
8K resolution, photorealistic, hyperdetailed
""".strip().replace('\n', ' ')

BASE_NEGATIVE_PROMPT = """
cartoon, anime, illustration, painting, drawing, sketch,
distorted face, ugly, deformed, disfigured,
low quality, blurry, pixelated, grainy,
watermark, text, logo, signature,
multiple people, crowd, group,
harsh shadows, overexposed, underexposed,
busy background, cluttered, distracting elements,
exaggerated features, unrealistic proportions,
stock photo feel, generic corporate,
costume-like, theatrical, Halloween,
overly ornate, gaudy, excessive accessories
""".strip().replace('\n', ' ')


# =============================================================================
# COUNTRY-SPECIFIC PROMPTS
# =============================================================================

COUNTRY_PROMPTS: dict[str, dict] = {
    # -------------------------------------------------------------------------
    # UNITED STATES
    # -------------------------------------------------------------------------
    "US": {
        "name": "United States",
        "traditional_dress": "Smart casual American style - well-fitted navy blazer over a crisp white oxford shirt, no tie, top button open",
        "dress_description": "wearing a perfectly tailored navy blue blazer over a crisp white oxford cloth button-down shirt, collar open casually, modern American professional style",
        "background_hint": "warm wood tones suggesting a university office",
        "color_mood": "warm neutrals with subtle blue undertones, Ivy League aesthetic",
        "color_palette": ["#002868", "#BF0A30", "#FFFFFF", "#1C3A5F"],
        "style_notes": "Think: Young professor at a top university. Approachable but clearly accomplished. The look should say 'I could be presenting at a conference or grabbing coffee with students.'"
    },
    
    # -------------------------------------------------------------------------
    # INDIA
    # -------------------------------------------------------------------------
    "IN": {
        "name": "India",
        "traditional_dress": "Elegant kurta - either a sophisticated neutral tone or subtle traditional pattern",
        "dress_description": "wearing an elegantly tailored kurta in rich ivory with subtle gold thread work at the collar, contemporary cut that bridges traditional and modern",
        "background_hint": "warm terracotta and cream tones evoking Indian architectural aesthetics",
        "color_mood": "warm saffron and cream tones, rich but not overwhelming",
        "color_palette": ["#FF9933", "#FFFFFF", "#138808", "#000080"],
        "style_notes": "Sophisticated modern Indian aesthetic. The kurta should look like something worn to an upscale Delhi gallery opening - traditional roots, contemporary execution."
    },
    
    # -------------------------------------------------------------------------
    # CHINA
    # -------------------------------------------------------------------------
    "CN": {
        "name": "China",
        "traditional_dress": "Modern Tang jacket or Zhongshan suit-inspired collar",
        "dress_description": "wearing a refined modern Tang jacket in deep charcoal with subtle mandarin collar, minimalist Chinese design sensibility, silk-like texture",
        "background_hint": "clean lines suggesting Chinese ink painting negative space",
        "color_mood": "sophisticated grays with subtle red accents, elegant restraint",
        "color_palette": ["#DE2910", "#FFDE00", "#1A1A1A", "#8B0000"],
        "style_notes": "Modern Chinese elegance - think tech executive meets traditional scholar. Clean lines, impeccable fit, subtle cultural signifiers."
    },
    
    # -------------------------------------------------------------------------
    # BRAZIL
    # -------------------------------------------------------------------------
    "BR": {
        "name": "Brazil",
        "traditional_dress": "Relaxed linen suit or elegant casual Brazilian style",
        "dress_description": "wearing a beautifully cut unstructured linen blazer in warm sand color over a clean white crew neck, relaxed Brazilian elegance",
        "background_hint": "warm tropical light with golden hour glow",
        "color_mood": "warm golden tones, sunlit and vibrant but sophisticated",
        "color_palette": ["#009739", "#FFDF00", "#002776", "#C4A962"],
        "style_notes": "São Paulo creative class meets academic. Effortlessly stylish, warm, approachable. The kind of look that works at a beach-side conference or a university lecture."
    },
    
    # -------------------------------------------------------------------------
    # JAPAN
    # -------------------------------------------------------------------------
    "JP": {
        "name": "Japan",
        "traditional_dress": "Modern minimalist Japanese style or subtle haori-inspired jacket",
        "dress_description": "wearing a meticulously tailored charcoal jacket with clean Japanese-inspired lines, minimal details, perfect proportions, subtle texture in the fabric",
        "background_hint": "zen-like negative space with soft natural light",
        "color_mood": "muted earth tones, wabi-sabi aesthetic, intentional imperfection",
        "color_palette": ["#BC002D", "#FFFFFF", "#2D2D2D", "#8B7355"],
        "style_notes": "Muji meets academia. The beauty is in the perfect fit and thoughtful details. Nothing flashy, everything intentional. Could be at a Tokyo design studio or Kyoto university."
    },
    
    # -------------------------------------------------------------------------
    # GERMANY
    # -------------------------------------------------------------------------
    "DE": {
        "name": "Germany",
        "traditional_dress": "Precise German tailoring, clean modern lines",
        "dress_description": "wearing a precisely tailored dark gray wool jacket, crisp white shirt, Bauhaus-inspired minimalism in every detail",
        "background_hint": "architectural precision, clean geometric forms",
        "color_mood": "cool neutrals, precise and balanced, Berlin contemporary",
        "color_palette": ["#000000", "#DD0000", "#FFCC00", "#4A4A4A"],
        "style_notes": "Bauhaus principles applied to personal style. Functional, precise, no excess. Think Berlin tech scene meets traditional German craftsmanship."
    },
    
    # -------------------------------------------------------------------------
    # UNITED KINGDOM
    # -------------------------------------------------------------------------
    "GB": {
        "name": "United Kingdom",
        "traditional_dress": "British tailoring - tweed or classic suiting",
        "dress_description": "wearing a beautifully cut herringbone tweed jacket in muted browns and grays, subtle elbow patches, perfectly British professorial style",
        "background_hint": "warm wood-paneled study, leather and books aesthetic",
        "color_mood": "rich warm browns, heritage greens, classic British palette",
        "color_palette": ["#012169", "#C8102E", "#8B4513", "#2F4F4F"],
        "style_notes": "Oxford don meets contemporary academic. Classic British tailoring but not stuffy. The kind of jacket that has character, looks better with age."
    },
    
    # -------------------------------------------------------------------------
    # FRANCE
    # -------------------------------------------------------------------------
    "FR": {
        "name": "France",
        "traditional_dress": "Effortless Parisian chic",
        "dress_description": "wearing a perfectly fitted navy wool sweater with subtle texture, white shirt collar visible, quintessential Parisian intellectual style",
        "background_hint": "soft Parisian light, cream and warm gray tones",
        "color_mood": "sophisticated navy and cream, Left Bank intellectual palette",
        "color_palette": ["#002395", "#FFFFFF", "#ED2939", "#1C1C1C"],
        "style_notes": "Saint-Germain-des-Prés intellectual. Effortlessly stylish without trying. The kind of person you'd see at a philosophy lecture or a gallery opening."
    },
    
    # -------------------------------------------------------------------------
    # ITALY
    # -------------------------------------------------------------------------
    "IT": {
        "name": "Italy",
        "traditional_dress": "Italian tailored elegance",
        "dress_description": "wearing an impeccably tailored Italian blazer in rich midnight blue, beautiful drape, white pocket square, understated luxury",
        "background_hint": "warm Mediterranean light, terracotta undertones",
        "color_mood": "rich Mediterranean blues, warm earth tones, la dolce vita",
        "color_palette": ["#009246", "#FFFFFF", "#CE2B37", "#1E3A5F"],
        "style_notes": "Milanese sprezzatura - looking this good should seem effortless. Think professor at Bocconi who could also be at Milan Fashion Week."
    },
    
    # -------------------------------------------------------------------------
    # SPAIN
    # -------------------------------------------------------------------------
    "ES": {
        "name": "Spain",
        "traditional_dress": "Warm Spanish elegance",
        "dress_description": "wearing a relaxed but refined linen blazer in warm terracotta, open collar white shirt, Spanish warmth and sophistication",
        "background_hint": "warm ochre and white, Mediterranean architecture feel",
        "color_mood": "warm terracotta, deep reds, Spanish passion tempered with sophistication",
        "color_palette": ["#AA151B", "#F1BF00", "#FFFFFF", "#8B4513"],
        "style_notes": "Madrid gallery owner meets Barcelona academic. Warm, passionate, but refined. Colors that evoke Spanish earth and light."
    },
    
    # -------------------------------------------------------------------------
    # SOUTH KOREA
    # -------------------------------------------------------------------------
    "KR": {
        "name": "South Korea",
        "traditional_dress": "Modern Korean style - K-fashion influenced or subtle hanbok elements",
        "dress_description": "wearing a sleek modern jacket with subtle Korean design elements, clean lines, contemporary Seoul fashion sensibility, perhaps a subtle traditional collar detail",
        "background_hint": "clean minimal Korean aesthetic, soft diffused light",
        "color_mood": "clean whites and soft grays with subtle traditional color accents",
        "color_palette": ["#003478", "#C60C30", "#FFFFFF", "#1A1A2E"],
        "style_notes": "Gangnam professional meets traditional aesthetics. Tech-forward, design-conscious, impeccably groomed. Modern Korea's blend of tradition and innovation."
    },
    
    # -------------------------------------------------------------------------
    # CANADA
    # -------------------------------------------------------------------------
    "CA": {
        "name": "Canada",
        "traditional_dress": "Smart casual Canadian - approachable and warm",
        "dress_description": "wearing a quality flannel-lined jacket in deep forest green over a clean gray sweater, outdoorsy but refined, Canadian warmth",
        "background_hint": "natural light, suggesting vast landscapes and warm interiors",
        "color_mood": "forest greens and warm grays, natural Canadian palette",
        "color_palette": ["#FF0000", "#FFFFFF", "#2E4A3E", "#8B7355"],
        "style_notes": "Toronto academic who also feels at home in the wilderness. Approachable, genuine, quality over flash. Think: could lecture at U of T then go hiking."
    },
    
    # -------------------------------------------------------------------------
    # AUSTRALIA
    # -------------------------------------------------------------------------
    "AU": {
        "name": "Australia",
        "traditional_dress": "Relaxed Australian smart casual",
        "dress_description": "wearing a lightweight unstructured blazer in warm tan over a clean white shirt, relaxed but polished Australian style",
        "background_hint": "warm natural light, eucalyptus and sandstone tones",
        "color_mood": "warm earth tones, golden sunlight, Australian bush palette",
        "color_palette": ["#00008B", "#FFD700", "#8B4513", "#F5DEB3"],
        "style_notes": "Sydney academic who doesn't take himself too seriously. Warm, approachable, genuine. Smart but never stuffy - very Australian."
    },
    
    # -------------------------------------------------------------------------
    # MEXICO
    # -------------------------------------------------------------------------
    "MX": {
        "name": "Mexico",
        "traditional_dress": "Guayabera or Mexican linen elegance",
        "dress_description": "wearing an elegant contemporary guayabera in pristine white with subtle embroidery, beautifully cut, Mexican craftsmanship meets modern design",
        "background_hint": "warm golden light, subtle terracotta and turquoise hints",
        "color_mood": "warm terracotta, bright accents, Mexican color sensibility",
        "color_palette": ["#006341", "#FFFFFF", "#CE1126", "#FFD700"],
        "style_notes": "Mexico City creative class. The guayabera should look sophisticated, not tourist-y. Think: could be at a Condesa gallery or UNAM lecture."
    },
    
    # -------------------------------------------------------------------------
    # NETHERLANDS
    # -------------------------------------------------------------------------
    "NL": {
        "name": "Netherlands",
        "traditional_dress": "Dutch design-forward minimalism",
        "dress_description": "wearing a perfectly cut modernist jacket in charcoal, clean Dutch design aesthetic, functional elegance, perhaps subtle orange accent in pocket square",
        "background_hint": "clean architectural lines, Dutch design sensibility",
        "color_mood": "clean grays with subtle orange accent, Dutch Masters palette",
        "color_palette": ["#21468B", "#FFFFFF", "#FF6600", "#2D2D2D"],
        "style_notes": "Amsterdam creative district professional. Design-conscious, practical, quietly stylish. The kind of look that works at a tech startup or TU Delft."
    },
    
    # -------------------------------------------------------------------------
    # SWITZERLAND
    # -------------------------------------------------------------------------
    "CH": {
        "name": "Switzerland",
        "traditional_dress": "Swiss precision and luxury",
        "dress_description": "wearing an immaculately tailored jacket in deep charcoal, Swiss precision in every stitch, subtle luxury, perhaps a fine merino turtleneck beneath",
        "background_hint": "alpine light, clean and crisp, Swiss precision",
        "color_mood": "pristine neutrals, alpine whites and deep grays",
        "color_palette": ["#FF0000", "#FFFFFF", "#2D2D2D", "#8B8B8B"],
        "style_notes": "Zürich banker meets ETH professor. Understated luxury, impeccable quality, nothing ostentatious. Swiss values in fabric form."
    },
    
    # -------------------------------------------------------------------------
    # SWEDEN
    # -------------------------------------------------------------------------
    "SE": {
        "name": "Sweden",
        "traditional_dress": "Scandinavian minimalism",
        "dress_description": "wearing a beautifully simple knit sweater in soft oatmeal over a clean white shirt, Scandinavian lagom aesthetic, perfectly balanced",
        "background_hint": "soft Nordic light, blonde wood tones, hygge warmth",
        "color_mood": "soft neutrals, pale woods, Swedish design palette",
        "color_palette": ["#006AA7", "#FECC00", "#E5D9C9", "#FFFFFF"],
        "style_notes": "Stockholm creative agency meets Uppsala academia. The epitome of lagom - just right, nothing excessive. Approachable, thoughtful, design-conscious."
    },
    
    # -------------------------------------------------------------------------
    # POLAND
    # -------------------------------------------------------------------------
    "PL": {
        "name": "Poland",
        "traditional_dress": "Polish professional with subtle traditional elements",
        "dress_description": "wearing a well-tailored dark jacket with subtle geometric patterns inspired by Polish folk art, modern interpretation of heritage",
        "background_hint": "warm amber light, suggesting Polish warmth and resilience",
        "color_mood": "rich reds, clean whites, warm amber tones",
        "color_palette": ["#FFFFFF", "#DC143C", "#1C1C1C", "#DAA520"],
        "style_notes": "Warsaw professional with awareness of Polish design heritage. Modern but rooted. The geometric folk patterns should be very subtle - a texture, not a costume."
    },
    
    # -------------------------------------------------------------------------
    # BELGIUM
    # -------------------------------------------------------------------------
    "BE": {
        "name": "Belgium",
        "traditional_dress": "Belgian surrealist-inspired or EU professional",
        "dress_description": "wearing a distinctive but refined jacket, perhaps in unexpected deep burgundy, Belgian eccentricity tempered with classic European tailoring",
        "background_hint": "art nouveau lines, Brussels sophistication",
        "color_mood": "rich burgundies, deep golds, Belgian artistic palette",
        "color_palette": ["#000000", "#FFD700", "#8B0000", "#2D2D2D"],
        "style_notes": "Brussels EU quarter meets Antwerp fashion scene. A touch of Magritte surrealism in the color choice perhaps, but always refined. Intellectual with an artistic edge."
    },
    
    # -------------------------------------------------------------------------
    # AUSTRIA
    # -------------------------------------------------------------------------
    "AT": {
        "name": "Austria",
        "traditional_dress": "Austrian elegance - subtle Tracht influence or Viennese sophistication",
        "dress_description": "wearing a refined loden-green jacket with subtle Austrian tailoring details, classical Viennese elegance, perhaps subtle horn buttons",
        "background_hint": "warm Viennese cafe light, imperial elegance",
        "color_mood": "forest greens, warm golds, Habsburg palette",
        "color_palette": ["#ED2939", "#FFFFFF", "#2F4F4F", "#DAA520"],
        "style_notes": "Vienna intellectual tradition. Could be discussing philosophy at a Kaffeehaus or presenting at the University of Vienna. Classic Central European cultivation."
    },
    
    # -------------------------------------------------------------------------
    # NORWAY
    # -------------------------------------------------------------------------
    "NO": {
        "name": "Norway",
        "traditional_dress": "Norwegian modern or subtle bunad-inspired",
        "dress_description": "wearing a high-quality wool sweater with subtle Norwegian pattern elements, clean Scandinavian lines, connected to nature",
        "background_hint": "cool Nordic light, fjord blues and mountain grays",
        "color_mood": "deep blues, crisp whites, Norwegian nature palette",
        "color_palette": ["#BA0C2F", "#FFFFFF", "#00205B", "#4A6FA5"],
        "style_notes": "Oslo professional who spends weekends in nature. The wool pattern should be subtle and sophisticated, not tourist-shop. Norwegian authenticity and quiet confidence."
    },
    
    # -------------------------------------------------------------------------
    # DENMARK
    # -------------------------------------------------------------------------
    "DK": {
        "name": "Denmark",
        "traditional_dress": "Danish hygge aesthetic",
        "dress_description": "wearing a perfectly fitting cashmere sweater in soft gray, ultimate hygge aesthetic, Danish design principles in personal style",
        "background_hint": "warm candlelit tones, Danish interior design aesthetic",
        "color_mood": "warm grays, soft creams, hygge comfort palette",
        "color_palette": ["#C8102E", "#FFFFFF", "#A0A0A0", "#E8DCC4"],
        "style_notes": "Copenhagen creative - could be at a design agency or Copenhagen Business School. Hygge embodied: comfortable, cozy, but impeccably stylish. Nothing forced."
    },
    
    # -------------------------------------------------------------------------
    # IRELAND
    # -------------------------------------------------------------------------
    "IE": {
        "name": "Ireland",
        "traditional_dress": "Irish tweed or Celtic-inspired modern",
        "dress_description": "wearing a beautiful Irish tweed jacket in heathered greens and browns, warm and scholarly, subtle Celtic heritage",
        "background_hint": "soft Irish light, green rolling hills suggested in the tones",
        "color_mood": "Irish greens, warm browns, literary Ireland palette",
        "color_palette": ["#009A49", "#FFFFFF", "#FF7900", "#4A6741"],
        "style_notes": "Trinity College meets Connemara. The tweed should look lived-in and loved, not costume-y. Irish warmth, literary depth, genuine character."
    },
}


# =============================================================================
# REGIONAL FALLBACK PROMPTS
# =============================================================================

REGIONAL_PROMPTS: dict[str, dict] = {
    # -------------------------------------------------------------------------
    # SOUTH AMERICA (excluding Brazil)
    # -------------------------------------------------------------------------
    "SOUTH_AMERICA": {
        "name": "South America",
        "countries": ["AR", "CL", "CO", "PE", "VE", "EC", "BO", "PY", "UY", "GY", "SR"],
        "traditional_dress": "South American elegance - warm and sophisticated",
        "dress_description": "wearing an elegant lightweight blazer in warm earth tones, perhaps with subtle textile patterns inspired by Andean weaving traditions, South American warmth",
        "background_hint": "warm Andean light, mountain earth tones",
        "color_mood": "warm terracottas, mountain earth tones, South American textile colors",
        "color_palette": ["#FCD116", "#009739", "#8B4513", "#CE1126"],
        "style_notes": "Could be in Buenos Aires, Santiago, or Lima. South American cosmopolitan with awareness of indigenous artistic traditions. Warm, cultured, sophisticated."
    },
    
    # -------------------------------------------------------------------------
    # CENTRAL AMERICA & CARIBBEAN
    # -------------------------------------------------------------------------
    "CENTRAL_AMERICA": {
        "name": "Central America & Caribbean",
        "countries": ["GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "HT", "JM", "TT", "PR", "BS", "BB"],
        "traditional_dress": "Caribbean professional - light and elegant",
        "dress_description": "wearing a crisp light linen shirt in pristine white or soft cream, perhaps a lightweight blazer, Caribbean elegance suited to warm climates",
        "background_hint": "warm tropical light, Caribbean blue and golden tones",
        "color_mood": "Caribbean blues, warm golds, tropical sophistication",
        "color_palette": ["#00BFFF", "#FFD700", "#228B22", "#FFFFFF"],
        "style_notes": "Caribbean professional elegance - appropriate for San Juan, Havana, or Kingston. Light fabrics, warm colors, genuine warmth in expression."
    },
    
    # -------------------------------------------------------------------------
    # WEST AFRICA
    # -------------------------------------------------------------------------
    "WEST_AFRICA": {
        "name": "West Africa",
        "countries": ["NG", "GH", "SN", "CI", "ML", "BF", "NE", "GN", "BJ", "TG", "SL", "LR", "GM", "GW", "CV", "MR"],
        "traditional_dress": "West African elegance - agbada or modern African styling",
        "dress_description": "wearing a sophisticated modern interpretation of West African formal wear, perhaps a refined senator style or contemporary African tailoring with subtle kente-inspired accents",
        "background_hint": "warm golden African light, rich earth tones",
        "color_mood": "rich golds, deep greens, kente-inspired warmth",
        "color_palette": ["#FCD116", "#009739", "#CE1126", "#8B4513"],
        "style_notes": "Lagos or Accra professional. Modern African elegance - not costume, but contemporary fashion that honors heritage. Confident, warm, distinguished."
    },
    
    # -------------------------------------------------------------------------
    # EAST AFRICA
    # -------------------------------------------------------------------------
    "EAST_AFRICA": {
        "name": "East Africa",
        "countries": ["KE", "TZ", "UG", "RW", "ET", "SO", "DJ", "ER", "SS", "BI", "MW", "MZ", "ZM", "ZW"],
        "traditional_dress": "East African professional style",
        "dress_description": "wearing a well-tailored jacket with subtle East African textile accents, perhaps kitenge-inspired pocket square or collar detail, Nairobi professional style",
        "background_hint": "warm savanna light, Maasai-inspired earth tones",
        "color_mood": "savanna golds, Maasai reds, East African earth palette",
        "color_palette": ["#000000", "#BB0000", "#006600", "#FFD700"],
        "style_notes": "Nairobi professional or Ethiopian creative class. Modern African style with subtle cultural references. Warm, confident, cosmopolitan."
    },
    
    # -------------------------------------------------------------------------
    # NORTH AFRICA
    # -------------------------------------------------------------------------
    "NORTH_AFRICA": {
        "name": "North Africa",
        "countries": ["EG", "MA", "DZ", "TN", "LY", "SD"],
        "traditional_dress": "North African elegance - Mediterranean meets Arabic",
        "dress_description": "wearing a refined jacket with subtle North African design sensibility, perhaps a nehru collar or Moroccan-inspired tailoring details, Mediterranean sophistication",
        "background_hint": "warm Moroccan light, arabesque patterns suggested",
        "color_mood": "Mediterranean blues, Saharan golds, Moorish elegance",
        "color_palette": ["#C8102E", "#007A3D", "#FFFFFF", "#DAA520"],
        "style_notes": "Could be in Cairo, Casablanca, or Tunis. North African intellectual tradition - Mediterranean warmth with Arabic elegance. Sophisticated, cultured."
    },
    
    # -------------------------------------------------------------------------
    # SOUTHERN AFRICA
    # -------------------------------------------------------------------------
    "SOUTHERN_AFRICA": {
        "name": "Southern Africa",
        "countries": ["ZA", "BW", "NA", "SZ", "LS", "AO"],
        "traditional_dress": "Southern African professional style",
        "dress_description": "wearing a refined modern jacket with subtle Southern African textile influence, perhaps Madiba-shirt inspired collar or shweshwe-inspired pocket detail",
        "background_hint": "warm African light, rainbow nation palette suggested",
        "color_mood": "vibrant but sophisticated African palette, rainbow nation",
        "color_palette": ["#007A4D", "#FFB612", "#DE3831", "#002395"],
        "style_notes": "Johannesburg or Cape Town professional. Modern South African style that acknowledges diverse heritage. Confident, warm, forward-looking."
    },
    
    # -------------------------------------------------------------------------
    # MIDDLE EAST
    # -------------------------------------------------------------------------
    "MIDDLE_EAST": {
        "name": "Middle East",
        "countries": ["SA", "AE", "QA", "KW", "BH", "OM", "YE", "JO", "LB", "SY", "IQ", "IR", "IL", "PS"],
        "traditional_dress": "Middle Eastern elegance - modern with traditional sensibility",
        "dress_description": "wearing a refined modern jacket in deep navy or charcoal, impeccable Gulf-style tailoring, perhaps subtle Arabic calligraphy-inspired details",
        "background_hint": "warm golden light, arabesque geometry suggested",
        "color_mood": "deep teals, rich golds, desert earth tones",
        "color_palette": ["#006C35", "#FFFFFF", "#CE1126", "#DAA520"],
        "style_notes": "Dubai professional or Beirut intellectual. Modern Middle Eastern elegance - sophisticated, cultured, bridging tradition and modernity."
    },
    
    # -------------------------------------------------------------------------
    # SOUTH ASIA (excluding India)
    # -------------------------------------------------------------------------
    "SOUTH_ASIA": {
        "name": "South Asia",
        "countries": ["PK", "BD", "LK", "NP", "BT", "MV", "AF"],
        "traditional_dress": "South Asian elegance - regional variations",
        "dress_description": "wearing a refined modern interpretation of South Asian formal wear, sophisticated kurta-style collar or contemporary tailoring with subtle regional textile influences",
        "background_hint": "warm South Asian light, intricate patterns suggested",
        "color_mood": "rich jewel tones, South Asian sophistication",
        "color_palette": ["#01411C", "#FFFFFF", "#FF6600", "#000080"],
        "style_notes": "Could be in Lahore, Dhaka, or Colombo. South Asian elegance with regional nuances. Warm, cultured, intellectually curious."
    },
    
    # -------------------------------------------------------------------------
    # SOUTHEAST ASIA
    # -------------------------------------------------------------------------
    "SOUTHEAST_ASIA": {
        "name": "Southeast Asia",
        "countries": ["TH", "VN", "PH", "MY", "SG", "ID", "MM", "KH", "LA", "BN"],
        "traditional_dress": "Southeast Asian modern - tropical elegance",
        "dress_description": "wearing a refined tropical-weight jacket or high-quality mandarin collar shirt, Southeast Asian sophistication suited to warm climates, Singapore professional style",
        "background_hint": "tropical light, Southeast Asian architectural influence",
        "color_mood": "tropical jewel tones, Southeast Asian richness",
        "color_palette": ["#FF0000", "#FFD700", "#00FF00", "#FFFFFF"],
        "style_notes": "Singapore finance meets Bangkok creative. Southeast Asian cosmopolitan - warm, approachable, culturally aware. Appropriate for any ASEAN capital."
    },
    
    # -------------------------------------------------------------------------
    # CENTRAL ASIA
    # -------------------------------------------------------------------------
    "CENTRAL_ASIA": {
        "name": "Central Asia",
        "countries": ["KZ", "UZ", "TM", "TJ", "KG", "MN"],
        "traditional_dress": "Central Asian elegance - Silk Road heritage",
        "dress_description": "wearing a refined jacket with subtle Silk Road influence, perhaps ikat-inspired textile accents, Central Asian craftsmanship meets modern tailoring",
        "background_hint": "warm steppe light, Silk Road geometry",
        "color_mood": "Silk Road blues and golds, nomadic warmth",
        "color_palette": ["#00AFCA", "#FFCC00", "#6CBB3C", "#FFFFFF"],
        "style_notes": "Almaty or Tashkent professional. Silk Road heritage meeting modern Central Asian identity. Cultured, warm, bridging East and West."
    },
    
    # -------------------------------------------------------------------------
    # EASTERN EUROPE
    # -------------------------------------------------------------------------
    "EASTERN_EUROPE": {
        "name": "Eastern Europe",
        "countries": ["RU", "UA", "BY", "MD", "RO", "BG", "RS", "HR", "SI", "BA", "ME", "MK", "AL", "XK", "CZ", "SK", "HU", "LT", "LV", "EE"],
        "traditional_dress": "Eastern European professional",
        "dress_description": "wearing a well-tailored dark jacket, Eastern European intellectual style, perhaps subtle folk-art geometric accents, Prague or Warsaw professional aesthetic",
        "background_hint": "cool European light, architectural heritage",
        "color_mood": "deep blues, rich reds, Eastern European palette",
        "color_palette": ["#0033A0", "#FFD700", "#DA291C", "#FFFFFF"],
        "style_notes": "Could be in Prague, Warsaw, or Budapest. Eastern European intellectual tradition - depth, resilience, cultural pride. Sophisticated but not flashy."
    },
    
    # -------------------------------------------------------------------------
    # OCEANIA & PACIFIC
    # -------------------------------------------------------------------------
    "OCEANIA": {
        "name": "Oceania & Pacific",
        "countries": ["NZ", "FJ", "PG", "WS", "TO", "VU", "SB", "NC", "PF", "GU"],
        "traditional_dress": "Pacific Islander elegance or New Zealand style",
        "dress_description": "wearing a refined modern jacket with subtle Pacific design influence, perhaps Maori-inspired geometric details, Auckland professional meets Pacific heritage",
        "background_hint": "Pacific light, ocean blues and volcanic earth",
        "color_mood": "ocean blues, Pacific earth tones, Polynesian warmth",
        "color_palette": ["#000000", "#FFFFFF", "#CC142B", "#006B3F"],
        "style_notes": "Auckland or Wellington professional with Pacific heritage awareness. Modern Pacific identity - confident, grounded, connected to land and sea."
    },
}


# =============================================================================
# FALLBACK / DEFAULT
# =============================================================================

DEFAULT_PROMPT = {
    "name": "International",
    "traditional_dress": "Universal professional elegance",
    "dress_description": "wearing a refined modern jacket in deep navy, universal professional elegance, warm and approachable academic style",
    "background_hint": "soft neutral studio light, universal appeal",
    "color_mood": "sophisticated neutrals, warm but universal palette",
    "color_palette": ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
    "style_notes": "Default international academic look. Should feel welcoming to anyone from anywhere. Warm, intelligent, approachable, culturally neutral but not bland."
}


# =============================================================================
# PROMPT GENERATOR
# =============================================================================

def generate_prompt(code: str) -> ImagePrompt:
    """Generate a complete prompt for a given country or region code."""
    
    # Check if it's a specific country
    if code in COUNTRY_PROMPTS:
        data = COUNTRY_PROMPTS[code]
        prompt_type = "country"
        filename = f"{code.lower()}.webp"
    # Check if it's a region
    elif code in REGIONAL_PROMPTS:
        data = REGIONAL_PROMPTS[code]
        prompt_type = "region"
        filename = f"regions/{code.lower().replace('_', '-')}.webp"
    # Use default
    else:
        data = DEFAULT_PROMPT
        prompt_type = "default"
        filename = "base.webp"
    
    # Build the full prompt
    full_prompt = BASE_PROMPT_TEMPLATE.format(
        dress_description=data["dress_description"],
        background_hint=data["background_hint"],
        color_mood=data["color_mood"]
    )
    
    return ImagePrompt(
        code=code,
        name=data["name"],
        filename=filename,
        prompt=full_prompt,
        negative_prompt=BASE_NEGATIVE_PROMPT,
        style_notes=data["style_notes"],
        traditional_dress=data["traditional_dress"],
        color_palette=data.get("color_palette", DEFAULT_PROMPT["color_palette"])
    )


def generate_all_prompts() -> dict:
    """Generate prompts for all countries and regions."""
    result = {
        "metadata": {
            "description": "Nano Banana prompts for culturally personalized profile images",
            "author": "Vincent's Website Generator",
            "total_prompts": 0,
            "base_negative_prompt": BASE_NEGATIVE_PROMPT
        },
        "countries": {},
        "regions": {},
        "default": None
    }
    
    # Generate country prompts
    for code in COUNTRY_PROMPTS:
        prompt = generate_prompt(code)
        result["countries"][code] = {
            "name": prompt.name,
            "filename": prompt.filename,
            "prompt": prompt.prompt,
            "style_notes": prompt.style_notes,
            "traditional_dress": prompt.traditional_dress,
            "color_palette": prompt.color_palette
        }
    
    # Generate regional prompts
    for code in REGIONAL_PROMPTS:
        prompt = generate_prompt(code)
        result["regions"][code] = {
            "name": prompt.name,
            "filename": prompt.filename,
            "prompt": prompt.prompt,
            "style_notes": prompt.style_notes,
            "traditional_dress": prompt.traditional_dress,
            "color_palette": prompt.color_palette,
            "countries": REGIONAL_PROMPTS[code]["countries"]
        }
    
    # Generate default
    prompt = generate_prompt("DEFAULT")
    result["default"] = {
        "name": prompt.name,
        "filename": prompt.filename,
        "prompt": prompt.prompt,
        "style_notes": prompt.style_notes,
        "traditional_dress": prompt.traditional_dress,
        "color_palette": prompt.color_palette
    }
    
    result["metadata"]["total_prompts"] = (
        len(result["countries"]) + 
        len(result["regions"]) + 
        1  # default
    )
    
    return result


def print_prompt_preview(code: str):
    """Print a formatted preview of a prompt."""
    prompt = generate_prompt(code)
    
    print("\n" + "=" * 80)
    print(f"  {prompt.name} ({prompt.code})")
    print("=" * 80)
    print(f"\n📁 Filename: {prompt.filename}")
    print(f"\n👔 Traditional Dress: {prompt.traditional_dress}")
    print(f"\n🎨 Color Palette: {' | '.join(prompt.color_palette)}")
    print(f"\n📝 Style Notes:\n   {prompt.style_notes}")
    print(f"\n🖼️  PROMPT:\n")
    
    # Word wrap the prompt
    words = prompt.prompt.split()
    line = "   "
    for word in words:
        if len(line) + len(word) > 78:
            print(line)
            line = "   " + word + " "
        else:
            line += word + " "
    print(line)
    
    print(f"\n🚫 NEGATIVE PROMPT:\n")
    words = prompt.negative_prompt.split()
    line = "   "
    for word in words:
        if len(line) + len(word) > 78:
            print(line)
            line = "   " + word + " "
        else:
            line += word + " "
    print(line)
    print()


def main():
    parser = argparse.ArgumentParser(
        description="Generate Nano Banana prompts for culturally personalized profile images"
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        help="Output JSON file path"
    )
    parser.add_argument(
        "--country", "-c",
        type=str,
        help="Preview prompt for a specific country code (e.g., US, IN, JP)"
    )
    parser.add_argument(
        "--region", "-r",
        type=str,
        help="Preview prompt for a specific region code (e.g., SOUTH_AMERICA, MIDDLE_EAST)"
    )
    parser.add_argument(
        "--all", "-a",
        action="store_true",
        help="Generate all prompts"
    )
    parser.add_argument(
        "--list", "-l",
        action="store_true",
        help="List all available country and region codes"
    )
    parser.add_argument(
        "--preview", "-p",
        action="store_true",
        help="Print formatted preview (use with --country or --region)"
    )
    
    args = parser.parse_args()
    
    if args.list:
        print("\n🌍 AVAILABLE COUNTRY CODES:")
        print("-" * 40)
        for code, data in sorted(COUNTRY_PROMPTS.items()):
            print(f"  {code:4} - {data['name']}")
        
        print("\n🗺️  AVAILABLE REGION CODES:")
        print("-" * 40)
        for code, data in sorted(REGIONAL_PROMPTS.items()):
            print(f"  {code:20} - {data['name']}")
            print(f"      Covers: {', '.join(data['countries'][:5])}{'...' if len(data['countries']) > 5 else ''}")
        return
    
    if args.country:
        code = args.country.upper()
        if args.preview:
            print_prompt_preview(code)
        else:
            prompt = generate_prompt(code)
            print(json.dumps({
                "code": prompt.code,
                "name": prompt.name,
                "filename": prompt.filename,
                "prompt": prompt.prompt,
                "negative_prompt": prompt.negative_prompt,
                "style_notes": prompt.style_notes,
                "color_palette": prompt.color_palette
            }, indent=2))
        return
    
    if args.region:
        code = args.region.upper()
        if args.preview:
            print_prompt_preview(code)
        else:
            prompt = generate_prompt(code)
            print(json.dumps({
                "code": prompt.code,
                "name": prompt.name,
                "filename": prompt.filename,
                "prompt": prompt.prompt,
                "negative_prompt": prompt.negative_prompt,
                "style_notes": prompt.style_notes,
                "color_palette": prompt.color_palette
            }, indent=2))
        return
    
    if args.all or args.output:
        all_prompts = generate_all_prompts()
        
        if args.output:
            output_path = Path(args.output)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(all_prompts, f, indent=2, ensure_ascii=False)
            print(f"✅ Generated {all_prompts['metadata']['total_prompts']} prompts")
            print(f"📁 Saved to: {output_path}")
        else:
            print(json.dumps(all_prompts, indent=2, ensure_ascii=False))
        return
    
    # Default: show help
    parser.print_help()
    print("\n💡 Examples:")
    print("   python generate_profile_prompts.py --list")
    print("   python generate_profile_prompts.py --country US --preview")
    print("   python generate_profile_prompts.py --region MIDDLE_EAST --preview")
    print("   python generate_profile_prompts.py --all --output prompts.json")


if __name__ == "__main__":
    main()
