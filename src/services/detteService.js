import { ApiClient } from '../data/ApiClient.js';

export class DetteService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async getByClientId(clientId) {
    try {
      const dettes = await this.api.get("dettes");
      // console.log("Toutes les dettes (sans filtrage):", dettes); // Debug
      return dettes || []; // Retourne tout sans filtrer
    } catch (error) {
      console.error("Erreur:", error);
      return [];
    }
  }

  async createDemande(demande) {
    try {
      return await this.api.post("demandeDettes", {
        ...demande,
        clientId: String(demande.clientId),
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
      if (!clientId) throw new Error("ID client requis");
      const demandes = await this.api.get("demandeDettes");
      if (!Array.isArray(demandes)) return [];
      
      // Filtrer côté client
      const clientIdStr = String(clientId);
      return demandes.filter(demande => 
        String(demande.clientId) === clientIdStr
      );
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
      const historique = await this.api.get("dettes/historique");
      if (!Array.isArray(historique)) return [];
      
      // Filtrer côté client
      return historique.filter(dette => 
        String(dette.clientId) === String(clientId)
      );
    } catch (error) {
      console.error("DetteService.getHistorique:", error);
      return [];
    }
  }
}