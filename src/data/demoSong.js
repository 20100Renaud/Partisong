export const demoSongs = [
  {
    id: 1,
    title: "Partons vite",
    artist: "Kaolin",
    capo: 3,

    groove: {
      beats: ["1", "2", "3", "4", "5", "6", "7", "8"],
      pattern: ["B", "", "x", "", "", "x", "x", "x"],
      strumming: ["↓", "↑", "↓", "↑", "↓", "↑", "↓", "↑"],
    },

    progressions: [
      {
        id: 1,
        label: "Intro",
        position: 0,
        theme: "yellow",
        chords: [
          { id: 1, value: "C", position: 0 },
          { id: 2, value: "Em", position: 1 },
          { id: 3, value: "Am", position: 2 },
          { id: 4, value: "Gx2", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 1,
            progression_id: 1,
            content: "",
            position: 0,
            show_chords: 1,
            mb: 4,
            display_label: "full",
          },
        ],
      },

      {
        id: 2,
        label: "Verse 1",
        position: 1,
        theme: "red",
        chords: [
          { id: 5, value: "C", position: 0 },
          { id: 6, value: "Em", position: 1 },
          { id: 7, value: "Am", position: 2 },
          { id: 8, value: "G", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 2,
            progression_id: 2,
            content:
              "Allez <b>dan</b>se, danse, <b>vient </b>dans mes bras, Allez <b>tour</b>ne, tourne, reste avec moi, Allez <b>par</b>tons vite si tu veux bien, dès <b>le</b> jour,",
            position: 1,
            show_chords: 0,
            mb: 0,
            display_label: "short",
          },
        ],
      },

      {
        id: 3,
        label: "Verse 2",
        position: 2,
        theme: "red",
        chords: [
          { id: 9, value: "Dm", position: 0 },
          { id: 10, value: "G", position: 1 },
          { id: 11, value: "Am", position: 2 },
          { id: 12, value: "G", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 3,
            progression_id: 3,
            content:
              "Le <b>so</b>leil brille très haut tu sais, Mais <b>j'ai</b>me ça, je t'attendais Alors <b>par</b>tons vite si tu veux bien, Sans <b>re</b>tour...",
            position: 2,
            show_chords: 0,
            mb: 4,
            display_label: "short",
          },
        ],
      },

      {
        id: 4,
        label: "Verse 1",
        position: 3,
        theme: "red",
        chords: [
          { id: 13, value: "Am", position: 0 },
          { id: 14, value: "Em", position: 1 },
          { id: 15, value: "Am", position: 2 },
          { id: 16, value: "Em", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 4,
            progression_id: 4,
            content:
              "<b>Rit</b> plus fort et parle-moi de <b>nos</b> projets, nos rêves tout ça Donne-<b>moi</b> la main, embrasse-moi, mon <b>a</b>mour",
            position: 4,
            show_chords: 0,
            mb: 0,
            display_label: "short",
          },
        ],
      },

      {
        id: 5,
        label: "Verse 2",
        position: 4,
        theme: "red",
        chords: [
          { id: 17, value: "Dm", position: 0 },
          { id: 18, value: "G", position: 1 },
          { id: 19, value: "G", position: 2 },
          { id: 20, value: "GG", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 5,
            progression_id: 5,
            content:
              "Le <b>temps</b> comme ami, moi je veux bien Mais <b>les</b> amis ça va, ça vient, Alors <b>par</b>tons vite <b>brû</b>ler le jour et <b>la</b> nuit",
            position: 5,
            show_chords: 0,
            mb: 4,
            display_label: "short",
          },
        ],
      },

      {
        id: 6,
        label: "Bridge 1",
        position: 6,
        theme: "bleu",
        chords: [
          { id: 17, value: "Dm", position: 0 },
          { id: 18, value: "G", position: 1 },
          { id: 19, value: "G", position: 2 },
          { id: 20, value: "GG", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 6,
            progression_id: 6,
            content:
              "Le <b>temps</b> comme ami, moi je veux bien Mais <b>les</b> amis ça va, ça vient, Alors <b>par</b>tons vite <b>brû</b>ler le jour et <b>la</b> nuit",
            position: 6,
            show_chords: 0,
            mb: 0,
            display_label: "short",
          },
        ],
      },

      {
        id: 7,
        label: "Bridge 2",
        position: 7,
        theme: "purple",
        chords: [
          { id: 17, value: "Dm", position: 0 },
          { id: 18, value: "G", position: 1 },
          { id: 19, value: "G", position: 2 },
          { id: 20, value: "GG", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 7,
            progression_id: 7,
            content:
              "Mais <b>pour</b> l'instant ferme tes yeux, pas<b>se</b> ta main dans mes che<b>veux</b>...",
            position: 7,
            show_chords: 0,
            mb: 4,
            display_label: "short",
          },
        ],
      },

      {
        id: 8,
        label: "Verse 1",
        position: 8,
        theme: "red",
        chords: [
          { id: 17, value: "Dm", position: 0 },
          { id: 18, value: "G", position: 1 },
          { id: 19, value: "G", position: 2 },
          { id: 20, value: "GG", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 8,
            progression_id: 8,
            content: "Lalala",
            position: 8,
            show_chords: 0,
            mb: 0,
            display_label: "short",
          },
        ],
      },

      {
        id: 9,
        label: "Verse 2",
        position: 9,
        theme: "red",
        chords: [
          { id: 17, value: "Dm", position: 0 },
          { id: 18, value: "G", position: 1 },
          { id: 19, value: "G", position: 2 },
          { id: 20, value: "GG", position: 3 },
        ],
        lyricsBlocks: [
          {
            id: 9,
            progression_id: 9,
            content: "Lalala",
            position: 9,
            show_chords: 0,
            mb: 4,
            display_label: "short",
          },
        ],
      },


    ],
  },
];
