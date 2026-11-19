import { useMemo, useState } from "react";
import { Badge, Chip, Empty, PageHead, SearchField, Sheet } from "../components/ui.jsx";
import { Doc, Download, MapIcon, Check } from "../components/Icons.jsx";
import { disciplines, toposGroupes as topos } from "../data/index.js";
import { useLocalStorage } from "../lib/store.js";

export default function Topos() {
  const [q, setQ] = useState("");
  const [discipline, setDiscipline] = useState(null);
  const [detail, setDetail] = useState(null);
  const [horsLigne, setHorsLigne] = useLocalStorage("sp_topos_offline", []);

  const liste = useMemo(() => {
    const t = q.trim().toLowerCase();
    return topos.filter((topo) => {
      const okD = !discipline || topo.discipline === discipline;
      const okQ =
        !t || [topo.name, topo.region, topo.country, topo.city, topo.discipline].join(" ").toLowerCase().includes(t);
      return okD && okQ;
    });
  }, [q, discipline]);

  const basculerHorsLigne = (id) =>
    setHorsLigne(horsLigne.includes(id) ? horsLigne.filter((x) => x !== id) : [...horsLigne, id]);

  return (
    <>
      <PageHead title="Sus'Topos" subtitle="Bibliothèque des cavités" />

      <SearchField
        value={q}
        onChange={setQ}
        placeholder="Nom de grotte, pays, commune…"
        label="Rechercher un topo"
      />

      <div className="filters" role="group" aria-label="Filtrer par discipline">
        <Chip active={!discipline} onClick={() => setDiscipline(null)}>
          Toutes
        </Chip>
        {disciplines.map((d) => (
          <Chip
            key={d.id}
            active={discipline === d.name}
            color={d.color}
            onClick={() => setDiscipline(discipline === d.name ? null : d.name)}
          >
            {d.name}
          </Chip>
        ))}
      </div>

      <p className="hint" role="status" style={{ marginBottom: 12 }}>
        {liste.length} cavité{liste.length > 1 ? "s" : ""} · {horsLigne.length} téléchargée
        {horsLigne.length > 1 ? "s" : ""} pour le hors-ligne
      </p>

      {liste.length === 0 ? (
        <Empty>Aucun topo ne correspond à cette recherche.</Empty>
      ) : (
        <>
          <ul className="list">
            {liste.slice(0, 20).map((t) => (
              <li key={t.id}>
                <button type="button" className="row" onClick={() => setDetail(t)}>
                  <span className="row-avatar" aria-hidden="true" style={{ color: t.disciplineColor }}>
                    <MapIcon width={20} height={20} />
                  </span>
                  <span className="row-main">
                    <span className="row-title">
                      {t.name}
                      {horsLigne.includes(t.id) && (
                        <Check width={14} height={14} style={{ color: "var(--ok)" }} aria-label="Disponible hors-ligne" />
                      )}
                    </span>
                    <span className="row-sub">
                      {[t.region, t.country].filter(Boolean).join(" · ")}
                      {t.documentTypes.length ? ` · ${t.documentTypes.length} doc.` : ""}
                    </span>
                    <span className="tag-list">
                      {t.documentTypes.slice(0, 4).map((d) => (
                        <span className="tag" key={d}>
                          {d}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="row-meta">
                    <span className="row-count">{t.documentTypes.length}</span>
                    <span className="row-count-sub">doc.</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {liste.length > 20 && (
            <p className="hint" style={{ textAlign: "center", marginTop: 14 }}>
              Affichage des 20 premiers résultats sur {liste.length}. Affinez la recherche pour voir les autres.
            </p>
          )}
        </>
      )}

      <Sheet
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name}
        subtitle={detail ? [detail.region, detail.country].filter(Boolean).join(" · ") : ""}
      >
        {detail && (
          <>
            <div className="tag-list" style={{ marginTop: 0 }}>
              {detail.discipline && <Badge tone="info">{detail.discipline}</Badge>}
              {detail.depth && <Badge tone="neutral">{detail.depth}</Badge>}
              {detail.development && <Badge tone="neutral">{detail.development}</Badge>}
            </div>

            <div className="section-title">
              <h2>Documents</h2>
              <span>{detail.documents.length}</span>
            </div>

            {detail.documents.length === 0 ? (
              <Empty>Pas encore de document joint à cette cavité.</Empty>
            ) : (
              <ul className="list">
                {detail.documents.map((d) => (
                  <li key={d} className="row" style={{ cursor: "default" }}>
                    <span className="row-avatar" aria-hidden="true">
                      <Doc width={18} height={18} />
                    </span>
                    <span className="row-main">
                      <span className="row-title">{d}</span>
                      <span className="row-sub">PDF — démonstration</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className={`btn btn--block ${horsLigne.includes(detail.id) ? "" : "btn--primary"}`}
              style={{ marginTop: 16 }}
              onClick={() => basculerHorsLigne(detail.id)}
            >
              <Download width={17} height={17} />
              {horsLigne.includes(detail.id) ? "Retirer du hors-ligne" : "Télécharger pour le hors-ligne"}
            </button>
            <p className="hint" style={{ textAlign: "center", marginTop: 10 }}>
              Sert dans une cavité sans réseau : le topo reste consultable même sans connexion.
            </p>
          </>
        )}
      </Sheet>
    </>
  );
}
