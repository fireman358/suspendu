import { PageHead, Badge } from "../components/ui.jsx";
import { Phone, Shield, Users } from "../components/Icons.jsx";
import { annuaire, secours } from "../data/index.js";

export default function Contacts() {
  return (
    <>
      <PageHead title="Sus'Contacts" subtitle="Secours, spéléos, logements" />

      <div className="offline-banner" style={{ background: "rgba(255,255,255,.05)", color: "var(--muted)" }} role="note">
        <Shield width={16} height={16} />
        Noms et numéros fictifs dans cette démonstration — les vrais contacts ne sont pas publiés.
      </div>

      <section aria-labelledby="secours">
        <div className="section-title">
          <h2 id="secours">Secours</h2>
          <span>{secours.length}</span>
        </div>
        <ul className="list">
          {secours.map((s) => (
            <li key={s.id} className="row" style={{ cursor: "default" }}>
              <span className="row-avatar" aria-hidden="true">
                <Shield width={18} height={18} />
              </span>
              <span className="row-main">
                <span className="row-title">{s.name}</span>
                <span className="row-sub">
                  {s.role}
                  {s.region ? ` · ${s.region}` : ""}
                </span>
              </span>
              <a className="btn" href={`tel:${s.phone.replace(/\s/g, "")}`} aria-label={`Appeler ${s.name} au ${s.phone}`}>
                <Phone width={16} height={16} />
                Appeler
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="annuaire">
        <div className="section-title">
          <h2 id="annuaire">Annuaire du club</h2>
          <span>{annuaire.length}</span>
        </div>
        <ul className="list">
          {annuaire.map((m) => (
            <li key={m.name} className="row" style={{ cursor: "default" }}>
              <span className="row-avatar" aria-hidden="true">
                <Users width={18} height={18} />
              </span>
              <span className="row-main">
                <span className="row-title">{m.name}</span>
                <span className="row-sub">
                  {m.role} · {m.region}
                </span>
              </span>
              <Badge tone="neutral">Fictif</Badge>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
