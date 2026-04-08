# Démarche de souveraineté numérique — Spade

Application web permettant de visualiser et comparer les alternatives souveraines aux outils numériques utilisés chez [Spade](https://www.spade.be).

## Stack

- [Nuxt 3](https://nuxt.com) — framework Vue.js
- [NuxtUI v2](https://ui.nuxt.com) — composants UI
- [Tailwind CSS](https://tailwindcss.com) — utilitaires CSS
- Geomanist — typographie principale (locale)
- SF Mono — typographie secondaire (monospace)

## Structure

```
├── pages/
│   └── index.vue              # Page principale
├── components/
│   ├── LogicielCard.vue       # Carte logiciel + fiche détail (slideover)
│   └── DemarcheSection.vue    # Section par démarche
├── assets/
│   ├── css/main.css           # Variables de couleurs + @font-face
│   └── fonts/Geomanist/       # Fichiers de police
└── logiciels_souverainete_spade.json  # Données source
```

## Données

Le fichier `logiciels_souverainete_spade.json` contient la liste des logiciels évalués, organisés par démarche :

- **Messagerie professionnelle**
- **Service cloud**
- **Prototypage UI**

Chaque logiciel dispose d'un score sur 100, d'indicateurs (open source, sécurité, portabilité) et d'une fiche détaillée (siège social, actionnariat, infrastructure, fonctionnalités, points d'attention…).

Démarches couvertes (mise à jour 2026-04-08) :

- **Messagerie professionnelle**
- **Service cloud**
- **Prototypage UI**
- **Repository**

## Lancer le projet

```bash
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`.
