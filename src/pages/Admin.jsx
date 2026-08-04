import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, ImagePlus, X } from "lucide-react";
import {
  creerMaison,
  listerQuartiers,
  listerMaisons,
  supprimerMaison,
  ajouterPhoto,
} from "../lib/data";
import { deconnexionAdmin, sessionActuelle } from "../lib/auth";
import { televerserImage } from "../lib/upload";
import { TYPES_BIEN, OPERATIONS } from "../lib/constantes";

const VIDE = {
  titre: "",
  description: "",
  prix: "",
  chambres: "",
  douches: "",
  superficie: "",
  type: "maison",
  operation: "louer",
  quartier_id: "",
};

export default function Admin() {
  const navigate = useNavigate();
  const [quartiers, setQuartiers] = useState([]);
  const [maisons, setMaisons] = useState([]);
  const [form, setForm] = useState(VIDE);
  const [photos, setPhotos] = useState([]); // { fichier, apercu }
  const [envoi, setEnvoi] = useState(false);
  const [etapeEnvoi, setEtapeEnvoi] = useState("");
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    sessionActuelle().then((s) => {
      if (!s) navigate("/admin/connexion");
    });
    listerQuartiers().then(setQuartiers);
    rafraichir();
  }, []);

  function rafraichir() {
    listerMaisons().then(setMaisons).catch(() => {});
  }

  function ajouterPhotosLocales(e) {
    const fichiers = Array.from(e.target.files || []);
    const nouvelles = fichiers.map((fichier) => ({
      fichier,
      apercu: URL.createObjectURL(fichier),
    }));
    setPhotos((p) => [...p, ...nouvelles]);
    e.target.value = "";
  }

  function retirerPhotoLocale(index) {
    setPhotos((p) => p.filter((_, i) => i !== index));
  }

  async function publier(e) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      setEtapeEnvoi("Publication de l'annonce...");
      const maison = await creerMaison({
        titre: form.titre,
        description: form.description,
        prix: Number(form.prix),
        chambres: Number(form.chambres) || 0,
        douches: Number(form.douches) || 0,
        superficie: form.superficie ? Number(form.superficie) : null,
        type: form.type,
        operation: form.operation,
        quartier_id: form.quartier_id,
        statut: "publiee",
        verifie: true,
      });

      for (let i = 0; i < photos.length; i++) {
        setEtapeEnvoi(`Envoi photo ${i + 1}/${photos.length}...`);
        const url = await televerserImage(photos[i].fichier);
        await ajouterPhoto(maison.id, url, i);
      }

      setForm(VIDE);
      setPhotos([]);
      rafraichir();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
      setEtapeEnvoi("");
    }
  }

  async function retirer(id) {
    await supprimerMaison(id);
    rafraichir();
  }

  return (
    <div className="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[20px] font-bold text-ink font-display">Gérer les annonces</h1>
        <button
          onClick={async () => {
            await deconnexionAdmin();
            navigate("/admin/connexion");
          }}
          className="flex items-center gap-1 text-[13px] text-muted"
        >
          <LogOut size={14} /> Quitter
        </button>
      </div>

      <form onSubmit={publier} className="bg-white border border-line rounded-2xl p-4 space-y-3">
        <p className="text-[13px] font-semibold text-muted uppercase tracking-wide">
          Nouvelle annonce
        </p>
        <input
          required
          placeholder="Titre (ex. Maison 3 chambres avec cour)"
          value={form.titre}
          onChange={(e) => setForm({ ...form, titre: e.target.value })}
          className="w-full border border-line rounded-xl px-3 py-2.5 text-sm"
        />
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-line rounded-xl px-3 py-2.5 text-sm h-20"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          >
            {Object.entries(TYPES_BIEN).map(([cle, { label, emoji }]) => (
              <option key={cle} value={cle}>
                {emoji} {label}
              </option>
            ))}
          </select>
          <select
            value={form.operation}
            onChange={(e) => setForm({ ...form, operation: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          >
            {Object.entries(OPERATIONS).map(([cle, { label }]) => (
              <option key={cle} value={cle}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <input
            required
            type="number"
            placeholder="Prix ($)"
            value={form.prix}
            onChange={(e) => setForm({ ...form, prix: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          />
          <input
            type="number"
            placeholder="Chambres"
            value={form.chambres}
            onChange={(e) => setForm({ ...form, chambres: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          />
          <input
            type="number"
            placeholder="Douches"
            value={form.douches}
            onChange={(e) => setForm({ ...form, douches: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          />
          <input
            type="number"
            placeholder="m²"
            value={form.superficie}
            onChange={(e) => setForm({ ...form, superficie: e.target.value })}
            className="border border-line rounded-xl px-3 py-2.5 text-sm"
          />
        </div>
        <select
          required
          value={form.quartier_id}
          onChange={(e) => setForm({ ...form, quartier_id: e.target.value })}
          className="w-full border border-line rounded-xl px-3 py-2.5 text-sm"
        >
          <option value="">Quartier...</option>
          {quartiers.map((q) => (
            <option key={q.id} value={q.id}>
              {q.nom}
            </option>
          ))}
        </select>

        <div>
          <label className="flex items-center gap-2 border border-dashed border-line rounded-xl px-3 py-3 text-[13px] text-muted cursor-pointer">
            <ImagePlus size={16} />
            Ajouter des photos
            <input type="file" accept="image/*" multiple onChange={ajouterPhotosLocales} className="hidden" />
          </label>
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {photos.map((p, i) => (
                <div key={i} className="relative shrink-0">
                  <img src={p.apercu} alt="" className="w-16 h-16 object-cover rounded-lg border border-line" />
                  <button
                    type="button"
                    onClick={() => retirerPhotoLocale(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted mt-1.5">
            Les photos sont compressées automatiquement avant l'envoi.
          </p>
        </div>

        {erreur && <p className="text-red-600 text-[13px]">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-brand text-white rounded-xl py-3 font-semibold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <Plus size={16} />
          {envoi ? etapeEnvoi || "Publication..." : "Publier l'annonce"}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-[13px] font-semibold text-muted uppercase tracking-wide mb-2">
          Annonces publiées ({maisons.length})
        </p>
        <div className="space-y-2">
          {maisons.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-white border border-line rounded-xl px-3 py-2.5"
            >
              <div>
                <p className="text-[14px] font-medium text-ink">{m.titre}</p>
                <p className="text-[12px] text-muted">
                  {m.quartiers?.nom} · ${m.prix}/mois
                </p>
              </div>
              <button onClick={() => retirer(m.id)} className="text-[12px] text-red-600">
                Retirer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
