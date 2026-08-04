import { supabase } from "./supabase";

export async function connexionAdmin(email, motDePasse) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse,
  });
  if (error) throw error;
  return data.session;
}

export async function deconnexionAdmin() {
  await supabase.auth.signOut();
}

export function surChangementSession(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}

export async function sessionActuelle() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
