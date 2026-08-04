import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connexionAdmin } from "../lib/auth";

export default function AdminConnexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();

  async function soumettre(e) {
    e.preventDefault();
    setErreur(null);
    setEnvoi(true);
    try {
      await connexionAdmin(email, motDePasse);
      navigate("/admin");
    } catch (err) {
      setErreur("Identifiants incorrects.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="px-4 pt-10 pb-24 max-w-sm mx-auto">
      <h1 className="text-[20px] font-bold text-ink font-display mb-1">Espace admin</h1>
      <p className="text-[13px] text-muted mb-6">Connexion réservée à l'équipe TonaBk.</p>

      <form onSubmit={soumettre} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded-xl px-4 py-3 text-sm"
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="w-full border border-line rounded-xl px-4 py-3 text-sm"
        />
        {erreur && <p className="text-red-600 text-[13px]">{erreur}</p>}
        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-brand text-white rounded-xl py-3.5 font-semibold text-[15px] disabled:opacity-60"
        >
          {envoi ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
