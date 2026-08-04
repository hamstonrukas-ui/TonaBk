import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import Accueil from "./pages/Accueil";
import Recherche from "./pages/Recherche";
import Fiche from "./pages/Fiche";
import Favoris from "./pages/Favoris";
import Publier from "./pages/Publier";
import AdminConnexion from "./pages/AdminConnexion";
import Admin from "./pages/Admin";
import BarreNavigation from "./components/BarreNavigation";
import { useFavoris } from "./lib/favoris";

export default function App() {
  const location = useLocation();
  const cacherNav = location.pathname.startsWith("/maison") || location.pathname.startsWith("/admin");
  const { favoris } = useFavoris();

  return (
    <div className="min-h-screen bg-cream flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-cream relative font-body">
        <div className="sticky top-0 z-30 bg-brand px-4 py-2.5 flex items-center justify-between">
          <h1 className="text-white text-[18px] font-bold tracking-tight font-display">TonaBk</h1>
          <div className="flex items-center gap-3">
            <Link to="/favoris" className="relative text-white">
              <Heart size={20} />
              {favoris.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoris.length}
                </span>
              )}
            </Link>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-ink font-bold text-xs">
              M
            </div>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/maison/:id" element={<Fiche />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/publier" element={<Publier />} />
          <Route path="/admin/connexion" element={<AdminConnexion />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {!cacherNav && <BarreNavigation />}
      </div>
    </div>
  );
}
