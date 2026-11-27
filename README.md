# 007 Wiki

A James Bond wiki made with React, Vite and Tailwind CSS for my SE 3355 midterm project.

- Live demo: https://bond-wiki.vercel.app/
- Repo: https://github.com/bsrjln/bond-wiki

## API

I used the [James Bond Movie Database API](https://bond.deanebarker.net/) for all the data (movies, actors,
characters, gadgets, vehicles, locations, organizations). It doesn't need a key.

The Bond API doesn't have images, so I used [OMDb](https://www.omdbapi.com/) for the movie posters.

The API also doesn't support search or pagination, so searching, filtering and "load more" are done in the browser.

## Features

- Home page with a short intro and links to all sections
- List pages for movies, characters, actors, gadgets, vehicles, locations and organizations
- Search, filters and sorting on every list page + load more button
- Detail pages for every item, related items link to each other (e.g. movie -> actor -> character)
- Loading and error messages (with a retry button)
- Responsive navbar with a mobile menu, 404 page
- Extra:
  - movie posters from OMDb
  - search/filter values are kept in the URL
  - previous / next movie buttons
  - "Dossier" page for saving favourites (localStorage)
  - timeline page (movies grouped by Bond actor)
  - stats page with simple bar charts
  - search in all categories from the navbar

## Folder structure

- `src/services` – API requests
- `src/hooks` – custom hooks (useFetch, useDebounce...)
- `src/components` – layout, cards, common components (search bar, loader, error message...)
- `src/pages` – one file for each page
- `src/utils` – helper functions (formatting, filtering)

## Running the project

```bash
npm install
npm run dev
```

For posters, create a `.env` file and add your OMDb key:

```
VITE_OMDB_API_KEY=your_key
```

Tests: `npm test`

## Deploy

Deployed on Vercel. Build command is `npm run build` and output folder is `dist`. The OMDb key is added as an
environment variable on Vercel. `vercel.json` is there so refreshing a page like `/movies/gf` doesn't give a 404.
