# Contenus du Site - Groupe Scolaire Vision Future

Ce dossier contient les fichiers Markdown pour le contenu de chaque page du site.

## Structure des Fichiers

| Fichier | Page | Description |
|---------|------|-------------|
| `accueil.md` | `/` | Page d'accueil avec hero, stats, témoignages, actualités |
| `vision.md` | `/vision` | Vision, mission et valeurs de l'établissement |
| `histoire.md` | `/histoire` | Historique et chronologie de l'école |
| `programmes.md` | `/programmes` | Cycles d'enseignement et programmes spéciaux |
| `excellence.md` | `/excellence` | Résultats, distinctions et anciens élèves |
| `admissions.md` | `/admissions` | Processus d'admission et frais |
| `contact.md` | `/contact` | Informations de contact |
| `visite.md` | `/visite` | Visite virtuelle du campus |

## Format des Fichiers

Chaque fichier utilise le format **Markdown** avec un **frontmatter YAML** :

```markdown
---
title: "Titre de la page"
subtitle: "Sous-titre"
description: "Description pour le SEO"
---

# Contenu de la page...
```

## Comment Modifier le Contenu

1. **Ouvrez le fichier** correspondant à la page à modifier
2. **Éditez le texte** en respectant la syntaxe Markdown
3. **Sauvegardez** le fichier
4. Le site sera automatiquement mis à jour après redéploiement

## Syntaxe Markdown Rapide

```markdown
# Titre principal (H1)
## Sous-titre (H2)
### Section (H3)

**Texte en gras**
*Texte en italique*

- Liste à puces
- Autre élément

1. Liste numérotée
2. Autre élément

> Citation ou note importante

[Lien](https://example.com)

| Colonne 1 | Colonne 2 |
|-----------|-----------|
| Valeur 1  | Valeur 2  |
```

## Images

Les références aux images utilisent le format :
```
/images/dossier/nom-fichier.webp
```

Les images doivent être placées dans `public/images/`.

---

*Pour toute question technique, contactez l'administrateur du site.*
