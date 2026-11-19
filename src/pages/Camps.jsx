import { PageHead, Badge, Empty } from "../components/ui.jsx";
import { Calendar, Clock, Mountain, Users } from "../components/Icons.jsx";
import { camps, formatDate, formatDateShort } from "../data/index.js";

export default function Camps() {
  return (
    <>
      <PageHead title="Sus'Camps" subtitle="Camps du club" />

      {camps.length === 0 ? (
        <Empty>Aucun camp annoncé pour l'instant.</Empty>
      ) : (
        camps.map((camp) => (
          <section key={camp.id} aria-labelledby={`camp-${camp.id}`} style={{ marginBottom: 24 }}>
            <div className="summary" style={{ marginBottom: 14 }}>
              <div className="row-title" style={{ fontSize: 18 }} id={`camp-${camp.id}`}>
                {camp.name}
              </div>
              <div className="row-sub">
                <Calendar width={13} height={13} aria-hidden="true" /> {formatDate(camp.start)} → {formatDate(camp.end)}
              </div>
              <div className="row-sub">
                <Users width={13} height={13} aria-hidden="true" /> {camp.participants} participants
                {camp.region ? ` · ${camp.region}` : ""}
              </div>
              <div className="tag-list">
                {camp.disciplines.map((d) => (
                  <Badge key={d} tone="info">
                    {d}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="section-title">
              <h2>Programme</h2>
              <span>{camp.programme.length} jour(s)</span>
            </div>

            {camp.programme.length === 0 ? (
              <Empty>Le programme sera publié à l'approche du camp.</Empty>
            ) : (
              <ul className="list">
                {camp.programme.map((p) => (
                  <li key={p.id} className="row" style={{ cursor: "default" }}>
                    <span className="row-avatar" aria-hidden="true" style={{ fontWeight: 800, fontSize: 12 }}>
                      {formatDateShort(p.date)}
                    </span>
                    <span className="row-main">
                      <span className="row-title">{p.title}</span>
                      <span className="row-sub">
                        <Mountain width={12} height={12} aria-hidden="true" /> {p.grotte || p.activity}
                        {p.departure ? (
                          <>
                            {" "}
                            · <Clock width={12} height={12} aria-hidden="true" /> départ {p.departure.slice(11, 16)}
                          </>
                        ) : null}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}
    </>
  );
}
