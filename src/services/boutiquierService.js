import { ApiClient } from "../data/ApiClient.js";

export class boutiquierService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  /**
   * Récupère tous les boutiquiers avec leurs informations utilisateur et localisation
   */
  async getAllBoutiquiers() {
    const boutiquiers = await this.api.get("boutiquiers");
    const utilisateurs = await this.api.get("utilisateurs");

    // Fusionne chaque boutiquier avec son utilisateur associé
    return boutiquiers.map(b => {
      const user = utilisateurs.find(u => u.id === b.id_utilisateur && u.id_role === "2" && u.deleted !== "true");
      if (user) {
        return {
          ...b,
          user
        };
      }
      return null;
    }).filter(b => b !== null); // supprime les null si l'utilisateur n'existe plus
  }

  /**
   * Supprime logiquement un boutiquier en mettant son utilisateur comme deleted = true
   */
  async deleteBoutiquier(id_utilisateur) {
    await this.api.patch(`utilisateurs/${id_utilisateur}`, { deleted: "true" });
  }

  /**
   * Ajoute un nouveau boutiquier
   * body = { id_utilisateur, localisation: { longitude, latitude } }
   */
  async addBoutiquier(body) {
    return await this.api.post("boutiquiers", body);
  }

  /**
   * Met à jour la localisation d'un boutiquier
   * body = { localisation: { longitude, latitude } }
   */
  async updateBoutiquier(id, body) {
    return await this.api.patch(`boutiquiers/${id}`, body);
  }
}
