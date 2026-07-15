document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("pitchModal");
  const modalClose = document.getElementById("pitchModalClose");
  const deck = document.getElementById("pitchDeck");
  const nav = document.getElementById("pitchNav");
  const progressFill = document.getElementById("pitchProgressFill");
  const projectName = document.getElementById("deckProjectName");
  const deckTitle = document.getElementById("pitchDeckTitle");
  const downloadTop = document.getElementById("downloadPdfBtn");
  const downloadBottom = document.getElementById("downloadPdfBtnBottom");
  const slide1DemoBtn = document.getElementById("slide1DemoBtn");
  const slide1Image = document.getElementById("slide1Image");
  const openButtons = document.querySelectorAll(".js-open-deck");
  const slides = Array.from(deck ? deck.querySelectorAll(".pitch-slide") : []);
  const cardNodes = document.querySelectorAll(".project-deck-card");
  const staticBase = window.REVIVAL_PRODUCTS_STATIC_BASE || "/static/";
  const contactUrl = window.REVIVAL_PRODUCTS_CONTACT_URL || "contact.html";
  let activeIndex = 0;
  let animatedIndex = -1;

  function staticAsset(path) {
    if (!path || /^(https?:|mailto:|tel:|\/)/.test(path)) return path;
    return staticBase.replace(/\/?$/, "/") + path.replace(/^\/+/, "");
  }

  const projectDecks = {
    EMICARD: {
      deckTitle: "Investor Pitch Deck",
      displayName: "EMICARD",
      pdf: "pitch_deck/EMICARD/EMICARD.pdf",
      demo: "https://emicard-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Concurrentiel",
        "Croissance",
        "Levée de Fonds"
      ],
      slide1: {
        title: "EMICARD",
        subtitle: "From Identity to Income",
        desc: "Une identité digitale qui permet de vendre.",
        image: "pitch_deck/EMICARD/EMICARD1.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Les canaux sont fragmentés, les revenus fuient, la structure manque.",
        problemItems: [
          ["LinkedIn", "Identité"],
          ["Instagram", "Audience"],
          ["Shopify", "Ventes"],
          ["WhatsApp", "Support"]
        ],
        stats: ["-31% conversion", "+4 outils séparés", "+2.5x friction"]
      },
      slide3: {
        title: "EMICARD = Identité + Commerce",
        desc: "Un seul flux: profil, boutique, paiement, conversion.",
        flow: ["Identité", "Boutique", "Revenus"],
        assets: ["QR Code Mockup", "Carte Digitale", "Paiement Intégré"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["IDENTITÉ", "Profil premium et signature digitale."],
          ["RÉSEAU", "Partage intelligent et distribution sociale."],
          ["E-COMMERCE", "Boutique intégrée et conversion directe."],
          ["AUTOMATION", "Campagnes et pilotage intelligent."]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "5 milliards d’internautes. Mobile-first. Social commerce en hypercroissance.",
        metrics: ["5B+", "76% mobile", "Social commerce x3"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "La convergence des créateurs, du social commerce et du mobile money crée une fenêtre historique.",
        timeline: [
          ["2024", "Explosion créateurs"],
          ["2025", "Social commerce massif"],
          ["2026", "Mobile money généralisé"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnements", "Plans Starter à Scale"],
          ["Commissions", "Transactions intégrées"],
          ["Cartes NFC", "Distribution premium"],
          ["Services Business", "Support et intégrations"]
        ]
      },
      slide8: {
        title: "Avantage Concurrentiel",
        headers: ["Plateforme", "Identité", "Vente", "Friction"],
        rows: [
          ["EMICARD", "Oui", "Oui", "Zéro friction"],
          ["Shopify", "Partiel", "Oui", "Moyenne"],
          ["Instagram", "Oui", "Partiel", "Élevée"],
          ["LinkedIn", "Oui", "Non", "Élevée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Roadmap progressive avec effet réseau.",
        phases: [
          ["Phase 1", "Créateurs"],
          ["Phase 2", "Vendeurs locaux"],
          ["Phase 3", "Entreprises"]
        ]
      },
      slide10: {
        title: "Levée de Fonds",
        desc: "Section investisseurs avec CTA premium et formulaire de contact rapide.",
        finalLine: "Nous ne construisons pas une app.<br />Nous construisons une économie."
      }
    },
    ECOMNEX: {
      deckTitle: "Investor Pitch Deck",
      displayName: "ECOMNEX SHOP",
      pdf: "pitch_deck/ECOMNEX/ECOMNEX.pdf",
      demo: "https://ecomnex-shop.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "ECOMNEX SHOP",
        subtitle: "The Growth Engine for E-Commerce",
        desc: "Créer une boutique est facile. La faire grandir est difficile. Nous construisons le système qui transforme les vendeurs en marques.",
        image: "pitch_deck/ECOMNEX/ECOMNEX.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le e-commerce est difficile à scaler. Le problème = la croissance, pas la vente.",
        problemItems: [
          ["Croissance", "Faible"],
          ["Marketing", "Complexe et coûteux"],
          ["Canaux", "Multi-plateformes"],
          ["Données", "Peu fiables"]
        ],
        stats: ["Échec massif", "Croissance instable", "Rentabilité faible"]
      },
      slide3: {
        title: "ECOMNEX = E-Commerce Growth System",
        desc: "Une seule plateforme pour scaler.",
        flow: ["Création", "Automatisation", "Scale"],
        assets: ["Store Creation", "Marketplace Management", "Data Analytics"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["STORE CREATION", "Boutiques optimisées"],
          ["MARKETPLACE MANAGEMENT", "Amazon, Shopify, etc."],
          ["MARKETING PERFORMANCE", "Ads + acquisition"],
          ["DATA & ANALYTICS", "Optimisation ventes"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Un marché mondial massif, porté par l’explosion des vendeurs et du social commerce.",
        metrics: ["Millions de vendeurs/an", "Social commerce en explosion", "Problème global: scaler"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le marché passe de création vers croissance, avec un besoin fort d’automatisation.",
        timeline: [
          ["Trend 1", "Boom du e-commerce"],
          ["Trend 2", "Multiplication des vendeurs"],
          ["Trend 3", "Besoin d’automatisation"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Setup de boutiques", "Lancement et structuration"],
          ["Abonnements", "Revenus mensuels récurrents"],
          ["Commission sur ventes", "Alignement performance"],
          ["Services marketing", "SaaS e-commerce hybride"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Plateforme", "Création", "Growth", "Différenciation"],
        rows: [
          ["ECOMNEX", "Oui", "Oui", "Full-stack croissance"],
          ["Shopify", "Oui", "Partiel", "Focus boutique"],
          ["Outils ads", "Non", "Partiel", "Fragmentés"],
          ["Suites data", "Non", "Partiel", "Complexes"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau: plus de vendeurs = plus de data = meilleure performance.",
        phases: [
          ["Phase 1", "Petits vendeurs"],
          ["Phase 2", "Marques en croissance"],
          ["Phase 3", "Plateforme globale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour automatiser la croissance e-commerce, renforcer l’IA marketing, signer les premiers clients et scaler internationalement.",
        finalLine: "Créer une boutique est facile. La faire réussir est difficile.<br />ECOMNEX transforme les vendeurs en marques.<br />ECOMNEX transforme les boutiques en business."
      }
    },
    ESOMBA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "ESOMBA APP",
      pdf: "pitch_deck/ESOMBA/ESOMBA.pdf",
      demo: "https://www.esomba-app.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Produit",
        "Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "ESOMBA APP",
        subtitle: "The Digital Store Operating System for Modern Retail Businesses",
        desc: "Nous construisons la plateforme qui transforme chaque commerce en boutique digitale autonome.",
        image: "pitch_deck/ESOMBA/ESOMBA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Les commerçants veulent vendre en ligne, mais les solutions restent complexes, techniques ou fragmentées.",
        problemItems: [
          ["Boutique", "Absence de solution simple"],
          ["Réseaux sociaux", "Dépendance forte"],
          ["Commandes", "Gestion manuelle"],
          ["Paiements", "Suivi peu structuré"]
        ],
        stats: ["Ventes perdues", "Croissance limitée", "Digitalisation faible"]
      },
      slide3: {
        title: "ESOMBA = Mono-Vendor E-Commerce OS",
        desc: "Une seule plateforme pour créer une boutique, gérer les produits, recevoir des commandes et suivre les ventes.",
        flow: ["Boutique", "Produits", "Commandes"],
        assets: ["Store builder", "Order engine", "Business dashboard"]
      },
      slide4: {
        title: "Produit (Coeur du Système)",
        pillars: [
          ["DIGITAL STORE BUILDER", "Création de boutique en quelques clics avec identité de marque."],
          ["PRODUCT MANAGEMENT", "Gestion produits, stock et prix en temps réel."],
          ["ORDER ENGINE", "Commandes clients, notifications et suivi des ventes."],
          ["PAYMENT DASHBOARD", "Revenus, analytics et historique client."]
        ]
      },
      slide5: {
        title: "Marché",
        desc: "Des millions de petits commerces doivent passer au digital, portés par le e-commerce mobile et les vendeurs indépendants.",
        metrics: ["Millions de commerces", "E-commerce mobile", "Vendeurs indépendants"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le commerce sur mobile, l'entrepreneuriat indépendant et le besoin de digitalisation rapide convergent maintenant.",
        timeline: [
          ["Trend 1", "Commerce mobile"],
          ["Trend 2", "Entrepreneurs indépendants"],
          ["Trend 3", "Digitalisation rapide"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement boutique", "SaaS mensuel récurrent"],
          ["Commissions ventes", "Alignement avec la croissance"],
          ["Templates premium", "Boutiques et thèmes avancés"],
          ["Extensions", "Marketing et modules e-commerce"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Simplicité", "Mobile-first", "Différenciation"],
        rows: [
          ["ESOMBA", "Ultra simple", "Oui", "Boutique prête en minutes"],
          ["Shopify", "Moyenne", "Partiel", "Complexe pour non-tech"],
          ["Réseaux sociaux", "Simple", "Oui", "Pas de système complet"],
          ["Solutions custom", "Faible", "Variable", "Coûteuses et lentes"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir le Shopify simplifié des marchés émergents.",
        phases: [
          ["Phase 1", "Petits commerces locaux"],
          ["Phase 2", "PME et marques locales"],
          ["Phase 3", "Standard mono-vendeur en Afrique"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour accélérer l'acquisition utilisateurs, améliorer l'UX mobile, intégrer les paiements locaux et soutenir la croissance régionale.",
        finalLine: "Le problème n'est pas le produit.<br />Le problème est l'absence de système e-commerce simple.<br />ESOMBA transforme chaque commerce en boutique digitale autonome."
      }
    },
    DROPFA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "DROPFA",
      pdf: "pitch_deck/DROPFA/DROPFA.pdf",
      demo: "https://kinshop-online.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Produit",
        "Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "DROPFA",
        subtitle: "The Modern African Marketplace Infrastructure",
        desc: "Nous construisons le système unifié du commerce digital africain.",
        image: "pitch_deck/DROPFA/DROPFA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le commerce africain est en forte croissance, mais il reste fragmenté, informel et peu digitalisé.",
        problemItems: [
          ["Vendeurs", "Fragmentation du marché"],
          ["Confiance", "Transactions peu sécurisées"],
          ["Logistique", "Flux irréguliers"],
          ["Digitalisation", "Structure encore faible"]
        ],
        stats: ["Pertes de ventes", "Faible visibilité", "Expérience incohérente"]
      },
      slide3: {
        title: "DROPFA = Multi-Vendor Marketplace OS",
        desc: "Nous connectons vendeurs locaux, entreprises, acheteurs, logistique et paiement dans une seule plateforme.",
        flow: ["Vendeurs", "Acheteurs", "Logistique"],
        assets: ["Marketplace multi-vendeurs", "Paiement sécurisé", "Catalogue unifié"]
      },
      slide4: {
        title: "Produit (Coeur du Système)",
        pillars: [
          ["MULTI-VENDOR MARKETPLACE", "Plusieurs vendeurs, boutiques indépendantes et catalogue unifié."],
          ["PAYMENT SYSTEM", "Paiements sécurisés, mobile money, cartes et transactions centralisées."],
          ["ORDER & DELIVERY FLOW", "Gestion commandes, suivi livraison et coordination logistique."],
          ["VENDOR DASHBOARD", "Ventes en temps réel, gestion produits et analytics business."]
        ]
      },
      slide5: {
        title: "Marché",
        desc: "Le e-commerce mondial croît fortement, l'Afrique adopte rapidement le mobile commerce et les marketplaces locales deviennent indispensables.",
        metrics: ["E-commerce en croissance", "Mobile commerce africain", "Marketplaces locales"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le mobile, le paiement digital et les vendeurs indépendants accélèrent la transition vers les marketplaces digitales.",
        timeline: [
          ["Trend 1", "Explosion du mobile en Afrique"],
          ["Trend 2", "Croissance mobile money"],
          ["Trend 3", "Vendeurs indépendants"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commissions ventes", "Monétisation transactionnelle"],
          ["Abonnements vendeurs", "Offres premium récurrentes"],
          ["Mise en avant produits", "Visibilité et placements sponsorisés"],
          ["Services intégrés", "Logistique et publicités marketplace"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Localisation", "Mobile-first", "Différenciation"],
        rows: [
          ["DROPFA", "Terrain local", "Oui", "Optimisé marchés émergents"],
          ["Géants globaux", "Faible", "Partiel", "Peu adaptés au terrain"],
          ["Commerce informel", "Local", "Variable", "Non structuré"],
          ["Petites boutiques", "Local", "Partiel", "Visibilité limitée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir l'infrastructure e-commerce africaine.",
        phases: [
          ["Phase 1", "Vendeurs locaux"],
          ["Phase 2", "Régions et grandes villes"],
          ["Phase 3", "Marketplace nationale puis continentale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour accélérer l'expansion vendeurs, optimiser la plateforme, intégrer la logistique et soutenir la croissance multi-pays.",
        finalLine: "Le marché existe déjà, mais il n'est pas organisé.<br />DROPFA structure le commerce digital africain.<br />DROPFA devient l'infrastructure marketplace des marchés émergents."
      }
    },
    POSHUB: {
      deckTitle: "Investor Pitch Deck",
      displayName: "POSHUB",
      pdf: "pitch_deck/POSHUB/POSHUB.pdf",
      demo: "https://poshub-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "POSHUB",
        subtitle: "The Operating System for Retail & Restaurants",
        desc: "Les petites entreprises sont le moteur de l’économie. Elles sont encore mal digitalisées et perdent du contrôle chaque jour. Nous construisons le système central des commerces.",
        image: "pitch_deck/POSHUB/POSHUB.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Les commerces sont mal structurés. Le problème = absence de système.",
        problemItems: [
          ["Ventes", "Non centralisées"],
          ["Stock", "Mal suivi"],
          ["Finances", "Floues"],
          ["Outils", "Fragmentés"]
        ],
        stats: ["Pertes de revenus", "Mauvaise gestion", "Incapacité à scaler"]
      },
      slide3: {
        title: "POSHUB = Business Operating System",
        desc: "Tout est centralisé dans un seul système.",
        flow: ["Ventes", "Stock", "Finance"],
        assets: ["Achats", "Rapports", "Pilotage centralisé"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["SMART POS SYSTEM", "Ventes + facturation"],
          ["INVENTORY ENGINE", "Stock + alertes"],
          ["FINANCE MODULE", "Profits + dépenses"],
          ["BUSINESS DASHBOARD", "Analyse + performance"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Millions de petits commerces dans le monde. Retail + restaurants = marché massif, avec une digitalisation encore faible en Afrique et émergents.",
        metrics: ["Marché massif", "Opportunité globale", "Faible digitalisation"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Les outils simples remplacent les systèmes complexes.",
        timeline: [
          ["Trend 1", "Digitalisation des PME"],
          ["Trend 2", "Boom du commerce local"],
          ["Trend 3", "Adoption du mobile business"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS mensuel", "Revenus récurrents"],
          ["Licences commerces", "Déploiement terrain"],
          ["Modules premium", "Upsell par besoin"],
          ["POS hardware", "Intégration multi-branches"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Plateforme", "Simplicité", "Mobile-first", "Positionnement"],
        rows: [
          ["POSHUB", "Oui", "Oui", "Marchés émergents"],
          ["Suites ERP", "Faible", "Partiel", "Complexes"],
          ["POS legacy", "Partiel", "Partiel", "Peu flexibles"],
          ["Outils séparés", "Non", "Partiel", "Fragmentés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus de commerces = plus de données = meilleure optimisation.",
        phases: [
          ["Phase 1", "Petits commerces"],
          ["Phase 2", "Chaînes locales"],
          ["Phase 3", "Standard global PME"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour améliorer la plateforme SaaS, signer les premiers commerces, déployer en Afrique et scaler régionalement.",
        finalLine: "Les commerces ne meurent pas par manque de clients. Ils meurent par manque de contrôle.<br />POSHUB transforme chaque commerce en système intelligent.<br />POSHUB transforme les données en décisions."
      }
    },
    FREELA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "FREELA ONLINE",
      pdf: "pitch_deck/FREELA/FREELA.pdf",
      demo: "https://freela-online.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Produit",
        "Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d’Expansion",
        "Investissement"
      ],
      slide1: {
        title: "FREELA ONLINE",
        subtitle: "The Operating System for Freelancers & Independent Work",
        desc: "Le travail devient globalement indépendant. Des millions de freelances émergent partout, mais l’écosystème reste fragmenté et inefficace. Nous construisons l’infrastructure complète du travail indépendant.",
        image: "pitch_deck/FREELA/FREELA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le freelancing est en forte croissance, mais désorganisé. Le marché est énorme, mais mal structuré.",
        problemItems: [
          ["Plateformes", "Multiples et non unifiées"],
          ["Prix", "Pression et concurrence forte"],
          ["Business", "Outils intégrés absents"],
          ["Revenus", "Instables pour freelances"]
        ],
        stats: ["Freelances sous-valorisés", "Recrutement inefficace", "Valeur captée par intermédiaires"]
      },
      slide3: {
        title: "FREELA = Freelancer Operating System",
        desc: "Une seule plateforme = toute la carrière freelance.",
        flow: ["Missions", "Gestion", "Paiements"],
        assets: ["Contrats & facturation", "Client management", "Outils business intégrés"]
      },
      slide4: {
        title: "Produit (Cœur du Système)",
        pillars: [
          ["FREELANCE MARKETPLACE", "Matching intelligent clients / talents"],
          ["BUSINESS BACK-OFFICE", "Contrats, factures, paiements"],
          ["CLIENT ACQUISITION ENGINE", "Visibilité et recommandations IA"],
          ["CAREER MANAGEMENT LAYER", "Productivité et suivi carrière"]
        ]
      },
      slide5: {
        title: "Marché",
        desc: "L’économie freelance dépasse 1000B$ et continue d’accélérer avec le remote et les nouvelles générations.",
        metrics: ["1000B$+ économie freelance", "Explosion remote", "Adoption jeunes générations"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : marché désorganisé. Maintenant : structuration possible à grande échelle.",
        timeline: [
          ["Trend 1", "Explosion freelancing global"],
          ["Trend 2", "Digitalisation totale des services"],
          ["Trend 3", "IA pour matching & gestion"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commissions missions", "Monétisation transactionnelle"],
          ["Abonnements premium", "Revenus récurrents freelances"],
          ["SaaS business tools", "Upsell productivité"],
          ["Finance & recrutement", "Wallet, paiements, entreprises"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Plateforme", "Scope", "Business+Finance", "Différenciation"],
        rows: [
          ["FREELA", "All-in-one", "Oui", "Structure la carrière complète"],
          ["Upwork", "Marketplace", "Partiel", "Matching principalement"],
          ["Fiverr", "Marketplace", "Partiel", "Offres standardisées"],
          ["Outils isolés", "Fragmenté", "Non", "Expérience morcelée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d’Expansion",
        desc: "Objectif : devenir l’infrastructure mondiale du freelancing.",
        phases: [
          ["Phase 1", "Freelances locaux + missions simples"],
          ["Phase 2", "PME et startups"],
          ["Phase 3", "Écosystème global du travail indépendant"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour développer la plateforme scalable, acquérir des freelances actifs, onboarder les entreprises et accélérer l’expansion régionale puis globale.",
        finalLine: "Le freelancing n’est pas un marché. C’est une nouvelle économie mondiale.<br />FREELA transforme les indépendants en entreprises structurées.<br />Celui qui contrôle le travail indépendant contrôle l’avenir du travail."
      }
    },
    HRNOW: {
      deckTitle: "Investor Pitch Deck",
      displayName: "HRNOW",
      pdf: "pitch_deck/HRNOW/HRNOW.pdf",
      demo: "https://hrnow-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "HRNOW",
        subtitle: "AI Operating System for Recruitment & HR Management",
        desc: "Le recrutement est lent et fragmenté, les processus RH restent manuels. Nous construisons le système complet d’automatisation RH.",
        image: "pitch_deck/HRNOW/HRNOW.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le recrutement et les RH sont inefficaces. Les entreprises ne scalent pas leurs équipes efficacement.",
        problemItems: [
          ["Tri CV", "Manuel et lent"],
          ["Interviews", "Longues et répétitives"],
          ["Onboarding", "Lent"],
          ["Processus RH", "Dispersés / non standardisés"]
        ],
        stats: ["Recrutement lent", "Coûts élevés", "Matching de qualité faible"]
      },
      slide3: {
        title: "HRNOW = Plateforme RH Intelligente",
        desc: "Une seule plateforme pour tout le cycle RH.",
        flow: ["Screening IA", "Interviews auto", "Onboarding digital"],
        assets: ["Tests techniques + soft skills", "Gestion candidats", "Suivi employés"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["RECRUTEMENT IA", "Filtrage + scoring + matching"],
          ["INTERVIEWS AUTOMATISÉES", "Audio / vidéo + analyse"],
          ["TESTS DE COMPÉTENCES", "Techniques + comportement"],
          ["ATS + PIPELINE RH", "Gestion candidats + décisions"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Le marché RH / recrutement est mondial, massif et récurrent, porté par la digitalisation des entreprises.",
        metrics: ["Toutes les entreprises recrutent", "Tous secteurs concernés", "Digitalisation RH en forte croissance"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le recrutement devient un système IA piloté par vitesse et précision.",
        timeline: [
          ["Trend 1", "IA mature pour RH"],
          ["Trend 2", "Explosion des candidatures"],
          ["Trend 3", "Besoin de rapidité + précision"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS entreprise RH", "Abonnements récurrents"],
          ["Paiement par recrutement", "Monétisation à la performance"],
          ["Licences enterprise", "Déploiements à grande échelle"],
          ["API + modules avancés", "Tests, analytics, onboarding"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Plateforme", "End-to-end", "Automatisation", "Différenciation"],
        rows: [
          ["HRNOW", "Oui", "Oui", "Unifie tout le cycle RH"],
          ["ATS traditionnels", "Partiel", "Partiel", "Fragmentés"],
          ["Outils test isolés", "Non", "Partiel", "Usage ponctuel"],
          ["Suites RH legacy", "Partiel", "Faible", "Complexité élevée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus d’entreprises = plus de données = meilleure IA.",
        phases: [
          ["Phase 1", "Startups et PME"],
          ["Phase 2", "Entreprises mid-market"],
          ["Phase 3", "Standard RH global IA"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour accélérer la plateforme IA, signer des entreprises pilotes, scaler internationalement et intégrer les systèmes RH existants.",
        finalLine: "Le recrutement est un système lent et coûteux. HRNOW le transforme en flux intelligent.<br />L’IA automatise les RH. L’humain valide les décisions.<br />Nous construisons l’infrastructure mondiale du recrutement."
      }
    },
    CLINIXA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "CLINIXA",
      pdf: "pitch_deck/CLINIXA/CLINIXA.pdf",
      demo: "https://clinixa-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Expansion",
        "Investissement"
      ],
      slide1: {
        title: "CLINIXA",
        subtitle: "The AI Clinical Intelligence Layer for Healthcare",
        desc: "Les systèmes de santé sont fragmentés, les données médicales sont dispersées et les décisions sont lentes. Nous construisons la couche d’intelligence de la santé.",
        image: "pitch_deck/CLINIXA/CLINIXA.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le système de santé est inefficace. Il est digitalisé, mais pas intelligent.",
        problemItems: [
          ["Données patients", "Dispersées"],
          ["Diagnostics", "Lents"],
          ["Médecins", "Surchargés"],
          ["Outils", "Non unifiés"]
        ],
        stats: ["Erreurs médicales", "Temps critique perdu", "Soins inégaux"]
      },
      slide3: {
        title: "CLINIXA = AI Clinical Intelligence Platform",
        desc: "Le médecin décide. L’IA assiste et accélère.",
        flow: ["Analyse patient", "Diagnostic IA", "Décision accélérée"],
        assets: ["Recommandations cliniques", "Centralisation données", "Vue patient temps réel"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["CLINICAL DATA ENGINE", "Centralisation des dossiers"],
          ["AI DIAGNOSTIC SUPPORT", "Analyse + suggestions"],
          ["DECISION INTELLIGENCE", "Risques + traitements"],
          ["HEALTH INTEGRATION LAYER", "Hôpitaux + cliniques connectés"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "HealthTech mondial = marché massif, porté par l’IA médicale et la digitalisation accélérée des hôpitaux.",
        metrics: ["IA médicale en croissance", "Hôpitaux digitalisés", "Besoin critique d’efficacité"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : impossible. Maintenant : nécessaire.",
        timeline: [
          ["Force 1", "Explosion des données médicales"],
          ["Force 2", "IA devenue performante"],
          ["Force 3", "Pression sur les systèmes de santé"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS hôpitaux", "Revenus récurrents"],
          ["Licences institutionnelles", "Déploiement santé"],
          ["API IA médicale", "Intégration systèmes"],
          ["Modules spécialisés", "Upsell par spécialité"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "IA santé", "Intégration", "Différenciation"],
        rows: [
          ["CLINIXA", "Oui", "Oui", "Intelligence clinique"],
          ["Logiciels santé", "Non", "Partiel", "Outils administratifs"],
          ["Chatbots génériques", "Partiel", "Non", "Non cliniques"],
          ["Systèmes legacy", "Non", "Partiel", "Données fragmentées"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus de données = meilleure IA, meilleure IA = adoption accélérée.",
        phases: [
          ["Phase 1", "Cliniques pilotes"],
          ["Phase 2", "Hôpitaux régionaux"],
          ["Phase 3", "Standard global santé"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire une IA médicale robuste, signer les premiers établissements, tester en conditions réelles et scaler à grande échelle.",
        finalLine: "Les systèmes de santé ont des données, pas d’intelligence.<br />CLINIXA transforme ces données en décisions.<br />Nous construisons l’infrastructure de décision médicale."
      }
    },
    CLINIQAI: {
      deckTitle: "Investor Pitch Deck",
      displayName: "CLINIQAI",
      pdf: "pitch_deck/CLINIQAI/CLINIQAI.pdf",
      demo: "https://cliniqai-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Expansion",
        "Investissement"
      ],
      slide1: {
        title: "CLINIQAI",
        subtitle: "AI Operating System for Healthcare in Africa",
        desc: "Hôpitaux saturés, médecins en sous-effectif, décisions médicales difficiles. Nous construisons l’IA qui assiste chaque décision clinique.",
        image: "pitch_deck/CLINIQAI/CLINIQAI.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le système de santé africain est sous pression. Le système ne scale pas.",
        problemItems: [
          ["Médecins", "Sous-effectif"],
          ["Diagnostics", "Lents"],
          ["Hôpitaux", "Saturés"],
          ["Urgences", "Débordées"]
        ],
        stats: ["Erreurs médicales", "Urgences débordées", "Vies perdues"]
      },
      slide3: {
        title: "CLINIQAI = Intelligence Clinique",
        desc: "Un copilote médical qui assiste en temps réel.",
        flow: ["Analyse patient", "Diagnostic IA", "Action suggérée"],
        assets: ["Détection urgences", "Red flags automatiques", "Priorisation clinique"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["ANALYSE PATIENT", "Lecture clinique en temps réel"],
          ["DIAGNOSTIC IA", "Hypothèses priorisées"],
          ["RED FLAGS AUTO", "Détection des urgences"],
          ["PLAN D’ACTION", "Actions suggérées au médecin"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "L’Afrique combine population jeune, systèmes sous-équipés et digitalisation rapide.",
        metrics: ["Population jeune", "Systèmes sous-équipés", "Forte demande médicale"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le moment est critique : données, manque de médecins et avancée de l’IA convergent maintenant.",
        timeline: [
          ["Trend 1", "Explosion des données"],
          ["Trend 2", "Manque de médecins"],
          ["Trend 3", "Avancée de l’IA"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Licences hôpitaux", "Déploiement institutionnel"],
          ["Abonnements médecins", "Usage quotidien"],
          ["API médicale", "Intégration santé"],
          ["Modules spécialisés", "Revenus par spécialité"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "IA médicale", "Afrique", "Différenciation"],
        rows: [
          ["CLINIQAI", "Oui", "Oui", "Système clinique"],
          ["Chatbots génériques", "Partiel", "Non", "Non spécialisés"],
          ["Logiciels santé", "Non", "Partiel", "Administratifs"],
          ["Outils isolés", "Partiel", "Partiel", "Fragmentés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Expansion",
        desc: "Objectif : standard médical IA pour l’Afrique.",
        phases: [
          ["Phase 1", "Cliniques pilotes"],
          ["Phase 2", "Hôpitaux nationaux"],
          ["Phase 3", "Plateforme Afrique"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire l’IA, tester en hôpital, signer des cliniques et déployer en Afrique.",
        finalLine: "Les médecins restent essentiels. L’IA augmente leur impact.<br />CLINIQAI sauve du temps. CLINIQAI sauve des vies.<br />L’IA devient la couche clinique de l’Afrique."
      }
    },
    CARVISTA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "CARVISTA",
      pdf: "pitch_deck/CARVISTA/CARVISTA.pdf",
      demo: "https://carvista-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "CARVISTA",
        subtitle: "The Digital Marketplace for Cars in Africa",
        desc: "Acheter et vendre des voitures est encore lent. Le marché est fragmenté, peu digitalisé et les vendeurs manquent de visibilité.",
        image: "pitch_deck/CARVISTA/CARVISTA.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le marché automobile africain est immense mais désorganisé.",
        problemItems: [
          ["Visibilité", "Faible pour les vendeurs"],
          ["Information", "Peu structurée"],
          ["Transactions", "Peu sécurisées"],
          ["Standard", "Aucun cadre digital commun"]
        ],
        stats: ["Véhicules difficiles à vendre", "Prix mal optimisés", "Marché opaque"]
      },
      slide3: {
        title: "CARVISTA = Marketplace Automobile Digitale",
        desc: "Une seule plateforme pour tout le marché auto.",
        flow: ["Publier", "Comparer", "Connecter"],
        assets: ["Achat transparent", "Vente simplifiée", "Décision accélérée"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["LISTING VOITURES", "Publication simple et rapide"],
          ["RECHERCHE INTELLIGENTE", "Filtres prix / modèle / état"],
          ["MISE EN RELATION", "Acheteurs et vendeurs directs"],
          ["VISIBILITÉ OPTIMISÉE", "Exposition maximale des annonces"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "L’Afrique combine importation massive, marché d’occasion dominant et besoin urgent de digitalisation.",
        metrics: ["Marché en forte croissance", "Occasion dominante", "Opportunité plateforme centrale"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le marché est prêt pour une plateforme unique mobile-first.",
        timeline: [
          ["Trend 1", "Croissance du digital en Afrique"],
          ["Trend 2", "Hausse des ventes d’occasion"],
          ["Trend 3", "Usage massif du mobile"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commission sur ventes", "Monétisation transactionnelle"],
          ["Mise en avant annonces", "Upsell visibilité"],
          ["Publicité automobile", "Revenus média ciblés"],
          ["Partenariats & premium", "Garages, importateurs, vendeurs pro"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Marché", "Digitalisation", "Demande vendeurs", "Position CARVISTA"],
        rows: [
          ["Afrique auto", "Faible", "Très forte", "Infrastructure centrale"],
          ["Classifieds classiques", "Partielle", "Moyenne", "Peu structurés"],
          ["Réseaux sociaux", "Faible", "Forte", "Sans standard"],
          ["Sites locaux", "Partielle", "Locale", "Portée limitée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau: plus de voitures = plus d’acheteurs = plus de vendeurs.",
        phases: [
          ["Phase 1", "Vendeurs locaux"],
          ["Phase 2", "Importateurs + garages"],
          ["Phase 3", "Expansion continentale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour digitaliser le marché automobile africain, accélérer l’adoption et déployer à grande échelle.",
        finalLine: "Le marché automobile africain est énorme mais désorganisé. CARVISTA le structure et le digitalise.<br />Chaque voiture devient visible. Chaque vendeur devient accessible. Chaque transaction devient simple."
      }
    },
    PHARMHUB: {
      deckTitle: "Investor Pitch Deck",
      displayName: "PHARMHUB",
      pdf: "pitch_deck/PHARMHUB/PHARMHUB.pdf",
      demo: "https://carvista-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "PHARMHUB",
        subtitle: "The Digital Operating System for Pharmacies",
        desc: "L’accès aux médicaments reste fragmenté, les pharmacies sont peu digitalisées et la gestion est encore manuelle. Nous construisons l’infrastructure digitale des pharmacies modernes.",
        image: "pitch_deck/PHARMHUB/PHARMHUB.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le système pharmaceutique manque de visibilité et d’efficacité.",
        problemItems: [
          ["Stocks", "Mal gérés"],
          ["Pénuries", "Fréquentes"],
          ["Ventes", "Non digitalisées"],
          ["Logistique", "Fragmentée"]
        ],
        stats: ["Patients mal servis", "Revenus perdus", "Gaspillage de stock"]
      },
      slide3: {
        title: "PHARMHUB = Système Pharmaceutique Digital",
        desc: "Une seule plateforme pour tout le cycle pharmacie.",
        flow: ["Gestion pharmacie", "Marketplace", "Suivi stock"],
        assets: ["Digitalisation des ventes", "Visibilité produits", "Contrôle opérationnel"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["PHARMACY OS", "Stock + ventes + finances"],
          ["DIGITAL PRESCRIPTION", "Gestion rapide des prescriptions"],
          ["MARKETPLACE", "Accès centralisé aux produits"],
          ["ANALYTICS", "Pilotage des performances"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "L’industrie pharmaceutique est massive, avec une forte croissance dans les marchés émergents et un besoin urgent de digitalisation.",
        metrics: ["Marché mondial massif", "Forte croissance Afrique", "Opportunité critique"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "La pression sur les systèmes de santé rend la modernisation des pharmacies incontournable.",
        timeline: [
          ["Trend 1", "Digitalisation des soins"],
          ["Trend 2", "Traçabilité médicaments"],
          ["Trend 3", "Pression systèmes de santé"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement pharmacies", "Revenu récurrent"],
          ["Commission sur ventes", "Monétisation transactionnelle"],
          ["Marketplace B2B", "Réseau fournisseurs"],
          ["Services premium", "Analytics & modules santé"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Couverture", "Marchés émergents", "Différenciation"],
        rows: [
          ["PHARMHUB", "Tout-en-un", "Oui", "Plateforme complète"],
          ["Outils partiels", "Partielle", "Partiel", "Fragmentés"],
          ["ERP legacy", "Partielle", "Partiel", "Complexes"],
          ["Marketplaces génériques", "Faible", "Partiel", "Non spécialisés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus de pharmacies = plus de produits = plus de valeur.",
        phases: [
          ["Phase 1", "Pharmacies locales"],
          ["Phase 2", "Chaînes + fournisseurs"],
          ["Phase 3", "Réseau national"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour développer la plateforme, signer des pharmacies pilotes, structurer le réseau et accélérer l’adoption.",
        finalLine: "Une pharmacie sans digital est inefficace. PHARMHUB la transforme en réseau intelligent.<br />Chaque stock devient visible. Chaque vente devient traçable. Chaque pharmacie devient connectée."
      }
    },
    KULATABLE: {
      deckTitle: "Investor Pitch Deck",
      displayName: "KULATABLE",
      pdf: "pitch_deck/KULATABLE/KULATABLE.pdf",
      demo: "https://cliniqai-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "KULATABLE",
        subtitle: "The Operating System for Restaurants",
        desc: "Les restaurants utilisent encore des outils séparés, les opérations sont fragmentées et les pertes sont quotidiennes. Nous construisons le système central de gestion des restaurants.",
        image: "pitch_deck/KULATABLE/KULATABLE.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "L’industrie restaurant est inefficace. Les restaurants manquent de système unifié.",
        problemItems: [
          ["Commandes", "Dispersées"],
          ["Réservations", "Mal gérées"],
          ["Cuisine", "Erreurs fréquentes"],
          ["Performance", "Suivi faible"]
        ],
        stats: ["Pertes de revenus", "Expérience client incohérente", "Opérations chaotiques"]
      },
      slide3: {
        title: "KULATABLE = Restaurant Operating System",
        desc: "Une seule plateforme pour tout gérer.",
        flow: ["Réservations", "Commandes", "Analytics"],
        assets: ["Menus", "Paiements", "Cuisine connectée"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["RESERVATION ENGINE", "Tables + réduction no-shows"],
          ["DIGITAL MENU SYSTEM", "Menus interactifs + mises à jour"],
          ["POS + ORDER SYSTEM", "Commandes + paiements + cuisine"],
          ["OPERATIONS DASHBOARD", "Ventes + performance + personnel"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Industrie restauration = marché massif, avec des millions de restaurants encore non digitalisés.",
        metrics: ["Marché massif", "Food-tech en croissance", "Digital ordering accéléré"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Les restaurants doivent se digitaliser maintenant.",
        timeline: [
          ["Trend 1", "QR ordering généralisé"],
          ["Trend 2", "Digitalisation post-COVID"],
          ["Trend 3", "Commandes en ligne en explosion"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS par restaurant", "Revenus récurrents"],
          ["Commission commandes", "Monétisation usage"],
          ["Modules premium", "CRM et analytics"],
          ["Chaînes et hôtels", "Solutions enterprise"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Tout-en-un", "Mobile-first", "Différenciation"],
        rows: [
          ["KULATABLE", "Oui", "Oui", "Système complet"],
          ["POS classiques", "Partiel", "Partiel", "Back-office limité"],
          ["Ordering apps", "Partiel", "Oui", "Canal isolé"],
          ["Outils séparés", "Non", "Partiel", "Fragmentés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus de restaurants = plus de données, plus de données = meilleure optimisation.",
        phases: [
          ["Phase 1", "Restaurants indépendants"],
          ["Phase 2", "Chaînes et groupes"],
          ["Phase 3", "Standard global restauration"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire une plateforme stable, signer des restaurants pilotes, accélérer l’adoption locale et scaler régionalement.",
        finalLine: "Un restaurant sans système digital perd de l’argent chaque jour.<br />KULATABLE transforme chaque opération en performance.<br />Nous construisons l’infrastructure digitale de la restauration."
      }
    },
    WAPIMEDIA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "WAPIMEDIA",
      pdf: "pitch_deck/WAPIMEDIA/WAPIMEDIA.pdf",
      demo: "https://wapimedia.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Produit",
        "Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d’Expansion",
        "Investissement"
      ],
      slide1: {
        title: "WAPIMEDIA",
        subtitle: "The Digital Media Infrastructure for Emerging Markets",
        desc: "Le contenu digital explose en Afrique, mais la valeur reste captée à l’extérieur. Nous construisons l’infrastructure qui crée, distribue et monétise le contenu local.",
        image: "pitch_deck/WAPIMEDIA/WAPIMEDIA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le contenu existe, mais la valeur est captée ailleurs.",
        problemItems: [
          ["Contenu africain", "Sous-monétisé"],
          ["Créateurs", "Dispersés"],
          ["Infrastructure", "Faible localement"],
          ["Réseaux étrangers", "Dépendance forte"]
        ],
        stats: ["Valeur locale perdue", "Distribution peu contrôlée", "Revenus limités"]
      },
      slide3: {
        title: "WAPIMEDIA = Infrastructure + Distribution + Monetization",
        desc: "Une seule plateforme = tout l’écosystème média.",
        flow: ["Créer", "Distribuer", "Monétiser"],
        assets: ["Création simplifiée", "Distribution multi-canal", "Audiences directes"]
      },
      slide4: {
        title: "Produit",
        pillars: [
          ["CONTENT CREATION HUB", "Articles, vidéo, audio"],
          ["DISTRIBUTION ENGINE", "Diffusion multi-plateformes"],
          ["MEDIA NETWORK", "Créateurs, médias, organisations"],
          ["MONETIZATION SYSTEM", "Pub locale, sponsorisé, abonnements"]
        ]
      },
      slide5: {
        title: "Marché",
        desc: "L’industrie des médias digitaux pèse des centaines de milliards de dollars, avec un fort déficit d’infrastructure locale dans les marchés émergents.",
        metrics: ["Médias digitaux massifs", "Créateurs Afrique en croissance", "Infrastructure locale faible"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : consommation passive. Maintenant : création massive.",
        timeline: [
          ["Trend 1", "Explosion du mobile en Afrique"],
          ["Trend 2", "Hausse des créateurs indépendants"],
          ["Trend 3", "Demande massive de contenu local"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Publicité locale", "Revenus média digitaux"],
          ["Abonnements créateurs", "Revenus récurrents"],
          ["Contenus sponsorisés", "Monétisation directe"],
          ["Distribution premium", "Services médias enterprise"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Local", "Monétisation", "Différenciation"],
        rows: [
          ["WAPIMEDIA", "Oui", "Oui", "Structure et monétise"],
          ["Réseaux sociaux", "Partiel", "Partiel", "Distribuent surtout"],
          ["Médias legacy", "Oui", "Partiel", "Peu scalables"],
          ["Outils isolés", "Partiel", "Non", "Fragmentés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d’Expansion",
        desc: "Objectif : devenir l’infrastructure média des marchés émergents.",
        phases: [
          ["Phase 1", "Créateurs et médias locaux"],
          ["Phase 2", "Entreprises, ONG, institutions"],
          ["Phase 3", "Standard média régional dominant"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour développer une plateforme scalable, acquérir créateurs et médias, accélérer l’adoption régionale et structurer la monétisation.",
        finalLine: "Le contenu est produit partout, mais la valeur n’est pas structurée localement.<br />WAPIMEDIA transforme le contenu en économie digitale.<br />Celui qui contrôle la distribution contrôle l’attention et les revenus."
      }
    },
    IMMOHUB: {
      deckTitle: "Investor Pitch Deck",
      displayName: "IMMOHUB",
      pdf: "pitch_deck/IMMOHUB/IMMOHUB.pdf",
      demo: "https://immohub-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "IMMOHUB",
        subtitle: "The Operating System for Real Estate Management",
        desc: "La gestion immobilière est encore manuelle, les processus sont fragmentés et les revenus sont mal optimisés. Nous construisons le système central de gestion immobilière.",
        image: "pitch_deck/IMMOHUB/IMMOHUB.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le secteur immobilier est massif mais mal digitalisé.",
        problemItems: [
          ["Loyers", "Gestion manuelle"],
          ["Communication", "Désorganisée"],
          ["Maintenance", "Non structurée"],
          ["Finance", "Visibilité faible"]
        ],
        stats: ["Pertes de revenus", "Coûts opérationnels élevés", "Mauvaise expérience utilisateur"]
      },
      slide3: {
        title: "IMMOHUB = Real Estate Management OS",
        desc: "Une seule plateforme pour tout gérer.",
        flow: ["Propriétés", "Paiements", "Maintenance"],
        assets: ["Locataires", "Communication", "Pilotage financier"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["PROPERTY MANAGEMENT", "Biens + locataires + contrats"],
          ["RENT & PAYMENTS", "Paiements automatisés"],
          ["MAINTENANCE SYSTEM", "Tickets + prestataires"],
          ["COMMUNICATION HUB", "Messages + notifications"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Marché immobilier mondial énorme, encore largement manuel, avec un fort besoin de digitalisation.",
        metrics: ["Marché mondial énorme", "Gestion encore manuelle", "Investissements locatifs en croissance"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le real estate passe obligatoirement vers le SaaS.",
        timeline: [
          ["Trend 1", "Digitalisation du real estate"],
          ["Trend 2", "Croissance des revenus locatifs"],
          ["Trend 3", "Besoin de transparence"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnements SaaS", "Revenus récurrents"],
          ["Licences agences", "Déploiement immobilier"],
          ["Modules premium", "Upsell fonctionnel"],
          ["API immobilière", "Intégrations enterprise"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Cycle complet", "Marchés émergents", "Différenciation"],
        rows: [
          ["IMMOHUB", "Oui", "Oui", "Plateforme complète"],
          ["Outils partiels", "Partiel", "Partiel", "Fonctions isolées"],
          ["Gestion manuelle", "Non", "Oui", "Non scalable"],
          ["ERP legacy", "Partiel", "Partiel", "Complexes"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus de biens = plus de données, plus de données = meilleure gestion.",
        phases: [
          ["Phase 1", "Petites agences + résidences"],
          ["Phase 2", "Grandes agences + promoteurs"],
          ["Phase 3", "Standard national immobilier"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire une plateforme SaaS robuste, signer des agences pilotes, digitaliser des résidences et scaler régionalement.",
        finalLine: "L’immobilier n’est pas un problème de construction. C’est un problème de gestion.<br />IMMOHUB transforme les bâtiments en systèmes intelligents.<br />Nous construisons l’infrastructure digitale de l’immobilier."
      }
    },
    TASKA360: {
      deckTitle: "Investor Pitch Deck",
      displayName: "TASKA360",
      pdf: "pitch_deck/TASKA360/TASKA360.pdf",
      demo: "https://taska360.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Croissance",
        "Investissement"
      ],
      slide1: {
        title: "TASKA360",
        subtitle: "The Operating System for Work & Execution",
        desc: "Le travail est fragmenté, les équipes sont mal organisées et la productivité reste sous-optimisée. Nous construisons le système d’exécution intelligent du travail.",
        image: "pitch_deck/TASKA360/TASKA360.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le travail moderne est inefficace : il manque une structure système.",
        problemItems: [
          ["Tâches", "Mal distribuées"],
          ["Talents", "Mal utilisés"],
          ["Processus", "Désorganisés"],
          ["Visibilité", "Limitée"]
        ],
        stats: ["Perte de productivité", "Coûts élevés", "Mauvaise exécution"]
      },
      slide3: {
        title: "TASKA360 = Workforce Intelligence Platform",
        desc: "Tout est connecté et optimisé.",
        flow: ["Tâches", "Talents", "Workflows"],
        assets: ["Équipes synchronisées", "Décisions plus rapides", "Exécution pilotée"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["TASK MANAGEMENT", "Création + priorisation des tâches"],
          ["TALENT MATCHING", "Assignation intelligente"],
          ["WORKFLOW AUTOMATION", "Processus automatisés"],
          ["PERFORMANCE TRACKING", "Suivi et scoring des équipes"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Le marché global productivité est massif, tiré par SaaS, HR Tech et outils de travail.",
        metrics: ["Opportunité mondiale", "Besoin récurrent", "Forte demande d’efficacité"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Le travail hybride et la montée de l’IA imposent une nouvelle couche d’automatisation.",
        timeline: [
          ["Trend 1", "Travail hybride et remote"],
          ["Trend 2", "Montée de l’IA"],
          ["Trend 3", "Pression sur la productivité"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS entreprises", "Abonnements récurrents"],
          ["Licences équipes", "Déploiement opérationnel"],
          ["Modules IA avancés", "Upsell intelligent"],
          ["API + automation", "Intégrations et scale"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Scope", "Automatisation IA", "Différenciation"],
        rows: [
          ["TASKA360", "Tout-en-un", "Oui", "Système complet d’exécution"],
          ["Asana", "Gestion tâches", "Partiel", "Focus management"],
          ["ClickUp/Monday", "Large", "Partiel", "Stack fragmenté"],
          ["Outils isolés", "Partiel", "Non", "Peu connectés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Croissance",
        desc: "Effet réseau : plus d’utilisateurs = plus de données = meilleure IA.",
        phases: [
          ["Phase 1", "PME et startups"],
          ["Phase 2", "Entreprises mid-market"],
          ["Phase 3", "Standard global du travail"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire la plateforme IA, signer des entreprises pilotes, accélérer le déploiement et scaler internationalement.",
        finalLine: "Le travail est inefficace à cause des systèmes. TASKA360 le transforme en exécution intelligente.<br />Les tâches deviennent organisées. Les talents deviennent optimisés. Les équipes deviennent performantes."
      }
    },
    KABISHI: {
      deckTitle: "Investor Pitch Deck",
      displayName: "KABISHI AI",
      pdf: "pitch_deck/KABISHI/KABISHI.pdf",
      demo: "https://kabishiai.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Produit",
        "Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "KABISHI AI",
        subtitle: "The African-First AI Infrastructure Layer",
        desc: "L'IA mondiale est dominée par quelques acteurs globaux. L'Afrique et les marchés émergents sont sous-servis. Nous construisons une infrastructure d'IA adaptée, utile et scalable.",
        image: "pitch_deck/KABISHI/KABISHI.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "L'intelligence artificielle actuelle est désalignée : faible adaptation aux contextes locaux, peu de support des langues africaines, cas d'usage business limités localement.",
        problemItems: [
          ["Adaptation", "Faible aux contextes locaux"],
          ["Langues", "Peu de support africain"],
          ["Business", "Cas d'usage limités"],
          ["Dépendance", "Plateformes étrangères"]
        ],
        stats: ["IA peu utilisée localement", "Faible transformation digitale", "Solutions mal adaptées"]
      },
      slide3: {
        title: "KABISHI AI = Contextual AI Infrastructure Layer",
        desc: "Nous créons une IA utile et adaptable.",
        flow: ["Entreprises locales", "Services digitaux", "IA mobile-first"],
        assets: ["Commerce, santé, éducation", "Multi-langues", "API ecosystem"]
      },
      slide4: {
        title: "Produit (Cœur du Système)",
        pillars: [
          ["AI CORE ENGINE", "Modèles IA spécialisés + adaptation locale"],
          ["BUSINESS AI TOOLS", "Automatisation tâches + aide décision"],
          ["MULTI-LANGUAGE AI", "Langues locales + internationales"],
          ["AI API ECOSYSTEM", "Intégration apps et SaaS"]
        ]
      },
      slide5: {
        title: "Marché",
        desc: "Marché global de l'IA : centaines de milliards $. Croissance massive des AI APIs. Faible pénétration en Afrique.",
        metrics: ["Marché IA massif", "Croissance AI APIs", "Opportunité Afrique"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : infrastructure absente. Maintenant : opportunité stratégique.",
        timeline: [
          ["Facteur 1", "Explosion adoption IA"],
          ["Facteur 2", "Open-source AI accélération"],
          ["Facteur 3", "Besoin urgent solutions locales"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["API IA", "Usage-based"],
          ["Licences entreprises", "Revenus récurrents"],
          ["Solutions sectorielles", "Health, retail, HR"],
          ["Services data & intelligence", "Intégrations SaaS"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Local-first", "API-driven", "Différenciation"],
        rows: [
          ["KABISHI AI", "Oui", "Oui", "Infrastructure IA locale"],
          ["Géants IA", "Non", "Oui", "Global, non contextualisé"],
          ["Solutions locales", "Oui", "Partiel", "Fragmentées"],
          ["Outils génériques", "Non", "Partiel", "Non adaptés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir la couche IA de l'écosystème digital africain.",
        phases: [
          ["Phase 1", "Entreprises et startups locales"],
          ["Phase 2", "Intégration apps (HR, health, commerce)"],
          ["Phase 3", "Infrastructure IA continentale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour développer l'IA spécialisée, créer une API scalable, intégrer avec apps existantes et déployer régionalement puis continentalement.",
        finalLine: "L'IA mondiale est universelle, mais son impact doit être local.<br />KABISHI AI transforme l'intelligence artificielle en infrastructure utile pour l'Afrique.<br />Celui qui contrôle l'IA locale contrôle la transformation digitale."
      }
    },
    SPACEHUB: {
      deckTitle: "Investor Pitch Deck",
      displayName: "SPACEHUB",
      pdf: "pitch_deck/SPACEHUB/SPACEHUB.pdf",
      demo: "https://spacehub-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Expansion",
        "Investissement"
      ],
      slide1: {
        title: "SPACEHUB",
        subtitle: "The Operating System for Physical Space",
        desc: "L'espace est mal utilisé, les actifs sont sous-optimisés, aucun système global n'existe. Nous créons l'infrastructure des espaces physiques intelligents.",
        image: "pitch_deck/SPACEHUB/SPACEHUB.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le système actuel est inefficace : espaces vides, gestion manuelle, aucune optimisation, pertes invisibles.",
        problemItems: [
          ["Espaces", "Vides et sous-utilisés"],
          ["Gestion", "Manuelle et fragmentée"],
          ["Optimisation", "Absente"],
          ["Contrôle", "Inexistant"]
        ],
        stats: ["Gaspillage massif", "Faible rentabilité", "Manque de contrôle"]
      },
      slide3: {
        title: "SPACEHUB = Asset Intelligence Layer",
        desc: "Nous connectons espaces, utilisateurs, entreprises et actifs dans une plateforme unique.",
        flow: ["Espaces", "Utilisateurs", "Optimisation"],
        assets: ["Gestion centralisée", "Accès digital", "Analytics temps réel"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["SPACE MANAGEMENT", "Gestion intelligente des espaces"],
          ["ACCESS SYSTEM", "Contrôle digital des accès"],
          ["OPTIMISATION IA", "Réduction du vide + analytics"],
          ["MARKETPLACE", "Location d'espaces connectée"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Immobilier : trillions $. Logistique en croissance. Self-storage en explosion. Opportunité : digitaliser les actifs physiques.",
        metrics: ["Immobilier trillions $", "Logistique en croissance", "Self-storage en explosion"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Besoin immédiat d'optimisation des espaces physiques.",
        timeline: [
          ["Trend 1", "E-commerce en hausse"],
          ["Trend 2", "Urbanisation rapide"],
          ["Trend 3", "Digitalisation immobilière"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commissions", "Monétisation transactionnelle"],
          ["Abonnements", "Revenus récurrents"],
          ["SaaS analytics", "Pilotage performance"],
          ["API entreprise", "Intégrations B2B"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Gestion", "Marketplace", "Différenciation"],
        rows: [
          ["SPACEHUB", "Oui", "Oui", "Système complet d'optimisation"],
          ["Immobilier classique", "Partiel", "Non", "Non digitalisé"],
          ["Marketplaces seules", "Non", "Oui", "Sans gestion intégrée"],
          ["SaaS isolés", "Oui", "Non", "Fragmentés"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Expansion",
        desc: "Objectif : devenir le système standard des espaces physiques.",
        phases: [
          ["Phase 1", "Storage + bureaux"],
          ["Phase 2", "Immobilier + logistique"],
          ["Phase 3", "Standard global espaces"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire la plateforme, signer des partenaires, digitaliser les espaces et scaler internationalement.",
        finalLine: "L'espace est sous-exploité.<br />SPACEHUB le transforme en actif intelligent.<br />Celui qui contrôle l'espace contrôle l'économie physique."
      }
    },
    AUROREIA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "AUROREIA",
      pdf: "pitch_deck/AUROREIA/AUROREIA.pdf",
      demo: "https://auroreia.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "L'Opportunité",
        "Business Model",
        "Avantage",
        "Stratégie",
        "Investissement"
      ],
      slide1: {
        title: "AUROREIA",
        subtitle: "AI Continental Core System",
        desc: "Une seule IA pour créer, automatiser et adapter le digital en Afrique et marchés émergents.",
        image: "pitch_deck/AUROREIA/AUROREIA.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "L'IA mondiale n'est pas adaptée localement. Les entreprises africaines restent sans automatisation réelle.",
        problemItems: [
          ["IA mondiale", "Non adaptée localement"],
          ["Outils SaaS", "Dispersés et fragmentés"],
          ["Automatisation", "Absente sur le terrain"],
          ["Accès IA", "Faible dans les marchés émergents"]
        ],
        stats: ["IA inutilisable localement", "Outils non intégrés", "Faible transformation digitale"]
      },
      slide3: {
        title: "AUROREIA = Plateforme IA Unique",
        desc: "Création de contenu, automatisation business, API IA et intelligence locale en une seule plateforme.",
        flow: ["Créer", "Automatiser", "Adapter"],
        assets: ["Intelligence locale", "Langues africaines", "API pour toutes les apps"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["AI CORE", "Modèles IA + génération + analyse"],
          ["BUSINESS ENGINE", "Marketing, emails, sales, contenu"],
          ["LOCAL INTELLIGENCE", "Langues africaines + adaptation terrain"],
          ["API LAYER", "Intégration dans toutes les apps"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "IA : marché global massif. Afrique : sous-équipée. Forte demande business et mobile.",
        metrics: ["Marché IA massif", "Afrique sous-équipée", "Forte demande mobile"]
      },
      slide6: {
        title: "L'Opportunité",
        desc: "Pas juste une IA globale — une IA contextuelle et utilisable sur le terrain.",
        timeline: [
          ["Angle 1", "IA contextuelle locale"],
          ["Angle 2", "Intégration multi-projets"],
          ["Angle 3", "Marchés ignorés par Big Tech"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS abonnement", "Revenus récurrents"],
          ["API usage", "Monétisation à l'usage"],
          ["Licences entreprises", "Déploiements B2B"],
          ["Solutions verticales", "Retail, HR, santé"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Local + Global", "Multi-projets", "Différenciation"],
        rows: [
          ["AUROREIA", "Oui", "Oui", "IA contextuelle terrain"],
          ["ChatGPT / OpenAI", "Global seulement", "Non", "Non adapté local"],
          ["Outils SaaS isolés", "Partiel", "Non", "Fragmentés"],
          ["Solutions locales", "Local seulement", "Partiel", "Peu scalables"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie",
        desc: "Objectif : devenir l'infrastructure IA régionale des marchés émergents.",
        phases: [
          ["Phase 1", "PME + créateurs"],
          ["Phase 2", "Entreprises + apps"],
          ["Phase 3", "Infrastructure IA régionale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour construire l'IA contextuelle, intégrer les projets existants et déployer à l'échelle continentale.",
        finalLine: "IA globale ≠ IA utile.<br />AUROREIA + KABISHI = IA réelle terrain.<br />Infrastructure intelligence des marchés émergents."
      }
    },
    CELINE: {
      deckTitle: "Investor Pitch Deck",
      displayName: "CELINE AI",
      pdf: "pitch_deck/CELINE/CELINE.pdf",
      demo: "https://celineai-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage",
        "Stratégie",
        "Investissement"
      ],
      slide1: {
        title: "CELINE AI",
        subtitle: "Personal AI Operating System",
        desc: "1 seule IA pour la vie digitale. Remplacer la fragmentation des apps. Assistant + productivité + organisation.",
        image: "pitch_deck/CELINE/celineai.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Trop d'apps, perte de temps quotidienne, surcharge mentale, zéro centralisation.",
        problemItems: [
          ["Apps", "Trop nombreuses et fragmentées"],
          ["Temps", "Perdu à jongler entre outils"],
          ["Mental", "Surcharge cognitive quotidienne"],
          ["Centralisation", "Inexistante"]
        ],
        stats: ["Vie digitale désorganisée", "Perte de productivité", "Surcharge mentale"]
      },
      slide3: {
        title: "CELINE AI = Cerveau Digital Personnel",
        desc: "Organisation, assistance, communication et productivité dans une seule interface intelligente.",
        flow: ["Organisation", "Assistance", "Productivité"],
        assets: ["Communication centralisée", "Interface unique", "IA contextuelle"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["ASSISTANT PERSONNEL", "Tâches + agenda + rappels"],
          ["CHAT IA CONTEXTUEL", "Réponses + aide quotidienne"],
          ["PRODUCTIVITY ENGINE", "Priorisation + automatisation"],
          ["LIFESTYLE HUB", "Recommandations + routine"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "AI assistants en forte croissance. Usage mobile quotidien. Demande massive de simplification.",
        metrics: ["AI assistants en croissance", "Usage mobile quotidien", "Marché global grand public"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Explosion des IA conversationnelles, fatigue des apps multiples, besoin d'un assistant unique.",
        timeline: [
          ["Trend 1", "Explosion IA conversationnelles"],
          ["Trend 2", "Fatigue des apps multiples"],
          ["Trend 3", "Centralisation devient obligatoire"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement premium IA", "Revenus récurrents"],
          ["Freemium → upgrade", "Acquisition + conversion"],
          ["API & intégrations", "Revenus B2B"],
          ["Services personnalisés", "Upsell premium"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Centré user", "Usage quotidien", "Différenciation"],
        rows: [
          ["CELINE AI", "Oui", "Oui", "Système de vie complet"],
          ["ChatGPT", "Partiel", "Oui", "Outil, pas système"],
          ["Apps séparées", "Non", "Oui", "Fragmentées"],
          ["Assistants vocaux", "Partiel", "Oui", "Limités"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie",
        desc: "Objectif : devenir l'écosystème IA complet de la vie personnelle.",
        phases: [
          ["Phase 1", "Assistant basique"],
          ["Phase 2", "Productivité + intégrations"],
          ["Phase 3", "Écosystème IA complet personnel"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons : [À DÉFINIR] pour rendre l'IA plus intelligente, accélérer la croissance mobile, l'expansion globale et une UX ultra simple.",
        finalLine: "Les apps organisent des tâches.<br />CELINE AI organise la vie.<br />Une seule intelligence, un seul système."
      }
    },
    LAWLINKER: {
      deckTitle: "Investor Pitch Deck",
      displayName: "LAWLINKER",
      pdf: "pitch_deck/LAWLINKER/LAWLINKER.pdf",
      demo: "https://lawlinker-online.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Valeur Double Face",
        "Le Marché",
        "Business Model",
        "Avantage",
        "Stratégie",
        "Investissement"
      ],
      slide1: {
        title: "LAWLINKER",
        subtitle: "AI Legal Growth & Matching System",
        desc: "Connecte clients ↔ avocats, automatise l'acquisition et simplifie l'accès au droit. Une seule plateforme pour les deux côtés du marché.",
        image: "pitch_deck/LAWLINKER/LAWLINKER.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le marché juridique est inefficace des deux côtés : clients sans avocat de confiance, avocats sans clients qualifiés.",
        problemItems: [
          ["Clients", "Difficile de trouver un bon avocat"],
          ["Avocats", "Manque de clients qualifiés"],
          ["Processus", "Long et coûteux"],
          ["Confiance", "Faible des deux côtés"]
        ],
        stats: ["Marché inefficace", "Acquisition coûteuse", "Temps perdu"]
      },
      slide3: {
        title: "LAWLINKER = Marketplace + AI Intake System",
        desc: "Mise en relation automatique clients / avocats, qualification intelligente des besoins, matching par spécialité juridique.",
        flow: ["Besoin client", "Matching IA", "Consultation"],
        assets: ["Qualification intelligente", "Matching spécialité", "Conversion rapide"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["CLIENT MATCHING AI", "Besoin → avocat adapté"],
          ["INTAKE AUTOMATISÉ", "Qualification des cas juridiques"],
          ["LAWYER MARKETPLACE", "Cabinet visible + profil + expertise"],
          ["CRM & CONVERSION ENGINE", "RDV + suivi + paiement"]
        ]
      },
      slide5: {
        title: "Valeur pour les 2 Parties",
        desc: "Un win-win structurel : clients accèdent rapidement à un avocat, avocats reçoivent un flux constant de clients qualifiés.",
        problemItems: [
          ["Clients", "Accès rapide à un avocat"],
          ["Avocats", "Flux constant de clients qualifiés"],
          ["Réponse", "Immédiate et ciblée"],
          ["Revenus", "Gain de temps + revenus avocats"]
        ],
        stats: ["Win-win structurel", "Réduction friction", "Conversion rapide"]
      },
      slide6: {
        title: "Le Marché",
        desc: "Marché juridique mondial massif, millions de clients potentiels, milliers de cabinets. Marché double face très scalable.",
        timeline: [
          ["Clients", "Millions de besoins juridiques"],
          ["Avocats", "Milliers de cabinets"],
          ["Scalabilité", "Marché double face global"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commission mise en relation", "Monétisation transactionnelle"],
          ["Abonnement cabinets", "Revenus récurrents"],
          ["Leads premium", "Upsell visibilité"],
          ["Services IA avancés", "Marketplace + SaaS hybride"]
        ]
      },
      slide8: {
        title: "Avantage",
        headers: ["Solution", "Double face", "IA Matching", "Différenciation"],
        rows: [
          ["LAWLINKER", "Oui", "Oui", "Système de transactions juridiques"],
          ["Annuaires avocats", "Non", "Non", "Simple listing"],
          ["Plateformes génériques", "Partiel", "Partiel", "Non spécialisées"],
          ["Cabinets directs", "Non", "Non", "Portée limitée"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie",
        desc: "Expansion progressive du local au global.",
        phases: [
          ["Phase 1", "Clients + avocats locaux"],
          ["Phase 2", "Cabinets régionaux"],
          ["Phase 3", "Réseau juridique global intelligent"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour développer l'AI matching juridique, onboarder avocats + clients, scaler la marketplace et accélérer l'expansion multi-pays.",
        finalLine: "Les clients cherchent des solutions.<br />Les avocats cherchent des clients.<br />LAWLINKER connecte les deux instantanément."
      }
    },
    DAWAGO: {
      deckTitle: "Investor Pitch Deck",
      displayName: "DAWAGO AI",
      pdf: "pitch_deck/DAWAGO/DAWAGO.pdf",
      demo: "https://dawagoai.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Timing",
        "Business Model",
        "Avantage Compétitif",
        "Expansion",
        "Investissement"
      ],
      slide1: {
        title: "DAWAGO AI",
        subtitle: "AI Health Intelligence & Patient Care OS",
        desc: "Les systèmes de santé sont fragmentés, les patients sont mal suivis, les médecins sont surchargés. Nous construisons la couche d'intelligence qui connecte patients, médecins et données médicales.",
        image: "pitch_deck/DAWAGO/DAWAGO.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le système de santé est inefficace : absence d'intelligence centralisée.",
        problemItems: [
          ["Dossiers patients", "Dispersés"],
          ["Diagnostic", "Lent"],
          ["Coordination", "Absente"],
          ["Hôpitaux", "Surchargés"]
        ],
        stats: ["Soins retardés", "Coûts élevés", "Pertes de vies évitables"]
      },
      slide3: {
        title: "DAWAGO AI = AI Medical Operating System",
        desc: "Nous unifions patients, médecins, cliniques et données médicales dans une seule plateforme intelligente.",
        flow: ["Patients", "Médecins", "Intelligence"],
        assets: ["Données centralisées", "Diagnostic IA", "Décision accélérée"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["AI DIAGNOSTIC ASSISTANT", "Analyse symptômes + aide au diagnostic"],
          ["PATIENT DATA SYSTEM", "Dossiers centralisés + historique complet"],
          ["CLINIC MANAGEMENT", "Consultations + flux patients optimisé"],
          ["DECISION INTELLIGENCE", "Alertes risques + priorisation critiques"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "HealthTech mondiale en énorme croissance, digitalisation rapide des hôpitaux, forte demande en IA médicale.",
        metrics: ["HealthTech en forte croissance", "Hôpitaux en digitalisation", "IA médicale en explosion"]
      },
      slide6: {
        title: "Timing",
        desc: "Avant : manuel. Maintenant : IA obligatoire. L'explosion de l'IA médicale et la surcharge des systèmes de santé créent une fenêtre stratégique.",
        timeline: [
          ["Trend 1", "Explosion de l'IA médicale"],
          ["Trend 2", "Surcharge des systèmes de santé"],
          ["Trend 3", "Besoin urgent de digitalisation"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["SaaS hôpitaux & cliniques", "Revenus récurrents"],
          ["Licences médicales", "Déploiement institutionnel"],
          ["API IA santé", "Intégrations systèmes"],
          ["Modules premium", "Diagnostic, triage, analytics"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "IA santé", "Centralisation", "Différenciation"],
        rows: [
          ["DAWAGO AI", "Oui", "Oui", "Intelligence médicale complète"],
          ["Logiciels santé", "Non", "Partiel", "Outils administratifs"],
          ["Chatbots génériques", "Partiel", "Non", "Non cliniques"],
          ["Systèmes legacy", "Non", "Partiel", "Données fragmentées"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Expansion",
        desc: "Objectif : devenir l'OS mondial de la santé digitale.",
        phases: [
          ["Phase 1", "Cliniques privées"],
          ["Phase 2", "Hôpitaux régionaux"],
          ["Phase 3", "Standard national / continental"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour développer l'IA médicale avancée, lancer les pilotes cliniques, intégrer les hôpitaux et accélérer l'expansion régionale.",
        finalLine: "La santé n'a pas besoin de plus de données. Elle a besoin d'intelligence.<br />DAWAGO AI transforme les soins en système intelligent.<br />Celui qui contrôle l'intelligence médicale contrôle l'avenir des soins."
      }
    },
    ZAA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "ZAA",
      pdf: "pitch_deck/ZAA/ZAA.pdf",
      demo: "https://zaa-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Timing",
        "Business Model",
        "Avantage Compétitif",
        "Expansion",
        "Investissement"
      ],
      slide1: {
        title: "ZAA",
        subtitle: "Classified Marketplace OS for Local Commerce",
        desc: "Le commerce local est immense mais non structuré. Les gens vendent encore via WhatsApp et Facebook. Nous construisons l'infrastructure du commerce entre particuliers.",
        image: "pitch_deck/ZAA/ZAA.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le marché local est inefficace : le commerce existe, mais il n'a pas de système.",
        problemItems: [
          ["Ventes", "Non organisées"],
          ["Confiance", "Absente entre acheteurs/vendeurs"],
          ["Visibilité", "Aucune pour les produits"],
          ["Paiement", "Pas de système structuré"]
        ],
        stats: ["Opportunités perdues", "Fraude fréquente", "Marché fragmenté"]
      },
      slide3: {
        title: "ZAA = Digital Classified Marketplace OS",
        desc: "Nous connectons vendeurs particuliers, petites entreprises et acheteurs locaux dans une seule plateforme.",
        flow: ["Vendeurs", "Plateforme", "Acheteurs"],
        assets: ["Annonces structurées", "Chat intégré", "Commerce digitalisé"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["BUY & SELL MARKETPLACE", "Annonces + catégories + neuf & occasion"],
          ["REAL-TIME CHAT", "Négociation directe acheteur/vendeur"],
          ["SMART SEARCH SYSTEM", "Filtres avancés + géolocalisation"],
          ["MONETIZATION ENGINE", "Annonces sponsorisées + abonnements premium"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Commerce informel énorme en Afrique et marchés émergents. Millions de vendeurs non digitalisés. Transition massive vers le mobile commerce.",
        metrics: ["Commerce informel massif", "Millions de vendeurs", "Mobile commerce en explosion"]
      },
      slide6: {
        title: "Timing",
        desc: "Avant : vente informelle. Maintenant : marketplace obligatoire.",
        timeline: [
          ["Trend 1", "Explosion du smartphone"],
          ["Trend 2", "Croissance du commerce peer-to-peer"],
          ["Trend 3", "Besoin de plateformes locales fiables"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnements vendeurs", "Revenus récurrents"],
          ["Publications premium", "Frais de mise en avant"],
          ["Annonces sponsorisées", "Revenus publicitaires locaux"],
          ["Commissions transactions", "Modèle hybride scalable"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Local-first", "Mobile-first", "Différenciation"],
        rows: [
          ["ZAA", "Oui", "Oui", "OS du commerce local optimisé"],
          ["OLX / Jiji", "Partiel", "Partiel", "Plateformes globales"],
          ["Facebook Marketplace", "Partiel", "Oui", "Pas de système dédié"],
          ["WhatsApp", "Non", "Oui", "Aucune structure commerce"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Expansion",
        desc: "Objectif : OS du commerce local mondial.",
        phases: [
          ["Phase 1", "Lancement ville par ville"],
          ["Phase 2", "Domination nationale"],
          ["Phase 3", "Réseau de marketplaces locales connectées"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour accélérer la croissance utilisateurs, acquérir des vendeurs, lancer le marketing local agressif et déployer l'expansion multi-pays.",
        finalLine: "Le commerce informel est le plus grand marché du monde… mais le moins structuré.<br />ZAA transforme les petites annonces en économie digitale organisée.<br />Celui qui structure le commerce local contrôle l'économie réelle."
      }
    },
    VENDIA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "VENDIA",
      pdf: "pitch_deck/VENDIA/VENDIA.pdf",
      demo: "https://vendia-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Timing",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie",
        "Investissement"
      ],
      slide1: {
        title: "VENDIA",
        subtitle: "Multi-Vendor E-Commerce Marketplace OS",
        desc: "Le commerce en ligne explose, mais les vendeurs sont dispersés sur des plateformes isolées. Nous construisons l'infrastructure où plusieurs vendeurs créent, vendent et scalent ensemble.",
        image: "pitch_deck/VENDIA/VENDIA.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le e-commerce est fragmenté : absence de marketplace flexible et accessible.",
        problemItems: [
          ["Vendeurs", "Isolés sans infrastructure"],
          ["Plateformes", "Dépendance aux géants"],
          ["Branding", "Faible contrôle client"],
          ["Scalabilité", "Difficile individuellement"]
        ],
        stats: ["Petits vendeurs bloqués", "Marketplaces dominantes", "Faible autonomie"]
      },
      slide3: {
        title: "VENDIA = Multi-Vendor Marketplace OS",
        desc: "Une seule plateforme = un écosystème de commerce complet.",
        flow: ["Vendeurs", "Marketplace", "Clients"],
        assets: ["Boutiques indépendantes", "Paiements intégrés", "Logistique centralisée"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["MULTI-VENDOR ENGINE", "Plusieurs vendeurs dans une seule plateforme"],
          ["PRODUCT & INVENTORY", "Gestion produits + stock synchronisé"],
          ["PAYMENT & ORDER SYSTEM", "Paiements sécurisés + split revenus"],
          ["ADMIN & ANALYTICS", "Suivi ventes + performance vendeurs"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "E-commerce mondial en forte croissance, explosion des marketplaces locales, Afrique et marchés émergents encore sous-développés.",
        metrics: ["E-commerce en forte croissance", "Marketplaces locales en explosion", "Marchés émergents sous-équipés"]
      },
      slide6: {
        title: "Timing",
        desc: "Avant : marketplaces lourdes à construire. Maintenant : SaaS marketplace prêt à déployer.",
        timeline: [
          ["Trend 1", "Explosion du commerce mobile"],
          ["Trend 2", "Croissance des vendeurs indépendants"],
          ["Trend 3", "Besoin de marketplaces locales rapides"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement SaaS marketplace", "Revenus récurrents"],
          ["Commission sur ventes", "Monétisation transactionnelle"],
          ["Frais vendeurs premium", "Upsell fonctionnel"],
          ["Publicités produits sponsorisés", "Revenus média intégrés"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Multi-vendeur", "SaaS flexible", "Différenciation"],
        rows: [
          ["VENDIA", "Natif", "Oui", "Marketplace complète clé en main"],
          ["Shopify", "Non", "Oui", "Boutiques individuelles"],
          ["WooCommerce", "Plugin", "Partiel", "Complexe à déployer"],
          ["Grandes marketplaces", "Oui", "Non", "Contrôle centralisé"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie",
        desc: "Objectif : devenir le système d'exploitation des marketplaces locales.",
        phases: [
          ["Phase 1", "Marketplaces locales (petits vendeurs)"],
          ["Phase 2", "Niches (mode, électronique, produits locaux)"],
          ["Phase 3", "Réseau global de marketplaces régionales"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour l'expansion SaaS marketplace, l'acquisition de vendeurs, l'intégration paiements + logistique et le scaling multi-pays.",
        finalLine: "Le commerce mondial ne manque pas de produits. Il manque de plateformes ouvertes aux vendeurs.<br />VENDIA transforme chaque groupe de vendeurs en marketplace autonome.<br />Celui qui contrôle les marketplaces contrôle le commerce digital."
      }
    },
    NOVAQ: {
      deckTitle: "Investor Pitch Deck",
      displayName: "NOVAQ",
      pdf: "pitch_deck/novaq/novaq.png",
      demo: "https://novaq-app.com/",
      navTitles: [
        "Vision",
        "Le Problème",
        "La Solution",
        "Le Produit",
        "Le Marché",
        "Timing",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie",
        "Investissement"
      ],
      slide1: {
        title: "NOVAQ",
        subtitle: "The Modern Digital Brand Commerce Store",
        desc: "Le commerce évolue vers le direct-to-consumer. Les marques veulent vendre sans intermédiaires. Le digital devient le canal principal de vente. Nous construisons une marque e-commerce moderne, optimisée pour la croissance digitale.",
        image: "pitch_deck/novaq/novaq.png"
      },
      slide2: {
        title: "Le Problème",
        desc: "Le e-commerce traditionnel est inefficace : dépendance aux marketplaces, marges réduites, faible contrôle client.",
        problemItems: [
          ["Marketplaces", "Dépendance Amazon, Jumia, etc."],
          ["Marges", "Réduites par les intermédiaires"],
          ["Branding", "Faible contrôle de la marque"],
          ["Fidélisation", "Acquisition client coûteuse"]
        ],
        stats: ["Peu de fidélisation", "Faible branding", "Profits limités"]
      },
      slide3: {
        title: "NOVAQ = Direct-to-Consumer Digital Brand",
        desc: "Nous vendons directement aux clients via une boutique en ligne optimisée, une expérience utilisateur moderne et un marketing digital intégré.",
        flow: ["Marque", "Client Direct", "Profit"],
        assets: ["Boutique optimisée", "Branding fort", "Marketing intégré"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["E-COMMERCE STORE", "Boutique mono-vendeur + catalogue exclusif"],
          ["ORDER MANAGEMENT", "Gestion commandes + suivi client"],
          ["PAYMENT SYSTEM", "Paiements sécurisés + mobile money"],
          ["DELIVERY INTEGRATION", "Logistique locale + suivi livraison"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "E-commerce mondial en forte croissance, explosion du mobile commerce, montée du D2C direct-to-consumer.",
        metrics: ["E-commerce en hypercroissance", "Mobile commerce dominant", "D2C en explosion"]
      },
      slide6: {
        title: "Timing",
        desc: "Avant : vendre via plateformes. Maintenant : vendre via sa propre marque. Trois tendances convergent pour créer une fenêtre stratégique.",
        timeline: [
          ["Trend 1", "Achat mobile dominant"],
          ["Trend 2", "Baisse de confiance marketplaces"],
          ["Trend 3", "Explosion des marques indépendantes"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Vente directe produits", "Marge D2C maximisée"],
          ["Bundles & upsells", "Panier moyen augmenté"],
          ["Offres limitées", "Collections exclusives"],
          ["Marketing performance", "Acquisition scalable"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Modèle", "Contrôle marque", "Marge", "Différenciation"],
        rows: [
          ["NOVAQ", "Total", "Élevée", "Marque indépendante D2C"],
          ["Amazon / Jumia", "Aucun", "Faible", "Intermédiaire"],
          ["Boutique générique", "Partiel", "Moyenne", "Sans branding fort"],
          ["Réseaux sociaux", "Partiel", "Faible", "Canal isolé"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie",
        desc: "Objectif : devenir une marque digitale forte et scalable.",
        phases: [
          ["Phase 1", "Lancement boutique unique"],
          ["Phase 2", "Branding fort + acquisition digitale"],
          ["Phase 3", "Expansion produit + nouvelles lignes"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour la croissance e-commerce, l'acquisition clients, le branding & marketing digital et l'expansion produit.",
        finalLine: "Les marques qui gagnent aujourd'hui vendent directement à leurs clients.<br />NOVAQ transforme le commerce en relation directe entre marque et consommateur.<br />Celui qui contrôle la marque contrôle la valeur."
      }
    },
    NOKA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "NOKA",
      pdf: "pitch_deck/noka/NOKA.pdf",
      demo: "https://noka-app.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "NOKA",
        subtitle: "The On-Demand Services Operating System",
        desc: "Les services à domicile sont fragmentés. Clients peinent à trouver des prestataires fiables. Prestataires manquent de clients structurés. Nous construisons la plateforme qui connecte instantanément clients et prestataires de services.",
        image: "pitch_deck/noka/noka.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le marché des services est inefficace : prestataires non digitalisés, demandes mal structurées, coordination manuelle.",
        problemItems: [
          ["Prestataires", "Non digitalisés"],
          ["Demandes", "Mal structurées"],
          ["Transparence", "Absente"],
          ["Coordination", "Manuelle et lente"]
        ],
        stats: ["Perte de temps", "Perte de revenus", "Mauvaise expérience client"]
      },
      slide3: {
        title: "NOKA = On-Demand Services Marketplace",
        desc: "Une seule plateforme pour trouver des services, réserver instantanément, gérer les prestataires et automatiser les paiements.",
        flow: ["Clients", "Plateforme", "Prestataires"],
        assets: ["Réservation instantanée", "Gestion prestataires", "Paiements automatisés"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["MARKETPLACE MULTI-SERVICES", "Plomberie, nettoyage, beauté, réparation"],
          ["BOOKING SYSTEM", "Réservation + planification + suivi temps réel"],
          ["PROVIDER MANAGEMENT", "Profils + disponibilité + gestion services"],
          ["PAYMENT & WALLET ENGINE", "Paiements intégrés + commissions automatiques"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Marché mondial des services : énorme et fragmenté. Croissance du on-demand economy. Explosion du mobile services booking.",
        metrics: ["Marché services massif", "On-demand en hypercroissance", "Mobile booking dominant"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : annuaires et bouche-à-oreille. Maintenant : réservation instantanée. L'adoption massive du mobile crée une fenêtre stratégique.",
        timeline: [
          ["Trend 1", "Adoption massive du mobile"],
          ["Trend 2", "Besoin de services rapides"],
          ["Trend 3", "Explosion des plateformes on-demand"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commission par service", "Monétisation transactionnelle"],
          ["Abonnements prestataires", "Revenus récurrents"],
          ["Services premium", "Visibilité + boost"],
          ["Partenariats entreprises", "Modèle hybride scalable"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Tout-en-un", "Multi-services", "Différenciation"],
        rows: [
          ["NOKA", "Oui", "Oui", "Système complet des services"],
          ["Plateformes niches", "Non", "Non", "Catégorie unique"],
          ["Annuaires classiques", "Non", "Partiel", "Pas de booking"],
          ["Réseaux sociaux", "Non", "Partiel", "Sans structure"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir l'infrastructure des services locaux.",
        phases: [
          ["Phase 1", "Services locaux (ménage, réparation, beauté)"],
          ["Phase 2", "Villes entières digitalisées"],
          ["Phase 3", "Standard national de services à domicile"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour lancer la marketplace stable, recruter des prestataires actifs, acquérir des clients locaux et accélérer l'expansion régionale.",
        finalLine: "Les services existent partout, mais ils ne sont pas structurés.<br />NOKA transforme les services en économie digitale organisée.<br />Celui qui contrôle la demande de services contrôle l'économie locale."
      }
    },
    AURORA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "AURORA MARKETPLACE",
      pdf: "pitch_deck/AURORA/AURORA.pdf",
      demo: "https://marketplace-aurora.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "AURORA MARKETPLACE",
        subtitle: "The Multi-Vendor E-Commerce Operating System",
        desc: "Le commerce digital explose mondialement. Les vendeurs sont encore isolés et mal structurés. Nous construisons l'infrastructure centrale du commerce multi-vendeurs.",
        image: "pitch_deck/AURORA/AURORA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le e-commerce est puissant mais inefficace : gestion non centralisée, outils dispersés, faible visibilité des performances.",
        problemItems: [
          ["Vendeurs", "Gestion non centralisée"],
          ["Outils", "Stock, paiement, livraison dispersés"],
          ["Performance", "Faible visibilité analytics"],
          ["Expérience", "Client fragmentée"]
        ],
        stats: ["Pertes de ventes", "Mauvaise gestion produits", "Croissance lente"]
      },
      slide3: {
        title: "AURORA = All-in-One Marketplace OS",
        desc: "Une seule plateforme centralisant vendeurs multiples, produits, commandes, paiements, logistique et gestion admin complète.",
        flow: ["Vendeurs", "Marketplace", "Clients"],
        assets: ["Catalogues centralisés", "Paiements unifiés", "Admin complet"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["MULTI-VENDOR ENGINE", "Onboarding vendeurs + stores individuels + catalogue"],
          ["ORDER & PAYMENT SYSTEM", "Checkout centralisé + multi-paiement + commissions"],
          ["ADMIN CONTROL PANEL", "Validation produits + gestion vendeurs + analytics"],
          ["CUSTOMER EXPERIENCE", "Recherche intelligente + filtres + suivi commandes"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "E-commerce mondial en trillions $. Explosion des marketplaces locales. Forte demande en solutions simples multi-vendeurs.",
        metrics: ["Trillions $ e-commerce", "Marketplaces locales en explosion", "SaaS marketplace en forte demande"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : développement complexe. Maintenant : SaaS marketplace indispensable. Trois tendances convergent pour créer une fenêtre stratégique.",
        timeline: [
          ["Trend 1", "Explosion du commerce digital mobile"],
          ["Trend 2", "Croissance des vendeurs indépendants"],
          ["Trend 3", "Besoin de marketplaces rapides à lancer"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement SaaS", "Revenus récurrents marketplace"],
          ["Commissions transactions", "Monétisation par vente"],
          ["Modules premium", "Analytics, SEO, ads"],
          ["Solutions enterprise", "Multi-boutiques + API"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Clé en main", "Multi-vendor", "Différenciation"],
        rows: [
          ["AURORA", "Oui", "Natif", "Marketplace OS complet"],
          ["Shopify", "Oui", "Non", "Boutiques individuelles"],
          ["WooCommerce", "Partiel", "Plugin", "Complexe à déployer"],
          ["Grandes marketplaces", "Non", "Oui", "Contrôle centralisé"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir le « Shopify des marketplaces multi-vendeurs ».",
        phases: [
          ["Phase 1", "Petites marketplaces locales + niches e-commerce"],
          ["Phase 2", "Marketplaces nationales + paiements + logistique"],
          ["Phase 3", "Infrastructure globale de marketplaces SaaS"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour améliorer la plateforme SaaS, acquérir les premiers marchands, accélérer l'expansion régionale et optimiser la scalabilité cloud.",
        finalLine: "Le futur du e-commerce n'est pas un magasin. C'est une plateforme de vendeurs.<br />AURORA transforme chaque utilisateur en marketplace complète.<br />Celui qui contrôle les marketplaces contrôle le commerce digital."
      }
    },
    DOKTA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "DOKTA HEALTHCARE",
      pdf: "pitch_deck/DOKTA/DOKTA.pdf",
      demo: "https://dokta-healthcare.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "DOKTA HEALTHCARE",
        subtitle: "The Digital Healthcare Operating System",
        desc: "Pitch deck provisoire: nous remplacerons ce contenu par les textes finaux du projet.",
        image: "pitch_deck/DOKTA/DOKTA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Les parcours de soin restent fragmentés: rendez-vous, dossiers, suivi patient et communication médicale ne sont pas assez centralisés.",
        problemItems: [
          ["Patients", "Accès aux soins complexe"],
          ["Médecins", "Suivi dispersé"],
          ["Dossiers", "Informations fragmentées"],
          ["Opérations", "Processus encore manuels"]
        ],
        stats: ["Temps perdu", "Faible continuité", "Expérience patient difficile"]
      },
      slide3: {
        title: "DOKTA = Healthcare Care OS",
        desc: "Une plateforme pour connecter patients, médecins, rendez-vous, dossiers et suivi médical.",
        flow: ["Patient", "Médecin", "Suivi"],
        assets: ["Rendez-vous", "Dossier patient", "Care dashboard"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["PATIENT APP", "Accès mobile aux soins, rendez-vous et informations utiles."],
          ["DOCTOR PORTAL", "Gestion consultations, patients et disponibilité."],
          ["CARE RECORDS", "Centralisation des données et historique médical."],
          ["OPERATIONS DASHBOARD", "Pilotage activité, demandes et performance."]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "La santé digitale accélère avec le mobile, la télémédecine et le besoin de systèmes accessibles dans les marchés émergents.",
        metrics: ["Santé digitale", "Mobile-first", "Accès aux soins"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Les patients attendent des services rapides et les professionnels ont besoin d'outils simples pour mieux suivre les soins.",
        timeline: [
          ["Trend 1", "Adoption mobile santé"],
          ["Trend 2", "Besoin de suivi patient"],
          ["Trend 3", "Digitalisation des cliniques"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnements cliniques", "Revenus B2B récurrents"],
          ["Plans médecins", "Accès professionnel premium"],
          ["Services patients", "Prise de rendez-vous et suivi"],
          ["Modules avancés", "Analytics, dossier, intégrations"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Patient", "Médecin", "Différenciation"],
        rows: [
          ["DOKTA", "Oui", "Oui", "Care OS centralisé"],
          ["Agenda simple", "Partiel", "Partiel", "Rendez-vous seulement"],
          ["Dossier papier", "Non", "Partiel", "Non digital"],
          ["Apps isolées", "Partiel", "Non", "Fragmentées"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Déployer progressivement auprès des professionnels, cliniques et réseaux de soins.",
        phases: [
          ["Phase 1", "Médecins et cliniques pilotes"],
          ["Phase 2", "Réseaux santé urbains"],
          ["Phase 3", "Plateforme santé régionale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour finaliser le produit, onboarder les premiers professionnels, renforcer la sécurité des données et accélérer l'adoption.",
        finalLine: "La santé a besoin de continuité digitale.<br />DOKTA connecte les soins, les patients et les professionnels.<br />Contenu provisoire à remplacer par la version finale."
      }
    },
    ELIMUU: {
      deckTitle: "Investor Pitch Deck",
      displayName: "ELIMUU",
      pdf: "pitch_deck/ELIMUU/ELIMUU.pdf",
      demo: "https://elimuu.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "ELIMUU",
        subtitle: "The Digital Learning Operating System",
        desc: "Pitch deck provisoire: nous remplacerons ce contenu par les textes finaux du projet.",
        image: "pitch_deck/ELIMUU/ELIMUU.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "L'éducation reste inégale, peu personnalisée et difficile à suivre quand les cours, les contenus et les performances sont dispersés.",
        problemItems: [
          ["Apprenants", "Accès variable"],
          ["Contenus", "Peu structurés"],
          ["Suivi", "Progression difficile"],
          ["Écoles", "Outils fragmentés"]
        ],
        stats: ["Décrochage", "Suivi faible", "Apprentissage lent"]
      },
      slide3: {
        title: "ELIMUU = Learning OS",
        desc: "Une plateforme pour organiser cours, contenus, progression, évaluations et accompagnement.",
        flow: ["Cours", "Progression", "Résultats"],
        assets: ["Learning paths", "Quiz & tests", "Student dashboard"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["COURSE PLATFORM", "Cours structurés et contenus accessibles."],
          ["STUDENT DASHBOARD", "Suivi progression, scores et objectifs."],
          ["TEACHER TOOLS", "Création cours, évaluations et feedback."],
          ["LEARNING ANALYTICS", "Données pour améliorer les résultats."]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "L'EdTech accélère avec le mobile learning, la formation continue et le besoin d'accès éducatif flexible.",
        metrics: ["EdTech en croissance", "Mobile learning", "Formation continue"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Les écoles, parents et apprenants cherchent des outils plus accessibles, mesurables et personnalisés.",
        timeline: [
          ["Trend 1", "Apprentissage mobile"],
          ["Trend 2", "Besoin de compétences"],
          ["Trend 3", "Suivi data-driven"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnements écoles", "Licences institutionnelles"],
          ["Plans étudiants", "Accès premium individuel"],
          ["Cours premium", "Contenus et certifications"],
          ["Services B2B", "Formation entreprises et analytics"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Cours", "Suivi", "Différenciation"],
        rows: [
          ["ELIMUU", "Oui", "Oui", "Learning OS complet"],
          ["Vidéos seules", "Partiel", "Non", "Pas de progression"],
          ["LMS legacy", "Oui", "Partiel", "Complexe"],
          ["Cours papier", "Partiel", "Non", "Non digital"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Commencer par des communautés d'apprenants, puis déployer écoles, centres et entreprises.",
        phases: [
          ["Phase 1", "Apprenants et enseignants pilotes"],
          ["Phase 2", "Écoles et centres de formation"],
          ["Phase 3", "Plateforme EdTech régionale"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour produire les contenus, améliorer l'expérience mobile, signer les premiers partenaires et accélérer la distribution.",
        finalLine: "L'éducation doit devenir accessible, suivie et mesurable.<br />ELIMUU transforme l'apprentissage en système digital.<br />Contenu provisoire à remplacer par la version finale."
      }
    },
    KORIZA: {
      deckTitle: "Investor Pitch Deck",
      displayName: "KORIZA APP",
      pdf: "pitch_deck/KORIZA/KORIZA.pdf",
      demo: "https://koriza-app.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "KORIZA APP",
        subtitle: "The Mobile-First Business Operating App",
        desc: "Pitch deck provisoire: nous remplacerons ce contenu par les textes finaux du projet.",
        image: "pitch_deck/KORIZA/KORIZA.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Les petites organisations utilisent trop d'outils séparés pour gérer clients, opérations, communication et croissance.",
        problemItems: [
          ["Clients", "Données dispersées"],
          ["Opérations", "Suivi manuel"],
          ["Équipe", "Communication morcelée"],
          ["Croissance", "Peu de visibilité"]
        ],
        stats: ["Temps perdu", "Faible contrôle", "Décisions lentes"]
      },
      slide3: {
        title: "KORIZA = Business App OS",
        desc: "Une application mobile-first pour centraliser activité, clients, actions et performance.",
        flow: ["Clients", "Actions", "Croissance"],
        assets: ["CRM léger", "Task flow", "Business dashboard"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["CLIENT HUB", "Centralisation contacts, interactions et historique."],
          ["OPERATIONS FLOW", "Tâches, demandes et activités quotidiennes."],
          ["COMMUNICATION LAYER", "Notifications, messages et suivi équipe."],
          ["GROWTH DASHBOARD", "Indicateurs, objectifs et performance."]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "Les PME, indépendants et équipes locales ont besoin d'outils simples, mobiles et adaptés à leur réalité.",
        metrics: ["PME locales", "Mobile-first", "Digitalisation business"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Les opérations passent sur mobile et les entreprises veulent des solutions plus simples que les suites lourdes.",
        timeline: [
          ["Trend 1", "Travail mobile"],
          ["Trend 2", "PME digitalisées"],
          ["Trend 3", "Besoin tout-en-un"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Abonnement mensuel", "Plans business récurrents"],
          ["Modules premium", "CRM, analytics, automation"],
          ["Services d'installation", "Onboarding et personnalisation"],
          ["Marketplace d'extensions", "Add-ons et intégrations"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Mobile", "Tout-en-un", "Différenciation"],
        rows: [
          ["KORIZA", "Oui", "Oui", "Business app simple"],
          ["Suites lourdes", "Partiel", "Oui", "Complexes"],
          ["Tableurs", "Partiel", "Non", "Manuels"],
          ["Apps isolées", "Oui", "Non", "Fragmentées"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Lancer avec les petites équipes, puis étendre vers PME, franchises et réseaux locaux.",
        phases: [
          ["Phase 1", "Indépendants et petites équipes"],
          ["Phase 2", "PME et commerces organisés"],
          ["Phase 3", "Réseaux multi-sites"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour finaliser l'app, intégrer les premiers clients, développer les modules premium et accélérer l'expansion commerciale.",
        finalLine: "Les petites équipes ont besoin d'un système simple.<br />KORIZA transforme les opérations en application mobile-first.<br />Contenu provisoire à remplacer par la version finale."
      }
    },
    MARIANO: {
      deckTitle: "Investor Pitch Deck",
      displayName: "MARIANO",
      pdf: "pitch_deck/MARIANO/MARIANO.pdf",
      demo: "https://mariano-app.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "MARIANO",
        subtitle: "The Front-End Commerce Experience Layer for Multi-Vendor Marketplaces",
        desc: "Le e-commerce moderne repose sur des marketplaces complexes. L'expérience utilisateur reste souvent lente et fragmentée. Nous construisons la couche d'expérience rapide, fluide et scalable du commerce multi-vendeurs.",
        image: "pitch_deck/MARIANO/MARIANO.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Les marketplaces souffrent de limites UX : navigation complexe, recherche peu optimisée, parcours d'achat long, performance mobile faible.",
        problemItems: [
          ["Navigation", "Complexe entre vendeurs"],
          ["Recherche", "Produit peu optimisée"],
          ["Performance", "Web faible sur mobile"],
          ["Expérience", "Utilisateur non unifiée"]
        ],
        stats: ["Baisse de conversion", "Abandon de panier élevé", "Faible rétention client"]
      },
      slide3: {
        title: "MARIANO = Ultra-Fast Marketplace UX Layer",
        desc: "Interface rapide React + Next.js, navigation optimisée multi-vendeurs, expérience mobile-first, recherche avancée et checkout simplifié.",
        flow: ["Interface", "Expérience", "Conversion"],
        assets: ["React / Next.js", "Mobile-first", "Checkout optimisé"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["LIGHTNING FAST FRONT-END", "React / Next.js + SEO optimisé + UI responsive"],
          ["MULTI-VENDOR UX ENGINE", "Navigation vendeurs + affichage produits intelligent"],
          ["SMART SEARCH SYSTEM", "Recherche rapide + suggestions + historique"],
          ["CHECKOUT & ORDER FLOW", "Parcours simplifié + paiements + suivi temps réel"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "E-commerce mondial en trillions $. Explosion des marketplaces SaaS. Besoin critique d'UX performante.",
        metrics: ["Trillions $ e-commerce", "Marketplaces SaaS en explosion", "UX performante = avantage clé"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : interfaces lentes et rigides. Maintenant : UX rapide = avantage compétitif décisif.",
        timeline: [
          ["Trend 1", "Explosion du multi-vendor SaaS"],
          ["Trend 2", "Migration vers React / Next.js"],
          ["Trend 3", "Mobile commerce dominant"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Licence SaaS front-end", "Revenus récurrents marketplace"],
          ["Templates premium", "Marketplace UI/UX"],
          ["Intégration enterprise", "E-commerce platforms"],
          ["Support & customization", "Extensions UI/UX premium"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Performance", "Multi-vendor", "Différenciation"],
        rows: [
          ["MARIANO", "Ultra-rapide", "Natif", "Conversion-first UX"],
          ["Shopify Storefront", "Rapide", "Partiel", "Mono-vendor focus"],
          ["Templates génériques", "Moyenne", "Non", "Pas de marketplace"],
          ["Dev custom", "Variable", "Partiel", "Coûteux et lent"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir le « Shopify Storefront Layer » des marketplaces multi-vendeurs.",
        phases: [
          ["Phase 1", "Intégration marketplaces existantes + petits e-commerce SaaS"],
          ["Phase 2", "Plateformes multi-vendeurs régionales + systèmes complets"],
          ["Phase 3", "Standard global front-end des marketplaces"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour améliorer l'UX/UI avancée, optimiser la performance globale, intégrer multi-plateformes et accélérer l'expansion internationale SaaS.",
        finalLine: "Une marketplace n'est pas définie par ses vendeurs… mais par son expérience.<br />MARIANO transforme la complexité en fluidité commerciale.<br />Celui qui contrôle l'expérience contrôle les conversions."
      }
    },
    KINSHOP: {
      deckTitle: "Investor Pitch Deck",
      displayName: "KINSHOP",
      pdf: "pitch_deck/KINSHOP/KINSHOP.pdf",
      demo: "https://kinshop-online.com/",
      navTitles: [
        "Vision",
        "Le Problème Global",
        "Notre Solution",
        "Le Produit",
        "Le Marché",
        "Pourquoi Maintenant",
        "Business Model",
        "Avantage Compétitif",
        "Stratégie d'Expansion",
        "Investissement"
      ],
      slide1: {
        title: "KINSHOP",
        subtitle: "The Hyperlocal Commerce Operating System for Cities",
        desc: "Le commerce local est massif mais fragmenté. Les utilisateurs veulent acheter près de chez eux, rapidement. Nous construisons l'infrastructure complète du commerce hyperlocal digital.",
        image: "pitch_deck/KINSHOP/KINSHOP.png"
      },
      slide2: {
        title: "Le Problème Global",
        desc: "Le commerce urbain est inefficace : produits dispersés, livraison non optimisée, absence de visibilité locale en temps réel.",
        problemItems: [
          ["Produits", "Dispersés dans plusieurs boutiques"],
          ["Livraison", "Non optimisée"],
          ["Visibilité", "Absence locale temps réel"],
          ["Systèmes", "Non connectés (vendeurs/clients/livreurs)"]
        ],
        stats: ["Pertes de ventes locales", "Délais livraison élevés", "Expérience client incohérente"]
      },
      slide3: {
        title: "KINSHOP = Hyperlocal Commerce OS",
        desc: "Nous connectons en temps réel clients, vendeurs multi-boutiques, livreurs et zones géographiques.",
        flow: ["Clients", "Vendeurs", "Livreurs"],
        assets: ["Localisation temps réel", "Multi-vendor", "Tracking livraison"]
      },
      slide4: {
        title: "Le Produit",
        pillars: [
          ["HYPERLOCAL MARKET ENGINE", "Commerce basé localisation + boutiques proches dynamiques"],
          ["MULTI-VENDOR SYSTEM", "Plusieurs vendeurs + gestion produits indépendante"],
          ["SMART DELIVERY SYSTEM", "Assignation auto livreurs + tracking temps réel"],
          ["NEXT-GEN E-COMMERCE UX", "Flutter apps + Next.js web + mobile-first ultra fluide"]
        ]
      },
      slide5: {
        title: "Le Marché",
        desc: "E-commerce global en trillions $. Explosion du quick commerce (livraison rapide). Croissance massive des marketplaces locales.",
        metrics: ["Trillions $ e-commerce", "Quick commerce en explosion", "Marketplaces locales en croissance"]
      },
      slide6: {
        title: "Pourquoi Maintenant",
        desc: "Avant : commerce physique isolé. Maintenant : commerce connecté en temps réel.",
        timeline: [
          ["Trend 1", "Explosion du mobile commerce"],
          ["Trend 2", "Demande de livraison instantanée"],
          ["Trend 3", "Croissance marketplaces hyperlocales"]
        ]
      },
      slide7: {
        title: "Business Model",
        revenues: [
          ["Commission transactions", "Monétisation par vente"],
          ["Abonnement vendeurs", "Revenus récurrents"],
          ["Frais de livraison", "Logistique monétisée"],
          ["Publicité locale + analytics", "Shops boostés + services premium"]
        ]
      },
      slide8: {
        title: "Avantage Compétitif",
        headers: ["Solution", "Hyperlocal", "Système complet", "Différenciation"],
        rows: [
          ["KINSHOP", "Natif", "Client+Vendeur+Livreur", "Commerce de proximité optimisé"],
          ["E-commerce global", "Non", "Partiel", "Pas de focus local"],
          ["Delivery apps", "Partiel", "Livraison seule", "Pas de marketplace"],
          ["Marketplaces classiques", "Non", "Partiel", "Pas d'optimisation locale"]
        ],
        winCell: [0, 3]
      },
      slide9: {
        title: "Stratégie d'Expansion",
        desc: "Objectif : devenir l'infrastructure du commerce urbain.",
        phases: [
          ["Phase 1", "Une ville pilote (densité forte) + onboarding vendeurs"],
          ["Phase 2", "Extension multi-villes + optimisation logistique"],
          ["Phase 3", "Standard du commerce hyperlocal national"]
        ]
      },
      slide10: {
        title: "Investissement",
        desc: "Nous levons pour stabiliser la plateforme multi-vendor, acquérir vendeurs + livreurs, accélérer l'expansion géographique et optimiser l'IA logistique.",
        finalLine: "Le commerce local est massif mais fragmenté.<br />KINSHOP transforme chaque ville en marketplace vivant.<br />Celui qui contrôle le commerce hyperlocal contrôle l'économie urbaine."
      }
    }
  };

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function setRepeatedContent(selector, values, updateFn) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach((node, index) => {
      const value = values[index];
      if (!value) return;
      updateFn(node, value);
    });
  }

  function renderComparisonTable(slide8) {
    const table = document.getElementById("comparisonTable");
    if (!table || !slide8) return;
    table.innerHTML = "";

    slide8.headers.forEach((header) => {
      const cell = document.createElement("div");
      cell.textContent = header;
      table.appendChild(cell);
    });

    slide8.rows.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const cell = document.createElement("div");
        cell.textContent = cellValue;
        if (slide8.winCell && slide8.winCell[0] === rowIndex && slide8.winCell[1] === colIndex) {
          cell.classList.add("win");
        }
        table.appendChild(cell);
      });
    });
  }

  function applyProjectDeck(projectKey) {
    const project = projectDecks[projectKey];
    const safeProject = project || projectDecks.EMICARD;
    const isSoon = !project;

    if (projectName) projectName.textContent = (safeProject.displayName || projectKey || "Projet");

    // Cas "bientôt disponible" / deck inconnu
    if (isSoon) {
      if (deckTitle) deckTitle.textContent = "Bientôt disponible";

      // Désactiver proprement les liens téléchargement (sans casser l'HTML)
      if (downloadTop) {
        downloadTop.setAttribute("href", "#");
        downloadTop.setAttribute("aria-disabled", "true");
        downloadTop.addEventListener("click", (e) => e.preventDefault(), { once: true });
      }
      if (downloadBottom) {
        downloadBottom.setAttribute("href", "#");
        downloadBottom.setAttribute("aria-disabled", "true");
        downloadBottom.addEventListener("click", (e) => e.preventDefault(), { once: true });
      }

      if (slide1DemoBtn) {
        slide1DemoBtn.setAttribute("href", contactUrl);
        slide1DemoBtn.textContent = "Contacter";
      }

      setText("slide1Title", projectKey || "Projet");
      setText("slide1Subtitle", "Bientôt disponible");
      setText("slide1Desc", "Le pitch deck de ce projet sera disponible prochainement.");

      // Image: on ne supprime jamais src (évite erreurs). On garde le layout.
      // Si l'image du slide1 existe déjà dans le HTML, on la laisse.
      if (slide1Image) {
        slide1Image.setAttribute("alt", projectKey || "Projet");
      }

      // Nettoyage contenu slides restantes pour éviter des valeurs undefined
      setText("slide2Title", "");
      setText("slide2Desc", "");
      setText("slide3Title", "");
      setText("slide3Desc", "");
      setText("slide4Title", "");
      setText("slide5Title", "");
      setText("slide5Desc", "");
      setText("slide6Title", "");
      setText("slide6Desc", "");
      setText("slide7Title", "");
      setText("slide8Title", "");
      setText("slide9Title", "");
      setText("slide9Desc", "");
      setText("slide10Title", "");

      const finalLine = document.getElementById("finalLine");
      if (finalLine) finalLine.innerHTML = "Bientôt disponible.";

      // Ne pas appeler renderComparisonTable/ setRepeatedContent sur un objet absent
      // juste pour ne jamais provoquer d'erreur JS.
      slides.forEach((slide) => {
        slide.dataset.title = "Bientôt";
      });

      return;
    }


    if (deckTitle) deckTitle.textContent = safeProject.deckTitle;
    if (downloadTop) downloadTop.setAttribute("href", staticAsset(safeProject.pdf));
    if (downloadBottom) downloadBottom.setAttribute("href", staticAsset(safeProject.pdf));
    if (slide1DemoBtn) {
      slide1DemoBtn.setAttribute("href", safeProject.demo || contactUrl);
    }

    setText("slide1Title", safeProject.slide1.title);
    setText("slide1Subtitle", safeProject.slide1.subtitle);
    setText("slide1Desc", safeProject.slide1.desc);
    if (slide1Image && safeProject.slide1.image) {
      slide1Image.setAttribute("src", staticAsset(safeProject.slide1.image));
      slide1Image.setAttribute("alt", safeProject.slide1.title);
    }


    setText("slide2Title", project.slide2.title);
    setText("slide2Desc", project.slide2.desc);
    setRepeatedContent(".js-problem-item", project.slide2.problemItems, (node, value) => {
      const titleNode = node.querySelector("strong");
      const labelNode = node.querySelector("span");
      if (titleNode) titleNode.textContent = value[0];
      if (labelNode) labelNode.textContent = value[1];
    });
    setRepeatedContent(".js-s2-stat", project.slide2.stats, (node, value) => {
      node.textContent = value;
    });

    setText("slide3Title", project.slide3.title);
    setText("slide3Desc", project.slide3.desc);
    setRepeatedContent(".js-flow-step", project.slide3.flow, (node, value) => {
      node.textContent = value;
    });
    setRepeatedContent(".js-solution-asset", project.slide3.assets, (node, value) => {
      node.textContent = value;
    });

    setText("slide4Title", project.slide4.title);
    setRepeatedContent(".js-pillar", project.slide4.pillars, (node, value) => {
      const titleNode = node.querySelector("h4");
      const descNode = node.querySelector("p");
      if (titleNode) titleNode.textContent = value[0];
      if (descNode) descNode.textContent = value[1];
    });

    setText("slide5Title", project.slide5.title);
    setText("slide5Desc", project.slide5.desc);
    setRepeatedContent(".js-market-metric", project.slide5.metrics, (node, value) => {
      node.textContent = value;
    });

    setText("slide6Title", project.slide6.title);
    setText("slide6Desc", project.slide6.desc);
    setRepeatedContent(".js-timeline-item", project.slide6.timeline, (node, value) => {
      const titleNode = node.querySelector("strong");
      const descNode = node.querySelector("span");
      if (titleNode) titleNode.textContent = value[0];
      if (descNode) descNode.textContent = value[1];
    });

    setText("slide7Title", project.slide7.title);
    setRepeatedContent(".js-revenue-item", project.slide7.revenues, (node, value) => {
      const titleNode = node.querySelector("h4");
      const descNode = node.querySelector("p");
      if (titleNode) titleNode.textContent = value[0];
      if (descNode) descNode.textContent = value[1];
    });

    setText("slide8Title", project.slide8.title);
    renderComparisonTable(project.slide8);

    setText("slide9Title", project.slide9.title);
    setText("slide9Desc", project.slide9.desc);
    setRepeatedContent(".js-growth-item", project.slide9.phases, (node, value) => {
      const titleNode = node.querySelector("strong");
      const descNode = node.querySelector("span");
      if (titleNode) titleNode.textContent = value[0];
      if (descNode) descNode.textContent = value[1];
    });

    setText("slide10Title", project.slide10.title);
    setText("slide10Desc", project.slide10.desc);
    const finalLine = document.getElementById("finalLine");
    if (finalLine) finalLine.innerHTML = project.slide10.finalLine;

    slides.forEach((slide, index) => {
      slide.dataset.title = project.navTitles[index] || "DONE";
    });
  }

  function buildSideNav() {
    if (!nav || !slides.length) return;
    nav.innerHTML = "";
    slides.forEach((slide, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pitch-nav-btn" + (idx === 0 ? " is-active" : "");
      btn.dataset.index = String(idx);
      btn.textContent = "DONE " + String(idx + 1).padStart(2, "0") + " - " + (slide.dataset.title || "DONE");
      btn.addEventListener("click", () => {
        slide.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      nav.appendChild(btn);
    });
  }

  function setActiveSlide(index) {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    const navButtons = nav ? nav.querySelectorAll(".pitch-nav-btn") : [];
    navButtons.forEach((btn, idx) => btn.classList.toggle("is-active", idx === activeIndex));
    if (progressFill) {
      const progress = ((activeIndex + 1) / slides.length) * 100;
      progressFill.style.width = progress + "%";
    }
  }

  function syncActiveByScroll() {
    if (!slides.length || !deck) return;
    const pivot = deck.scrollTop + (deck.clientHeight * 0.45);
    const newIndex = slides.findIndex((slide, idx) => {
      const top = slide.offsetTop;
      const bottom = top + slide.offsetHeight;
      if (idx === slides.length - 1) return pivot >= top;
      return pivot >= top && pivot < bottom;
    });
    const resolvedIndex = newIndex === -1 ? slides.length - 1 : newIndex;
    if (resolvedIndex !== activeIndex) {
      setActiveSlide(resolvedIndex);
      animateCurrentSlide();
    }
  }

  function openDeck(projectKey) {
    if (!modal) return;
    applyProjectDeck(projectKey);
    buildSideNav();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (deck) deck.scrollTop = 0;
    animatedIndex = -1;
    setActiveSlide(0);
    animateCurrentSlide();
  }

  function closeDeck() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function animateCurrentSlide() {
    if (!window.gsap || !slides.length) return;
    if (animatedIndex === activeIndex) return;
    animatedIndex = activeIndex;
    const currentSlide = slides[activeIndex];
    if (!currentSlide) return;
    const targets = currentSlide.querySelectorAll("h3, h4, p, article, .comparison-table > div, .investor-form, .final-line");
    window.gsap.fromTo(
      targets,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.03,
        clearProps: "all"
      }
    );
  }

  function initCardParallax() {
    cardNodes.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "translateY(-8px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function preventButtonPropagation() {
    // Ne pas bloquer les boutons js-open-deck (gérés par délégation)
    const allButtons = document.querySelectorAll(".project-deck-card__actions .btn:not(.js-open-deck), .pitch-slide__actions .btn, .investor-form__actions .btn, .pitch-modal__side-actions .btn");
    allButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
      }, { passive: false });
      
      btn.addEventListener("touchstart", (event) => {
        event.stopPropagation();
      }, { passive: true });
    });
  }

  function initProjectsPagination() {
    const pagination = document.getElementById("projectsPagination");
    const prevBtn = document.getElementById("projectsPrevBtn");
    const nextBtn = document.getElementById("projectsNextBtn");
    const status = document.getElementById("projectsPageStatus");
    const cards = Array.from(cardNodes);
    const cardsPerPage = 12;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const pageNumbers = document.createElement("div");
    let currentPage = 0;

    if (!pagination || !prevBtn || !nextBtn || !status || totalPages <= 1) {
      return;
    }

    pageNumbers.className = "pitch-projects__page-numbers";
    pageNumbers.setAttribute("aria-label", "Pagination des projets");
    pagination.insertBefore(pageNumbers, status);

    function scrollToProjects() {
      const projectsSection = document.querySelector(".pitch-projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    function renderPageNumbers() {
      pageNumbers.innerHTML = "";

      for (let index = 0; index < totalPages; index += 1) {
        const pageButton = document.createElement("button");
        pageButton.type = "button";
        pageButton.className = "pitch-projects__page-btn";
        pageButton.textContent = String(index + 1);
        pageButton.setAttribute("aria-label", "Afficher la page " + (index + 1) + " des projets");
        pageButton.setAttribute("aria-current", index === currentPage ? "page" : "false");
        pageButton.classList.toggle("is-active", index === currentPage);
        pageButton.addEventListener("click", () => {
          if (currentPage === index) {
            scrollToProjects();
            return;
          }
          currentPage = index;
          renderPage(true);
        });
        pageNumbers.appendChild(pageButton);
      }
    }

    function renderPage(shouldScroll) {
      const start = currentPage * cardsPerPage;
      const end = start + cardsPerPage;

      cards.forEach((card, index) => {
        card.classList.toggle("is-hidden-by-pagination", index < start || index >= end);
      });

      prevBtn.disabled = currentPage === 0;
      nextBtn.disabled = currentPage === totalPages - 1;
      status.textContent = "Page " + (currentPage + 1) + " / " + totalPages;
      renderPageNumbers();

      if (shouldScroll) {
        scrollToProjects();
      }
    }

    prevBtn.addEventListener("click", () => {
      if (currentPage === 0) return;
      currentPage -= 1;
      renderPage(true);
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage >= totalPages - 1) return;
      currentPage += 1;
      renderPage(true);
    });

    pagination.hidden = false;
    renderPage(false);
  }

  initCardParallax();
  preventButtonPropagation();
  initProjectsPagination();

  // Délégation d'événements sur le conteneur parent pour couvrir toutes les cartes
  // (y compris celles cachées par la pagination ou ajoutées dynamiquement)
  const projectsGrid = document.querySelector(".pitch-projects__grid");
  if (projectsGrid) {
    projectsGrid.addEventListener("click", (event) => {
      const btn = event.target.closest(".js-open-deck");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      const project = btn.dataset.project || "EMICARD";
      openDeck(project);
    });
    projectsGrid.addEventListener("touchend", (event) => {
      const btn = event.target.closest(".js-open-deck");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();
      const project = btn.dataset.project || "EMICARD";
      openDeck(project);
    }, { passive: false });
  }

  // Fallback sur les boutons individuels (compatibilité)
  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const project = button.dataset.project || "EMICARD";
      openDeck(project);
    });
  });

  if (modalClose) {
    const handleClose = (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeDeck();
    };
    
    modalClose.addEventListener("click", handleClose);
    modalClose.addEventListener("touchend", (event) => {
      event.preventDefault();
      handleClose(event);
    }, { passive: false });
  }
  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeDeck();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeDeck();
    }
  });

  if (deck) {
    deck.addEventListener("scroll", syncActiveByScroll, { passive: true });
  }
});
