import { ApiClient } from '../data/ApiClient.js';

export class DetteService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getByClientId(clientId) {
    try {
      const dettes = await this.api.get("dettes", { clientId });
      return Array.isArray(dettes) ? dettes : [];
    } catch (error) {
      console.error("Erreur:", error);
      return [];
    }
  }

  async createDemande(demande) {
    try {
      // Formatage des données pour inclure les articles
      const demandeData = {
        clientId: String(demande.clientId),
        montant: parseFloat(demande.montant),
        raison: demande.raison,
        statut: "pending",
        createdAt: new Date().toISOString(),
        articles: demande.articles.map(art => ({
          id: art.id,
          libelle: art.libelle,
          prix: parseFloat(art.prix)
        }))
      };

      return await this.api.post("demandeDettes", demandeData);
    } catch (error) {
      console.error("Erreur lors de la création de la demande:", error);
      throw error;
    }
  }

  async getDemandesByClient(clientId) {
    try {
      if (!clientId) throw new Error("ID client requis");
      const demandes = await this.api.get("demandeDettes", { clientId });
      return Array.isArray(demandes) ? demandes : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      return [];
    }
  }

  async validerDemande(demandeId, data) {
    try {
      return await this.api.patch(`demandeDettes/${demandeId}`, {
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
      return await this.api.patch(`dettes/${detteId}`, {
        montant: parseFloat(montant),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("DetteService.rembourser:", error);
      throw error;
    }
  }

  async getHistorique(clientId) {
    try {
      const historique = await this.api.get("dettes/historique", { clientId });
      return Array.isArray(historique) ? historique : [];
    } catch (error) {
      console.error("DetteService.getHistorique:", error);
      return [];
    }
  }
}