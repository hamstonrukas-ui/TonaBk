const CLD_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const CLD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

// Réduit la taille de l'image côté navigateur avant envoi : essentiel avec
// une connexion instable, ça évite d'envoyer des photos de 5 Mo depuis un téléphone.
export async function compresserImage(file, largeurMax = 1000, qualite = 0.78) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(largeurMax / img.width, 1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression échouée"))),
        "image/jpeg",
        qualite
      );
    };
    img.onerror = () => reject(new Error("Image illisible"));
  });
}

export async function televerserImage(file) {
  if (!CLD_CLOUD || !CLD_PRESET) {
    throw new Error(
      "Cloudinary non configuré : renseigne VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env"
    );
  }
  const compressee = await compresserImage(file);
  const donnees = new FormData();
  donnees.append("file", compressee);
  donnees.append("upload_preset", CLD_PRESET);
  donnees.append("folder", "tonabk");

  const reponse = await fetch(`https://api.cloudinary.com/v1_1/${CLD_CLOUD}/image/upload`, {
    method: "POST",
    body: donnees,
  });
  const resultat = await reponse.json();
  if (!resultat.secure_url) throw new Error("Échec de l'envoi de la photo");
  return resultat.secure_url;
}
