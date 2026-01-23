// Content data for Groupe Scolaire Vision Future
// This simulates Markdown content that would be editable via CMS

export const siteConfig = {
  name: "Groupe Scolaire Vision Future",
  shortName: "GSVF",
  location: "Grand-Bassam, Côte d'Ivoire",
  phone: "+225 27 21 30 45 67",
  email: "contact@visionfuture.ci",
  address: "Boulevard de la République, Grand-Bassam, Côte d'Ivoire",
  socialLinks: {
    facebook: "https://facebook.com/gsvf",
    instagram: "https://instagram.com/gsvf",
    linkedin: "https://linkedin.com/company/gsvf",
    youtube: "https://youtube.com/@gsvf"
  }
};

export const homeContent = {
  hero: {
    title: "Groupe Scolaire Vision Future",
    subtitle: "Former les leaders de demain dans un environnement d'excellence",
    description: "Depuis 1998, nous accompagnons chaque élève vers la réussite académique et l'épanouissement personnel à Grand-Bassam.",
    ctaPrimary: "Découvrir nos programmes",
    ctaSecondary: "Visite virtuelle"
  },
  sections: {
    features: {
      subtitle: "Pourquoi nous choisir",
      title: "Une éducation d'excellence",
      description: "Découvrez ce qui fait de Vision Future un établissement de référence en Côte d'Ivoire."
    },
    aboutPreview: {
      badge: "Notre histoire",
      title: "25 ans d'engagement pour l'éducation",
      paragraphs: [
        "Fondé en 1998 à Grand-Bassam, le Groupe Scolaire Vision Future est né de la vision d'éducateurs passionnés qui croyaient en une éducation de qualité accessible à tous.",
        "Aujourd'hui, nous sommes fiers d'avoir formé des milliers d'élèves qui excellent dans tous les domaines, de la médecine à l'ingénierie, du droit à l'entrepreneuriat."
      ],
      ctaPrimary: "Notre histoire",
      ctaSecondary: "Notre vision",
      imageCaption: "Campus Vision Future",
      highlight: {
        value: "98%",
        label: "Réussite au BAC"
      }
    },
    programmesPreview: {
      subtitle: "Nos programmes",
      title: "Un parcours complet",
      description: "De la maternelle au baccalauréat, nous accompagnons chaque élève vers la réussite.",
      learnMore: "En savoir plus",
      cards: [
        { title: "Maternelle", ages: "3-5 ans", icon: "heart", color: "from-pink-500 to-rose-500" },
        { title: "Primaire", ages: "6-11 ans", icon: "book", color: "from-blue-500 to-cyan-500" },
        { title: "Collège", ages: "12-15 ans", icon: "graduation", color: "from-purple-500 to-violet-500" },
        { title: "Lycée", ages: "16-18 ans", icon: "star", color: "from-amber-500 to-orange-500" }
      ],
      cta: "Découvrir tous nos programmes"
    },
    testimonials: {
      subtitle: "Témoignages",
      title: "Ils nous font confiance",
      description: "Découvrez ce que nos élèves et parents disent de leur expérience."
    },
    news: {
      subtitle: "Actualités",
      title: "Les dernières nouvelles",
      description: "Restez informé des événements et actualités de notre établissement.",
      readMore: "Lire la suite"
    },
    cta: {
      title: "Prêt à rejoindre Vision Future ?",
      description: "Inscrivez votre enfant dès maintenant et offrez-lui les meilleures chances de réussite.",
      primary: "Demander une inscription",
      secondary: "Nous contacter"
    }
  },
  stats: [
    { value: "25+", label: "Années d'excellence" },
    { value: "98%", label: "Taux de réussite au BAC" },
    { value: "1500+", label: "Élèves formés" },
    { value: "120+", label: "Enseignants qualifiés" }
  ],
  features: [
    {
      title: "Excellence Académique",
      description: "Un programme rigoureux aligné sur les standards internationaux avec un suivi personnalisé.",
      icon: "academic"
    },
    {
      title: "Infrastructures Modernes",
      description: "Campus de 5 hectares avec laboratoires, bibliothèque et installations sportives.",
      icon: "building"
    },
    {
      title: "Encadrement Bienveillant",
      description: "Un ratio élève-enseignant optimal pour un accompagnement individualisé.",
      icon: "users"
    },
    {
      title: "Ouverture Internationale",
      description: "Partenariats avec des écoles françaises et programmes d'échanges culturels.",
      icon: "globe"
    }
  ],
  testimonials: [
    {
      quote: "Vision Future a transformé ma vie. Les enseignants m'ont donné confiance en mes capacités.",
      author: "Aminata Koné",
      role: "Ancienne élève, promotion 2022",
      achievement: "Admise à Sciences Po Paris"
    },
    {
      quote: "L'environnement d'apprentissage et les valeurs transmises ont façonné le caractère de mes enfants.",
      author: "Dr. Jean-Baptiste Aka",
      role: "Parent d'élèves",
      achievement: "3 enfants diplômés"
    },
    {
      quote: "Une école qui prépare vraiment les élèves aux défis du monde moderne.",
      author: "Marie-Claire Bamba",
      role: "Ancienne élève, promotion 2020",
      achievement: "Ingénieure chez Google"
    }
  ],
  news: [
    {
      title: "Résultats exceptionnels au BAC 2025",
      date: "15 Juillet 2025",
      excerpt: "98% de réussite avec 45% de mentions Très Bien.",
      image: "/images/home/news1.webp"
    },
    {
      title: "Inauguration du nouveau laboratoire de sciences",
      date: "10 Septembre 2025",
      excerpt: "Un investissement majeur pour l'enseignement scientifique.",
      image: "/images/home/news2.webp"
    },
    {
      title: "Partenariat avec l'Université de Bordeaux",
      date: "5 Novembre 2025",
      excerpt: "Nouvelles opportunités pour nos bacheliers.",
      image: "/images/home/news3.webp"
    }
  ]
};

