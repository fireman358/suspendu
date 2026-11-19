import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, SearchField, Sheet, Badge, Empty } from "../components/ui.jsx";
import { Box, Qr, Download, Check, ArrowRight, Clock } from "../components/Icons.jsx";
import { formatDate, materiaux, stockParCategorie } from "../data/index.js";
import { useLocalStorage } from "../lib/store.js";
import QRCode from "qrcode";

const totalPieces = materiaux.reduce((s, m) => s + m.total, 0);

export default function Matos() {
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [rapports, setRapports] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [emprunts] = useLocalStorage("sp_emprunts", []);

  useEffect(() => {
    if (!qrItem) return;
    const url = `${location.origin}${location.pathname}#/matos?ref=${encodeURIComponent(qrItem.uniqueId)}`;
    QRCode.toDataURL(url, { margin: 1, width: 336, color: { dark: "#111111", light: "#ffffff" } })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [qrItem]);

  const groupes = useMemo(() => {
    const t = q.trim().toLowerCase();
    const filtres = t
      ? materiaux.filter((m) => `${m.name} ${m.category} ${m.option} ${m.uniqueId}`.toLowerCase().includes(t))
      : materiaux;
    const map = new Map();
    for (const m of filtres) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category).push(m);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
  }, [q]);

  const dispoTotal = materiaux.reduce((s, m) => s + m.dispo, 0);

  return (
    <>
      <PageHead title="Sus'Matos" subtitle="Emprunts & retours" />

      <div className="action-stack">
        <Link className="action-card action-card--primary" to="/matos/emprunter">
          <span className="action-icon">
            <Box />
          </span>
          <span className="row-main">
            <span className="action-title">Emprunter du matériel</span>
            <span className="action-sub">Casques, cordes, mousquetons…</span>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>

        <Link className="action-card" to="/matos/emprunter?retour=1">
          <span className="action-icon">
            <Check />
          </span>
          <span className="row-main">
            <span className="action-title">Rendre du matériel</span>
            <span className="action-sub">
              {emprunts.length
                ? `${emprunts.reduce((s, e) => s + e.qty, 0)} article(s) à rendre`
                : "Aucun matériel à rendre"}
            </span>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>

        <button type="button" className="action-card" onClick={() => setRapports(true)}>
          <span className="action-icon">
            <Download />
          </span>
          <span className="row-main">
            <span className="action-title">Rapports</span>
            <span className="action-sub">État du parc et disponibilité</span>
          </span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>

      <div className="stats" style={{ marginBottom: 18 }}>
        <div className="stat">
          <b>{dispoTotal}</b>
          <span>disponibles</span>
        </div>
        <div className="stat">
          <b>{totalPieces - dispoTotal}</b>
          <span>sortis</span>
        </div>
        <div className="stat">
          <b>{materiaux.length}</b>
          <span>références</span>
        </div>
      </div>

      <SearchField value={q} onChange={setQ} placeholder="Rechercher du matériel" label="Rechercher du matériel" />

      {groupes.length === 0 ? (
        <Empty>Aucun matériel ne correspond à « {q} ».</Empty>
      ) : (
        groupes.map(([categorie, items]) => {
          const dispo = items.reduce((s, m) => s + m.dispo, 0);
          const cat = stockParCategorie.find((c) => c.name === categorie);
          return (
            <section key={categorie} aria-labelledby={`cat-${categorie}`}>
              <div className="section-title">
                <h2 id={`cat-${categorie}`}>{categorie}</h2>
                <span>
                  {dispo} dispo · {items.length} réf.
                </span>
              </div>
              <ul className="list">
                {items.map((m) => (
                  <li key={m.id}>
                    <div className="row" style={{ cursor: "default" }}>
                      {cat?.image ? (
                        <img className="row-thumb" src={cat.image} alt="" loading="lazy" />
                      ) : (
                        <span className="row-avatar" aria-hidden="true">
                          <Box width={20} height={20} />
                        </span>
                      )}
                      <button
                        type="button"
                        className="row-main"
                        onClick={() => setDetail(m)}
                        style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer" }}
                      >
                        <span className="row-title">
                          {m.name}
                          {m.option && m.option !== m.name && <span className="badge badge--neutral">{m.option}</span>}
                        </span>
                        <span className="row-sub">
                          Réf. {m.uniqueId}
                          {m.status !== "Actif" ? ` · ${m.status}` : ""}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => setQrItem(m)}
                        aria-label={`Afficher l'étiquette QR de ${m.name}`}
                      >
                        <Qr width={18} height={18} />
                      </button>
                      <span className="row-meta" style={{ marginLeft: 4 }}>
                        <span className="row-count" style={{ color: m.dispo ? "var(--ok)" : "var(--warn)" }}>
                          {m.dispo}
                        </span>
                        <span className="row-count-sub">dispo</span>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      {/* --- fiche matériel --- */}
      <Sheet open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.name} subtitle={detail ? `Réf. ${detail.uniqueId} · ${detail.category}` : ""}>
        {detail && (
          <>
            <div className="tag-list" style={{ marginTop: 0 }}>
              <Badge tone={detail.dispo > 0 ? "ok" : "warn"}>{detail.dispo} disponible(s)</Badge>
              <Badge tone="neutral">{detail.borrowed} sorti(s)</Badge>
              <Badge tone="neutral">{detail.total} au total</Badge>
            </div>
            <div className="summary" style={{ marginTop: 16 }}>
              <div className="summary-line">
                <span>Catégorie</span>
                <span>{detail.category}</span>
              </div>
              <div className="summary-line">
                <span>Option</span>
                <span>{detail.option || "—"}</span>
              </div>
              <div className="summary-line">
                <span>État</span>
                <span>{detail.status}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <Link className="btn btn--primary btn--block" to="/matos/emprunter" onClick={() => setDetail(null)}>
                Emprunter
              </Link>
              <button type="button" className="btn btn--block" onClick={() => setQrItem(detail)}>
                <Qr width={18} height={18} />
                Étiquette
              </button>
            </div>
          </>
        )}
      </Sheet>

      {/* --- étiquette QR --- */}
      <Sheet
        open={Boolean(qrItem)}
        onClose={() => setQrItem(null)}
        title={qrItem?.name}
        subtitle="Étiquette à coller sur le matériel — scan à l'emprunt et au retour."
      >
        {qrItem && (
          <>
            <div className="qr-box">{qrUrl && <img src={qrUrl} alt={`QR code de ${qrItem.name}, référence ${qrItem.uniqueId}`} />}</div>
            <p className="hint" style={{ textAlign: "center" }}>
              Réf. {qrItem.uniqueId}
            </p>
            <p className="hint" style={{ textAlign: "center", marginTop: 10 }}>
              Le scan ouvre la fiche du matériel : plus de saisie de nom avec des gants, et zéro erreur de référence.
            </p>
          </>
        )}
      </Sheet>

      {/* --- rapports --- */}
      <Sheet open={rapports} onClose={() => setRapports(false)} title="Rapports" subtitle="État du parc de matériel">
        {emprunts.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 0 }}>
              <h2>Mes emprunts en cours</h2>
              <span>{emprunts.length}</span>
            </div>
            <ul className="list">
              {emprunts.map((e) => (
                <li key={e.id} className="row" style={{ cursor: "default" }}>
                  <span className="row-avatar" aria-hidden="true">
                    <Clock width={18} height={18} />
                  </span>
                  <span className="row-main">
                    <span className="row-title">
                      {e.name} × {e.qty}
                    </span>
                    <span className="row-sub">
                      <Check width={12} height={12} style={{ verticalAlign: "-2px" }} aria-hidden="true" /> à rendre avant le{" "}
                      {formatDate(e.to)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="section-title">
          <h2>Disponibilité par catégorie</h2>
        </div>
        <ul className="list">
          {stockParCategorie
            .filter((c) => c.references > 0)
            .sort((a, b) => b.dispo - a.dispo)
            .map((c) => (
              <li key={c.id} className="row" style={{ cursor: "default" }}>
                <span className="row-main">
                  <span className="row-title">{c.name}</span>
                  <span className="row-sub">
                    {c.references} référence(s) · {c.total} pièces
                  </span>
                </span>
                <span className="row-meta">
                  <span className="row-count" style={{ color: c.dispo ? "var(--ok)" : "var(--warn)" }}>
                    {c.dispo}
                  </span>
                  <span className="row-count-sub">dispo</span>
                </span>
              </li>
            ))}
        </ul>
      </Sheet>
    </>
  );
}
