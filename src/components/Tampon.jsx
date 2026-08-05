import { ShieldCheck } from "lucide-react";

export default function Tampon({ small }) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border-2 border-verifie text-verifie font-semibold uppercase tracking-wide font-display ${
        small ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      }`}
    >
      <ShieldCheck size={small ? 11 : 13} strokeWidth={2.5} />
      Vérifiée
    </div>
  );
}
