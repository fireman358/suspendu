import { useCallback, useEffect, useState } from "react";

/** Petit hook de persistance locale (emprunts, carnet) — fonctionne hors-ligne. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota plein ou mode privé : on ignore, l'app reste utilisable */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, setValue, reset];
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const toInputDate = (d) => d.toISOString().slice(0, 10);
