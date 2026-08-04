import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import CarteMaison from "../components/CarteMaison";
import { listerFavoris } from "../lib/data";
import { useFavoris } from "../lib/favoris";

export default function Favoris() {
  const navigate = useNavigate();
  const { favoris, basculer } = useFavoris();
  const [maisons, setMaisons] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    listerFavoris(favoris)
      .then(setMaisons)
      .finally(() => setChargement(false));
  }, [favoris]);

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-3 bg-white sticky top-0 z-10 border-b border-line flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
          <ChevronLeft size={20} className="text-ink" />
        </button>
        <h1 className="text-[17px] font-bold text-ink font-display">Mes favoris</h1>
      </div>

      <div className="px-4 mt-4">
        {chargement && <p className="text-muted text-sm">Chargement...</p>}
        {!chargement && maisons.length === 0 && (
          <p className="text-muted text-sm">
            Aucun favori pour l'instant — touche le cœur sur une annonce pour la garder ici.
          </p>
        )}
        <div className="grid grid-cols-1 gap-3">
          {maisons.map((m) => (
            <CarteMaison key={m.id} maison={m} estFavori onBasculerFavori={basculer} />
          ))}
        </div>
      </div>
    </div>
  );
}
