import { useMemo, useState } from "react";
import { Badge, Chip, Empty, PageHead, Sheet } from "../components/ui.jsx";
import { Doc, Download } from "../components/Icons.jsx";
import { themes } from "../data/index.js";

export default function School() {
  const [theme, setTheme] = useState(null);
  const [detail, setDetail] = useState(null);

  const docs = useMemo(() => {
    const base = theme ? themes.find((t) => t.id === theme)?.documents || [] : themes.flatMap((t) => t.documents);
    return base;
  }, [theme]);

  return (
    <>
      <PageHead title="Sus'School" subtitle="Ressources de formation" />

      <div className="filters" role="group" aria-label="Filtrer par thème">
        <Chip active={!theme} onClick={() => setTheme(null)}>
          Tous les thèmes
        </Chip>
        {themes.map((t) => (
          <Chip key={t.id} active={theme === t.id} onClick={() => setTheme(theme === t.id ? null : t.id)}>
            {t.name}
          </Chip>
        ))}
      </div>

      <p className="hint" role="status" style={{ marginBottom: 12 }}>
        {docs.length} document{docs.length > 1 ? "s" : ""}
      </p>

      {docs.length === 0 ? (
        <Empty>Aucun document dans ce thème pour l'instant.</Empty>
      ) : (
        <ul className="list">
          {docs.map((d) => (
            <li key={d.id}>
              <button type="button" className="row" onClick={() => setDetail(d)}>
                <span className="row-avatar" aria-hidden="true">
                  <Doc width={19} height={19} />
                </span>
                <span className="row-main">
                  <span className="row-title">{d.title}</span>
                  <span className="row-sub">
                    {d.discipline || "Général"}
                    {d.documents.length ? ` · ${d.documents.length} fichier(s)` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.title} subtitle={detail?.discipline}>
        {detail && (
          <>
            <p style={{ color: "#d5d5da", lineHeight: 1.6 }}>
              {detail.description || "Pas de description pour ce document."}
            </p>
            <div className="section-title">
              <h2>Fichiers</h2>
            </div>
            <ul className="list">
              {detail.documents.map((f) => (
                <li key={f} className="row" style={{ cursor: "default" }}>
                  <span className="row-avatar" aria-hidden="true">
                    <Doc width={18} height={18} />
                  </span>
                  <span className="row-main">
                    <span className="row-title">{f}</span>
                    <span className="row-sub">Démonstration : fichier non inclus</span>
                  </span>
                </li>
              ))}
            </ul>
            <Badge tone="neutral">
              <Download width={12} height={12} /> Les documents ne sont pas redistribués dans la démo
            </Badge>
          </>
        )}
      </Sheet>
    </>
  );
}
