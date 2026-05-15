import LyricsBlock from "./LyricsBlock";

export default function Lyrics() {
  return (
    <section className="flex text-sm leading-5 gap-8">
      {/* Column #1 */}
      <div className="flex flex-col pl-12 gap-8">
        <div>
          <LyricsBlock id="Intro"></LyricsBlock>
        </div>
        <div>
          <LyricsBlock id="1">
            Allez <b>dan</b>se, danse, vient dans mes bras,
            <br />
            Allez <b>tour</b>ne, tourne, reste avec moi,
            <br />
            Allez <b>par</b>tons vite si tu veux bien, dès <b>le</b> jour,
          </LyricsBlock>

          <LyricsBlock id="2">
            Le <b>so</b>leil brille très haut tu sais,
            <br />
            Mais <b>j'ai</b>me ça, je t'attendais
            <br />
            Alors <b>par</b>tons vite si tu veux bien, Sans <b>re</b>tour...
          </LyricsBlock>
        </div>

        <div>
          <LyricsBlock id="1">
            <b>Rit</b> plus fort et parle-moi
            <br />
            de <b>nos</b> projets, nos rêves tout ça
            <br />
            Donne-<b>moi</b> la main, embrasse-moi, mon <b>a</b>mour
          </LyricsBlock>

          <LyricsBlock id="2">
            Le <b>temps</b> comme ami, moi je veux bien
            <br />
            Mais <b>les</b> amis ça va, ça vient,
            <br />
            Alors <b>par</b>tons vite brûler le jour et <b>la</b> nuit
          </LyricsBlock>
        </div>

        <div>
          <LyricsBlock id="3">
            Evidem<b>ment</b>, tu l'aimes en<b>core</b>,
            <br />
            Je le <b>vois</b> bien tu sais,
            <br />
            et puis al<b>ors</b>?
          </LyricsBlock>

          <LyricsBlock id="4">
            Mais <b>pour</b> l'instant ferme tes yeux,
            <br />
            pas<b>se</b> ta main dans mes che<b>veux</b>...
          </LyricsBlock>
        </div>

        <div className="flex gap-6">
          <LyricsBlock id="1">Lalala</LyricsBlock>
          <LyricsBlock id="2">Lalala</LyricsBlock>
        </div>

        <div>
          <LyricsBlock id="1">
            Je <b>veux</b> entendre, ton cœur qui bat,
            <br />
            tu <b>sais</b>, je crois qu'il chante pour moi
            <br />
            Mais <b>en</b> douceur comme ça tout bas, comme <b>un</b> sourd
          </LyricsBlock>

          <LyricsBlock id="2">
            Mon <b>cœur</b> lui s'emballe, il vole haut,
            <br />
            peut <b>être</b> un peut trop haut pour moi
            <br />
            Mais <b>je</b> m'en fous, je suis vivant pour <b>de</b> bon
          </LyricsBlock>
        </div>
      </div>
      {/* Column #2 */}
      <div className="flex flex-col  gap-8">
        <div>
          <LyricsBlock id="1">
            Allez <b>dan</b>se, danse, regarde-moi
            <br />
            Allez <b>tour</b>ne, tourne, ne t'arrête pas
            <br />
            Allez <b>par</b>tons vite, si tu veux bien, dès <b>le</b> jour
          </LyricsBlock>

          <LyricsBlock id="2">
            Le <b>soleil</b> brille, profitons-en
            <br />
            Je <b>t'at</b>tendrai, je t'aime tant
            <br />
            Alors <b>vas</b>-t'en vite si tu veux bien, sans <b>re</b>tour
          </LyricsBlock>
        </div>
        <div>
          <LyricsBlock id="3">
            Evidem<b>ment</b>, tu l'aimes en<b>core</b>,
            <br />
            Ça <b>crè</b>ve les yeux mon dieu,
            <br />
            Tu l'aimes en<b>core</b>
          </LyricsBlock>

          <LyricsBlock id="4">
            Mais <b>pour</b> l'instant ferme tes yeux,
            <br />
            pas<b>se</b> ta main dans mes cheveux
          </LyricsBlock>
        </div>
        <div className="flex gap-6">
          <LyricsBlock id="1">Lalala</LyricsBlock>
          <LyricsBlock id="2">Siffle</LyricsBlock>
        </div>
        <div>
          <LyricsBlock id="1">
            <i>
              "Allez danse mon amour! Allez danse!
              <br />
              Faisons de nos enfants des droits!"
            </i>
          </LyricsBlock>

          <LyricsBlock id="2">
            <i>
              "Fais tourner le monde mon amour,
              <br />
              fait tourner le monde!"
            </i>
          </LyricsBlock>
        </div>
        <div>
          <LyricsBlock id="1">
            Allez <b>dan</b>se, danse, retourne-toi
            <br />
            Allez <b>tour</b>ne, tourne, ne t'arrête pas
            <br />
            Allez <b>par</b>tons vite, si tu veux bien, dès <b>le</b> jour
          </LyricsBlock>

          <LyricsBlock id="2">
            J'ai <b>man</b>qué d'air je m'en souviens,
            <br />
            Toutes <b>ses</b> années sans toi sans rien
            <br />
            Même <b>mes</b> chansons se baladaient le <b>cœur</b> lourd
          </LyricsBlock>
        </div>
        <div>
          <LyricsBlock id="1">
            Evidem<b>ment</b>, tu l'aimes en<b>core</b>,
            <br />
            Ça <b>crè</b>ve les yeux mon dieu,
            <br />
            Ça <b>crè</b>ve les yeux mon dieu, mon <b>dieu</b>...
          </LyricsBlock>
        </div>
        <div className="-mb-8">
          <LyricsBlock id="1">Lalala</LyricsBlock>
        </div>
        ⟶ C
      </div>
    </section>
  );
}
