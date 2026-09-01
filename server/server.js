const express = require("express");
const cors = require("cors");

const songsRoutes = require("./routes/songs");
const progressionsRoutes = require("./routes/progressions");
const chordsRoutes = require("./routes/chords");
const lyricsBlocksRoutes = require("./routes/lyricsBlocks");
const grooveRoutes = require("./routes/groove");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/songs", songsRoutes);
app.use("/api/progressions", progressionsRoutes);
app.use("/api/chords", chordsRoutes);
app.use("/api/lyrics-blocks", lyricsBlocksRoutes);
app.use("/api/groove", grooveRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
