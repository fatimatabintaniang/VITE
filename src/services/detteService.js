import { ApiClient } from '../data/ApiClient.js';

export class DetteService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getByClientId(clientId) {
    try {
      if (!clientId) throw new Error("ID client requis");
      const response = await this.api.get("dettes", { clientId });
 return Array.isArray(response?.data) ? response.data : [];    } catch (error) {
      console.error("Erreur lors de la récupération des dettes:", error);
      throw new Error("Impossible de charger les dettes");
        return [];
    }
  }

  async createDemande(demande) {
    try {
      return await this.api.post("demandeDettes", {
        ...demande,
        statut: "pending",
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erreur lors de la création de la demande:", error);
      throw error;
    }
  }

  async getDemandesByClient(clientId) {
    try {
      const response = await this.api.get("demandeDettes", { clientId });
 return Array.isArray(response?.data) ? response.data : [];    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      throw new Error("Impossible de charger les demandes");
      return [];
    }
  }

  async validerDemande(demandeId, data) {
    try {
      return await this.api.patch(`demandeDettes/${demandeId}`, null, {
        ...data,
        statut: "approved",
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      throw error;
    }
  }

  async rembourser(detteId, montant) {
    try {
      return await this.api.patch(`dettes/${detteId}`, null, {
        montant,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("DetteService.rembourser:", error);
      throw error;
    }
  }

  async getHistorique(clientId) {
    try {
      const response = await this.api.get(`dettes/historique`, { clientId });
      return response.data;
    } catch (error) {
      console.error("DetteService.getHistorique:", error);
      throw error;
    }
  }
}