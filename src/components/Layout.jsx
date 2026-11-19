import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Box, Book, Calendar, Gear, Globe, Home, MapIcon, Mountain, Users, WifiOff } from "./Icons.jsx";

const principal = [
  { to: "/", label: "Accueil", icon: Home, end: true },
  { to: "/sorties", label: "Sorties", icon: Mountain },
  { to: "/matos", label: "Matos", icon: Box },
  { to: "/topos", label: "Topos", icon: MapIcon },
  { to: "/carnet", label: "Carnet", icon: Book },
];

const secondaire = [
  { to: "/camps", label: "Camps", icon: Calendar },
  { to: "/school", label: "School", icon: Globe },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/reglages", label: "Réglages", icon: Gear },
];

export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}

function Logo() {
  return <img src="images/logo.png" alt="" width="46" height="46" />;
}

export default function Layout() {
  const online = useOnline();
  const { pathname } = useLocation();

  return (
    <div className="app">
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>

      <aside className="sidebar" aria-label="Navigation principale">
        <div className="sidebar-brand">
          <Logo />
          <b>
            Les Sus'Pendus
            <br />
            <span style={{ fontWeight: 500, fontSize: 12, color: "var(--muted)" }}>Espace du club</span>
          </b>
        </div>

        {principal.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} aria-current={pathname === to ? "page" : undefined}>
            <Icon />
            {label}
          </NavLink>
        ))}

        <div style={{ height: 14 }} />

        {secondaire.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} aria-current={pathname === to ? "page" : undefined}>
            <Icon />
            {label}
          </NavLink>
        ))}

        <div className="sidebar-footer">
          Prototype de démonstration — données anonymisées.
          <br />
          Version hors-ligne disponible.
        </div>
      </aside>

      <main className="main" id="contenu">
        {!online && (
          <p className="offline-banner" role="status">
            <WifiOff width={16} height={16} />
            Hors-ligne — vous consultez les données enregistrées sur cet appareil.
          </p>
        )}
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Navigation principale">
        {principal.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} aria-current={pathname === to ? "page" : undefined}>
            <Icon width={22} height={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function TopBar({ showSettings = true }) {
  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Les Sus'Pendus — accueil">
        <Logo />
        <span className="brand-name">Les Sus'Pendus</span>
      </Link>
      {showSettings && (
        <div className="topbar-actions">
          <Link className="btn btn--ghost" to="/reglages">
            <Gear width={18} height={18} />
            Réglages
          </Link>
        </div>
      )}
    </header>
  );
}
