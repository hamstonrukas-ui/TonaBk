# TonaBk

PWA de location de maisons à Bukavu, organisée par quartier.

## Démarrage

1. Installer les dépendances :
   ```
   npm install
   ```

2. Créer un projet sur [supabase.com](https://supabase.com), puis :
   - Copier `.env.example` vers `.env` et renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
     (Project Settings → API dans Supabase)
   - Ouvrir l'éditeur SQL de Supabase et exécuter le contenu de `supabase/schema.sql`
   - Dans Authentication → Users, créer un utilisateur admin (ton email + mot de passe) :
     c'est ce compte qui te connectera sur `/admin`

3. Créer un compte gratuit sur [cloudinary.com](https://cloudinary.com) pour l'upload des
   photos depuis l'espace admin :
   - Dans Settings → Upload, créer un "Upload preset" en mode **Unsigned**
   - Renseigner `VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET` dans `.env`

4. Lancer le serveur de développement :
   ```
   npm run dev
   ```

5. Ouvrir `http://localhost:5173` — l'accueil, la recherche et les fiches maison sont
   branchés sur Supabase. Va sur `/admin/connexion` pour te connecter et publier
   une première annonce depuis `/admin`, photos comprises.

## Fonctionnalités incluses

- Recherche par quartier, type de bien (maison, appartement, chambre, parcelle, boutique)
  et opération (louer / vendre)
- Favoris enregistrés localement sur l'appareil, avec compteur dans le header
- Compteur de vues par annonce (incrémenté automatiquement à l'ouverture d'une fiche)
- Upload de photos avec compression automatique avant envoi (utile en connexion instable)
- Badge "Vérifiée" et modèle admin-only pour garantir la qualité des annonces

## Prochaines étapes suggérées

- Rôle "agent" pour les commissaires validés (phase 2)
- Mode sombre (présent dans l'ancienne version, pas encore repris ici)
- Icônes PWA réelles dans `public/icons/` (192x192 et 512x512)
- Déploiement (Vercel ou Netlify fonctionnent bien avec Vite)
