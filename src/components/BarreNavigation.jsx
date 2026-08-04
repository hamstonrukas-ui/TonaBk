import { NavLink } from "react-router-dom";
import { Home, Search, Megaphone } from "lucide-react";

const ONGLETS = [
  { to: "/", label: "Accueil", Icon: Home, end: true },
  { to: "/recherche", label: "Recherche", Icon: Search },
  { to: "/publier", label: "Publier", Icon: Megaphone },
];

export default function BarreNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-line px-6 py-2.5 flex justify-around">
      {ONGLETS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[11px] ${
              isActive ? "text-brand" : "text-[#A3ADA9]"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </div>
  );
}
