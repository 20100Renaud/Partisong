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

const progressionSeed = [
  {
    label: "Intro",
    textColor: "text-black",
    borderColor: "border-red-500",
    bgColor: "bg-red-500/10",
    badgeColor: "bg-red-500",
    chords: ["C", "Em", "C", "Em", "Am", "G", "G"],
  },
  {
    label: "Verse",
    textColor: "text-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500/10",
    badgeColor: "bg-red-500",
    chords: ["C", "Em", "Am", "G"],
  },
  {
    label: "Verse",
    textColor: "text-green-600",
    borderColor: "border-green-600",
    bgColor: "bg-green-600/10",
    badgeColor: "bg-green-600",
    chords: ["Dm", "G", "Am", "G"],
  },
  {
    label: "Bridge",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500/10",
    badgeColor: "bg-blue-500",
    chords: ["Am", "Em", "Am", "Em"],
  },
  {
    label: "Outro",
    textColor: "text-purple-500",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-500/10",
    badgeColor: "bg-purple-500",
    chords: ["Dm", "G", "G", "GG"],
  },
];

const grooveSeed = {
  beats: ["1", "2", "3", "4", "5", "6", "7", "8"],
  pattern: ["B", "", "x", "", "", "x", "x", "x"],
  strumming: ["↓", "↑", "↓", "↑", "↓", "↑", "↓", "↑"],
};

function seedDatabase() {
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
            textColor,
            borderColor,
            bgColor,
            badgeColor
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            songId,
            p.label,
            index,
            p.textColor,
            p.borderColor,
            p.bgColor,
            p.badgeColor,
          ],
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
                    show_chords
                  )
                  VALUES (?, ?, ?, ?, ?)
                `,
                  [
                    songId,
                    progressionIds[block.progressionIndex],
                    block.content,
                    blockIndex,
                    1,
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
    song_id INTEGER,
    label TEXT,
    position INTEGER,
    textColor TEXT,
    borderColor TEXT,
    bgColor TEXT,
    badgeColor TEXT,
    FOREIGN KEY(song_id) REFERENCES songs(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      progression_id INTEGER,
      value TEXT,
      position INTEGER,
      FOREIGN KEY(progression_id) REFERENCES progressions(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lyrics_blocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER,
      progression_id INTEGER,
      content TEXT,
      position INTEGER,
      show_chords INTEGER DEFAULT 0,
      FOREIGN KEY(song_id) REFERENCES songs(id),
      FOREIGN KEY(progression_id) REFERENCES progressions(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS groove (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      song_id INTEGER,
      beats TEXT,
      pattern TEXT,
      strumming TEXT,
      FOREIGN KEY(song_id) REFERENCES songs(id)
    )
  `);

  db.get("SELECT COUNT(*) as count FROM songs", (err, row) => {
    if (row.count === 0) {
      seedDatabase();
    }
  });
});
module.exports = db;
