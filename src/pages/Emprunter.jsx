import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge, Empty, Qty } from "../components/ui.jsx";
import { ArrowRight, Box, Check, ChevronLeft, Clock } from "../components/Icons.jsx";
import { formatDate, materiaux, stockParCategorie } from "../data/index.js";
import { addDays, toInputDate, uid, useLocalStorage } from "../lib/store.js";

const nomType = { individuel: "Individuel", collectif: "Collectif" };

export default function Emprunter() {
  const [params] = useSearchParams();
  const modeRetour = params.get("retour") === "1";
  const [emprunts, setEmprunts] = useLocalStorage("sp_emprunts", []);

  const [etape, setEtape] = useState(modeRetour ? "retour" : "type");
  const [type, setType] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [selection, setSelection] = useState({});
  const [from, setFrom] = useState(toInputDate(new Date()));
  const [to, setTo] = useState(toInputDate(addDays(new Date(), 7)));

  const categories = useMemo(
    () => stockParCategorie.filter((c) => c.type === type && c.references > 0),
    [type]
  );

  const itemsCategorie = useMemo(
    () => materiaux.filter((m) => m.categoryId === categorie),
    [categorie]
  );

  const lignes = useMemo(
    () => Object.entries(selection).filter(([, q]) => q > 0),
    [selection]
  );

  const totalArticles = lignes.reduce((s, [, q]) => s + q, 0);
  const catCourante = stockParCategorie.find((c) => c.id === categorie);

  const setQty = (id, qty) => setSelection((s) => ({ ...s, [id]: qty }));

  const valider = () => {
    const nouveaux = lignes.map(([itemId, qty]) => {
      const m = materiaux.find((x) => x.id === itemId);
      return { id: uid(), itemId, name: m.name, qty, from, to };
    });
    setEmprunts([...emprunts, ...nouveaux]);
    setEtape("ok");
  };

  const rendre = (id) => setEmprunts(emprunts.filter((e) => e.id !== id));

  /* --- mode retour ------------------------------------------------------- */
  if (etape === "retour") {
    return (
      <>
        <Link className="back" to="/matos">
          <ChevronLeft width={18} height={18} /> Retour au matériel
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 850, letterSpacing: "-0.03em", marginBottom: 4 }}>
          Rendre du matériel
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          {emprunts.length ? "Sélectionnez ce que vous rapportez." : "Vous n'avez rien à rendre."}
        </p>

        {emprunts.length === 0 ? (
          <Empty>Aucun emprunt en cours. Le matériel que vous empruntez apparaîtra ici.</Empty>
        ) : (
          <ul className="list">
            {emprunts.map((e) => (
              <li key={e.id} className="row" style={{ cursor: "default" }}>
                <span className="row-avatar" aria-hidden="true">
                  <Box width={20} height={20} />
                </span>
                <span className="row-main">
                  <span className="row-title">
                    {e.name} × {e.qty}
                  </span>
                  <span className="row-sub">
                    <Clock width={12} height={12} style={{ verticalAlign: "-2px" }} aria-hidden="true" /> à rendre avant le{" "}
                    {formatDate(e.to)}
                  </span>
                </span>
                <button type="button" className="btn" onClick={() => rendre(e.id)}>
                  <Check width={16} height={16} />
                  Rendre
                </button>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: 18 }}>
          <Link className="btn btn--block" to="/matos">
            Terminer
          </Link>
        </div>
      </>
    );
  }

  /* --- confirmation ------------------------------------------------------ */
  if (etape === "ok") {
    return (
      <>
        <div className="stat" style={{ marginTop: 30, padding: 26 }}>
          <span className="action-icon" style={{ margin: "0 auto 12px", background: "var(--ok-bg)", color: "var(--ok)" }}>
            <Check width={22} height={22} />
          </span>
          <b style={{ fontSize: 26 }}>C'est noté</b>
          <span style={{ display: "block", marginTop: 6 }}>
            {totalArticles} article{totalArticles > 1 ? "s" : ""} emprunté{totalArticles > 1 ? "s" : ""} jusqu'au{" "}
            {formatDate(to)}.
          </span>
        </div>
        <p className="hint" style={{ textAlign: "center", marginTop: 14 }}>
          Un rappel sera envoyé la veille du retour. Le matériel est visible dans « Rendre du matériel ».
        </p>
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <Link className="btn btn--primary btn--block" to="/matos">
            Voir mes emprunts
          </Link>
          <Link className="btn btn--block" to="/matos/emprunter">
            Emprunter autre chose
          </Link>
        </div>
      </>
    );
  }

  /* --- parcours d'emprunt ------------------------------------------------ */
  const etapes = [
    { id: "type", label: "Type" },
    { id: "categorie", label: "Matériel" },
    { id: "quantite", label: "Quantités" },
    { id: "dates", label: "Dates" },
  ];
  const index = etapes.findIndex((e) => e.id === etape);

  return (
    <>
      <Link className="back" to="/matos">
        <ChevronLeft width={18} height={18} /> Retour au matériel
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 850, letterSpacing: "-0.03em", marginBottom: 6 }}>
        Emprunter du matériel
      </h1>

      <ol
        aria-label="Étapes de l'emprunt"
        style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, margin: "0 0 20px" }}
      >
        {etapes.map((e, i) => (
          <li
            key={e.id}
            aria-current={i === index ? "step" : undefined}
            style={{
              flex: 1,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: i <= index ? "var(--accent)" : "var(--muted)",
              borderTop: `2px solid ${i <= index ? "var(--accent)" : "var(--line-strong)"}`,
              paddingTop: 8,
            }}
          >
            {i + 1}. {e.label}
          </li>
        ))}
      </ol>

      {etape === "type" && (
        <div className="grid" style={{ marginTop: 0 }}>
          {[
            { id: "individuel", img: "images/card-matos.png" },
            { id: "collectif", img: "images/card-extra.png" },
          ].map(({ id, img }) => (
            <button
              key={id}
              type="button"
              className="cat-tile"
              onClick={() => {
                setType(id);
                setEtape("categorie");
              }}
              style={{ minHeight: 168 }}
            >
              <img src={img} alt="" loading="lazy" />
              <span className="cat-tile-body" style={{ minHeight: 168 }}>
                <span className="cat-tile-name">Matériel {nomType[id].toLowerCase()}</span>
                <span className="cat-tile-stock">
                  {id === "individuel" ? "Casques, baudriers, éclairage, longes…" : "Cordes, mousquetons, sacs, poulies…"}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {etape === "categorie" && (
        <>
          <p className="hint" style={{ marginBottom: 12 }}>
            {categories.length} catégories · le stock disponible est affiché sur chaque vignette.
          </p>
          <div className="cat-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="cat-tile"
                disabled={c.dispo === 0}
                onClick={() => {
                  setCategorie(c.id);
                  setEtape("quantite");
                }}
              >
                {c.image && <img src={c.image} alt="" loading="lazy" />}
                <span className="badge badge--ok" aria-hidden="true">
                  {c.dispo} dispo
                </span>
                <span className="cat-tile-body">
                  <span className="cat-tile-name">{c.name}</span>
                  <span className="cat-tile-stock">{c.references} référence(s)</span>
                </span>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--block" style={{ marginTop: 16 }} onClick={() => setEtape("type")}>
            Changer de type
          </button>
        </>
      )}

      {etape === "quantite" && (
        <>
          <p className="hint" style={{ marginBottom: 12 }}>
            {catCourante?.name} · {catCourante?.dispo} pièces disponibles
          </p>
          <ul className="list">
            {itemsCategorie.map((m) => (
              <li key={m.id} style={{ display: "grid", gap: 6 }}>
                <Qty
                  name={m.name}
                  value={selection[m.id] || 0}
                  max={m.dispo}
                  onChange={(q) => setQty(m.id, q)}
                />
                <span className="hint" style={{ marginLeft: 4 }}>
                  Réf. {m.uniqueId} · {m.dispo} dispo{m.option ? ` · ${m.option}` : ""}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn--primary btn--block btn--lg"
              disabled={totalArticles === 0}
              onClick={() => setEtape("dates")}
            >
              {totalArticles === 0 ? "Sélectionnez du matériel" : `Continuer (${totalArticles} article${totalArticles > 1 ? "s" : ""})`}
            </button>
            <button type="button" className="btn btn--block" onClick={() => setEtape("categorie")}>
              Autre catégorie
            </button>
          </div>
        </>
      )}

      {etape === "dates" && (
        <>
          <div className="summary" style={{ marginBottom: 18 }}>
            {lignes.map(([id, q]) => {
              const m = materiaux.find((x) => x.id === id);
              return (
                <div className="summary-line" key={id}>
                  <span>
                    {m.name} × {q}
                  </span>
                  <span>Réf. {m.uniqueId}</span>
                </div>
              );
            })}
            <div className="summary-line summary-total">
              <span>Total</span>
              <span>
                {totalArticles} article{totalArticles > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label className="label" htmlFor="emprunt-depart">
                Départ
              </label>
              <input
                id="emprunt-depart"
                className="input"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="emprunt-retour">
                Retour
              </label>
              <input
                id="emprunt-retour"
                className="input"
                type="date"
                value={to}
                min={from}
                aria-describedby="retour-aide"
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
          <p className="hint" id="retour-aide" style={{ marginTop: -6, marginBottom: 18 }}>
            Par défaut, une semaine. Un rappel part la veille du retour.
          </p>

          <button
            type="button"
            className="btn btn--primary btn--block btn--lg"
            onClick={valider}
            disabled={!to || to < from}
          >
            Valider l'emprunt
          </button>
          {to && to < from && <p className="hint" style={{ color: "var(--warn)" }}>La date de retour doit suivre la date de départ.</p>}
        </>
      )}

      <div style={{ marginTop: 18 }}>
        <Badge tone="neutral">
          <ArrowRight width={12} height={12} /> Prototype : l'emprunt est enregistré sur cet appareil
        </Badge>
      </div>
    </>
  );
}
