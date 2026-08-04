import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import CarteMaison from "../components/CarteMaison";
import Tampon from "../components/Tampon";
import { listerMaisons, listerQuartiers } from "../lib/data";
import { useFavoris } from "../lib/favoris";

export default function Accueil() {
  const [maisons, setMaisons] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const { favoris, basculer } = useFavoris();

  useEffect(() => {
    Promise.all([listerMaisons(), listerQuartiers()])
      .then(([m, q]) => {
        setMaisons(m);
        setQuartiers(q);
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-4 bg-brand rounded-b-[28px]">
        <p className="text-brand-light text-[13px]">Trouvez votre maison en confiance</p>
        <Link
          to="/recherche"
          className="mt-3 w-full bg-white rounded-2xl px-4 py-3 flex items-center gap-2 text-muted text-sm"
        >
          <Search size={16} />
          Chercher par quartier, prix...
        </Link>
      </div>

      <div className="px-4 mt-4">
        <p className="text-[13px] font-semibold text-muted uppercase tracking-wide mb-2">
          Quartiers
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          {quartiers.map((q) => (
            <Link
              key={q.id}
              to={`/recherche?quartier=${encodeURIComponent(q.nom)}`}
              className="shrink-0 bg-white border border-line text-ink text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap"
            >
              {q.nom}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[13px] font-semibold text-muted uppercase tracking-wide">
            Nouvelles annonces
          </p>
          <Tampon small />
        </div>

        {chargement && <p className="text-muted text-sm">Chargement...</p>}
        {erreur && <p className="text-red-600 text-sm">Erreur : {erreur}</p>}
        {!chargement && !erreur && maisons.length === 0 && (
          <p className="text-muted text-sm">Aucune annonce publiée pour l'instant.</p>
        )}

        <div className="grid grid-cols-1 gap-3">
          {maisons.map((m) => (
            <CarteMaison
              key={m.id}
              maison={m}
              estFavori={favoris.includes(m.id)}
              onBasculerFavori={basculer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