export const visiteContent = {
  hero: {
    title: "Visite Virtuelle du Campus",
    subtitle: "Découvrez nos installations et notre environnement d'apprentissage",
    description: "Explorez notre campus de 5 hectares à travers cette visite guidée interactive."
  },
  ui: {
    zoneLabel: "Zone",
    galleryButton: "Voir la galerie",
    photosLabel: "photos",
    cta: {
      title: "Envie de visiter en personne ?",
      description: "Planifiez une visite guidée de notre campus avec notre équipe.",
      button: "Planifier une visite"
    },
    lightbox: {
      imageLabel: "Image",
      ofLabel: "sur"
    }
  },
  sections: [
    {
      id: "entree",
      title: "Entrée Principale & Accueil",
      description: "Un accueil chaleureux dans un cadre verdoyant. Notre entrée principale reflète les valeurs d'ouverture et d'excellence de notre établissement.",
      images: [
        { src: "/images/visite/E1.webp", caption: "Portail principal" },
        { src: "/images/visite/E2.webp", caption: "Allée d'accès" },
        { src: "/images/visite/E3.webp", caption: "Bâtiment administratif" }
      ]
    },
    {
      id: "classes",
      title: "Salles de Classe",
      description: "Des espaces d'apprentissage lumineux et bien équipés, conçus pour favoriser la concentration et l'interaction.",
      images: [
        { src: "/images/visite/C1.webp", caption: "Salle de classe primaire" },
        { src: "/images/visite/C2.webp", caption: "Salle de classe secondaire" },
        { src: "/images/visite/C3.webp", caption: "Salle multimédia" },
        { src: "/images/visite/C4.webp", caption: "Bibliothèque" }
      ]
    },
    {
      id: "sciences",
      title: "Laboratoires Scientifiques",
      description: "Nos laboratoires de physique, chimie et SVT permettent une approche pratique des sciences.",
      images: [
        { src: "/images/visite/S1.webp", caption: "Laboratoire de physique" },
        { src: "/images/visite/S2.webp", caption: "Laboratoire de chimie" },
        { src: "/images/visite/S3.webp", caption: "Laboratoire SVT" }
      ]
    },
    {
      id: "sport",
      title: "Installations Sportives",
      description: "Un complexe sportif complet pour le développement physique et l'esprit d'équipe.",
      images: [
        { src: "/images/visite/SP1.webp", caption: "Terrain de football" },
        { src: "/images/visite/SP2.webp", caption: "Gymnase" },
        { src: "/images/visite/SP3.webp", caption: "Piscine" },
        { src: "/images/visite/SP4.webp", caption: "Courts de tennis" }
      ]
    },
    {
      id: "restauration",
      title: "Restauration & Détente",
      description: "Une cantine moderne servant des repas équilibrés et des espaces de détente pour les pauses.",
      images: [
        { src: "/images/visite/R1.webp", caption: "Cantine principale" },
        { src: "/images/visite/R2.webp", caption: "Espace détente" }
      ]
    }
  ]
};

