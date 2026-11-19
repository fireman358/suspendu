/* ==========================================================================
   Données de démonstration.
   Les contenus proviennent de l'app du club (export lecture seule) puis sont
   ANONYMISÉS : noms des membres remplacés, téléphones de secours fictifs,
   liens de partage de frais supprimés, identifiants techniques retirés.
   ========================================================================== */

import grottesRaw from "./Grotte.json";
import toposRaw from "./Topo.json";
import materielRaw from "./Materiel.json";
import categoriesRaw from "./MatosCategory.json";
import optionsRaw from "./MatosOption.json";
import disciplinesRaw from "./Discipline.json";
import campsRaw from "./Camp.json";
import programmeRaw from "./CampProgram.json";
import themesRaw from "./SchoolTheme.json";
import documentsRaw from "./SchoolDocument.json";
import sortiesRaw from "./Sortie.json";
import secoursRaw from "./ContactSecours.json";
import imagesRaw from "./_images.json";

/* --- images des catégories ------------------------------------------------ */

const imageByCategoryId = new Map(
  imagesRaw.filter((i) => i.field === "category").map((i) => [i.id, `images/${i.file}`])
);

/* --- anonymisation -------------------------------------------------------- */

const Membre = (n) => `Membre ${n}`;

/** Nettoie une mesure saisie en texte libre (« 149 », « unknown », « 8 000 m »…). */
const mesure = (v) => {
  if (!v) return "";
  const s = String(v).trim();
  if (!s || /^(unknown|n\/?a|-)$/i.test(s)) return "";
  const n = Number(s.replace(",", ".").replace(/\s/g, ""));
  if (Number.isFinite(n) && /^\d+([.,]\d+)?$/.test(s.replace(/\s/g, ""))) return `${n.toLocaleString("fr-BE")} m`;
  return s;
};

/* --- normalisation -------------------------------------------------------- */

export const grottes = grottesRaw.map((g) => ({
  id: g.id,
  name: g.name,
  country: g.country || "",
  region: g.region || "",
  city: g.city || "",
  development: g.development || "",
  depth: g.depth || "",
  latitude: Number(g.latitude) || null,
  longitude: Number(g.longitude) || null,
}));

export const disciplines = disciplinesRaw.map((d) => ({
  id: d.id,
  name: d.name,
  color: d.color,
  icon: d.icon,
}));

const disciplineByName = new Map(disciplines.map((d) => [d.name, d]));

export const categories = categoriesRaw
  .filter((c) => c.active !== false)
  .map((c) => ({
    id: c.id,
    name: (c.name || "").trim(),
    type: c.material_type || "individuel",
    image: imageByCategoryId.get(c.id) || null,
    icon: c.icon || null,
    order: Number(c.order) || 0,
  }))
  .sort((a, b) => a.order - b.order);

const categoryById = new Map(categories.map((c) => [c.id, c]));

export const materiaux = materielRaw
  .filter((m) => m.active !== false)
  .map((m) => {
    const total = Number(m.quantity_total) || 0;
    const borrowed = Number(m.quantity_borrowed) || 0;
    return {
      id: m.id,
      name: m.name,
      uniqueId: m.unique_id,
      categoryId: m.category_id,
      category: categoryById.get(m.category_id)?.name || m.category_name || "Autre",
      categoryType: categoryById.get(m.category_id)?.type || "individuel",
      option: m.option_name || "",
      total,
      borrowed,
      dispo: Math.max(0, total - borrowed),
      status: m.status || "Actif",
    };
  })
  .sort((a, b) => a.category.localeCompare(b.category, "fr") || a.name.localeCompare(b.name, "fr"));

/** Stock disponible agrégé par catégorie (pour les vignettes d'emprunt). */
export const stockParCategorie = categories.map((c) => {
  const items = materiaux.filter((m) => m.categoryId === c.id);
  return {
    ...c,
    dispo: items.reduce((s, m) => s + m.dispo, 0),
    total: items.reduce((s, m) => s + m.total, 0),
    references: items.length,
  };
});

