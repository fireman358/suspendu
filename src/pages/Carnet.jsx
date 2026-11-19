import { Link } from "react-router-dom";
import { PageHead, Empty, Badge } from "../components/ui.jsx";
import { ArrowRight, Book, Calendar, Mountain, Plus } from "../components/Icons.jsx";
import { formatDate, sorties } from "../data/index.js";
import { useLocalStorage } from "../lib/store.js";

export default function Carnet() {
  const [entrees] = useLocalStorage("sp_carnet", []);
  const heures = entrees.reduce((s, e) => s + (Number(e.duree) || 0), 0);

  return (
    <>
      <PageHead title="Mon carnet spéléo" subtitle="Sorties et camps personnels" />

      <div className="stats" style={{ marginBottom: 18 }}>
        <div className="stat">
          <b>{entrees.length}</b>
          <span>sorties</span>
        </div>
        <div className="stat">
          <b>{entrees.length ? heures : 0}</b>
          <span>heures sous terre</span>
        </div>
        <div className="stat">
          <b>{entrees.filter((e) => e.discipline === "Canyoning").length}</b>
          <span>canyons</span>
        </div>
      </div>

      <div className="action-stack">
        <Link className="action-card action-card--primary" to="/carnet/nouvelle">
          <span className="action-icon">
            <Plus />
          </span>
          <span className="row-main">
            <span className="action-title">Ajouter une sortie</span>
            <span className="action-sub">Sortie ancienne ou hors-club</span>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>

        <Link className="action-card" to="/sorties">
          <span className="action-icon">
            <Mountain />
          </span>
          <span className="row-main">
            <span className="action-title">Sorties du club</span>
            <span className="action-sub">{sorties.length} comptes rendus à parcourir</span>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>

      <div className="section-title">
        <h2>Mes entrées</h2>
        <span>{entrees.length}</span>
      </div>

      {entrees.length === 0 ? (
        <Empty>
          Votre carnet est vide. Ajoutez une première sortie — même ancienne — pour retrouver vos heures et vos
          cavités.
        </Empty>
      ) : (
        <ul className="list">
          {entrees.map((e) => (
            <li key={e.id} className="row" style={{ cursor: "default" }}>
              <span className="row-avatar" aria-hidden="true">
                <Book width={19} height={19} />
              </span>
              <span className="row-main">
                <span className="row-title">{e.grotte}</span>
                <span className="row-sub">
                  <Calendar width={12} height={12} style={{ verticalAlign: "-2px" }} aria-hidden="true" />{" "}
                  {formatDate(e.date)} · {e.discipline} · {e.duree} h
                </span>
              </span>
              <Badge tone="neutral">{e.role}</Badge>
            </li>
          ))}
        </ul>
      )}

      <p className="hint" style={{ marginTop: 16 }}>
        Vos entrées sont enregistrées sur cet appareil et restent accessibles hors-ligne.
      </p>
    </>
  );
}