export const visionContent = {
  hero: {
    title: "Notre Vision & Mission",
    subtitle: "Bâtir l'avenir par l'éducation",
    description: "Découvrez les valeurs et les principes qui guident notre action éducative."
  },
  vision: {
    title: "Notre Vision",
    content: "Être l'établissement de référence en Côte d'Ivoire pour une éducation d'excellence qui forme des citoyens responsables, créatifs et engagés, capables de relever les défis du 21ème siècle."
  },
  mission: {
    title: "Notre Mission",
    content: "Offrir à chaque élève un environnement d'apprentissage stimulant et bienveillant, où l'excellence académique s'allie au développement personnel, à l'ouverture culturelle et à l'engagement citoyen."
  },
  values: [
    {
      title: "Excellence",
      description: "Nous visons l'excellence dans tous les domaines : académique, sportif, artistique et humain.",
      icon: "star"
    },
    {
      title: "Intégrité",
      description: "L'honnêteté, le respect et la responsabilité sont au cœur de notre éducation.",
      icon: "shield"
    },
    {
      title: "Innovation",
      description: "Nous embrassons les nouvelles méthodes pédagogiques et technologies éducatives.",
      icon: "lightbulb"
    },
    {
      title: "Solidarité",
      description: "Nous cultivons l'entraide, le partage et le sens de la communauté.",
      icon: "heart"
    },
    {
      title: "Ouverture",
      description: "Nous encourageons la curiosité intellectuelle et l'ouverture sur le monde.",
      icon: "globe"
    },
    {
      title: "Persévérance",
      description: "Nous apprenons à nos élèves que l'effort et la détermination mènent au succès.",
      icon: "target"
    }
  ],
  commitment: {
    title: "Notre Engagement",
    points: [
      "Un enseignement de qualité dispensé par des professionnels passionnés",
      "Un suivi individualisé de chaque élève",
      "Des infrastructures modernes et sécurisées",
      "Une communication transparente avec les familles",
      "Une préparation aux études supérieures et à la vie professionnelle"
    ]
  },
  ui: {
    values: {
      subtitle: "Nos valeurs",
      title: "Les piliers de notre éducation",
      description: "Ces valeurs fondamentales guident chaque aspect de notre action éducative."
    },
    commitment: {
      badge: "Notre engagement",
      intro: "Nous nous engageons chaque jour à offrir le meilleur environnement d'apprentissage pour le développement académique et personnel de chaque élève.",
      objectiveTitle: "Notre objectif",
      objectiveSubtitle: "Former les leaders de demain",
      stats: {
        value: "100%",
        label: "Engagement"
      }
    },
    quote: {
      text: "\"L'éducation est l'arme la plus puissante que vous pouvez utiliser pour changer le monde.\"",
      author: "— Nelson Mandela"
    },
    cta: {
      title: "Partagez-vous nos valeurs ?",
      description: "Rejoignez une communauté éducative engagée pour l'excellence et l'épanouissement de chaque élève.",
      primary: "Rejoindre Vision Future",
      secondary: "Découvrir notre histoire"
    }
  }
};

