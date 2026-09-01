const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../data/songs.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run("PRAGMA foreign_keys = ON");

const lyricsSeed = [
  {
    progressionIndex: 0,
    content: "Intro lyrics...",
  },
  {
    progressionIndex: 1,
    content: "First verse...",
  },
  {
    progressionIndex: 2,
    content: "Second verse...",
  },
  {
    progressionIndex: 3,
    content: "Bridge lyrics...",
  },
];

const themes = [
  {
    name: "red",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500/10",
    badgeColor: "bg-red-500",
  },
  {
    name: "green",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500/10",
    badgeColor: "bg-green-500",
  },
  {
    name: "blue",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500/10",
    badgeColor: "bg-blue-500",
  },
  {
    name: "purple",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-500/10",
    badgeColor: "bg-purple-500",
  },
  {
    name: "yellow",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500/10",
    badgeColor: "bg-yellow-500",
  },
];

const progressionSeed = [
  {
    label: "Intro",
    theme: "red",
    chords: ["C", "Em", "Am", "Gx2"],
  },
  {
    label: "Verse 1",
    theme: "yellow",
    chords: ["C", "Em", "Am", "G"],
  },
  {
    label: "Verse 2",
    theme: "green",
    chords: ["Dm", "G", "Am", "G"],
  },
  {
    label: "Bridge",
    theme: "blue",
    chords: ["Am", "Em", "Am", "Em"],
  },
  {
    label: "Outro",
    theme: "purple",
    chords: ["Dm", "G", "G", "GG"],
  },
];

const grooveSeed = {
  beats: ["1", "2", "3", "4", "5", "6", "7", "8"],
  pattern: ["B", "", "x", "", "", "x", "x", "x"],
  strumming: ["↓", "↑", "↓", "↑", "↓", "↑", "↓", "↑"],
};

function seedDatabase() {
  // SONG
  db.run(
    `
    INSERT INTO songs (title, artist, capo)
    VALUES (?, ?, ?)
  `,
    ["Partons vite", "Kaolin", 3],
    function (err) {
      if (err) return console.error(err);

      const songId = this.lastID;

      // GROOVE
      db.run(
        `
        INSERT INTO groove
        (song_id, beats, pattern, strumming)
        VALUES (?, ?, ?, ?)
      `,
        [
          songId,
          JSON.stringify(grooveSeed.beats),
          JSON.stringify(grooveSeed.pattern),
          JSON.stringify(grooveSeed.strumming),
        ],
      );

      const progressionIds = [];
      let completed = 0;

      // PROGRESSIONS
      progressionSeed.forEach((p, index) => {
        db.run(
          `
          INSERT INTO progressions
          (
            song_id,
            label,
            position,
            theme
          )
          VALUES (?, ?, ?, ?)
        `,
          [songId, p.label, index, p.theme],
          function (err) {
            if (err) return console.error(err);

            const progressionId = this.lastID;
            progressionIds[index] = progressionId;

            // CHORDS
            p.chords.forEach((chord, chordIndex) => {
              db.run(
                `
                INSERT INTO chords
                (progression_id, value, position)
                VALUES (?, ?, ?)
              `,
                [progressionId, chord, chordIndex],
              );
            });

            completed++;

            // LYRICS BLOCKS
            if (completed === progressionSeed.length) {
              lyricsSeed.forEach((block, blockIndex) => {
                db.run(
                  `
                  INSERT INTO lyrics_blocks
                  (
                    song_id,
                    progression_id,
                    content,
                    position,
                    show_chords,
                    mb,
                    display_label
                  )
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                  [
                    songId,
                    progressionIds[block.progressionIndex],
                    block.content,
                    blockIndex,
                    1,
                    4,
                    "short",
                  ],
                );
              });
            }
          },
        );
      });
    },
  );
}

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      capo INTEGER
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS progressions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL,
    label TEXT,
    position INTEGER,
    theme TEXT,

    FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      progression_id INTEGER NOT NULL,
      value TEXT,
      position INTEGER,

      FOREIGN KEY(progression_id) REFERENCES progressions(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lyrics_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER NOT NULL,
      progression_id INTEGER,
      content TEXT,
      position INTEGER,
      show_chords INTEGER DEFAULT 0,
      mb INTEGER DEFAULT 4,
      display_label TEXT DEFAULT 'short',

      FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE,
      FOREIGN KEY(progression_id) REFERENCES progressions(id) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS groove (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER NOT NULL,
      beats TEXT,
      pattern TEXT,
      strumming TEXT,

      FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE
    )
  `);

  db.get("SELECT COUNT(*) as count FROM songs", (err, row) => {
    if (row.count === 0) {
      seedDatabase();
    }
  });

});
module.exports = db;
