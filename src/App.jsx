import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Sorties from "./pages/Sorties.jsx";
import Matos from "./pages/Matos.jsx";
import Emprunter from "./pages/Emprunter.jsx";
import Topos from "./pages/Topos.jsx";
import Carnet from "./pages/Carnet.jsx";
import CarnetNouvelle from "./pages/CarnetNouvelle.jsx";
import Camps from "./pages/Camps.jsx";
import School from "./pages/School.jsx";
import Contacts from "./pages/Contacts.jsx";
import Reglages from "./pages/Reglages.jsx";
import { Empty } from "./components/ui.jsx";
import { Link } from "react-router-dom";

function Introuvable() {
  return (
    <>
      <h1 style={{ fontSize: 26, fontWeight: 850, marginBottom: 8 }}>Page introuvable</h1>
      <p style={{ color: "var(--muted)", marginBottom: 18 }}>
        Cette adresse n'existe pas dans l'application.
      </p>
      <Link className="btn btn--primary" to="/">
        Retour à l'accueil
      </Link>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="sorties" element={<Sorties />} />
        <Route path="matos" element={<Matos />} />
        <Route path="matos/emprunter" element={<Emprunter />} />
        <Route path="topos" element={<Topos />} />
        <Route path="carnet" element={<Carnet />} />
        <Route path="carnet/nouvelle" element={<CarnetNouvelle />} />
        <Route path="camps" element={<Camps />} />
        <Route path="school" element={<School />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="reglages" element={<Reglages />} />
        <Route path="*" element={<Introuvable />} />
      </Route>
    </Routes>
  );
}
