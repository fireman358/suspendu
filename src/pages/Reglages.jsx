import { useState } from "react";
import { PageHead, Badge } from "../components/ui.jsx";
import { Check, Download, Shield } from "../components/Icons.jsx";
import { useLocalStorage } from "../lib/store.js";

export default function Reglages() {
  const [profil, setProfil] = useLocalStorage("sp_profil", {
    nom: "David D.",
    fonction: "Adhérent",
    telephone: "",
    partage: true,
  });
  const [enregistre, setEnregistre] = useState(false);

  const set = (k) => (e) => setProfil({ ...profil, [k]: e.target.value });

  const soumettre = (e) => {
    e.preventDefault();
    setEnregistre(true);
    setTimeout(() => setEnregistre(false), 2200);
  };

  return (
    <>
      <PageHead title="Réglages" subtitle="Profil & administration" />

      <div className="section-title" style={{ marginTop: 0 }}>
        <h2>Mon profil</h2>
      </div>

      <form onSubmit={soumettre}>
        <div className="field">
          <label className="label" htmlFor="profil-nom">
            Nom d'affichage
          </label>
          <input id="profil-nom" className="input" value={profil.nom} onChange={set("nom")} />
          <p className="hint">Utilisé dans toute l'application (laissez vide pour utiliser votre prénom).</p>
        </div>

        <div className="field">
          <label className="label" htmlFor="profil-fonction">
            Fonction au club
          </label>
          <input
            id="profil-fonction"
            className="input"
            value={profil.fonction}
            onChange={set("fonction")}
            placeholder="Adhérent, guide, équipement…"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="profil-tel">
            Téléphone
          </label>
          <input
            id="profil-tel"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={profil.telephone}
            onChange={set("telephone")}
            placeholder="+32 …"
          />
        </div>

        <div className="switch-row" style={{ marginBottom: 16 }}>
          <span>
            <span className="row-title" id="partage-label">
              Partager mon numéro
            </span>
            <span className="row-sub">Visible dans Sus'Contacts par les membres du club</span>
          </span>
          <button
            type="button"
            className="switch"
            role="switch"
            aria-checked={profil.partage}
            aria-labelledby="partage-label"
            onClick={() => setProfil({ ...profil, partage: !profil.partage })}
          >
            <span className="sr-only">{profil.partage ? "Désactiver le partage" : "Activer le partage"}</span>
          </button>
        </div>

        <button type="submit" className="btn btn--primary btn--block btn--lg">
          {enregistre ? (
            <>
              <Check width={17} height={17} /> Profil enregistré
            </>
          ) : (
            "Enregistrer mon profil"
          )}
        </button>
      </form>

      <div className="section-title">
        <h2>Réglages du club</h2>
      </div>

      <div className="summary">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Shield width={18} height={18} style={{ color: "var(--muted)" }} aria-hidden="true" />
          <span style={{ color: "var(--muted)", fontSize: 13.5 }}>
            Les réglages du club sont réservés aux administrateurs.
          </span>
        </div>
      </div>

      <div className="section-title">
        <h2>Application</h2>
      </div>

      <div className="summary">
        <div className="summary-line">
          <span>Version</span>
          <span>Prototype 1.0</span>
        </div>
        <div className="summary-line">
          <span>Hors-ligne</span>
          <span>Activé</span>
        </div>
        <div className="summary-line">
          <span>Données</span>
          <span>Anonymisées</span>
        </div>
      </div>

      <p className="hint" style={{ marginTop: 14 }}>
        <Download width={13} height={13} style={{ verticalAlign: "-2px" }} aria-hidden="true" /> Pour installer
        l'application : menu du navigateur → « Installer » ou « Ajouter à l'écran d'accueil ».
      </p>

      <div style={{ marginTop: 18 }}>
        <Badge tone="info">Prototype de démonstration — non officiel</Badge>
      </div>
    </>
  );
}
