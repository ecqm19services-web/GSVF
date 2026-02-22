# Guide développeur — Restauration Niveau B

Ce document décrit **uniquement pour le développeur** la logique de code d'accès à la restauration Niveau B.

## Objectif
- Niveau A: restauration du contenu éditable (usage équipe école)
- Niveau B: restauration complète (usage développeur uniquement)

## Code développeur du jour (Niveau B)
Le code attendu est calculé côté serveur à partir de la date du jour (`d-m-y`) convertie en hexadécimal segment par segment.

### Règle
1. Prendre la date du jour au format `dd-mm-yy`.
2. Convertir chaque segment en base 16 (hex) en minuscule.
3. Padding à 2 caractères par segment.
4. Assembler avec des tirets.

### Exemple
- Date: `22-02-26`
- Conversion hex:
  - `22` -> `16`
  - `02` -> `02`
  - `26` -> `1a`
- Code attendu: `16-02-1a`

## Notes de sécurité
- Le format du code ne doit pas être affiché dans l'interface admin.
- La vérification du code est faite côté serveur uniquement.
- Pour le Niveau B, l'admin doit contacter le développeur.

## Localisation technique
- API: `server/api/admin-backup/index.php`
- Fonction: `expectedDeveloperCodeForToday()`

## Rappel
Utiliser Niveau B seulement en cas de nécessité critique.
