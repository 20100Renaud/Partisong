const router = require("express").Router();
const db = require("../database/db");

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  db.run(
    `UPDATE chords SET value = ? WHERE id = ?`,
    [value, id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    },
  );
});

module.exports = router;
