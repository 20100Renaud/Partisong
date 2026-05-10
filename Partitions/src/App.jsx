import LyricsBlock from "./LyricsBlock";
import { progression } from "./progression";

export default function App() {
  const counts = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const pattern = ["B", "", "x", "", "", "x", "x", "x"];
  const rhythm = ["↓", "↑", "↓", "↑", "↓", "↑", "↓", "↑"];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-10">
      <div
        className="
          w-[794px]
          h-[1123px]
          bg-white
          shadow-2xl
          border
          border-zinc-200
          overflow-hidden
        "
      >
        {/* Header */}
        <section className="flex p-12 gap-12">
          {/* LEFT : Title + Artist */}
          <div className="flex-none">
            <h1 className="text-4xl font-bold">Partons vite</h1>
            <p className="text-zinc-700 text-right mr-4">Kaolin</p>
          </div>
          {/* RIGHT : Helper */}
          <div className="flex-1">
            <div className="flex border gap-4 flex justify-around rounded-lg p-6">
              {/* Left side of HELPER */}
              <div className="flex flex-col">
                {/* Capo */}
                <div className="font-bold -translate-y-3 text-center px-2">
                  <span>⸻</span>
                  <span className="border rounded-xl px-1">Capo 3</span>
                  <span>⸻</span>
                </div>

                {/* Rhythm */}
                <div className="flex-1 flex items-center">
                  <div className="font-bold">
                    {/* counts */}
                    <div className="px-3">
                      <div className="grid grid-cols-8 gap-2 text-center">
                        {counts.map((n) => (
                          <div key={n}>{n}</div>
                        ))}
                      </div>
                    </div>

                    {/* pattern */}
                    <div className="bg-black text-white rounded-lg px-3">
                      <div className="grid grid-cols-8 gap-2 -mb-1 text-center">
                        {pattern.map((v, i) => (
                          <div key={i}>{v}</div>
                        ))}
                      </div>
                    </div>

                    {/* rhythm */}
                    <div className="px-3">
                      <div className="grid grid-cols-8 gap-2 text-xl text-center">
                        {rhythm.map((v, i) => (
                          <div key={i}>{v}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side of HELPER */}
              <div className="space-y-0 text-left justify-items-start">
                {/* Progression */}
                <section>
                  {progression
                    .filter((row) => row.id !== "Intro")
                    .map((row, i) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[100px_1fr] items-center"
                      >
                        {/* label / index */}
                        <div
                          className={`font-bold text-right mr-4 ${row.textColor}`}
                        >
                          {row.label} {row.id}
                        </div>

                        {/* chords */}
                        <div className="grid grid-cols-4 text-center gap-4">
                          {row.chords.map((chord, j) => (
                            <div key={j}>{chord}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Lyrics */}
        <section className="flex text-sm leading-5 gap-8">
          {/* Column #1 */}
          <div className="flex flex-col pl-12 gap-8">
            <div>
              <LyricsBlock id="Intro">
              </LyricsBlock>
            </div>
            <div>
              <LyricsBlock id="1">
                Allez danse, danse, vient dans mes bras,
                <br />
                Allez tourne, tourne, reste avec moi,
                <br />
                Allez partons vite si tu veux bien, dès le jour,
              </LyricsBlock>

              <LyricsBlock id="2">
                Le soleil brille très haut tu sais,
                <br />
                Mais j'aime ça, je t'attendais
                <br />
                Alors partons vite si tu veux bien, Sans retour...
              </LyricsBlock>
            </div>

            <div>
              <LyricsBlock id="1">
                Rit plus fort et parle-moi
                <br />
                de nos projets, nos rêves tout ça
                <br />
                Donne-moi la main, embrasse-moi, mon amour
              </LyricsBlock>

              <LyricsBlock id="2">
                Le temps comme ami, moi je veux bien
                <br />
                Mais les amis ça va, ça vient,
                <br />
                Alors partons vite brûler le jour et la nuit
              </LyricsBlock>
            </div>

            <div>
              <LyricsBlock id="3">
                Evidemment, tu l'aimes encore,
                <br />
                Je le vois bien tu sais,
                <br />
                et puis alors?
              </LyricsBlock>

              <LyricsBlock id="4">
                Mais pour l'instant ferme tes yeux,
                <br />
                passe ta main dans mes cheveux...
              </LyricsBlock>
            </div>

            <div className="flex gap-6">
              <LyricsBlock id="1">Lalala</LyricsBlock>
              <LyricsBlock id="2">Lalala</LyricsBlock>
            </div>

            <div>
              <LyricsBlock id="1">
                Je veux entendre, ton cœur qui bat,
                <br />
                tu sais, je crois qu'il chante pour moi
                <br />
                Mais en douceur comme ça tout bas, comme un sourd
              </LyricsBlock>

              <LyricsBlock id="2">
                Mon cœur lui s'emballe, il vole haut,
                <br />
                peut être un peut trop haut pour moi
                <br />
                Mais je m'en fous, je suis vivant pour de bon
              </LyricsBlock>
            </div>
          </div>
          {/* Column #2 */}
          <div className="flex flex-col  gap-8">
            <div>
              <LyricsBlock id="1">
                Allez danse, danse, regarde-moi
                <br />
                Allez tourne, tourne, ne t'arrête pas
                <br />
                Allez partons vite, si tu veux bien, dès le jour
              </LyricsBlock>

              <LyricsBlock id="2">
                Le soleil brille, profitons-en
                <br />
                Je t'attendrai, je t'aime tant
                <br />
                Alors vas-t'en vite si tu veux bien, sans retour
              </LyricsBlock>
            </div>
            <div>
              <LyricsBlock id="3">
                Evidemment, tu l'aimes encore,
                <br />
                Ça crève les yeux mon dieu,
                <br />
                Tu l'aimes encore
              </LyricsBlock>

              <LyricsBlock id="4">
                Mais pour l'instant ferme tes yeux,
                <br />
                passe ta main dans mes cheveux
              </LyricsBlock>
            </div>
            <div className="flex gap-6">
              <LyricsBlock id="1">Lalala</LyricsBlock>
              <LyricsBlock id="2">Sifle</LyricsBlock>
            </div>
            <div className="m">
              <LyricsBlock id="1">
                Allez danse mon amour! Allez danse!
                <br />
                Faisons de nos enfants des droits!
              </LyricsBlock>

              <LyricsBlock id="2">
                Fais tourner le monde mon amour,
                <br />
                fait tourner le monde
              </LyricsBlock>
            </div>
            <div>
              <LyricsBlock id="1">
                Allez danse, danse, retourne-toi
                <br />
                Allez tourne, tourne, ne t'arrête pas
                <br />
                Allez partons vite, si tu veux bien, dès le jour
              </LyricsBlock>

              <LyricsBlock id="2">
                J'ai manqué d'air je m'en souviens,
                <br />
                Toutes ses années sans toi sans rien
                <br />
                Même mes chansons se baladaient le cœur lourd
              </LyricsBlock>
            </div>
            <div>
              <LyricsBlock id="1">
                Evidemment, tu l'aimes encore,
                <br />
                Ça crève les yeux mon dieu,
                <br />
                ça crève les yeux mon dieu Mon dieu...
              </LyricsBlock>
            </div>
            <div className="-mb-8">
              <LyricsBlock id="1">Lalala</LyricsBlock>
            </div>
            ⟶ C
          </div>
        </section>
      </div>
    </div>
  );
}
