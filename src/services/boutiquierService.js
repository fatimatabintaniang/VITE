import { ApiClient } from "../data/ApiClient.js";
import { CloudinaryClient } from "./CloudinaryClient.js";

export class boutiquierService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
    this.cloudinary = new CloudinaryClient();
  }

  async getAllBoutiquiers() {
    const boutiquiers = await this.api.get("boutiquiers");
    const utilisateurs = await this.api.get("utilisateurs");

    return boutiquiers.map(b => {
      const user = utilisateurs.find(u => u.id == b.id_utilisateur && u.id_role === "2" && u.deleted !== "true");
      return user ? { ...b, user } : null;
    }).filter(b => b !== null);
  }


 async create(boutiquier) {
  try {
    // 1. Création de l'utilisateur
    const newUser = await this.api.post("utilisateurs", {
      nom: boutiquier.nom,
      prenom: boutiquier.prenom,
      email: boutiquier.email,
      telephone: boutiquier.telephone,
      password: boutiquier.password,
      id_role: "2", // rôle boutiquier
      image: boutiquier.image,
    });

    // 2. Création du boutiquier en utilisant l'id_utilisateur créé
    const newBoutiquier = await this.api.post("boutiquiers", {
      id_utilisateur: newUser.id,
      localisation: boutiquier.localisation,
    });

    // 3. Retourne les données combinées
    return {
      ...newUser,
      localisation: newBoutiquier.localisation,
    };

  } catch (error) {
    console.error("Erreur lors de la création du boutiquier :", error);

    // Si l'erreur vient du deuxième appel, supprime l'utilisateur créé pour cohérence
    if (newUser && newUser.id) {
      await this.api.delete(`utilisateurs/${newUser.id}`);
    }

    throw new Error('Échec de la création du boutiquier');
  }
}



  async uploadImage(file) {
  if (!file) return "";
  
  // Validation supplémentaire
  if (!(file instanceof File)) {
    console.warn('Fichier invalide:', file);
    return "";
  }

  try {
    const result = await this.cloudinary.uploadImage(file);
    return result.secure_url || result.url || "";
  } catch (error) {
    console.error("Échec upload Cloudinary:", {
      fileName: file.name,
      fileType: file.type,
      error: error.message
    });
    throw error; 
  }
}

  _getUserFriendlyError(error) {
    if (error.message.includes('upload')) {
      return 'Échec du téléchargement de l\'image. Veuillez réessayer avec une autre image.';
    }
    if (error.message.includes('400')) {
      return 'Données invalides. Vérifiez les informations saisies.';
    }
    return error.message || 'Une erreur inattendue est survenue';
  }

  async deleteBoutiquier(id_utilisateur) {
    try {
      await this.api.patch(`utilisateurs/${id_utilisateur}`, { deleted: "true" });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw new Error('Échec de la suppression du boutiquier');
    }
  }

  async updateBoutiquier(id, body) {
    try {
      return await this.api.patch(`boutiquiers/${id}`, body);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      throw new Error('Échec de la mise à jour du boutiquier');
    }
  }
}