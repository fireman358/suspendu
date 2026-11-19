import { useEffect, useId, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Minus, Plus, Search } from "./Icons.jsx";

/* --- feuille modale accessible ------------------------------------------- */

export function Sheet({ open, onClose, title, subtitle, children }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const el = ref.current;
    el?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !el) return;
      const focusables = el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={ref} tabIndex={-1}>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="sheet-head">
          <h2 id={titleId}>{title}</h2>
          {subtitle && <p className="sheet-sub">{subtitle}</p>}
          <button type="button" className="icon-btn sheet-close" onClick={onClose} aria-label="Fermer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div style={{ marginTop: 16 }}>{children}</div>
      </div>
    </div>
  );
}

/* --- petits éléments ------------------------------------------------------ */

export function Badge({ tone = "neutral", children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function Chip({ active, onClick, color, children }) {
  return (
    <button
      type="button"
      className="chip"
      aria-pressed={active}
      onClick={onClick}
      style={active ? { background: color || "var(--accent)" } : undefined}
    >
      {color && !active && <span className="chip-dot" style={{ background: color }} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function SearchField({ value, onChange, placeholder, label }) {
  return (
    <div className="search">
      <Search width={18} height={18} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label || placeholder}
      />
    </div>
  );
}

export function PageHead({ title, subtitle, back = false }) {
  const navigate = useNavigate();
  return (
    <div className="page-head">
      <div>
        {back && (
          <button type="button" className="back" onClick={() => navigate(-1)}>
            <ChevronLeft width={18} height={18} />
            Retour
          </button>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export function Empty({ children }) {
  return <p className="empty">{children}</p>;
}

export function Qty({ value, max, onChange, name }) {
  return (
    <div className="qty-row">
      <span className="row-main" id={`${name}-label`}>
        {name}
      </span>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        aria-label={`Retirer un ${name}`}
      >
        <Minus width={16} height={16} />
      </button>
      <span className="qty-value" aria-live="polite" aria-label={`${value} ${name} sélectionné${value > 1 ? "s" : ""}`}>
        {value}
      </span>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Ajouter un ${name}`}
      >
        <Plus width={16} height={16} />
      </button>
    </div>
  );
}

export function Tile({ to, img, title, subtitle, wide = false, icon = null, external = false }) {
  const content = (
    <>
      {img && <img src={img} alt="" loading="lazy" />}
      <span className="tile-arrow" aria-hidden="true">
        <ArrowRight width={wide ? 18 : 16} height={wide ? 18 : 16} />
      </span>
      <span className="tile-body">
        {wide && icon && <span className="tile-icon">{icon}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </span>
    </>
  );

  const className = `tile${wide ? " tile--wide" : ""}`;

  if (external) {
    return (
      <a className={className} href={to} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {content}
    </Link>
  );
}
