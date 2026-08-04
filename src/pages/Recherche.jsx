import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";

import CarteMaison from "../components/CarteMaison";
import { listerMaisons, listerQuartiers } from "../lib/data";
import { useFavoris } from "../lib/favoris";
import { TYPES_BIEN, OPERATIONS } from "../lib/constantes";

export default function Recherche() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const quartierActif = params.get("quartier");
  const typeActif = params.get("type");
  const operationActive = params.get("operation");
  const { favoris, basculer } = useFavoris();

  const [quartiers, setQuartiers] = useState([]);
  const [maisons, setMaisons] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    listerQuartiers().then(setQuartiers);
  }, []);

  useEffect(() => {
    setChargement(true);
    listerMaisons({
      quartier: quartierActif || undefined,
      type: typeActif || undefined,
      operation: operationActive || undefined,
    })
      .then(setMaisons)
      .finally(() => setChargement(false));
  }, [quartierActif, typeActif, operationActive]);

  function majParam(cle, valeur) {
    const suivants = new URLSearchParams(params);
    if (valeur) suivants.set(cle, valeur);
    else suivants.delete(cle);
    setParams(suivants);
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-5 pb-3 bg-white sticky top-0 z-10 border-b border-line">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
            <ChevronLeft size={20} className="text-ink" />
          </button>
          <div className="flex-1 bg-[#F4F1E8] rounded-xl px-3 py-2.5 flex items-center gap-2 text-muted text-sm">
            <Search size={15} />
            Quartier, type, budget...
          </div>
        </div>
      </div>

      <div className="px-4 mt-3 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => majParam("operation", null)}
            className={`shrink-0 text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap border ${
              !operationActive ? "bg-brand text-white border-brand" : "bg-white text-ink border-line"
            }`}
          >
            Louer &amp; vendre
          </button>
          {Object.entries(OPERATIONS).map(([cle, { label }]) => (
            <button
              key={cle}
              onClick={() => majParam("operation", cle)}
              className={`shrink-0 text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap border ${
                operationActive === cle
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-ink border-line"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => majParam("type", null)}
            className={`shrink-0 text-[13px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap border ${
              !typeActif ? "bg-brand text-white border-brand" : "bg-white text-ink border-line"
            }`}
          >
            Tous types
          </button>
          {Object.entries(TYPES_BIEN).map(([cle, { label, emoji }]) => (
            <button
              key={cle}
              onClick={() => majParam("type", cle)}
              className={`shrink-0 text-[13px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap border ${
                typeActif === cle
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-ink border-line"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => majParam("quartier", null)}
            className={`shrink-0 text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap border ${
              !quartierActif ? "bg-brand text-white border-brand" : "bg-white text-ink border-line"
            }`}
          >
            Tous quartiers
          </button>
          {quartiers.map((q) => (
            <button
              key={q.id}
              onClick={() => majParam("quartier", q.nom)}
              className={`shrink-0 text-[13px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap border ${
                quartierActif === q.nom
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-ink border-line"
              }`}
            >
              {q.nom}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {!chargement && (
          <p className="text-[13px] text-muted mb-2">
            {maisons.length} annonce{maisons.length > 1 ? "s" : ""} trouvée
            {maisons.length > 1 ? "s" : ""}
          </p>
        )}
        <div className="grid grid-cols-1 gap-3">
          {!chargement && maisons.length === 0 && (
            <div className="text-center py-10 text-muted text-sm">
              Aucune annonce ne correspond à ces critères pour l'instant.
            </div>
          )}
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
