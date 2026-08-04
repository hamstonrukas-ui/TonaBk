import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, BedDouble, Bath, ShieldCheck, MessageCircle, Heart, Eye } from "lucide-react";
import Tampon from "../components/Tampon";
import { obtenirMaison } from "../lib/data";
import { useFavoris } from "../lib/favoris";
import { TYPES_BIEN } from "../lib/constantes";

export default function Fiche() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [m, setM] = useState(null);
  const [erreur, setErreur] = useState(null);
  const { favoris, basculer } = useFavoris();

  useEffect(() => {
    obtenirMaison(id).then(setM).catch((e) => setErreur(e.message));
  }, [id]);

  if (erreur) return <p className="p-4 text-red-600 text-sm">Erreur : {erreur}</p>;
  if (!m) return <p className="p-4 text-muted text-sm">Chargement...</p>;

  const photo = m.photos_maison?.sort((a, b) => a.ordre - b.ordre)[0]?.url;
  const quartier = m.quartiers?.nom;
  const commune = m.quartiers?.commune;
  const type = TYPES_BIEN[m.type] || TYPES_BIEN.maison;
  const estFavori = favoris.includes(m.id);
  const msg = encodeURIComponent(`Bonjour, je suis intéressé(e) par "${m.titre}" à ${quartier} sur TonaBk.`);

  return (
    <div className="pb-24">
      <div className="relative">
        <img src={photo} alt={m.titre} className="w-full h-64 object-cover bg-line" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow"
        >
          <ChevronLeft size={18} className="text-ink" />
        </button>
        <button
          onClick={() => basculer(m.id)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow"
        >
          <Heart size={18} className={estFavori ? "text-red-500" : "text-ink"} fill={estFavori ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="px-4 -mt-6 relative">
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(15,45,40,0.1)]">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[13px] text-muted">
              <MapPin size={13} /> {quartier}{commune ? `, commune de ${commune}` : ""}
            </span>
            {m.verifie && <Tampon small />}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted mt-1.5">
            <span>{type.emoji} {type.label}</span>
            <span>·</span>
            <span>{m.operation === "vendre" ? "À vendre" : "À louer"}</span>
            {m.vues > 0 && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {m.vues} vues</span>
              </>
            )}
          </div>
          <h1 className="text-[19px] font-bold text-ink mt-1.5 leading-snug font-display">
            {m.titre}
          </h1>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-brand font-display">${m.prix}</span>
            {m.operation !== "vendre" && <span className="text-[13px] text-muted">/ mois</span>}
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-[#EFEBE0]">
            {m.chambres > 0 && (
              <div className="flex items-center gap-1.5 text-ink text-sm">
                <BedDouble size={16} className="text-brand" /> {m.chambres} chambres
              </div>
            )}
            {m.douches > 0 && (
              <div className="flex items-center gap-1.5 text-ink text-sm">
                <Bath size={16} className="text-brand" /> {m.douches} douches
              </div>
            )}
            {m.superficie && (
              <div className="flex items-center gap-1.5 text-ink text-sm">
                📐 {m.superficie} m²
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[13px] font-semibold text-muted uppercase tracking-wide mb-1.5">
            Description
          </p>
          <p className="text-[14px] text-[#3A4744] leading-relaxed">{m.description}</p>
        </div>

        <div className="mt-4 bg-[#F4F1E8] rounded-2xl p-4 flex items-center gap-3">
          <ShieldCheck size={20} className="text-brand shrink-0" />
          <p className="text-[13px] text-[#3A4744] leading-snug">
            Cette annonce a été vérifiée sur place par l'équipe TonaBk. Aucune commission cachée.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-4 pt-3 bg-white/95 backdrop-blur border-t border-line">
        <a
          href={`https://wa.me/?text=${msg}`}
          className="w-full bg-brand text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px]"
        >
          <MessageCircle size={18} />
          Contacter sur WhatsApp
        </a>
      </div>
    </div>
  );
}