export const histoireContent = {
  hero: {
    title: "Notre Histoire",
    subtitle: "25 ans d'excellence éducative à Grand-Bassam",
    description: "Retracez le parcours d'une institution qui a formé des générations de leaders."
  },
  intro: "Fondé en 1998 par un groupe d'éducateurs visionnaires, le Groupe Scolaire Vision Future est né de la conviction que chaque enfant mérite une éducation de qualité. Ce qui a commencé comme une petite école de 50 élèves est devenu aujourd'hui un établissement de référence accueillant plus de 1500 élèves.",
  timeline: [
    {
      year: "1998",
      title: "Fondation",
      description: "Création de l'école primaire avec 50 élèves et 5 enseignants dans un bâtiment modeste.",
      milestone: true
    },
    {
      year: "2002",
      title: "Premier Agrandissement",
      description: "Construction de nouveaux bâtiments et ouverture du collège.",
      milestone: false
    },
    {
      year: "2006",
      title: "Ouverture du Lycée",
      description: "Lancement du cycle secondaire avec les filières scientifiques et littéraires.",
      milestone: true
    },
    {
      year: "2010",
      title: "Première Promotion de Bacheliers",
      description: "95% de réussite au baccalauréat pour notre première promotion.",
      milestone: true
    },
    {
      year: "2012",
      title: "Complexe Sportif",
      description: "Inauguration du complexe sportif avec gymnase et piscine.",
      milestone: false
    },
    {
      year: "2015",
      title: "Partenariats Internationaux",
      description: "Signature de conventions avec des établissements français et canadiens.",
      milestone: true
    },
    {
      year: "2018",
      title: "20 ans - Jubilé",
      description: "Célébration des 20 ans avec plus de 3000 anciens élèves réunis.",
      milestone: true
    },
    {
      year: "2020",
      title: "Transformation Numérique",
      description: "Déploiement de la plateforme e-learning et équipement numérique des salles.",
      milestone: false
    },
    {
      year: "2023",
      title: "Nouveau Campus Maternelle",
      description: "Ouverture d'un campus dédié à la petite enfance avec pédagogie Montessori.",
      milestone: true
    },
    {
      year: "2025",
      title: "Cap sur l'Avenir",
      description: "Lancement du programme d'excellence scientifique et des classes préparatoires.",
      milestone: false
    }
  ],
  founders: [
    {
      name: "Dr. Kouamé Yao",
      role: "Fondateur & Président",
      bio: "Ancien professeur à l'Université de Cocody, visionnaire de l'éducation en Côte d'Ivoire."
    },
    {
      name: "Mme Adjoua Koffi",
      role: "Co-fondatrice & Directrice Pédagogique",
      bio: "30 ans d'expérience dans l'enseignement, spécialiste des méthodes actives."
    }
  ],
  ui: {
    timelineTitle: "Notre parcours",
    founders: {
      title: "Nos Fondateurs",
      description: "Des visionnaires qui ont cru en une éducation d'excellence pour tous."
    },
    quote: {
      text: "\"Chaque enfant mérite une éducation de qualité qui lui permet de réaliser son plein potentiel.\"",
      author: "— Dr. Kouamé Yao, Fondateur"
    },
    stats: [
      { value: "1998", label: "Année de fondation" },
      { value: "25+", label: "Années d'excellence" },
      { value: "5000+", label: "Diplômés" },
      { value: "120+", label: "Enseignants" }
    ],
    cta: {
      title: "Écrivez l'histoire avec nous",
      description: "Rejoignez une institution qui a fait ses preuves depuis plus de 25 ans.",
      primary: "Rejoindre Vision Future",
      secondary: "Nos résultats"
    }
  }
};

