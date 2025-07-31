import { ApiClient } from '../data/ApiClient.js';

export class DetteService {
  constructor() {
    this.api = new ApiClient("http://localhost:3001");
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
  // Lister toutes les demandes de dettes des clients du boutiquier
async getDemandesByBoutiquier(id_boutiquier) {
  try {
    const clients = await this.api.get("clients", { id_boutiquier });
    const clientIds = clients.map(c => c.id);

    const allDemandes = await this.api.get("demandeDettes");
    return allDemandes
      .filter(d => clientIds.includes(d.clientId))
      .map(d => ({
        ...d,
        client: clients.find(c => c.id === d.clientId)
      }));
  } catch (error) {
    console.error("Erreur lors du chargement des demandes du boutiquier:", error);
    return [];
  }
}
async getByBoutiquierId(boutiquierId) {
  try {
    const [dettes, clients] = await Promise.all([
      this.api.get("demandeDettes"),
      this.api.get("clients")
    ]);

    const dettesFiltrees = dettes.filter((d) => d.boutiquierId === boutiquierId);

    const result = await Promise.all(
      dettesFiltrees.map(async (dette) => {
        const client = clients.find((c) => c.id === dette.clientId);

        let utilisateur = null;
        if (client && client.id_utilisateur) {
          try {
            utilisateur = await this.api.get(`utilisateurs/${client.id_utilisateur}`);
          } catch (e) {
            console.warn(`Utilisateur introuvable pour client ${client.id}`);
          }
        }

        return {
          ...dette,
          client: {
            ...client,
            utilisateur
          }
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Erreur getByBoutiquierId:", error);
    return [];
  }
}




// Refuser une demande de dette
async refuserDemande(demandeId, motif = "") {
  try {
    return await this.api.patch(`demandeDettes/${demandeId}`, {
      statut: "refused",
      motifRefus: motif,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erreur lors du refus de la demande:", error);
    throw error;
  }
}

}