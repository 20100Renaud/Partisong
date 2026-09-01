const router = require("express").Router();
const db = require("../database/db");

router.patch("/:songId", (req, res) => {
  const { songId } = req.params;
  const { beats, pattern, strumming } = req.body;

  db.run(
    `
    UPDATE groove
    SET beats = ?, pattern = ?, strumming = ?
    WHERE song_id = ?
  `,
    [
      JSON.stringify(beats),
      JSON.stringify(pattern),
      JSON.stringify(strumming),
      songId,
    ],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    },
  );
});

module.exports = router;