export const programmesContent = {
  hero: {
    title: "Nos Programmes",
    subtitle: "Un parcours éducatif complet de la maternelle au lycée",
    description: "Découvrez nos cycles d'enseignement et nos spécialités."
  },
  intro: "Le Groupe Scolaire Vision Future propose un parcours éducatif complet, de la maternelle au baccalauréat. Chaque cycle est conçu pour développer les compétences académiques, sociales et personnelles de nos élèves.",
  cycles: [
    {
      id: "maternelle",
      title: "Maternelle",
      ages: "3-5 ans",
      description: "Un environnement stimulant inspiré de la pédagogie Montessori pour les premières découvertes.",
      features: [
        "Petits effectifs (15 élèves max)",
        "Éveil aux langues (français et anglais)",
        "Activités sensorielles et motrices",
        "Initiation à la lecture et aux mathématiques",
        "Arts plastiques et musique"
      ],
      image: "/images/programmes/M1.webp"
    },
    {
      id: "primaire",
      title: "École Primaire",
      ages: "6-11 ans",
      description: "Les fondamentaux académiques dans un cadre bienveillant et exigeant.",
      features: [
        "Programme national enrichi",
        "Anglais renforcé dès le CP",
        "Initiation à l'informatique",
        "Éducation sportive quotidienne",
        "Projets interdisciplinaires"
      ],
      image: "/images/programmes/P1.webp"
    },
    {
      id: "college",
      title: "Collège",
      ages: "12-15 ans",
      description: "Approfondir les connaissances et développer l'autonomie.",
      features: [
        "Toutes les matières du programme national",
        "LV2 : Espagnol ou Allemand",
        "Laboratoires de sciences équipés",
        "Préparation au BEPC",
        "Clubs et activités périscolaires"
      ],
      image: "/images/programmes/CO1.webp"
    },
    {
      id: "lycee",
      title: "Lycée",
      ages: "16-18 ans",
      description: "Préparer l'excellence au baccalauréat et l'entrée dans le supérieur.",
      features: [
        "Séries : A, C, D",
        "Classes à effectifs réduits",
        "Préparation intensive au BAC",
        "Orientation et coaching",
        "Partenariats universitaires"
      ],
      image: "/images/programmes/L1.webp"
    }
  ],
  specialPrograms: [
    {
      title: "Section Internationale",
      description: "Programme bilingue français-anglais préparant aux certifications Cambridge.",
      icon: "globe"
    },
    {
      title: "Excellence Scientifique",
      description: "Parcours renforcé en mathématiques et sciences pour les élèves à haut potentiel.",
      icon: "flask"
    },
    {
      title: "Arts & Culture",
      description: "Option arts plastiques, musique et théâtre avec spectacles annuels.",
      icon: "palette"
    },
    {
      title: "Sport-Études",
      description: "Aménagement des horaires pour les sportifs de haut niveau.",
      icon: "trophy"
    }
  ],
  ui: {
    cycles: {
      keyPointsTitle: "Points clés du programme :"
    },
    specialPrograms: {
      subtitle: "Programmes spéciaux",
      title: "Des parcours d'excellence",
      description: "En plus du programme national, nous proposons des parcours spécialisés pour développer les talents de chaque élève."
    },
    pedagogy: {
      badge: "Notre approche",
      title: "Une pédagogie innovante",
      description: "Notre approche pédagogique combine les méthodes traditionnelles éprouvées avec les innovations éducatives modernes pour offrir le meilleur à chaque élève.",
      points: [
        "Apprentissage par projets et expérimentation",
        "Suivi individualisé de chaque élève",
        "Intégration des outils numériques",
        "Développement des compétences du 21ème siècle",
        "Évaluation formative continue"
      ],
      stats: [
        { value: "25", label: "Élèves max/classe" },
        { value: "1:12", label: "Ratio enseignant" },
        { value: "8h", label: "Anglais/semaine" },
        { value: "100%", label: "Équipement numérique" }
      ]
    },
    cta: {
      title: "Prêt à inscrire votre enfant ?",
      description: "Découvrez notre processus d'admission et les prochaines étapes pour rejoindre Vision Future.",
      primary: "Processus d'admission",
      secondary: "Visiter le campus"
    }
  }
};

