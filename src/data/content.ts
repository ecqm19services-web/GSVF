// Content data for Collège Privé la Vision Future
// This simulates Markdown content that would be editable via CMS

export const siteConfig = {
  name: "Collège Privé la Vision Future",
  shortName: "CPVF",
  location: "Grand-Bassam, Côte d'Ivoire",
  phone: "+225 27 21 29 39 83",
  email: "contact@lavisionfuture.ci",
  address: "Boulevard de la République, Grand-Bassam, Côte d'Ivoire",
  socialLinks: {
    facebook: "https://www.facebook.com/lavisionfuture",
    instagram: "https://instagram.com/cpvf",
    linkedin: "https://linkedin.com/company/cpvf",
    youtube: "https://youtube.com/@cpvf"
  }
};

export const homeContent = {
  hero: {
    title: "Collège Privé la Vision Future",
    subtitle: "L'excellence, Notre devise",
    description: "Depuis 2019, nous formons les leaders de demain en accompagnant chaque élève vers la réussite académique et l'épanouissement personnel à Grand-Bassam.",
    ctaPrimary: "Mot du fondateur",
    ctaSecondary: "Découvrir nos programmes"
  },
  sections: {
    features: {
      subtitle: "Pourquoi nous choisir",
      title: "Une éducation d'excellence",
      description: "Découvrez ce qui fait du Collège Privé la Vision Future un établissement de référence à Grand-Bassam."
    },
    aboutPreview: {
      badge: "Notre histoire",
      title: "Depuis 2019, un engagement fort pour l'éducation",
      paragraphs: [
        "Fondé en 2019 à Grand-Bassam, le Collège Privé la Vision Future est né de la vision de M. DÉGBOUÉ YAO EULOGE, convaincu qu'une éducation de qualité peut transformer des vies.",
        "Aujourd'hui, nous sommes fiers d'accompagner nos élèves vers l'excellence, avec des enseignants tous qualifiés et disposant de toutes les autorisations requises."
      ],
      ctaPrimary: "Notre histoire",
      ctaSecondary: "Notre vision",
      imageCaption: "Campus Vision Future",
      highlight: {
        value: "100%",
        label: "Réussite au CEPE 2024-2025"
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
      title: "Prêt à rejoindre la Vision Future ?",
      description: "Inscrivez votre enfant dès maintenant et offrez-lui les meilleures chances de réussite.",
      primary: "Demander une inscription",
      secondary: "Nous contacter"
    }
  },
  stats: [
    { value: "100%", label: "Réussite CEPE 2024-2025" },
    { value: "7 ans", label: "D'excellence éducative" },
    { value: "100%", label: "Enseignants qualifiés & autorisés" }
  ],
  features: [
    {
      title: "Excellence Académique",
      description: "Un programme rigoureux aligné sur les standards internationaux avec un suivi personnalisé.",
      icon: "academic"
    },
    {
      title: "Infrastructures Modernes",
      description: "Campus moderne avec laboratoires, bibliothèque et installations sportives.",
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
      quote: "Le Collège Privé la Vision Future a transformé ma vie. Les enseignants m'ont donné confiance en mes capacités.",
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
      title: "100% de réussite au CEPE 2024-2025",
      date: "Juillet 2025",
      excerpt: "Taux de réussite de 100% au CEPE, confirmant l'excellence de notre enseignement.",
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
    description: "Explorez notre campus à travers cette visite guidée interactive."
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
      description: "Des espaces d'apprentissage modernes et lumineux, dédiés à chaque niveau, favorisant la concentration et la réussite des élèves.",
      images: [
        { src: "/images/visite/C1.webp", caption: "Salle de classe primaire" },
        { src: "/images/visite/C2.webp", caption: "Salle de classe secondaire" },
        { src: "/images/visite/C4.webp", caption: "Bibliothèque" }
      ]
    },
    {
      id: "robotique",
      title: "Robotique & Informatique",
      description: "Une salle dédiée à la robotique et à l'informatique, où les élèves s'initient aux nouvelles technologies, à la programmation et à la pensée computationnelle.",
      images: [
        { src: "/images/visite/C3.webp", caption: "Salle de robotique & informatique" }
      ]
    },
    {
      id: "sciences",
      title: "Laboratoires Scientifiques",
      description: "Une salle de laboratoire dédiée à la physique et à la chimie, ainsi qu'une salle de SVT, permettent une approche pratique des sciences.",
      images: [
        { src: "/images/visite/S1.webp", caption: "Laboratoire de physique-chimie" },
        { src: "/images/visite/S3.webp", caption: "Salle de SVT" }
      ],
      galleryImages: [
        { src: "/images/visite/S1.webp", caption: "Laboratoire de physique-chimie" },
        { src: "/images/visite/S2.webp", caption: "Laboratoire de physique-chimie — vue 2" },
        { src: "/images/visite/S3.webp", caption: "Salle de SVT" }
      ]
    },
    {
      id: "sport",
      title: "Espace Sportif",
      description: "Un terrain polyvalent en plein air servant à la pratique du football, du basketball, du handball et du tennis. Un espace simple mais fonctionnel où les élèves développent leur esprit d'équipe et leur condition physique.",
      images: [
        { src: "/images/visite/SP1.webp", caption: "Terrain polyvalent" },
        { src: "/images/visite/SP2.webp", caption: "Activités sportives" }
      ]
    },
    {
      id: "restauration",
      title: "Restauration & Détente",
      description: "Un espace de restauration où les élèves prennent leurs repas dans un cadre convivial, avec des espaces de détente pour les pauses.",
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
      primary: "Rejoindre la Vision Future",
      secondary: "Découvrir notre histoire"
    }
  }
};

export const histoireContent = {
  hero: {
    title: "Notre Histoire",
    subtitle: "L'excellence éducative à Grand-Bassam depuis 2019",
    description: "Retracez le parcours d'un établissement qui forme les leaders de demain."
  },
  intro: "Fondé en 2019, le Collège Privé la Vision Future est né de la conviction de M. DÉGBOUÉ YAO EULOGE qu'une éducation de qualité peut transformer des vies. Depuis sa création, l'établissement n'a cessé de grandir et de s'affirmer comme une référence éducative à Grand-Bassam.",
  timeline: [
    {
      year: "2019-2020",
      title: "Fondation du Collège",
      description: "Création du Collège Privé la Vision Future à Grand-Bassam par M. DÉGBOUÉ YAO EULOGE, avec une équipe d'enseignants qualifiés et autorisés.",
      milestone: true
    },
    {
      year: "2020-2021",
      title: "Consolidation",
      description: "Renforcement de l'équipe pédagogique et mise en place des programmes du 1er cycle (6e à 3e).",
      milestone: false
    },
    {
      year: "2021-2022",
      title: "Croissance",
      description: "Augmentation des effectifs et amélioration continue des infrastructures.",
      milestone: false
    },
    {
      year: "2022-2023",
      title: "Ouverture du 2nd Cycle",
      description: "Lancement des classes de 2nde à Terminale (séries A, D et C).",
      milestone: true
    },
    {
      year: "2023-2024",
      title: "Développement",
      description: "Accueil des élèves affectés et non-affectés. Renforcement des partenariats éducatifs.",
      milestone: false
    },
    {
      year: "2024-2025",
      title: "Renforcement académique et orientation",
      description: "Consolidation des parcours d'excellence, renforcement de l'accompagnement aux examens et orientation active des élèves.",
      milestone: false
    },
    {
      year: "2025-2026",
      title: "Introduction des cours de robotique",
      description: "Lancement d'un programme de robotique éducative pour développer la logique, la créativité et les compétences STEM dès la classe de CP.",
      milestone: true
    }
  ],
  founders: [
    {
      name: "M. DÉGBOUÉ YAO EULOGE",
      role: "Fondateur & Directeur Général",
      bio: "Visionnaire de l'éducation en Côte d'Ivoire, il a consacré sa vie à offrir une éducation de qualité accessible à tous les enfants de Grand-Bassam et au-delà."
    }
  ],
  ui: {
    timelineTitle: "Notre parcours",
    founders: {
      title: "Notre Fondateur",
      description: "Un visionnaire qui a cru en une éducation d'excellence pour tous."
    },
    quote: {
      text: "\"Chaque enfant mérite une éducation de qualité qui lui permet de réaliser son plein potentiel.\"",
      author: "— M. DÉGBOUÉ YAO EULOGE, Fondateur"
    },
    stats: [
      { value: "2019", label: "Année de fondation" },
      { value: "7 ans", label: "D'excellence" },
      { value: "100%", label: "Réussite CEPE" },
      { value: "100%", label: "Enseignants qualifiés" }
    ],
    cta: {
      title: "Écrivez l'histoire avec nous",
      description: "Rejoignez un établissement en pleine croissance depuis 2019.",
      primary: "Rejoindre la Vision Future",
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
  intro: "Le Collège Privé la Vision Future propose un parcours éducatif structuré avec un 1er cycle (de la 6e à la 3e) et un 2nd cycle (de la 2nde à la Terminale) avec les séries du BAC A1, A2, C et D. Les élèves affectés et non-affectés sont les bienvenus.",
  cycles: [
    {
      id: "maternelle",
      title: "Maternelle",
      ages: "3-5 ans",
      description: "Un environnement stimulant inspiré de la pédagogie Montessori pour les premières découvertes.",
      features: [
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
      title: "1er Cycle (Collège)",
      ages: "6e à 3e",
      description: "Le premier cycle couvre de la 6e à la 3e. Nous accueillons les élèves affectés et non-affectés pour approfondir les connaissances et développer l'autonomie.",
      features: [
        "Programme national complet de la 6e à la 3e",
        "Préparation au BEPC",
        "Encadrement par des enseignants qualifiés et autorisés",
        "Accueil des élèves affectés et non-affectés",
        "Suivi personnalisé de chaque élève"
      ],
      image: "/images/programmes/CO1.webp"
    },
    {
      id: "lycee",
      title: "2nd Cycle (Lycée)",
      ages: "2nde à Terminale",
      description: "Le second cycle prépare les élèves au baccalauréat avec les séries A1, A2, C et D. La classe de Première est disponible avec précision sur les séries A2, C et D. Les affectés comme les non-affectés sont accueillis.",
      features: [
        "Séries BAC : A1, A2, C, D",
        "De la 2nde à la Terminale",
        "Classe de Première : séries A2, C, D",
        "Préparation intensive au BAC",
        "Accueil des affectés et non-affectés",
        "Orientation et coaching personnalisé"
      ],
      image: "/images/programmes/L1.webp"
    }
  ],
  specialPrograms: [],
  ui: {
    cycles: {
      keyPointsTitle: "Points clés du programme :"
    },
    pedagogy: {
      badge: "Notre approche",
      title: "Une pédagogie centrée sur l'élève",
      description: "Au Collège Privé la Vision Future, nous croyons qu'un enseignement de qualité repose sur un encadrement rigoureux, des enseignants qualifiés et un suivi personnalisé de chaque élève.",
      points: [
        "Enseignants tous qualifiés et disposant des autorisations requises",
        "Suivi individualisé et accompagnement personnalisé",
        "Accueil des élèves affectés et non-affectés",
        "Préparation rigoureuse aux examens nationaux (CEPE, BEPC, BAC)"
      ],
      stats: [
        { value: "2019", label: "Année de fondation" },
        { value: "100%", label: "Réussite CEPE 2024-2025" },
        { value: "A1, A2, C, D", label: "Séries au BAC" },
        { value: "100%", label: "Enseignants qualifiés" }
      ]
    },
    cta: {
      title: "Prêt à inscrire votre enfant ?",
      description: "Découvrez notre processus d'admission et les prochaines étapes pour rejoindre la Vision Future.",
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
    title: "Résultats aux Examens 2024-2025",
    exams: [
      {
        name: "CEPE 2024-2025",
        rate: "100%",
        mentions: "Tous les candidats admis",
        rank: "Excellence confirmée"
      },
      {
        name: "BEPC 2024-2025",
        rate: "89,47%",
        mentions: "Bonne performance académique",
        rank: "Résultats publiés"
      },
      {
        name: "BAC 2024-2025",
        rate: "62,31%",
        mentions: "Progression continue",
        rank: "Résultats publiés"
      }
    ]
  },
  distinctions: [
    {
      title: "[Nom de la compétition]",
      year: "[Année]",
      achievement: "[Résultat obtenu] — [Nom de l'élève]",
      image: ""
    },
    {
      title: "[Nom de la compétition]",
      year: "[Année]",
      achievement: "[Résultat obtenu] — [Nom de l'élève]",
      image: ""
    },
    {
      title: "[Nom de la compétition]",
      year: "[Année]",
      achievement: "[Résultat obtenu] — [Nom de l'élève]",
      image: ""
    },
    {
      title: "[Nom de la compétition]",
      year: "[Année]",
      achievement: "[Résultat obtenu] — [Nom de l'élève]",
      image: ""
    }
  ],
  alumni: [
    {
      name: "[Nom de l'ancien élève]",
      promotion: "[Année]",
      achievement: "[Parcours ou réussite de l'ancien élève]",
      image: "/images/excellence/A1.webp"
    },
    {
      name: "[Nom de l'ancien élève]",
      promotion: "[Année]",
      achievement: "[Parcours ou réussite de l'ancien élève]",
      image: "/images/excellence/A2.webp"
    },
    {
      name: "[Nom de l'ancien élève]",
      promotion: "[Année]",
      achievement: "[Parcours ou réussite de l'ancien élève]",
      image: "/images/excellence/A3.webp"
    }
  ],
  testimonials: [
    {
      quote: "[Témoignage de l'ancien élève à remplacer par un vrai témoignage]",
      author: "[Nom de l'ancien élève]",
      role: "[Promotion Année]"
    },
    {
      quote: "[Témoignage de l'ancien élève à remplacer par un vrai témoignage]",
      author: "[Nom de l'ancien élève]",
      role: "[Promotion Année]"
    }
  ],
  ui: {
    results: {
      subtitle: "Résultats 2024-2025",
      description: "Des performances exceptionnelles qui témoignent de la qualité de notre enseignement."
    },
    distinctions: {
      subtitle: "Distinctions",
      title: "Nos élèves brillent",
      description: "Palmarès des distinctions obtenues par nos élèves lors des compétitions académiques."
    },
    alumni: {
      subtitle: "Nos anciens",
      title: "Ils ont réussi avec la Vision Future",
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
        { value: "100%", label: "Réussite CEPE 2024-2025", icon: "graduationcap" },
        { value: "100%", label: "Enseignants qualifiés", icon: "award" },
        { value: "2019", label: "Année de fondation", icon: "trending" },
        { value: "7 ans", label: "D'excellence", icon: "trophy" }
      ]
    },
    cta: {
      title: "Rejoignez l'excellence",
      description: "Offrez à votre enfant les meilleures chances de réussite en rejoignant la Vision Future.",
      primary: "Demander une inscription",
      secondary: "Découvrir nos programmes"
    }
  }
};

export const admissionsContent = {
  hero: {
    title: "Admissions",
    subtitle: "Rejoignez la famille de la Vision Future",
    description: "Découvrez notre processus d'admission et les étapes pour inscrire votre enfant."
  },
  intro: "Nous accueillons les élèves du 1er cycle (6e à 3e) et du 2nd cycle (2nde à Terminale A, D et C). Les affectés et non-affectés sont les bienvenus. Notre processus d'admission est simple et transparent.",
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
  infoSheet: {
    title: "Fiche de renseignements",
    subtitle: "Rentrée scolaire 2025 - 2026",
    disclaimer: "NB : les montants ci-dessous sont indicatifs et peuvent évoluer. Veuillez contacter l'administration pour confirmation.",
    servicesTitle: "Services",
    services: [
      "Infirmerie",
      "Philosophie à partir de la classe de 2nde",
      "Suivi avec psychologue",
      "Informatique / Robotique",
      "Allemand / Espagnol à partir de la 6ème"
    ],
    annexFees: {
      title: "Frais annexes",
      visibleInProduction: true,
      columns: ["6ème à la 4ème", "3ème", "2nde / 1ère", "Tle"],
      rows: [
        { label: "Tenue de sport", values: ["6 000 FCFA", "6 000 FCFA", "9 000 FCFA", "9 000 FCFA"] },
        { label: "Tenue scolaire", values: ["12 000 FCFA", "14 000 FCFA", "14 000 FCFA", "14 000 FCFA"] },
        { label: "Polo", values: ["7 000 FCFA", "7 000 FCFA", "7 000 FCFA", "7 000 FCFA"] },
        { label: "Paquet de marqueurs (12)", values: ["6 000 FCFA", "6 000 FCFA", "6 000 FCFA", "6 000 FCFA"] },
        { label: "Rame", values: ["6 000 FCFA", "6 000 FCFA", "6 000 FCFA", "6 000 FCFA"] },
        { label: "Feuilles de copie", values: ["6 000 FCFA", "6 000 FCFA", "6 000 FCFA", "6 000 FCFA"] },
        { label: "Frais d'examen / visite médicale", values: ["5 000 FCFA", "9 000 FCFA", "5 000 FCFA", "12 000 FCFA"] },
        { label: "Photo", values: ["2 000 FCFA", "2 000 FCFA", "2 000 FCFA", "2 000 FCFA"] },
        { label: "Assurance scolaire", values: ["1 000 FCFA", "1 000 FCFA", "1 000 FCFA", "1 000 FCFA"] },
        { label: "Livre scolaire", values: ["2 000 FCFA", "2 000 FCFA", "2 000 FCFA", "2 000 FCFA"] },
        { label: "Robotique", values: ["75 000 FCFA", "75 000 FCFA", "75 000 FCFA", "75 000 FCFA"] }
      ],
      totalLabel: "TOTAL",
      totals: ["128 000 FCFA", "132 000 FCFA", "131 000 FCFA", "138 000 FCFA"]
    },
    transport: {
      title: "Transport",
      routes: [
        {
          label: "Les Cités / Rond point ANANI / Akissi Delta / Modeste",
          amount: "60 000",
          currency: "FCFA",
          period: "Trimestre"
        },
        {
          label: "Grand Bassam Mossou / Gonzague-ville / Jean folly / Adjouffou",
          amount: "75 000",
          currency: "FCFA",
          period: "Trimestre"
        },
        {
          label: "Port Bouet / Palmier / Autoroute / Cité la Paix / et autres destinations",
          amount: "90 000",
          currency: "FCFA",
          period: "Trimestre"
        }
      ],
      canteen: {
        label: "Cantine",
        amount: "60 000",
        currency: "FCFA",
        period: "Trimestre"
      },
      notes: [
        "Test d'entrée obligatoire pour les classes de 5e, 4e, 3e, 2nde, 1ère et Tle.",
        "Reçu d'inscription en ligne obligatoire à l'inscription.",
        "Pas de réduction pour affectés de l'État."
      ]
    },
    tuition: {
      title: "Écolage",
      visibleInProduction: true,
      columns: [
        "6ème à la 3ème (Affectés)",
        "6ème à la 3ème (Non affectés)",
        "2nde à la Tle (Affectés)",
        "2nde à la Tle (Non affectés)"
      ],
      rows: [
        { label: "Écolage", values: ["200 000 FCFA", "350 000 FCFA", "250 000 FCFA", "400 000 FCFA"] },
        { label: "Inscription", values: ["100 000 FCFA", "200 000 FCFA", "150 000 FCFA", "200 000 FCFA"] },
        { label: "Septembre", values: ["40 000 FCFA", "30 000 FCFA", "25 000 FCFA", "40 000 FCFA"] },
        { label: "Octobre", values: ["20 000 FCFA", "30 000 FCFA", "25 000 FCFA", "40 000 FCFA"] },
        { label: "Novembre", values: ["20 000 FCFA", "30 000 FCFA", "25 000 FCFA", "40 000 FCFA"] },
        { label: "Décembre", values: ["20 000 FCFA", "30 000 FCFA", "25 000 FCFA", "40 000 FCFA"] },
        { label: "Janvier", values: ["", "30 000 FCFA", "", "40 000 FCFA"] }
      ],
      note: "NB : Prévoir 100 FCFA de timbre fiscal pour tout versement à effectuer (obligatoire)."
    },
    extracurricular: {
      title: "Activité extrascolaire",
      membership: "Adhésion : 10 000 FCFA",
      quarterly: "15 000 FCFA / trimestre",
      activities: ["TAEKWONDO", "ESCRIME", "KUNG FU"],
      music: "Cours de musique (gratuit pour le collège)",
      facility: "Salle équipée"
    },
    uniforms: {
      title: "Tenues scolaires",
      girlsTitle: "Filles",
      girls: [
        "Chemises blanches, manches courtes",
        "Jupe bleue marine, avec fentes",
        "Cheveux courts, pas de tissage",
        "Ni de perruques, ni de tresses",
        "Chaussures fermées"
      ],
      boysTitle: "Garçons",
      boys: [
        "Pantalon bleu marine avec chemise manches courtes",
        "Cheveux courts",
        "Chaussures fermées"
      ]
    },
    registrationFile: {
      title: "Dossier à fournir à l'inscription",
      sections: [
        {
          title: "Pour les élèves de la Sixième (6e) à la Quatrième (4e)",
          items: [
            "1 extrait d'acte de naissance (copie originale)",
            "1 relevé de note obtenue à l'entrée en 6e (collante) pour les élèves de 6e",
            "Le dernier bulletin de l'année scolaire 2024-2025 (pour les élèves de la 5e et de la 4e)",
            "1 livret scolaire de la 5e et de la 4e"
          ]
        },
        {
          title: "Pour les élèves de la 3e et Tle",
          items: [
            "2 copies d'acte de naissance (copie originale)",
            "Candidats de plus de 16 ans en 2025 : 1 CNI (Carte Nationale d'identité) - Ivoirien + CMU",
            "Candidats de plus de 16 ans en 2025 : 1 Carte Consulaire - Non Ivoirien + CMU"
          ]
        }
      ],
      notes: [
        "Pas d'admission en classe pour tout dossier incomplet.",
        "NB : ces pièces doivent être remises à la Direction de l'école, à l'inscription (obligatoire)."
      ]
    }
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
        "Collège Privé la Vision Future",
        "Boulevard de la République",
        "Grand-Bassam, Côte d'Ivoire"
      ]
    },
    phone: {
      title: "Téléphone",
      numbers: [
        "+225 27 21 29 39 83",
        "+225 05 54 20 35 44"
      ]
    },
    email: {
      title: "Email",
      addresses: [
        "contact@lavisionfuture.ci",
        "admissions@lavisionfuture.ci"
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
      email: "direction@lavisionfuture.ci",
      phone: "+225 27 21 29 39 83"
    },
    {
      name: "Service Admissions",
      email: "admissions@lavisionfuture.ci",
      phone: "+225 05 54 20 35 44"
    },
    {
      name: "Service Scolarité",
      email: "scolarite@lavisionfuture.ci",
      phone: "+225 05 54 20 35 44"
    },
    {
      name: "Comptabilité",
      email: "comptabilite@lavisionfuture.ci",
      phone: "+225 05 54 20 35 44"
    }
  ]
};

export const mentionsLegalesContent = {
  hero: {
    title: "Mentions légales",
    subtitle: "Informations légales",
    description: "Mentions légales du site du Collège Privé la Vision Future",
  },
  sections: [
    {
      title: "Éditeur du site",
      content: "Collège Privé la Vision Future",
    },
    {
      title: "Hébergement",
      content: "Ce site est hébergé sur Hostinger.",
    },
    {
      title: "Propriété intellectuelle",
      content:
        "Le contenu de ce site (textes, images, logos) est la propriété du Collège Privé la Vision Future, sauf mention contraire.",
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
    description: "Politique de confidentialité du site du Collège Privé la Vision Future",
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
  { name: "Notre École", path: "/notre-ecole" },
  { name: "Visite", path: "/visite" },
  { name: "Programmes", path: "/programmes" },
  { name: "Excellence", path: "/excellence" },
  { name: "Actualités", path: "/actualites" },
  { name: "Carrières", path: "/carrieres" },
  { name: "Admissions", path: "/admissions" },
  { name: "Contact", path: "/contact" }
];
