import { useMemo, useState } from "react";
import { PageHead, SearchField, Sheet, Empty, Badge } from "../components/ui.jsx";
import { Clock, Mountain, Users } from "../components/Icons.jsx";
import { formatDate, formatDuration, sorties } from "../data/index.js";

export default function Sorties() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const liste = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return sorties;
    return sorties.filter((s) =>
      [s.title, s.cave, s.region, s.country, s.discipline].join(" ").toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <>
      <PageHead
        title="Sus'Sorties"
        subtitle="Comptes rendus du club"
      />

      <SearchField value={q} onChange={setQ} placeholder="Rechercher une cavité, une région…" label="Rechercher une sortie" />

      <p className="hint" role="status" style={{ marginBottom: 12 }}>
        {liste.length} compte{liste.length > 1 ? "s" : ""} rendu{liste.length > 1 ? "s" : ""}
      </p>

      {liste.length === 0 ? (
        <Empty>Aucune sortie ne correspond à « {q} ».</Empty>
      ) : (
        <ul className="list">
          {liste.map((s) => (
            <li key={s.id}>
              <button type="button" className="row" onClick={() => setOpen(s)}>
                <span className="row-avatar" aria-hidden="true">
                  <Mountain width={20} height={20} />
                </span>
                <span className="row-main">
                  <span className="row-title">{s.title}</span>
                  <span className="row-sub">
                    {formatDate(s.date)}
                    {s.region ? ` · ${s.region}` : ""}
                  </span>
                </span>
                <span className="row-meta">
                  <span className="row-count">{s.participants}</span>
                  <span className="row-count-sub">pers.</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open?.title}
        subtitle={open ? `${formatDate(open.date)}${open.region ? " · " + open.region : ""}` : ""}
      >
        {open && (
          <>
            <div className="tag-list" style={{ marginTop: 0 }}>
              <Badge tone="info">{open.discipline || "Spéléo"}</Badge>
              {open.duration > 0 && <Badge tone="neutral">{formatDuration(open.duration)}</Badge>}
              {open.depth && <Badge tone="neutral">{open.depth} m</Badge>}
              {open.development && <Badge tone="neutral">{open.development} m de développement</Badge>}
            </div>

            <p style={{ marginTop: 16, color: "#d5d5da", lineHeight: 1.6 }}>
              {open.content ||
                "Aucun récit n'a été saisi pour cette sortie. Les participants sont listés ci-dessous."}
            </p>

            <div className="section-title">
              <h2>
                <Users width={16} height={16} style={{ verticalAlign: "-3px", marginRight: 6 }} aria-hidden="true" />
                Participants
              </h2>
              <span>{open.participants}</span>
            </div>

            <ul className="list">
              {open.participantsList.map((p, i) => (
                <li key={i} className="row" style={{ cursor: "default" }}>
                  <span className="row-avatar" aria-hidden="true">
                    {p.name.split(" ")[1]}
                  </span>
                  <span className="row-main">
                    <span className="row-title">{p.name}</span>
                    <span className="row-sub">{p.role}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="hint" style={{ marginTop: 14 }}>
              <Clock width={13} height={13} style={{ verticalAlign: "-2px", marginRight: 4 }} aria-hidden="true" />
              Noms anonymisés dans cette démonstration.
            </p>
          </>
        )}
      </Sheet>
    </>
  );
}
