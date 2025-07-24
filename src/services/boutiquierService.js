import { ApiClient } from "../data/ApiClient.js";
import { CloudinaryClient } from "./CloudinaryClient.js";

export class boutiquierService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
    this.cloudinary = new CloudinaryClient();
  }



async getDeletedBoutiquiers() {
  const boutiquiers = await this.api.get("boutiquiers");
  const utilisateurs = await this.api.get("utilisateurs?deleted=true");
  
  return boutiquiers.map(b => {
    const user = utilisateurs.find(u => u.id == b.id_utilisateur && u.id_role === "2");
    return user ? { ...b, user } : null;
  }).filter(b => b !== null);
}

async restore(id) {
  await this.api.patch(`utilisateurs/${id}`, { deleted: false });
}

  async getAllBoutiquiers(includeDeleted = false) {
  const boutiquiers = await this.api.get("boutiquiers");
  const utilisateurs = await this.api.get("utilisateurs");

  return boutiquiers.map(b => {
    const user = utilisateurs.find(u => 
      u.id == b.id_utilisateur && 
      u.id_role === "2" &&
      (includeDeleted || u.deleted !== "true")
    );
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

async update(id, data) {
  try {
    // Validation des données requises
    if (!data.nom || !data.prenom || !data.email || !data.telephone) {
      throw new Error("Données utilisateur incomplètes");
    }

    // 1. Mise à jour de l'utilisateur
    const userUpdate = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      telephone: data.telephone
    };

    // Champs optionnels
    if (data.password) userUpdate.password = data.password;
    if (data.image) userUpdate.image = data.image;

    await this.api.patch(`utilisateurs/${id}`, userUpdate);

    // 2. Mise à jour de la localisation
    if (data.localisation) {
      const boutiquiers = await this.api.get(`boutiquiers?id_utilisateur=${id}`);
      
      const localisationUpdate = {
        localisation: {
          latitude: data.localisation.latitude || 0,
          longitude: data.localisation.longitude || 0
        }
      };

      if (boutiquiers.length > 0) {
        await this.api.patch(`boutiquiers/${boutiquiers[0].id}`, localisationUpdate);
      } else {
        await this.api.post('boutiquiers', {
          id_utilisateur: id,
          ...localisationUpdate
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur update détaillée:", {
      error: error.message,
      stack: error.stack,
      id: id,
      data: data
    });
    throw new Error(`Échec de la mise à jour: ${error.message}`);
  }
}

async getBoutiquierById(id) {
  try {
    const user = await this.api.get(`utilisateurs/${id}`);
    const boutiquiers = await this.api.get(`boutiquiers?id_utilisateur=${id}`);
    const boutiquierInfo = boutiquiers[0] || {};

    // Retourne un objet plat avec toutes les propriétés nécessaires
    return {
      id: user.id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      image: user.image || null,
      localisation: boutiquierInfo.localisation || {
        latitude: 0,
        longitude: 0
      }
    };
  } catch (error) {
    console.error("Erreur getBoutiquierById:", error);
    throw new Error("Impossible de charger les données du boutiquier");
  }
}

 async softDelete(id) {
  try {
    // 1. Mise à jour de l'utilisateur
    await this.api.patch(`utilisateurs/${id}`, {
      deleted: "true",
      deletedAt: new Date().toISOString()
    });

    // 2. Optionnel : Mettre à jour les produits associés
    // await this.api.patch(`produits?boutiquier_id=${id}`, {
    //   deleted: "true"
    // });

    return { success: true, message: "Boutiquier archivé avec succès" };
  } catch (error) {
    console.error("Erreur softDelete:", {
      id: id,
      error: error.message,
      stack: error.stack
    });
    throw new Error("Échec de l'archivage du boutiquier");
  }
}

//  async restore(id) {
//   try {
//     // 1. Restauration de l'utilisateur
//     await this.api.patch(`utilisateurs/${id}`, {
//       deleted: "false",
//       deletedAt: null
//     });

//     // 2. Optionnel : Restaurer les produits associés
//     // await this.api.patch(`produits?boutiquier_id=${id}`, {
//     //   deleted: "false"
//     // });

//     return { success: true, message: "Boutiquier restauré avec succès" };
//   } catch (error) {
//     console.error("Erreur restore:", {
//       id: id,
//       error: error.message,
//       stack: error.stack
//     });
//     throw new Error("Échec de la restauration du boutiquier");
//   }
// }
}