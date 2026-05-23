const router = require("express").Router();
const db = require("../database/db");


// UPDATE progression
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const sql = `
    UPDATE progressions
    SET ${keys.map((k) => `${k} = ?`).join(", ")}
    WHERE id = ?
  `;

  db.run(sql, [...values, id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ updated: this.changes });
  });
});

// CREATE new progression
router.post("/", (req, res) => {
  const {
    song_id,
    label,
    position,
    theme,
    chordCount,
  } = req.body;

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
    [song_id, label, position, theme],
    function (err) {
      if (err) return res.status(500).json(err);

      const id = this.lastID;

      // create empty chords
      const stmt = db.prepare(`
        INSERT INTO chords (progression_id, value, position)
        VALUES (?, ?, ?)
      `);

      const count = chordCount || 4;

      for (let i = 0; i < count; i++) {
        stmt.run(id, "", i);
      }

      stmt.finalize(() => {
        db.all(
          `
          SELECT id, value, position
          FROM chords
          WHERE progression_id = ?
          ORDER BY position
          `,
          [id],
          (err, rows) => {
            if (err) return res.status(500).json(err);

            res.json({
              id,
              song_id,
              label,
              position,
              theme,
              chords: rows,
            });
          },
        );
      });
    },
  );
});

//Delete progression
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.prepare("DELETE FROM progressions WHERE id = ?").run(id);

  res.json({ success: true });
});

module.exports = router;
