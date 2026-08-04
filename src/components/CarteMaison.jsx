import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, ArrowUpRight, Heart, Eye } from "lucide-react";
import Tampon from "./Tampon";
import { TYPES_BIEN } from "../lib/constantes";

export default function CarteMaison({ maison, estFavori, onBasculerFavori }) {
  const photo = maison.photos_maison?.sort((a, b) => a.ordre - b.ordre)[0]?.url;
  const quartier = maison.quartiers?.nom;
  const type = TYPES_BIEN[maison.type] || TYPES_BIEN.maison;

  return (
    <Link
      to={`/maison/${maison.id}`}
      className="block text-left w-full bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,45,40,0.08)] border border-line active:scale-[0.98] transition-transform"
    >
      <div className="relative">
        <img src={photo} alt={maison.titre} className="w-full h-40 object-cover bg-line" />
        <div className="absolute top-2 left-2 bg-white/95 rounded-full px-2.5 py-1 text-[11px] font-semibold text-ink flex items-center gap-1">
          <MapPin size={11} /> {quartier}
        </div>
        {maison.verifie && (
          <div className="absolute top-2 right-2 bg-white/95 rounded-full px-1.5 py-1">
            <Tampon small />
          </div>
        )}
        {onBasculerFavori && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBasculerFavori(maison.id);
            }}
            className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow"
          >
            <Heart
              size={14}
              className={estFavori ? "text-red-500" : "text-muted"}
              fill={estFavori ? "currentColor" : "none"}
            />
          </button>
        )}
        <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/95 flex items-center justify-center shadow">
          <ArrowUpRight size={14} className="text-brand" strokeWidth={2.5} />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
          <span>{type.emoji} {type.label}</span>
          <span>·</span>
          <span>{maison.operation === "vendre" ? "À vendre" : "À louer"}</span>
        </div>
        <h3 className="text-[15px] font-semibold text-ink leading-snug font-display">
          {maison.titre}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 text-muted text-[13px]">
          {maison.chambres > 0 && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {maison.chambres}
            </span>
          )}
          {maison.douches > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {maison.douches}
            </span>
          )}
          {maison.vues > 0 && (
            <span className="flex items-center gap-1">
              <Eye size={14} /> {maison.vues}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-lg font-bold text-brand font-display">${maison.prix}</span>
          {maison.operation !== "vendre" && <span className="text-[12px] text-muted">/ mois</span>}
        </div>
      </div>
    </Link>
  );
}