export const excellenceContent = {
  hero: {
    title: "Excellence Académique",
    subtitle: "Des résultats qui parlent d'eux-mêmes",
    description: "Découvrez les performances de nos élèves et les parcours de nos anciens."
  },
  results: {
    title: "Résultats aux Examens 2025",
    exams: [
      {
        name: "Baccalauréat",
        rate: "98%",
        mentions: "45% Très Bien, 30% Bien",
        rank: "1er établissement de Grand-Bassam"
      },
      {
        name: "BEPC",
        rate: "100%",
        mentions: "60% avec mention",
        rank: "Top 5 national"
      },
      {
        name: "CEPE",
        rate: "100%",
        mentions: "Moyenne générale : 8.5/10",
        rank: "Excellence confirmée"
      }
    ]
  },
  distinctions: [
    {
      title: "Olympiades de Mathématiques",
      year: "2025",
      achievement: "Médaille d'or nationale - Kouassi Ange"
    },
    {
      title: "Concours Général",
      year: "2025",
      achievement: "3ème prix en Philosophie - Bamba Fatou"
    },
    {
      title: "Spelling Bee National",
      year: "2024",
      achievement: "Champion national - Diallo Ibrahim"
    },
    {
      title: "Robotique Junior",
      year: "2024",
      achievement: "Finalistes au concours panafricain"
    }
  ],
  alumni: [
    {
      name: "Dr. Aminata Koné",
      promotion: "2015",
      achievement: "Médecin à l'hôpital Cocody, spécialiste en cardiologie",
      image: "/images/excellence/A1.webp"
    },
    {
      name: "Yao Kouamé",
      promotion: "2012",
      achievement: "Ingénieur chez Microsoft, Seattle",
      image: "/images/excellence/A2.webp"
    },
    {
      name: "Marie-Claire Bamba",
      promotion: "2018",
      achievement: "Avocate au Barreau de Paris",
      image: "/images/excellence/A3.webp"
    },
    {
      name: "Jean-Luc Aka",
      promotion: "2016",
      achievement: "Entrepreneur, fondateur de TechIvoire",
      image: "/images/excellence/A4.webp"
    },
    {
      name: "Fatou Diallo",
      promotion: "2019",
      achievement: "Doctorante en physique, MIT",
      image: "/images/excellence/A5.webp"
    },
    {
      name: "Olivier Koffi",
      promotion: "2014",
      achievement: "Diplomate, Ambassade de Côte d'Ivoire à Paris",
      image: "/images/excellence/A6.webp"
    }
  ],
  testimonials: [
    {
      quote: "Vision Future m'a donné les bases solides qui m'ont permis de réussir à Sciences Po puis à Harvard.",
      author: "Aminata Koné",
      role: "Promotion 2015"
    },
    {
      quote: "L'exigence et la bienveillance des professeurs ont forgé mon caractère et ma détermination.",
      author: "Yao Kouamé",
      role: "Promotion 2012"
    }
  ],
  ui: {
    results: {
      subtitle: "Résultats 2025",
      description: "Des performances exceptionnelles qui témoignent de la qualité de notre enseignement."
    },
    distinctions: {
      subtitle: "Distinctions",
      title: "Nos élèves brillent",
      description: "Palmarès des distinctions obtenues par nos élèves lors des compétitions académiques."
    },
    alumni: {
      subtitle: "Nos anciens",
      title: "Ils ont réussi avec Vision Future",
      description: "Découvrez les parcours inspirants de nos anciens élèves.",
      promotionLabel: "Promotion"
    },
    testimonials: {
      subtitle: "Témoignages",
      title: "Paroles d'anciens"
    },
    successStats: {
      title: "L'excellence en chiffres",
      description: "Des résultats qui parlent d'eux-mêmes et témoignent de notre engagement pour la réussite de chaque élève.",
      stats: [
        { value: "98%", label: "Réussite BAC", icon: "graduationcap" },
        { value: "85%", label: "Mentions", icon: "award" },
        { value: "100%", label: "Orientation réussie", icon: "trending" },
        { value: "5000+", label: "Diplômés", icon: "trophy" }
      ]
    },
    cta: {
      title: "Rejoignez l'excellence",
      description: "Offrez à votre enfant les meilleures chances de réussite en rejoignant Vision Future.",
      primary: "Demander une inscription",
      secondary: "Découvrir nos programmes"
    }
  }
};

