// Shared data for all pages
const PROFILE = {
  name: "Kiran Garimella",
  role: "Assistant Professor, Rutgers University",
  tagline: "I study information ecosystems, misinformation, and AI for the public good.",
  location: "New Brunswick, NJ",
  email: "kg766@comminfo.rutgers.edu",
  cvUrl: "https://rutgers.box.com/s/ajtifcnfiumx7ofozr82wj0h7jcv6pkt",
  photo: "kiran_img.png",   // ← NEW: set to your headshot path or URL
  blog: "https://gvrkiran.substack.com",
  socials: {
    cv: "https://rutgers.box.com/s/ajtifcnfiumx7ofozr82wj0h7jcv6pkt",
    scholar: "https://scholar.google.com/citations?user=PH96F4oAAAAJ&hl=en",
    linkedin: "https://www.linkedin.com/in/gvrkiran/",
    twitter: "https://www.twitter.com/gvrkiran/",
    github: "https://github.com/gvrkiran",
  }
};

const KEYWORDS = [
  "computational social science",
  "global south",
  "AI applications",
  "misinformation",
  "data donation",
  "multi modal data analysis"
];

const HIGHLIGHTS = [
  { label: "Google Research Fellow", year: "2025" },
  { label: "NSF CAREER (in prep)", year: "2025" },
  { label: "NatGeo Marketing Analytics", year: "2022" }
];

const PROJECTS = [
  {
    title: "Applications of AI for multi modal content processing",
    summary: "We are developing tools and methods to process multi modal data, including images, videos and audio. Thanks to advances in AI, we can now apply these methods reliably to tackle real world problems.",
    tags: ["Television analytics", "Image analysis", "Podcasts"]
//    links: [{ label: "Overview", href: "#" }]
  },
  {
    title: "WhatsApp, encryption, and misinformation",
    summary: "How are users using encrypted chat applications like WhatsApp? How much misinformation exists on these platforms? How can we provide privacy preserving content moderation solutions while preserving encryption?",
    tags: ["Encryption", "Messaging Platforms", "Misinformation"]
//    links: [{ label: "Preprint", href: "#" }, { label: "Data Protocol", href: "#" }]
  },
  {
    title: "Global south social media and AI usage",
    summary: "How do users in the global south use social media? Going beyond just misinformation, what are positive benefits of social media beyond what we know already? How are users picking up AI and what will they be used for?",
    tags: ["Global South", "AI", "Social Media"]
//    links: [{ label: "Preprint", href: "#" }, { label: "Data Protocol", href: "#" }]
  },
  {
    title: "Data donation on social media",
    summary: "How can we collect data from end users, going beyond depending on APIs provided by the platforms?",
    tags: ["Data donation", "Tools", "Education"],
    links: [{ label: "Paper", href: "content/data_donation_social_media.pdf"}, {label:"Tools", href: "tools.html"}]
  },
  {
    title: "Polarization on social media",
    summary: "What is the role of polarization on social media? What are technical tools we can build to tackle increasing political polarization?",
    tags: ["Political polarization", "Social media"]
//    links: [{ label: "Demo", href: "#" }]
  }
];

