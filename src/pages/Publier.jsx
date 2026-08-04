import { Megaphone, PhoneCall } from "lucide-react";

const NUMERO_EQUIPE = "+243 000 000 000";

export default function Publier() {
  return (
    <div className="px-4 pt-6 pb-24">
      <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4">
        <Megaphone size={26} className="text-ink" strokeWidth={2.5} />
      </div>
      <h1 className="text-[20px] font-bold text-ink leading-snug font-display">
        Vous avez une maison à louer ?
      </h1>
      <p className="text-[14px] text-[#3A4744] leading-relaxed mt-2">
        Pour l'instant, seule l'équipe TonaBk publie les annonces afin de garantir que chaque
        maison est vérifiée sur place. Contactez-nous avec l'adresse, le prix et des photos, et
        nous nous occupons du reste.
      </p>

      <div className="mt-5 bg-white rounded-2xl border border-line p-4">
        <p className="text-[13px] font-semibold text-muted uppercase tracking-wide mb-2">
          Ce qu'il faut préparer
        </p>
        <ul className="text-[14px] text-[#3A4744] space-y-1.5 list-disc pl-4">
          <li>Le quartier et l'adresse de la maison</li>
          <li>Le prix mensuel souhaité</li>
          <li>Quelques photos claires</li>
          <li>Vos coordonnées pour la visite</li>
        </ul>
      </div>

      <a
        href={`tel:${NUMERO_EQUIPE.replace(/\s/g, "")}`}
        className="mt-5 w-full bg-brand text-white rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-[15px]"
      >
        <PhoneCall size={18} />
        Appeler l'équipe · {NUMERO_EQUIPE}
      </a>
    </div>
  );
}
