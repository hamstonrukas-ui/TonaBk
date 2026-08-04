import { useCallback, useEffect, useState } from "react";

const CLE = "tonabk_favoris";

export function useFavoris() {
  const [favoris, setFavoris] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLE) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CLE, JSON.stringify(favoris));
  }, [favoris]);

  const basculer = useCallback((id) => {
    setFavoris((actuels) =>
      actuels.includes(id) ? actuels.filter((f) => f !== id) : [...actuels, id]
    );
  }, []);

  return { favoris, basculer };
}
