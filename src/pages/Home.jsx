import { Link } from "react-router-dom";
import { TopBar } from "../components/Layout.jsx";
import { Tile } from "../components/ui.jsx";
import { ArrowRight, Calendar, Globe } from "../components/Icons.jsx";
import { materiaux, sorties, topos } from "../data/index.js";

export default function Home() {
  return (
    <>
      <TopBar />

      <Link className="hero" to="/sorties">
        <img src="images/hero-sorties.png" alt="" />
        <span className="hero-content">
          <span className="eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m3 19 6-13 4 8 2-3 6 8z" strokeLinejoin="round" />
            </svg>
            Section
          </span>
          <h1>Sus'Sorties</h1>
          <p>Comptes rendus</p>
          <span className="hero-motto">
            Explorer Partager Progresser
            <span aria-hidden="true" />
          </span>
        </span>
      </Link>

      <div className="grid">
        <Tile to="/matos" img="images/card-matos.png" title="Sus'Matos" subtitle="Emprunts & retours" />
        <Tile to="/topos" img="images/card-topos.png" title="Sus'Topos" subtitle="Cartes & accès" />
        <Tile to="/camps" img="images/card-camp.png" title="Sus'Camp" subtitle="Suivi des camps" />
        <Tile to="/carnet" img="images/card-carnet.png" title="Sus'Carnet" subtitle="Carnet personnel" />
        <Tile to="/school" img="images/card-school.png" title="Sus'School" subtitle="Documents de formation" />
        <Tile
          to="https://www.suspendus.be/agenda"
          external
          img="images/card-agenda.png"
          title="Agenda"
          subtitle="Agenda du club"
        />
      </div>

      <section aria-labelledby="site-titre" style={{ marginTop: 12 }}>
        <h2 id="site-titre" className="sr-only">
          Lien externe
        </h2>
        <a className="site-link" href="https://www.suspendus.be/" target="_blank" rel="noreferrer">
          <span className="tile-icon">
            <Globe width={20} height={20} />
          </span>
          <span className="row-main">
            <span className="row-title">Site Internet</span>
            <span className="row-sub">Découvrir le site du club</span>
          </span>
          <ArrowRight width={18} height={18} aria-hidden="true" />
        </a>
      </section>

      <section aria-labelledby="chiffres">
        <div className="section-title">
          <h2 id="chiffres">Le club en chiffres</h2>
          <span>à ce jour</span>
        </div>
        <div className="stats">
          <div className="stat">
            <b>{sorties.length}</b>
            <span>comptes rendus</span>
          </div>
          <div className="stat">
            <b>{topos.length}</b>
            <span>topos</span>
          </div>
          <div className="stat">
            <b>{materiaux.reduce((s, m) => s + m.total, 0)}</b>
            <span>pièces de matériel</span>
          </div>
        </div>
      </section>

      <p className="footer-quote">— Des cavités aux rencontres —</p>
    </>
  );
}
