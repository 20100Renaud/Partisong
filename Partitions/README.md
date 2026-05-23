# Partitions App
- Backend : Node.js + Express
- Frontend : Vite + React
- Database : SQLite
## Command
### Backend server
```
~/projects/Partitions/Partitions/server$ npm run dev
```
- to see the json file:
```
http://localhost:3001/api/songs
```

### Frontend server
```
~/projects/Partitions/Partitions$ npm run dev
```
- to see the json file:
```
http://localhost:5173/api/songs
http://localhost:5173/api/songs/Id // Change Id for details
```
## Tree structure
- Install
```
sudo apt install tree
```
- Run bash
```
~/projects/Partitions$ tree -I node_modules
```
- Result
```
.
└── Partitions
    ├── Kaolin - Partons vite.pdf
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── favicon.svg
    │   └── icons.svg
    ├── server
    │   ├── data
    │   │   ├── song.db
    │   │   └── songs.db
    │   ├── database
    │   │   └── db.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   │   └── songs.js
    │   └── server.js
    ├── src
    │   ├── App.jsx
    │   ├── App_save.jsx
    │   ├── Header.jsx
    │   ├── Index.css
    │   ├── Lyrics.jsx
    │   ├── LyricsBlock.jsx
    │   ├── Main.jsx
    │   ├── Progression.jsx
    │   ├── api.js
    │   └── assets
    │       ├── hero.png
    │       ├── react.svg
    │       └── vite.svg
    └── vite.config.js

9 directories, 28 files
```