export const admissionsContent = {
  hero: {
    title: "Admissions",
    subtitle: "Rejoignez la famille Vision Future",
    description: "Découvrez notre processus d'admission et les étapes pour inscrire votre enfant."
  },
  intro: "Nous accueillons les élèves de la maternelle au lycée. Notre processus d'admission vise à identifier les élèves motivés et à assurer une bonne adéquation avec notre projet pédagogique.",
  process: [
    {
      step: 1,
      title: "Demande d'Information",
      description: "Remplissez le formulaire ci-dessous ou contactez notre service admissions."
    },
    {
      step: 2,
      title: "Visite du Campus",
      description: "Participez à une visite guidée et rencontrez notre équipe pédagogique."
    },
    {
      step: 3,
      title: "Dossier de Candidature",
      description: "Soumettez le dossier complet avec les bulletins et documents requis."
    },
    {
      step: 4,
      title: "Évaluation",
      description: "Test de niveau adapté au cycle demandé et entretien avec la direction."
    },
    {
      step: 5,
      title: "Décision",
      description: "Notification de la décision sous 2 semaines."
    },
    {
      step: 6,
      title: "Inscription",
      description: "Finalisation de l'inscription et règlement des frais."
    }
  ],
  documents: [
    "Bulletins scolaires des 2 dernières années",
    "Extrait d'acte de naissance",
    "Certificat de scolarité",
    "Photos d'identité (4)",
    "Carnet de vaccination à jour"
  ],
  fees: {
    note: "Les frais de scolarité varient selon le cycle. Contactez-nous pour un devis personnalisé.",
    cycles: [
      { name: "Maternelle", range: "800 000 - 1 000 000 FCFA/an" },
      { name: "Primaire", range: "900 000 - 1 200 000 FCFA/an" },
      { name: "Collège", range: "1 100 000 - 1 400 000 FCFA/an" },
      { name: "Lycée", range: "1 300 000 - 1 600 000 FCFA/an" }
    ],
    includes: [
      "Frais de scolarité",
      "Manuels scolaires",
      "Assurance scolaire",
      "Activités périscolaires de base"
    ]
  },
  calendar: {
    title: "Calendrier des Admissions 2025-2026",
    dates: [
      { event: "Ouverture des inscriptions", date: "1er Février 2025" },
      { event: "Journées portes ouvertes", date: "15-16 Mars 2025" },
      { event: "Date limite de dépôt", date: "30 Avril 2025" },
      { event: "Tests d'admission", date: "Mai 2025" },
      { event: "Notifications", date: "Juin 2025" },
      { event: "Rentrée scolaire", date: "Septembre 2025" }
    ]
  },
  ui: {
    processSection: {
      subtitle: "Processus",
      title: "Les étapes d'admission"
    },
    applicationSection: {
      subtitle: "Candidature",
      title: "Demande d'admission"
    },
    helpCta: {
      title: "Des questions ?",
      description: "Notre équipe est à votre disposition.",
      button: "Nous contacter"
    }
  }
};

