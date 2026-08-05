import { supabase } from "./supabase";

// -- Lecture publique -------------------------------------------------

const CHAMPS_MAISON =
  "id, titre, description, prix, chambres, douches, superficie, type, operation, verifie, a_la_une, vues, statut, quartiers(nom), photos_maison(url, ordre)";

export async function listerMaisons({ quartier, type, operation } = {}) {
  let requete = supabase
    .from("maisons")
    .select(CHAMPS_MAISON)
    .eq("statut", "publiee")
    .order("created_at", { ascending: false });

  if (quartier) requete = requete.eq("quartiers.nom", quartier);
  if (type) requete = requete.eq("type", type);
  if (operation) requete = requete.eq("operation", operation);

  const { data, error } = await requete;
  if (error) throw error;
  return data;
}

export async function obtenirMaison(id) {
  const { data, error } = await supabase
    .from("maisons")
    .select(
      "id, titre, description, prix, chambres, douches, superficie, type, operation, verifie, vues, quartiers(nom, commune), photos_maison(url, ordre)"
    )
    .eq("id", id)
    .single();
  if (error) throw error;

  // Comptabilise la vue sans bloquer l'affichage si ça échoue
  try {
    await supabase.rpc("incrementer_vues", { maison_id: id });
  } catch {
    // silencieux : la vue n'est pas critique pour l'affichage
  }

  return data;
}

export async function listerFavoris(ids) {
  if (!ids?.length) return [];
  const { data, error } = await supabase.from("maisons").select(CHAMPS_MAISON).in("id", ids);
  if (error) throw error;
  return data;
}

export async function listerQuartiers() {
  const { data, error } = await supabase.from("quartiers").select("id, nom").order("nom");
  if (error) throw error;
  return data;
}

// -- Back-office admin --------------------------------------------------

export async function creerMaison(maison) {
  // maison : { titre, description, prix, chambres, douches, quartier_id, statut }
  const { data, error } = await supabase.from("maisons").insert(maison).select().single();
  if (error) throw error;
  return data;
}

export async function modifierMaison(id, changements) {
  const { data, error } = await supabase
    .from("maisons")
    .update(changements)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function supprimerMaison(id) {
  const { error } = await supabase.from("maisons").delete().eq("id", id);
  if (error) throw error;
}

export async function ajouterPhoto(maisonId, url, ordre = 0) {
  const { error } = await supabase
    .from("photos_maison")
    .insert({ maison_id: maisonId, url, ordre });
  if (error) throw error;
}