// data.js
const PUBLICATIONS = [
  // Under review
  {
    year: "Unpublished",
    status: "Under review",
    title: "Data Donation on Social Media: Tools and Datasets",
    venue: "Under review",
    authors: ["Kiran Garimella"],
    links: [
      { label: "paper", href: "content/data_donation_social_media.pdf" },
      { label: "dataset", href: "https://doi.org/10.7910/DVN/VOFPK1" }
    ]
  },
  {
    year: "Unpublished",
    status: "Under review",
    title: "Disagreement Is Disappearing on U.S. Cable Debate Shows",
    venue: "Under review",
    authors: ["Mehedi Zaman", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/television_disagreements.pdf" }]
  },
  {
    year: "Unpublished",
    status: "Under review",
    title: "How Students (Really) Use ChatGPT: Uncovering Experiences Among Undergraduate Students",
    venue: "Under review",
    authors: ["Meilun Chen", "Kiran Garimella", "Tawfiq Ammari"],
    links: [{ label: "paper", href: "content/how_students_use_chatgpt.pdf" }]
  },
  {
    year: "Unpublished",
    status: "Under review",
    title: "Examining (Political) Content Consumption on Facebook Through Data Donation",
    venue: "Under review",
    authors: ["Joao Couto", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/Facebook_data_donation_political_content.pdf" }]
  },

  // 2026
  {
    year: 2026,
    title: "Personal Experience and Public Support for Internet Shutdowns in Rural India",
    venue: "ICWSM 2026",
    authors: ["Kiran Garimella", "Avinash Collis", "Varun Karekurve Ramachandra"],
    links: [{ label: "paper", href: "content/internet_bans.pdf" }]
  },
  {
    year: 2026,
    title: "Structural Dynamics of Harmful Content Dissemination on WhatsApp",
    venue: "ICWSM 2026",
    authors: ["Yuxin Liu", "Amin Rahimian", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/whatsapp_misinformation_network_spread.pdf" }]
  },

  // 2025
  {
    year: 2025,
    title: "Calibrated and Diverse News Coverage",
    venue: "CIKM 2025",
    authors: ["Tianyi Zhou", "Stefan Neumann", "Kiran Garimella", "Aristides Gionis"],
    links: [{ label: "paper", href: "content/calibrated_and_diverse_news_coverage.pdf" }]
  },
  {
    year: 2025,
    title: "Dynamics of Toxicity in Political Podcasts",
    venue: "ACM Multimedia 2025",
    authors: ["Naquee Rizwan", "Nayandeep Deb", "Sarthak Roy", "Vishwajeet Singh Solanki", "Kiran Garimella", "Animesh Mukherjee"],
    links: [{ label: "paper", href: "content/Toxicity_in_Podcasts.pdf" }]
  },
  {
    year: 2025,
    title: "Political Manipulation of the Israel-Hamas Conflict on WhatsAppp in India",
    venue: "International Journal of Communication, 2025",
    authors: ["Kiran Garimella"],
    links: [{ label: "paper", href: "content/Israel_Gaza_WhatsApp_narratives_IJOC.pdf" }]
  },
  {
    year: 2025,
    title: "Global Patterns of Viral Content on WhatsApp",
    venue: "ICWSM 2025",
    authors: ["Kiran Garimella", "Princessa Cintaqia", "Juan Jose Rojas Constain", "Bharat Nayak", "Aditya Vashistha"],
    links: [
      { label: "paper", href: "content/WhatsApp_groups_misinfo__hate.pdf" },
      { label: "video", href: "https://www.youtube.com/watch?v=-Zc8J7qcYJQ" }
    ]
  },
  {
    year: 2025,
    title: "Analyzing Patterns and Influence of Advertising in Print Newspapers",
    venue: "ACM Compass 2025",
    authors: ["Harsha Nemani", "Ponnurangam Kumaraguru", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/ads_vs_coverage_in_print_newspapers.pdf" }]
  },
  {
    year: 2025,
    title: "Community-Driven Fact-Checking on WhatsApp: Who Fact-Checks Whom, Why, and With What Effect?",
    venue: "Computational Approaches to Content Moderation and Platform Governance workshop at ICWSM 2025",
    authors: ["Kiran Garimella"],
    links: [
      { label: "paper", href: "content/WhatsApp_community_factchecking____ICWSM_May_2023.pdf" },
      { label: "video", href: "https://www.youtube.com/watch?v=n74qFEzlW4Q" }
    ]
  },
  {
    year: 2025,
    title: "Private Sharing of Public Content on Facebook",
    venue: "Countering the Degradation of Social Media workshop at ICWSM 2025",
    authors: ["Kiran Garimella"],
    links: [
      { label: "paper", href: "content/Private_Sharing_of_Public_Content_on_Social_Networks.pdf" },
      { label: "blog", href: "https://kiran-research2.comminfo.rutgers.edu/tmp/private_sharing_public_content.html" },
      { label: "video", href: "https://www.youtube.com/watch?v=wreDNJDVBJY" }
    ]
  },
  {
    year: 2025,
    title: "WhatsApp Explorer: A Data Donation Tool To Facilitate Research on WhatsApp",
    venue: "Mobile Media and Communication",
    authors: ["Kiran Garimella", "Simon Chauchard"],
    links: [
      { label: "paper", href: "content/WhatsApp_Explorer_Garimella_Chauchard.pdf" },
      { label: "code", href: "https://github.com/gvrkiran/WhatsAppExplorer" },
      { label: "tool walkthrough", href: "https://www.youtube.com/watch?v=_NGIJG4a-hY" }
    ]
  },
  {
    year: 2025,
    title: "Hate Speech Campaigns in the 2016 Philippine Elections on Facebook",
    venue: "ICWSM 2025",
    authors: ["Sudhamshu Hosamane", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/philippines_hate_speech_2016_election.pdf" }]
  },

  // 2024
  {
    year: 2024,
    title: "Collecting WhatsApp Data for Social Science Research: Challenges and a Proposed Solution",
    venue: "Book chapter, New York University Press",
    authors: ["Simon Chauchard", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/WhatsApp_Chauchard_Garimella_AUGUST2023_V3.pdf" }]
  },
  {
    year: 2024,
    title: "Generative AI and Political Discourse: Insights from WhatsApp in Rural India",
    venue: "",
    authors: ["Kiran Garimella", "Simon Chauchard"],
    links: [
      { label: "paper", href: "content/generative_AI_whatsapp_DRAFT.pdf" },
      { label: "Nature Commentary", href: "https://www.nature.com/articles/d41586-024-01588-2" }
    ]
  },
  {
    year: 2024,
    title: "Television Discourse Decoded: Comprehensive Multimodal Analytics at Scale",
    venue: "KDD 2024",
    authors: ["Anmol Agarwal", "Pratyush Priyadarshi", "Shiven Sinha", "Shrey Gupta", "Hitkul Jangra", "Ponnurangam Kumaraguru", "Kiran Garimella"],
    links: [
      { label: "paper", href: "content/TV_Debates_KDD_2024.pdf" },
      { label: "video", href: "https://youtu.be/STLfV8kv83g" }
    ]
  },
  {
    year: 2024,
    title: "Misinformation Mitigation Praxis: Lessons Learned and Future Directions from Co-Insights",
    venue: "SIGIR 2024",
    authors: ["Scott Hale", "Kiran Garimella", "Shiri Dori-Hacohen"],
    links: [{ label: "paper", href: "content/Misinformation_SIGIR2024.pdf" }]
  },
  {
    year: 2024,
    title: "Online Knowledge Production in Polarized Political Memes: The Case of Critical Race Theory",
    venue: "New Media and Society 2024",
    authors: ["Alyvia Walters", "Tawfiq Ammari", "Kiran Garimella", "Shagun Jhaver"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2310.03171" }]
  },
  {
    year: 2024,
    title: "Minimizing polarization and disagreement using topic-based timeline algorithms",
    venue: "Web Conference 2024",
    authors: ["Tianyi Zhou", "Stefan Neuman", "Kiran Garimella", "Aristides Gionis"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2402.10053" }]
  },
  {
    year: 2024,
    title: "Unraveling the Dynamics of Television Debates and Social Media Engagement: Insights from an Indian News Show",
    venue: "ICWSM 2024",
    authors: ["Kiran Garimella", "Abhilash Datta"],
    links: [{ label: "paper", href: "content/The_Impact_of_Political_debates_on_Social_Media__ICWSM_2023_.pdf" }]
  },

  // 2023
  {
    year: 2023,
    title: "Social Media Narratives on Conflict from Northern Syria",
    venue: "Journal of Politics",
    authors: ["Erin Walk", "Elizabeth Parker-Magyar", "Ahmet Akbiyik", "Fotini Christia", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/Social_Media_Narratives_on_Conflict_from_Northern_Syria.pdf" }]
  },
  {
    year: 2023,
    title: "Understanding and combatting misinformation across 16 countries on six continents",
    venue: "Nature Human Behavior",
    authors: ["Antonio A. Arechar", "et al."],
    links: [{ label: "paper", href: "content/Understanding-and-combatting-misinformation-across-16-countries-on-six-continents.pdf" }]
  },
  {
    year: 2023,
    title: "On the Rise of Fear Speech in Online Social Media",
    venue: "PNAS",
    authors: ["Punyajoy Saha", "Kiran Garimella", "Binny Mathew", "Animesh Mukherjee"],
    links: [
      { label: "paper", href: "content/on-the-rise-of-fear-speech-PNAS.pdf" },
      { label: "student version", href: "https://www.sciencejournalforkids.org/articles/how-does-fear-speech-spread-on-social-media/" }
    ]
  },
  {
    year: 2023,
    title: "Displacement and Return in the Internet Era: How Social Media Captures Migration Decisions in Northern Syria",
    venue: "World Development",
    authors: ["Erin Walk", "Fotini Christia", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/displacement-and-return-syria-world_development.pdf" }]
  },
  {
    year: 2023,
    title: "Talking politics on WhatsApp: A survey of Cuban, Indian, and Mexican American diaspora communities in the United States",
    venue: "Center for Media Engagement White Paper",
    authors: ["Martin J Riedl", "João VS Ozawa", "Samuel Woolley", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/Talking-Politics-on-WhatsApp-A-survey-of-Cuban-Indian-and-Mexican-American-Diaspora-Communities-in-the-United-States.pdf" }]
  },
  {
    year: 2023,
    title: "Effects of Algorithmic Trend Promotion: Evidence from Coordinated Campaigns in Twitter’s Trending Topics",
    venue: "ICWSM 2023",
    authors: ["Joseph Schlessinger", "Kiran Garimella", "Maurice Jakesch", "Dean Eckles"],
    links: [{ label: "paper", href: "content/Effect_of_Trending_Topics_on_Tweet_Volume__ICWSM_2022_.pdf" }]
  },

  // 2022
  {
    year: 2022,
    title: "Decentralized yet Unifying: Digital Media and Solidarity in Hong Kong's Anti-Extradition Movement",
    venue: "Journal of Quantitative Description",
    authors: ["Brian Leung", "Yuan Hsiao", "Kiran Garimella"],
    links: [{ label: "paper", href: "https://journalqd.org/article/view/2977" }]
  },
  {
    year: 2022,
    title: "Using Facebook and LinkedIn Data to Study International Mobility",
    venue: "Book chapter, Oxford University Press",
    authors: ["Carolina Coimbra Vieira", "Masoomali Fatehkia", "Kiran Garimella", "Ingmar Weber", "Emilio Zagheni"],
    links: [{ label: "chapter", href: "content/Using_Facebook_and_LinkedIn_Data_to_Study_Mobility__book_chapter_.pdf" }]
  },
  {
    year: 2022,
    title: "Jettisoning Junk Messaging in the Era of End-to-End Encryption: A Case Study of WhatsApp",
    venue: "WWW 2022",
    authors: ["Pushkal Agarwal", "Aravindh Raman", "Damiola Ibosiola", "Nishanth Sastry", "Gareth Tyson", "Kiran Garimella"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2106.05184" }]
  },
  {
    year: 2022,
    title: "What Circulates on Partisan WhatsApp in India?: Insights from an Unusual Dataset",
    venue: "Journal of Quantitative Description",
    authors: ["Simon Chauchard", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/What-Circulates-on-Partisan-WhatsApp-in-India.pdf" }]
  },
  {
    year: 2022,
    title: "Tiplines to Combat Misinformation on Encrypted Platforms: A Case Study of the 2019 Indian Election on WhatsApp",
    venue: "HKS Misinformation Review",
    authors: ["Ashkan Kazemi", "Devin Gaffney", "Gautam Shahi", "Scott Hale", "Kiran Garimella"],
    links: [{ label: "paper", href: "https://misinforeview.hks.harvard.edu/article/research-note-tiplines-to-uncover-misinformation-on-encrypted-platforms-a-case-study-of-the-2019-indian-general-election-on-whatsapp/" }]
  },
  {
    year: 2022,
    title: "Providing normative information increases intentions to accept a COVID-19 vaccine",
    venue: "Nature Communications",
    authors: ["Alex Moehring", "Avinash Collis", "Amin Rahimian", "Dean Eckles", "Sinan Aral", "Kiran Garimella"],
    links: [
      { label: "paper", href: "content/nature_communications_vaccine_norms.pdf" },
      { label: "data", href: "http://covidsurvey.mit.edu/" },
      { label: "additional material", href: "https://psyarxiv.com/srv6t/" }
    ]
  },
  {
    year: 2022,
    title: "Global survey on COVID-19 beliefs, behaviors, and norms",
    venue: "Nature Human Behavior",
    authors: ["Alex Moehring", "Avinash Collis", "Amin Rahimian", "Stella Babalola", "Nina Gobat", "Dominick Shattuck", "Jeni Stolow", "Dean Eckles", "Sinan Aral", "Kiran Garimella"],
    links: [
      { label: "website", href: "https://covidsurvey.mit.edu/" },
      { label: "paper", href: "content/COVID_BBN_survey_report.pdf" }
    ]
  },

  // 2021
  {
    year: 2021,
    title: "Trend Alert: Manipulation of Twitter Trends Through Cross-Platform Coordination",
    venue: "CSCW 2021",
    authors: ["Maurice Jakesch", "Mor Naaman", "Dean Eckles", "Kiran Garimella"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2104.13259" }]
  },
  {
    year: 2021,
    title: "Claim Matching Beyond English to Scale Global Fact-Checking",
    venue: "ACL 2021",
    authors: ["Ashkan Kazemi", "Devin Gaffney", "Scott Hale", "Kiran Garimella"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/2106.00853" },
      { label: "data", href: "https://zenodo.org/record/4890950" }
    ]
  },
  {
    year: 2021,
    title: "Evolution of Individual Impact on Social Media",
    venue: "ICWSM 2021",
    authors: ["Robert West", "Kiran Garimella"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/2103.10754" },
      { label: "data", href: "https://zenodo.org/record/4685973" }
    ]
  },
  {
    year: 2021,
    title: "\"Short is the Road that Leads from Fear to Hate\": Fear Speech in Indian WhatsApp Groups",
    venue: "The Web Conference 2021",
    authors: ["Punyajoy Saha", "Binny Mathew", "Animesh Mukherjee", "Kiran Garimella"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/2102.03870" },
      { label: "data", href: "https://github.com/punyajoy/Fear-Speech-analysis" }
    ]
  },
  {
    year: 2021,
    title: "Political Polarization in Online News Consumption",
    venue: "ICWSM 2021",
    authors: ["Robert West", "Rebecca Weiss", "Tim Smith", "Kiran Garimella"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2104.06481" }]
  },

  // 2020
  {
    year: 2020,
    title: "A First Look at COVID-19 Messages on WhatsApp in Pakistan",
    venue: "IEEE/ACM ASONAM 2020",
    authors: ["—"], // authors not listed in snippet beyond arXiv; keep minimal
    links: [{ label: "paper", href: "https://arxiv.org/abs/2011.09145" }]
  },
  {
    year: 2020,
    title: "Characterising and Detecting Sponsored Influencer Posts on Instagram",
    venue: "IEEE/ACM ASONAM 2020",
    authors: ["—"],
    links: [{ label: "paper", href: "http://arxiv.org/abs/2011.05757" }]
  },
  {
    year: 2020,
    title: "Human Estimates of Body Measurements: Accuracy, Biases, and Mental Models",
    venue: "EPJ Data Science",
    authors: ["Kirill Martynov", "Kiran Garimella", "Robert West"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/2009.07828" }]
  },
  {
    year: 2020,
    title: "Darks and Stripes: Effects of Clothing on Weight Perception",
    venue: "IEEE Journal on Social Computing",
    authors: ["Kirill Martynov", "Kiran Garimella", "Robert West"],
    links: [{ label: "paper", href: "content/clothing_weight_perception.pdf" }]
  },
  {
    year: 2020,
    title: "Tracking global gender gaps in information technology using online data",
    venue: "ITU Digital Skills Insights 2020",
    authors: ["Florianne C. J. Verkroost", "Ridhi Kashyap", "Kiran Garimella", "Ingmar Weber", "Emilio Zagheni"],
    links: [{ label: "paper", href: "https://drive.google.com/file/d/1DYJBy6UnSBcI7O5yyGk8ttCZEoKjzpQd/view" }]
  },
  {
    year: 2020,
    title: "Can WhatsApp benefit from debunked fact-checked stories to reduce misinformation?",
    venue: "HKS Misinformation Review",
    authors: ["Julio Reis", "Philipe Melo", "Kiran Garimella", "Fabricio Benevenuto"],
    links: [{ label: "paper", href: "https://misinforeview.hks.harvard.edu/article/can-whatsapp-benefit-from-debunked-fact-checked-stories-to-reduce-misinformation/" }]
  },
  {
    year: 2020,
    title: "Images and misinformation in political groups: evidence from WhatsApp in India",
    venue: "HKS Misinformation Review",
    authors: ["Kiran Garimella", "Dean Eckles"],
    links: [{ label: "paper", href: "https://misinforeview.hks.harvard.edu/article/images-and-misinformation-in-political-groups-evidence-from-whatsapp-in-india/" }]
  },
  {
    year: 2020,
    title: "A Dataset of Fact-Checked Images Shared on WhatsApp During the Brazilian and Indian Elections",
    venue: "ICWSM 2020 (Dataset paper)",
    authors: ["Julio Reis", "Philipe Melo", "Kiran Garimella", "Jussara Almeida", "Dean Eckles", "Fabricio Benevenuto"],
    links: [
      { label: "paper", href: "content/Dataset-of-Fact-Checked-Images-Shared-on-WhatsApp-During-the-Brazilian-and-Indian-Elections.pdf" },
      { label: "data", href: "https://zenodo.org/record/3734805" }
    ]
  },
  {
    year: 2020,
    title: "Characterising User Content on a Multi-Lingual Social Network",
    venue: "ICWSM 2020",
    authors: ["Pushkal Agarwal", "Kiran Garimella", "Sagar Joglekar", "Nishanth Sastry", "Gareth Tyson"],
    links: [
      { label: "paper", href: "content/characterising-user-content-on-a-multi-lingual-social-network.pdf" },
      { label: "data", href: "http://tiny.cc/share-chat" }
    ]
  },
  {
    year: 2020,
    title: "Urban Dictionary Embeddings for Slang NLP Applications",
    venue: "LREC 2020",
    authors: ["Steve Wilson", "Walid Magdy", "Barbara McGillivray", "Kiran Garimella", "Gareth Tyson"],
    links: [{ label: "paper", href: "content/urban-dictionary-embeddings-for-slang-nlp-applications.pdf" }]
  },

  // 2019
  {
    year: 2019,
    title: "Can WhatsApp Counter Misinformation by Limiting Message Forwarding?",
    venue: "Complex Networks 2019",
    authors: ["Philipe Melo", "Carolina Vieira", "Kiran Garimella", "Pedro de Melo", "Fabricio Benevenuto"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/1909.08740" }]
  },
  {
    year: 2019,
    title: "Hot Streaks on Social Media",
    venue: "ICWSM 2019",
    authors: ["Kiran Garimella", "Robert West"],
    links: [
      { label: "paper", href: "content/hot-streaks-social-media.pdf" },
      { label: "slides", href: "content/hot-streaks-social-media.pptx" }
    ]
  },
  {
    year: 2019,
    title: "WhatsApp Monitor: A Fact-Checking System for WhatsApp",
    venue: "ICWSM 2019 (Demo)",
    authors: ["Philipe Melo", "Johnnatan Messias", "Gustavo Resende", "Kiran Garimella", "Jussara Almeida", "Fabricio Benevenuto"],
    links: [
      { label: "paper", href: "content/Whatsapp_monitor.pdf" },
      { label: "demo", href: "http://www.whatsapp-monitor.dcc.ufmg.br/" }
    ]
  },
  {
    year: 2019,
    title: "Tools for WhatsApp data collection",
    venue: "ICWSM 2019 (Tutorial)",
    authors: ["Kiran Garimella", "Philipe Melo", "Gareth Tyson", "Jussara Almeida", "Fabricio Benevenuto"],
    links: [
      { label: "slides", href: "content/WhatsApp_data_collection____Tutorial_at_ICWSM_19.pdf" },
      { label: "website", href: "https://users.ics.aalto.fi/kiran/whatsapp-tutorial/" }
    ]
  },
  {
    year: 2019,
    title: "Segregation and Sentiment: Estimating Refugee Segregation and Its Effects Using Digital Trace Data",
    venue: "Data4Refugees Challenge",
    authors: ["Neal Marquez", "Kiran Garimella", "Ott Toomet", "Ingmar Weber", "Emilio Zagheni"],
    links: [{ label: "paper", href: "content/data4refugees.pdf" }]
  },
  {
    year: 2019,
    title: "Disinformation on Facebook — A case study from Finland",
    venue: "Tech report",
    authors: ["Vili Ketonen", "Kiran Garimella", "Aristides Gionis"],
    links: [{ label: "paper", href: "content/fakenews-on-facebook-finland.pdf" }]
  },

  // 2018
  {
    year: 2018,
    title: "Polarization on Social Media",
    venue: "PhD Thesis",
    authors: ["Kiran Garimella"],
    links: [{ label: "thesis", href: "content/thesis.pdf" }]
  },
  {
    year: 2018,
    title: "Studying Migrant Assimilation Through Facebook Interests",
    venue: "SocInfo 2018 (Short paper)",
    authors: ["Antoine Dubois", "Emilio Zagheni", "Kiran Garimella", "Ingmar Weber"],
    links: [
      { label: "paper", href: "content/Studying_Migrant_Assimilation_Through_Facebook_Interests.pdf" },
      { label: "poster", href: "https://docs.google.com/presentation/d/15ebSNLuwVSScjx116AEfTSi9NG7qDTTbcxmMt1K2-QQ/edit?usp=sharing" }
    ]
  },
  {
    year: 2018,
    title: "WhatsApp Doc?: A First Look at WhatsApp Public Group Data",
    venue: "ICWSM 2018 (Dataset paper)",
    authors: ["Kiran Garimella", "Gareth Tyson"],
    links: [
      { label: "paper", href: "content/whatsapp.pdf" },
      { label: "slides", href: "content/WhatsApp.pptx" }
    ]
  },
  {
    year: 2018,
    title: "Professional Gender Gaps Across US Cities",
    venue: "ICWSM 2018 (Short paper)",
    authors: ["Karri Haranko", "Emilio Zagheni", "Kiran Garimella", "Ingmar Weber"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1801.09429" },
      { label: "poster", href: "https://docs.google.com/presentation/d/1ruVlDT3jhEK3lmGaMvS2iaLtcfliPqzbfugfNXhb_i8/edit?usp=sharing" }
    ]
  },
  {
    year: 2018,
    title: "Political Discourse on Social Media: Echo Chambers, Gatekeepers, and the Price of Bipartisanship",
    venue: "WWW 2018",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1801.01665" },
      { label: "slides", href: "content/WWW2018.pptx" }
    ]
  },
  {
    year: 2018,
    title: "Joint Non-negative Matrix Factorization for Learning Ideological Leaning on Twitter",
    venue: "WSDM 2018",
    authors: ["Preeti Lahoti", "Kiran Garimella", "Aristides Gionis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1711.10251" },
      { label: "slides", href: "content/wsdm18.pdf" },
      { label: "website", href: "http://resources.mpi-inf.mpg.de/d5/filterbubble/" }
    ]
  },

  // 2017
  {
    year: 2017,
    title: "Balancing Information Exposure on Social Networks",
    venue: "NIPS 2017",
    authors: ["Kiran Garimella", "Aristides Gionis", "Nikos Parotsidis", "Nikolaj Tatti"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1611.00172" },
      { label: "poster", href: "content/nips_2017_poster.pdf" },
      { label: "website", href: "https://users.ics.aalto.fi/kiran/BalanceExposure/" },
      { label: "video", href: "https://www.youtube.com/watch?v=EayNxWQGAmk" }
    ]
  },
  {
    year: 2017,
    title: "Quantifying Controversy on Social Media",
    venue: "WSDM 2016; Transactions on Social Computing",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1507.05224" },
      { label: "slides", href: "content/wsdm_presentation.pptx" }
    ]
  },
  {
    year: 2017,
    title: "Understanding Para Social Breakups on Twitter",
    venue: "WebScience 2017 (Poster; also ICCSS 2017)",
    authors: ["Kiran Garimella", "Jonathan Cohen", "Ingmar Weber"],
    links: [
      { label: "paper", href: "content/Understanding-Para-Social-Breakups-on-Twitter.pdf" },
      { label: "poster", href: "content/Understanding_parasocial_breakups_on_Twitter_WEBSCI.pdf" }
    ]
  },
  {
    year: 2017,
    title: "The Effect of Collective Attention on Controversial Debates on Social Media",
    venue: "WebScience 2017 (Best student paper award)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "content/The-Effect-of-Collective-Attention-on-Controversial-Debates-on-Social-Media.pdf" },
      { label: "slides", href: "content/websci17_effect_of_collective_attention.pptx" },
      { label: "website", href: "https://mmathioudakis.github.io/polarization/" }
    ]
  },
  {
    year: 2017,
    title: "Factors in Recommending Contrarian Content on Social Media",
    venue: "WebScience 2017 (Short paper)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [{ label: "paper", href: "content/Factors-in-Recommending-Contrarian-Content-on-Social-Media.pdf" }]
  },
  {
    year: 2017,
    title: "Ad-blocking: A Study on Performance, Privacy and Counter-measures",
    venue: "WebScience 2017 (Short paper)",
    authors: ["Kiran Garimella", "Orestis Kostakis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "content/Ad-blocking-A-Study-on-Performance-Privacy-and-Counter-measures.pdf" },
      { label: "slides", href: "content/websci17_Adblocking.pptx" },
      { label: "website", href: "adblock/" }
    ]
  },
  {
    year: 2017,
    title: "Polarization on Social Media",
    venue: "ICWSM 2017 (Tutorial)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "website", href: "https://users.ics.aalto.fi/kiran/controversy-tutorial/" },
      { label: "slides", href: "https://www.slideshare.net/KiranGarimella1/polarization-on-social-media" }
    ]
  },
  {
    year: 2017,
    title: "The Ebb and Flow of Controversial Debates on Social Media",
    venue: "ICWSM 2017 (Short paper)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "content/The-Ebb-and-Flow-of-Controversial-Debates-on-Social-Media.pdf" },
      { label: "poster", href: "content/ebb_and_flow_ICWSM.pdf" },
      { label: "website", href: "https://mmathioudakis.github.io/polarization/" }
    ]
  },
  {
    year: 2017,
    title: "A Motif-based Approach for Identifying Controversy",
    venue: "ICWSM 2017 (Short paper)",
    authors: ["Mauro Coletto", "Kiran Garimella", "Aristides Gionis", "Claudio Lucchese"],
    links: [
      { label: "paper", href: "content/A-Motif-based-Approach-for-Identifying-Controversy.pdf" },
      { label: "poster", href: "content/motifs_ICWSM.pdf" }
    ]
  },
  {
    year: 2017,
    title: "A Long-Term Analysis of Polarization on Twitter",
    venue: "ICWSM 2017 (Short paper; also ICCSS 2017)",
    authors: ["Kiran Garimella", "Ingmar Weber"],
    links: [
      { label: "paper", href: "content/A-Long-Term-Analysis-of-Polarization-on-Twitter.pdf" },
      { label: "poster", href: "content/Longterm_polarization_ICWSM.pdf" },
      { label: "website", href: "https://users.ics.aalto.fi/kiran/polarizationTwitter/" }
    ]
  },
  {
    year: 2017,
    title: "Media Attention to Science",
    venue: "WWW 2017 (Poster)",
    authors: ["Kiran Garimella", "Han Xiao"],
    links: [
      { label: "paper", href: "content/Media-attention-science.pdf" },
      { label: "poster", href: "content/Poster_Media-Attention-to-Science.pdf" },
      { label: "website", href: "https://users.ics.aalto.fi/kiran/mediaAttentionScience/" }
    ]
  },
  {
    year: 2017,
    title: "Understanding International Migration using Tensor Factorization",
    venue: "WWW 2017 (Poster)",
    authors: ["Hieu Nguyen", "Kiran Garimella"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1702.04996" },
      { label: "poster", href: "content/Poster_Understanding-International-Migration-using-Tensor-Factorization.pdf" },
      { label: "website", href: "https://users.ics.aalto.fi/kiran/migrationTwitter/" }
    ]
  },
  {
    year: 2017,
    title: "Exposing Twitter Users to Contrarian News",
    venue: "WWW 2017 (Demo)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "content/Exposing-Users-to-Contrarian-Viewpoints.pdf" },
      { label: "poster", href: "content/Poster_Exposing-Twitter-Users-to-Contrarian-News.pdf" },
      { label: "demo", href: "https://users.ics.aalto.fi/kiran/reducingControversy/homepage" }
    ]
  },
  {
    year: 2017,
    title: "Balancing Opposing Views to Reduce Controversy",
    venue: "WSDM 2017 (Best student paper award)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1611.00172" },
      { label: "slides", href: "content/wsdm17_reducing_polarization.pptx" },
      { label: "poster", href: "content/wsdm17_poster.pdf" }
    ]
  },

  // 2016
  {
    year: 2016,
    title: "Discovering the Network Backbone from Traffic Activity Data",
    venue: "PAKDD 2016 / Journal of Data Science and Analytics 2016",
    authors: ["Kiran Garimella", "Sanjay Chawla", "Aristides Gionis", "Dominic Tsang"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1402.6138" },
      { label: "slides", href: "content/PAKDD_presentation.pptx" }
    ]
  },
  {
    year: 2016,
    title: "Quote RTs on Twitter: Usage of the New Feature for Political Discourse",
    venue: "ACM WebScience 2016 (also ICCSS 2016)",
    authors: ["Kiran Garimella", "Ingmar Weber", "Munmun De Choudhury"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1603.07933" },
      { label: "slides", href: "content/websci16_presentation.pptx" }
    ]
  },
  {
    year: 2016,
    title: "Social Media Image Analysis for Public Health",
    venue: "CHI 2016 (Short paper)",
    authors: ["Kiran Garimella", "Aboud Alfayad", "Ingmar Weber"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1512.04476" },
      { label: "poster", href: "https://docs.google.com/presentation/d/1E5lwzwtDndp5vlYfd-IJqAr3Y2TbN-dqPeVocPC1CmI" },
      { label: "data", href: "imagga_tags_data/" }
    ]
  },
  {
    year: 2016,
    title: "Exploring Controversy on Twitter",
    venue: "CSCW 2016 (Demo)",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1512.05550" },
      { label: "demo", href: "https://users.ics.aalto.fi/kiran/controversy" },
      { label: "poster", href: "content/WSDM_CSCW_poster.pdf" }
    ]
  },
  {
    year: 2016,
    title: "Quantifying Controversy on Social Media",
    venue: "WSDM 2016; Transactions on Social Computing",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Michael Mathioudakis"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1507.05224" },
      { label: "slides", href: "content/wsdm_presentation.pptx" }
    ]
  },

  // 2015
  {
    year: 2015,
    title: "Scalable Facility Location for Massive Graphs on Pregel-like Systems",
    venue: "CIKM 2015",
    authors: ["Kiran Garimella", "Gianmarco De Francisci Morales", "Aristides Gionis", "Mauro Sozio"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1503.03635" },
      { label: "slides", href: "content/facility_slides.pptx" }
    ]
  },

  // 2014
  {
    year: 2014,
    title: "From \"I love you babe\" to \"leave me alone\" — Romantic Relationship Breakups on Twitter",
    venue: "SocInfo 2014 (also ICCSS 2015)",
    authors: ["Kiran Garimella", "Ingmar Weber", "Sonya Dal Cin"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1409.5980" },
      { label: "slides", href: "content/twitter_breakup_presentation.pptx" }
    ]
  },
  {
    year: 2014,
    title: "Co-Following on Twitter",
    venue: "ACM Hypertext 2014 (Short paper)",
    authors: ["Kiran Garimella", "Ingmar Weber"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/1407.0791" }]
  },
  {
    year: 2014,
    title: "Gender Asymmetries in Reality and Fiction: The Bechdel Test of Social Media",
    venue: "ICWSM 2014",
    authors: ["David Garcia", "Ingmar Weber", "Kiran Garimella"],
    links: [
      { label: "paper", href: "https://arxiv.org/abs/1404.0163" },
      { label: "slides", href: "https://www.sg.ethz.ch/media/talk_slides/ICWSM14_1.pdf" }
    ]
  },
  {
    year: 2014,
    title: "Who Watches (and Shares) What on YouTube? And When? Using Twitter to Understand YouTube Viewership",
    venue: "WSDM 2014",
    authors: ["Adiya Abisheva", "Kiran Garimella", "David Garcia", "Ingmar Weber"],
    links: [{ label: "paper", href: "https://arxiv.org/abs/1312.4511" }]
  },
  {
    year: 2014,
    title: "Giving is Caring: Understanding Online Donation behavior through Email",
    venue: "ACM CSCW 2014",
    authors: ["Yelena Mejova", "Kiran Garimella", "Ingmar Weber", "Michael Dougal"],
    links: [
      { label: "paper", href: "content/email.pdf" },
      { label: "slides", href: "https://pt.slideshare.net/YelenaMejova/giving-is-caring-31393976" }
    ]
  },
  {
    year: 2014,
    title: "Inferring International and Internal Migration Patterns from Twitter Data",
    venue: "WWW 2014 (Web Science workshop)",
    authors: ["Emilio Zagheni", "Kiran Garimella", "Ingmar Weber", "Bogdan State"],
    links: [{ label: "paper", href: "content/migrations_twitter.pdf" }]
  },
  {
    year: 2014,
    title: "Using Co-Following for Out-of-Context Twitter Friend Recommendation",
    venue: "ICWSM 2014 (Demo)",
    authors: ["Ingmar Weber", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/Using-Co-Following-for-Personalized-Out-of-Context-Twitter-Friend-Recommendation.pdf" }]
  },
  {
    year: 2014,
    title: "Visualizing User-Defined, Discriminative Geo-Temporal Twitter Activity",
    venue: "ICWSM 2014 (Demo)",
    authors: ["Ingmar Weber", "Kiran Garimella"],
    links: [
      { label: "paper", href: "content/Visualizing-User-Defined-Discriminative-Geo-Temporal-Twitter-Activity.pdf" },
      { label: "demo1", href: "http://nyc.qcri.org/" },
      { label: "demo2", href: "http://qtr.qcri.org/" }
    ]
  },
  {
    year: 2014,
    title: "FAST: Forecast and Analytics of Social Media and Traffic",
    venue: "ACM CSCW 2014 (Demo)",
    authors: ["Kiran Garimella", "Carlos Castillo"],
    links: [
      { label: "paper", href: "content/fast_forecast_analytics_social_media_traffic_2014_garimella_castillo.pdf" },
      { label: "demo", href: "http://fast.qcri.org/" }
    ]
  },

  // 2013
  {
    year: 2013,
    title: "Secular vs. Islamist Polarization in Egypt on Twitter",
    venue: "ASONAM 2013",
    authors: ["Ingmar Weber", "Kiran Garimella", "Alaa Batayneh"],
    links: [{ label: "paper", href: "content/Secular-vs.-Islamist-Polarization-in-Egypt-on-Twitter.pdf" }]
  },
  {
    year: 2013,
    title: "#Egypt: Visualizing Islamist vs. Secular Tension on Twitter",
    venue: "ASONAM 2013 (Demo)",
    authors: ["Ingmar Weber", "Kiran Garimella"],
    links: [{ label: "paper", href: "content/Egypt-Visualizing-Islamist-vs.-Secular-Tension-on-Twitter.pdf" }]
  },
  {
    year: 2013,
    title: "Inferring Audience Partisanship for YouTube Videos",
    venue: "WWW 2013 (Poster)",
    authors: ["Ingmar Weber", "Kiran Garimella", "Erik Borra"],
    links: [{ label: "paper", href: "content/Inferring-Audience-Partisanship-for-YouTube-Videos.pdf" }]
  },
  {
    year: 2013,
    title: "Political Hashtag Trends",
    venue: "ECIR 2013 (Short paper)",
    authors: ["Ingmar Weber", "Kiran Garimella", "Asmelash Teka"],
    links: [{ label: "paper", href: "content/Political-Hashtag-Trends.pdf" }]
  },
  {
    year: 2013,
    title: "Political Hashtag Hijacking in the U.S.",
    venue: "WWW 2013 (Poster)",
    authors: ["Asmelash Teka", "Kiran Garimella", "Ingmar Weber"],
    links: [{ label: "paper", href: "content/Political-Hashtag-Hijacking-in-the-U.S.pdf" }]
  },

  // 2012
  {
    year: 2012,
    title: "Mining Web Query Logs to analyze political issues",
    venue: "ACM WebScience 2012",
    authors: ["Ingmar Weber", "Kiran Garimella", "Erik Borra"],
    links: [{ label: "paper", href: "content/Mining-Web-Query-Logs-to-Analyze-Political-Issues.pdf" }]
  },
  {
    year: 2012,
    title: "Political Search Trends",
    venue: "SIGIR 2012 (Demo)",
    authors: ["Ingmar Weber", "Kiran Garimella", "Erik Borra"],
    links: [{ label: "paper", href: "content/Political-search-trends.pdf" }]
  },

  // 2011
  {
    year: 2011,
    title: "Towards Multi-Document Summarization of Scientific Articles: Making Interesting Comparisons with SciSumm",
    venue: "ACL 2011 (Workshop on Automatic Summarization)",
    authors: ["Nitin Agarwal", "Kiran Garimella", "Ravi Shankar", "Carolyn Rose"],
    links: [{ label: "paper", href: "content/Towards-Multi-Document-Summarization-of-Scientific-Articles.pdf" }]
  },
  {
    year: 2011,
    title: "SciSumm: A Multi-Document Summarization System for Scientific Articles",
    venue: "ACL 2011 (Demo)",
    authors: ["Nitin Agarwal", "Kiran Garimella", "Ravi Shankar", "Carolyn Rose"],
    links: [{ label: "paper", href: "content/SciSumm-A-Multi-Document-Summarization-System-for-Scientific-Articles.pdf" }]
  },
  {
    year: 2011,
    title: "Load Prediction and Hot Spot Detection Models for Autonomic Cloud Computing",
    venue: "UCC 2011",
    authors: ["Prasad Saripalli", "Kiran Garimella", "Ravi Shankar", "Nitin Bindal"],
    links: [{ label: "paper", href: "content/Load-Prediction-and-Hot-Spot-Detection-Models-for-Autonomic-Cloud-Computing.pdf" }]
  },

  // 2010
  {
    year: 2010,
    title: "Frequent Itemset based Hierarchical Document Clustering using Wikipedia as External Knowledge",
    venue: "KES 2010 (Masters Thesis)",
    authors: ["Kiran Garimella", "Ravi Shankar", "Vikram Pudi"],
    links: [{ label: "paper", href: "content/Frequent-Itemset-Based-Hierarchical-Document-Clustering.pdf" }]
  },
  {
    year: 2010,
    title: "Evolutionary Clustering using Frequent Itemsets",
    venue: "StreamKDD workshop, KDD 2010",
    authors: ["Ravi Shankar", "Kiran Garimella", "Vikram Pudi"],
    links: [{ label: "paper", href: "content/Evolutionary-Clustering-using-Frequent-Itemsets.pdf" }]
  },
  {
    year: 2010,
    title: "Document Clustering using Various External Knowledge Sources",
    venue: "Masters Thesis",
    authors: ["Kiran Garimella"],
    links: [{ label: "link", href: "content/Kiran_Masters_Thesis.pdf" }]
  }
];


const TEACHING = [
  { course: "Beyond the Hype: What AI Can and Cannot Do", term: "Summer 2025", info: "Graduate course exploring capabilities and limits of modern AI. Based on the AI Snake Oil book by Sayash Kapoor and Arvind Narayanan. Check out a <a href='https://www.youtube.com/watch?v=RqjsbuhgXqo&list=PLvK4dRPIjeyGh2mCM6-SE2jGefnOcr83s' target='_blank' style='color:blue'>YouTube playlist</a> I created about how I use AI in my daily life." },
  { course: "Object Oriented Programming", term: "Spring/Fall 202x", info: "Introduction to Python programming for undergraduate students." },
  { course: "Problem Solving with Data", term: "Spring/Fall 202x", info: "Analysis and understanding of data, using Python and including geographic analysis, network data, and text as well as numerical data and data wrangling." }
];

const TALKS = [
  { title: "Responsible GenAI in the Wild", where: "Stanford T&S Research", date: "Oct 2024", link: "#" },
  { title: "Messaging Platforms and Democracy", where: "Gates Foundation", date: "May 2024", link: "#" }
];

const PRESS = [
  { outlet: "The New York Times", title: "How WhatsApp Shapes News", link: "#" },
  { outlet: "The Hindu", title: "Rumors and Responsibility", link: "#" }
];