export const contactContent = {
  hero: {
    title: "Contactez-Nous",
    subtitle: "Nous sommes à votre écoute",
    description: "Une question ? N'hésitez pas à nous contacter par téléphone, email ou via le formulaire."
  },
  ui: {
    coordinatesTitle: "Nos coordonnées",
    form: {
      title: "Envoyez-nous un message",
      description: "Remplissez le formulaire ci-dessous et nous vous répondrons rapidement."
    }
  },
  info: {
    address: {
      title: "Adresse",
      lines: [
        "Groupe Scolaire Vision Future",
        "Boulevard de la République",
        "Grand-Bassam, Côte d'Ivoire"
      ]
    },
    phone: {
      title: "Téléphone",
      numbers: [
        "+225 27 21 30 45 67",
        "+225 07 08 09 10 11"
      ]
    },
    email: {
      title: "Email",
      addresses: [
        "contact@visionfuture.ci",
        "admissions@visionfuture.ci"
      ]
    },
    hours: {
      title: "Horaires d'Accueil",
      schedule: [
        "Lundi - Vendredi : 7h30 - 17h00",
        "Samedi : 8h00 - 12h00"
      ]
    }
  },
  departments: [
    {
      name: "Direction Générale",
      email: "direction@visionfuture.ci",
      phone: "+225 27 21 30 45 68"
    },
    {
      name: "Service Admissions",
      email: "admissions@visionfuture.ci",
      phone: "+225 27 21 30 45 69"
    },
    {
      name: "Service Scolarité",
      email: "scolarite@visionfuture.ci",
      phone: "+225 27 21 30 45 70"
    },
    {
      name: "Comptabilité",
      email: "comptabilite@visionfuture.ci",
      phone: "+225 27 21 30 45 71"
    }
  ]
};

export const mentionsLegalesContent = {
  hero: {
    title: "Mentions légales",
    subtitle: "Informations légales",
    description: "Mentions légales du site Vision Future",
  },
  sections: [
    {
      title: "Éditeur du site",
      content: "Groupe Scolaire Vision Future",
    },
    {
      title: "Hébergement",
      content: "Ce site est hébergé sur une infrastructure de type Netlify.",
    },
    {
      title: "Propriété intellectuelle",
      content:
        "Le contenu de ce site (textes, images, logos) est la propriété de Groupe Scolaire Vision Future, sauf mention contraire.",
    },
    {
      title: "Contact",
      content: "Pour toute question, veuillez nous contacter via la page Contact.",
    },
  ],
};

export const confidentialiteContent = {
  hero: {
    title: "Politique de confidentialité",
    subtitle: "Protection des données",
    description: "Politique de confidentialité du site Vision Future",
  },
  sections: [
    {
      title: "Données collectées",
      content:
        "Les formulaires du site peuvent collecter des informations nécessaires au traitement de votre demande (contact, admissions, suivi).",
    },
    {
      title: "Finalité",
      content:
        "Les données sont utilisées uniquement pour répondre à votre demande et assurer le suivi administratif.",
    },
    {
      title: "Conservation",
      content:
        "Les données sont conservées pendant la durée nécessaire au traitement, puis archivées ou supprimées selon les obligations applicables.",
    },
    {
      title: "Vos droits",
      content:
        "Vous pouvez demander l’accès, la rectification ou la suppression de vos données en nous contactant via la page Contact.",
    },
  ],
};

export const navigation = [
  { name: "Accueil", path: "/" },
  { name: "Visite", path: "/visite" },
  { name: "Vision", path: "/vision" },
  { name: "Histoire", path: "/histoire" },
  { name: "Programmes", path: "/programmes" },
  { name: "Excellence", path: "/excellence" },
  { name: "Admissions", path: "/admissions" },
  { name: "Contact", path: "/contact" }
];
