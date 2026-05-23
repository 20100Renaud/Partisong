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
  const {
    song_id,
    progression_id,
    content,
    show_chords,
    position,
    mb = 4,
  } = req.body;

  db.run(
    `
    INSERT INTO lyrics_blocks
    (song_id, progression_id, content, show_chords, position, mb)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [song_id, progression_id, content, show_chords, position, mb],
    function (err) {
      if (err) return res.status(500).json(err);

      res.json({
        id: this.lastID,
        song_id,
        progression_id,
        content,
        show_chords,
        position,
        mb,
      });
    },
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.prepare("DELETE FROM lyrics_blocks WHERE id = ?").run(id);

  res.json({ success: true });
});

module.exports = router;
