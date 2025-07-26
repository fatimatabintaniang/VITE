import { ApiClient } from '../data/ApiClient.js';

export class ClientService {
  constructor() {
    this.api = new ApiClient("http://localhost:3000");
  }

  async list(includeDeleted = false) {
    try {
      const [users, clients] = await Promise.all([
        this.api.get("utilisateurs", { id_role: 2 }),
        this.api.get("clients")
      ]);
      
      return users.data.map(user => {
        const clientData = clients.data.find(c => c.id_utilisateur === user.id) || {};
        
        return { ...user, ...clientData };
      }).filter(client => includeDeleted || !client.deletedAt);
    } catch (error) {
      console.error("List clients error:", error);
      throw new Error("Impossible de charger les clients");
    }
  }

  async get(id) {
    if (!id) throw new Error("ID client requis");
    try {
      const [user, client] = await Promise.all([
        this.api.get(`utilisateurs/${id}`),
        this.api.get(`clients`, { id_utilisateur: id }).then(res => res.data[0])
      ]);
      return { ...user.data, ...client };
    } catch (error) {
      console.error("Get client error:", error);
      throw new Error("Client introuvable");
    }
  }

  async create(clientData) {
  if (!clientData?.nom || !clientData?.telephone) {
    throw new Error("Nom et téléphone sont obligatoires");
  }

  try {
    // 1. Créer l'utilisateur
    const { id: utilisateurId } = await this.api.post("utilisateurs", {
      prenom: clientData.prenom,
      nom: clientData.nom,
      email: clientData.email,
      telephone: clientData.telephone,
      id_role: "3"
    });

    // 2. Créer le client lié à l'utilisateur ET au boutiquier
    const client = await this.api.post("clients", {
      id_utilisateur: utilisateurId,
      id_boutiquier: clientData.id_boutiquier, // <-- C'est ici l'ajout clé
      solde: parseFloat(clientData.solde || 0),
      creditMax: parseFloat(clientData.creditMax || 0)
    });

    return { ...client, utilisateurId };
  } catch (error) {
    console.error("Create client error:", error);
    throw new Error("Échec de la création du client");
  }
}


  async update(id, updates) {
    try {
      const [user, client] = await Promise.all([
        this.api.patch(`utilisateurs/${id}`, null, {
          nom: updates.nom,
          prenom: updates.prenom,
          telephone: updates.telephone,
          email: updates.email
        }),
        this.api.patch(`clients/${id}`, null, {
          solde: updates.solde,
          creditMax: updates.creditMax
        })
      ]);
      return { ...user, ...client };
    } catch (error) {
      console.error("Update client error:", error);
      throw new Error("Échec de la mise à jour du client");
    }
  }

  async delete(id) {
    try {
      return await this.api.patch(`clients/${id}`, null, { 
        deletedAt: new Date().toISOString() 
      });
    } catch (error) {
      console.error("Delete client error:", error);
      throw new Error("Échec de la suppression du client");
    }
  }

  async restore(id) {
    try {
      return await this.api.patch(`clients/${id}`, null, { 
        deletedAt: null 
      });
    } catch (error) {
      console.error("Restore client error:", error);
      throw new Error("Échec de la restauration du client");
    }
  }

  async manageDebt(clientId, operation) {
    try {
      return await this.api.post(`clients/${clientId}/debt`, operation);
    } catch (error) {
      console.error("Manage debt error:", error);
      throw new Error("Échec de l'opération sur la dette");
    }
  }

 async listByBoutiquier(id_boutiquier, includeDeleted = false) {
  try {
    const allClients = await this.api.get("clients", { id_boutiquier });
    const clients = allClients.filter(c => c.id_boutiquier === id_boutiquier);
        console.log(id_boutiquier);

    
    

    const result = await Promise.all(
      clients.map(async (client) => {
        const utilisateur = await this.api.get(`utilisateurs/${client.id_utilisateur}`);
        return { ...client, utilisateur };
      })
    );

    return result.filter(c => includeDeleted || !c.deletedAt);
  } catch (error) {
    console.error("List clients by boutiquier error:", error);
    throw new Error("Impossible de charger les clients du boutiquier");
  }
}

async getClientById(id) {
  if (!id) throw new Error("ID client requis");
  try {
    // 1. Récupérer le client par son id (clé primaire clients.id)
    const client = await this.api.get(`clients/${id}`);
 
    if (!client) throw new Error("Client introuvable");

    // 2. Récupérer l'utilisateur lié via client.id_utilisateur
    const userRes = await this.api.get(`utilisateurs/${client.id_utilisateur}`);
    const user = userRes;
    

    // 3. Fusionner et retourner
    return { ...client, utilisateur: user };
  } catch (error) {
    console.error("getClientById error:", error);
    throw new Error("Impossible de récupérer le client");
  }
}




}