export const topos = toposRaw
  .filter((t) => t.active !== false)
  .map((t) => {
    const grotte = grottes.find((g) => g.id === t.grotte_id);
    return {
      id: t.id,
      grotteId: t.grotte_id,
      name: t.grotte_name || grotte?.name || "Cavité sans nom",
      country: grotte?.country || "",
      region: grotte?.region || "",
      city: grotte?.city || "",
      documentTypes: t.document_types || [],
      documents: (t.files || []).map((f) => f.file_name).filter(Boolean),
      comment: t.comment || "",
      discipline: t.discipline_name || "",
      disciplineColor: disciplineByName.get(t.discipline_name)?.color || "#8b8b94",
      development: mesure(grotte?.development),
      depth: mesure(grotte?.depth),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

/**
 * Une cavité peut avoir plusieurs fiches topo (équipement, accès, coupe…).
 * On les regroupe pour n'afficher qu'une ligne par cavité.
 */
export const toposGroupes = (() => {
  const map = new Map();
  for (const t of topos) {
    const cle = t.grotteId || t.name;
    const existant = map.get(cle);
    if (!existant) {
      map.set(cle, { ...t, documentTypes: [...t.documentTypes], documents: [...t.documents] });
    } else {
      existant.documentTypes = [...new Set([...existant.documentTypes, ...t.documentTypes])];
      existant.documents = [...new Set([...existant.documents, ...t.documents])];
      existant.discipline ||= t.discipline;
      existant.development ||= t.development;
      existant.depth ||= t.depth;
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
})();

export const sorties = sortiesRaw
  .filter((s) => s.status === "published")
  .map((s) => {
    const liste = (s.participants_list || []).map((p, i) => ({
      name: Membre(i + 1),
      role: (p.roles || ["Participant"]).join(", "),
    }));
    return {
      id: s.id,
      title: s.title || s.cave_name,
      date: s.sortie_date,
      cave: s.cave_name,
      region: [s.city, s.region].filter(Boolean).join(" · "),
      country: s.country || "",
      participants: liste.length,
      participantsList: liste,
      duration: Number(s.duration_minutes) || 0,
      depth: s.depth || "",
      development: s.development || "",
      discipline: s.discipline_name || "",
      author: Membre(0).replace("0", "1"),
      content: s.content || "",
      photos: (s.photos || []).length,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const camps = campsRaw.map((c) => ({
  id: c.id,
  name: c.name,
  start: c.start_date,
  end: c.end_date,
  region: [c.city, c.region, c.country].filter(Boolean).join(" · "),
  disciplines: c.discipline_names || [],
  participants: (c.participants || []).length,
  programme: programmeRaw
    .filter((p) => p.camp_id === c.id)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((p) => ({
      id: p.id,
      date: p.date,
      title: p.title,
      activity: p.activity_type,
      grotte: p.grotte_name,
      departure: p.departure_time,
      return: p.return_time,
    })),
}));

export const themes = themesRaw
  .filter((t) => t.active !== false)
  .map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description || "",
    order: Number(t.order) || 0,
    documents: documentsRaw
      .filter((d) => (d.theme_ids || []).includes(t.id))
      .map((d) => ({
        id: d.id,
        title: d.title,
        discipline: d.discipline_name || "",
        author: d.author || "",
        type: d.resource_type || "",
        description: d.description || "",
        documents: (d.files || []).map((f) => f.file_name).filter(Boolean),
        external: d.external_link || "",
      })),
  }))
  .sort((a, b) => a.order - b.order);

export const documents = documentsRaw
  .filter((d) => d.active !== false)
  .map((d) => ({
    id: d.id,
    title: d.title,
    discipline: d.discipline_name || "",
    themes: d.theme_names || [],
    documents: (d.files || []).map((f) => f.file_name).filter(Boolean),
  }));

/** Contacts de secours : noms et numéros fictifs (les vrais ne sont pas publiés). */
export const secours = secoursRaw.map((s, i) => ({
  id: s.id,
  name: `Contact secours ${i + 1}`,
  role: s.role || "",
  region: [s.region, s.country].filter(Boolean).join(" · "),
  phone: i === 0 ? "112" : "+33 3 81 00 00 0" + (i + 1),
}));

/** Annuaire de démonstration : entièrement fictif. */
export const annuaire = [
  { name: "Alex Moreau", role: "Guide · Spéléo", region: "Namur" },
  { name: "Camille Dubois", role: "Initiatrice · Canyoning", region: "Liège" },
  { name: "Sacha Lambert", role: "Équipement · Spéléo", region: "Namur" },
  { name: "Noa Fontaine", role: "Participante · Via Ferrata", region: "Luxembourg" },
  { name: "Lou Vermeulen", role: "Guide · Spéléo", region: "Hainaut" },
  { name: "Milan Leclercq", role: "Participant · Canyoning", region: "Bruxelles" },
];

/* --- utilitaires ---------------------------------------------------------- */

export const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? iso + "T12:00:00" : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
};

export const formatDateShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? iso + "T12:00:00" : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-BE", { day: "2-digit", month: "short" });
};

export const formatDuration = (minutes) => {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
};
