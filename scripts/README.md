# Scripts utilitaires

## bootstrap-admin-operators.cjs

Génère `server/_secure/admin-operators.json` avec des opérateurs individuels, chacun avec un mot de passe aléatoire hashé en bcrypt (compatible PHP).

```bash
node scripts/bootstrap-admin-operators.cjs 10
```

Options : `10` = nombre d'opérateurs · `--force` = écrase un fichier existant.

## generate-operators-excel.cjs / export-operators-excel.cjs

Génèrent les fichiers Excel/CSV d'accès des opérateurs.

## postbuild.cjs / deploy.cjs

- `postbuild.cjs` : copie `server/` → `dist/` après `vite build` (préserve `dist/data/`).
- `deploy.cjs` : prépare `dist-deploy/` (sans les données live) pour l'upload Hostinger.
