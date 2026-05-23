const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL SONGS
router.get("/", (req, res) => {
  db.all(
    `
    SELECT *
    FROM songs
    ORDER BY id DESC
    `,
    [],
    (err, songs) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.json(songs);
    },
  );
});

// GET SONG BY ID
router.get("/:id", (req, res) => {
  const songId = req.params.id;

  db.get(`SELECT * FROM songs WHERE id = ?`, [songId], (err, song) => {
    if (err) return res.status(500).json(err);
    if (!song) return res.status(404).json({ error: "Song not found" });

    db.all(
      `SELECT * FROM progressions WHERE song_id = ? ORDER BY position`,
      [songId],
      (err, progressions) => {
        if (err) return res.status(500).json(err);

        db.all(
          `SELECT * FROM chords WHERE progression_id IN
          (SELECT id FROM progressions WHERE song_id = ?)`,
          [songId],
          (err, chords) => {
            if (err) return res.status(500).json(err);

            db.all(
              `SELECT * FROM lyrics_blocks WHERE song_id = ? ORDER BY position`,
              [songId],
              (err, lyricsBlocks) => {
                if (err) return res.status(500).json(err);

                db.get(
                  `SELECT * FROM groove WHERE song_id = ?`,
                  [songId],
                  (err, grooveRow) => {
                    if (err) return res.status(500).json(err);

                    // Build progression map
                    const progressionMap = new Map(
                      progressions.map((p) => [
                        p.id,
                        { ...p, chords: [], lyricsBlocks: [] },
                      ]),
                    );

                    // attach chords
                    chords.forEach((c) => {
                      const p = progressionMap.get(c.progression_id);
                      if (p) {
                        p.chords.push({
                          id: c.id,
                          value: c.value,
                          position: c.position,
                        });
                      }
                    });

                    // attach lyrics blocks
                    lyricsBlocks.forEach((l) => {
                      const p = progressionMap.get(l.progression_id);
                      if (p) {
                        p.lyricsBlocks.push(l);
                      }
                    });

                    // finalize
                    const enrichedProgressions = Array.from(
                      progressionMap.values(),
                    ).map((p) => ({
                      ...p,
                      chords: p.chords.sort((a, b) => a.position - b.position),
                      lyricsBlocks: p.lyricsBlocks.sort(
                        (a, b) => a.position - b.position,
                      ),
                    }));

                    res.json({
                      ...song,
                      progressions: enrichedProgressions,
                      groove: grooveRow
                        ? {
                            ...grooveRow,
                            beats: JSON.parse(grooveRow.beats || "[]"),
                            pattern: JSON.parse(grooveRow.pattern || "[]"),
                            strumming: JSON.parse(grooveRow.strumming || "[]"),
                          }
                        : {
                            beats: [],
                            pattern: [],
                            strumming: [],
                          },
                    });
                  },
                );
              },
            );
          },
        );
      },
    );
  });
});

// Update specifics part of a song
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { title, artist, capo } = req.body;

  db.run(
    `UPDATE songs SET title = ?, artist = ?, capo = ? WHERE id = ?`,
    [title, artist, capo, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    },
  );
});

// Create a new song
router.post("/", (req, res) => {
  const { title, artist, capo } = req.body;

  const grooveSeed = {
    beats: ["1", "2", "3", "4", "5", "6", "7", "8"],
    pattern: ["B", "", "x", "", "", "x", "x", "x"],
    strumming: ["↓", "↑", "↓", "↑", "↓", "↑", "↓", "↑"],
  };

  db.run(
    `
    INSERT INTO songs (title, artist, capo)
    VALUES (?, ?, ?)
    `,
    [title || "New Song", artist || "Artist", capo ?? 0],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      const songId = this.lastID;

      // Create default groove
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
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
          }

          res.json({
            id: songId,
            title,
            artist,
            capo,
            groove: grooveSeed,
          });
        },
      );
    },
  );
});

// Delete song
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM songs WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ success: true });
  });
});

module.exports = router;
