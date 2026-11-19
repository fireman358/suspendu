import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "../components/Icons.jsx";
import { disciplines, grottes } from "../data/index.js";
import { toInputDate, uid, useLocalStorage } from "../lib/store.js";

const roles = ["Participant", "Guide", "Équipement", "Déséquipement"];

export default function CarnetNouvelle() {
  const navigate = useNavigate();
  const [entrees, setEntrees] = useLocalStorage("sp_carnet", []);
  const [form, setForm] = useState({
    grotte: "",
    date: toInputDate(new Date()),
    discipline: "Spéléo",
    role: "Participant",
    duree: "",
    notes: "",
  });
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const soumettre = (e) => {
    e.preventDefault();
    if (!form.grotte.trim()) return setErreur("Indiquez la cavité ou le site.");
    if (!form.date) return setErreur("Indiquez la date de la sortie.");
    setErreur("");
    setEntrees([...entrees, { ...form, id: uid(), duree: Number(form.duree) || 0 }]);
    setEnvoye(true);
    setTimeout(() => navigate("/carnet"), 700);
  };

  return (
    <>
      <Link className="back" to="/carnet">
        <ChevronLeft width={18} height={18} /> Retour au carnet
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 850, letterSpacing: "-0.03em" }}>Ajouter une sortie</h1>
      <p style={{ color: "var(--muted)", marginBottom: 22 }}>Sortie ancienne ou hors-club</p>

      <form onSubmit={soumettre} noValidate>
        <div className="field">
          <label className="label" htmlFor="champ-grotte">
            Cavité ou site
          </label>
          <input
            id="champ-grotte"
            className="input"
            list="liste-grottes"
            value={form.grotte}
            onChange={set("grotte")}
            placeholder="Nom de la grotte, du canyon…"
            aria-describedby="aide-grotte"
            required
          />
          <datalist id="liste-grottes">
            {grottes.map((g) => (
              <option key={g.id} value={g.name} />
            ))}
          </datalist>
          <p className="hint" id="aide-grotte">
            Les cavités déjà connues du club sont proposées : le nom sera rattaché au bon topo.
          </p>
        </div>

        <div className="field-row">
          <div className="field">
            <label className="label" htmlFor="champ-date">
              Date de la sortie
            </label>
            <input id="champ-date" className="input" type="date" value={form.date} onChange={set("date")} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="champ-duree">
              Durée (heures)
            </label>
            <input
              id="champ-duree"
              className="input"
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              value={form.duree}
              onChange={set("duree")}
              placeholder="4"
            />
          </div>
        </div>

        <fieldset style={{ border: 0, padding: 0, margin: "0 0 16px" }}>
          <legend className="label">Discipline</legend>
          <div className="filters" style={{ paddingBottom: 0 }}>
            {disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                className="chip"
                aria-pressed={form.discipline === d.name}
                onClick={() => setForm({ ...form, discipline: d.name })}
                style={form.discipline === d.name ? { background: d.color, color: "#08080a" } : undefined}
              >
                {d.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label className="label" htmlFor="champ-role">
            Mon rôle
          </label>
          <select id="champ-role" className="select" value={form.role} onChange={set("role")}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="label" htmlFor="champ-notes">
            Souvenirs, impressions
          </label>
          <textarea
            id="champ-notes"
            className="textarea"
            value={form.notes}
            onChange={set("notes")}
            placeholder="Ce que vous retenez de la sortie…"
          />
        </div>

        {erreur && (
          <p className="hint" role="alert" style={{ color: "var(--warn)", marginBottom: 12 }}>
            {erreur}
          </p>
        )}

        <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={envoye}>
          {envoye ? "Enregistré ✓" : "Enregistrer dans mon carnet"}
        </button>
        <p className="hint" style={{ textAlign: "center", marginTop: 12 }}>
          Enregistré sur cet appareil — la synchronisation se fera au retour du réseau.
        </p>
      </form>
    </>
  );
}
