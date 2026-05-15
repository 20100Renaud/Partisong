const router = require("express").Router();
const db = require("../database/db");

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const keys = Object.keys(fields);
  const values = Object.values(fields);

  const sql = `
    UPDATE lyrics_blocks
    SET ${keys.map((k) => `${k} = ?`).join(", ")}
    WHERE id = ?
  `;

  db.run(sql, [...values, id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ updated: this.changes });
  });
});

router.post("/", (req, res) => {
  const { song_id, progression_id, content, show_chords, position } = req.body;

  db.run(
    `
    INSERT INTO lyrics_blocks
    (song_id, progression_id, content, show_chords, position)
    VALUES (?, ?, ?, ?, ?)
    `,
    [song_id, progression_id, content, show_chords, position],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        song_id,
        progression_id,
        content,
        show_chords,
        position,
      });
    },
  );
});

module.exports = router;
