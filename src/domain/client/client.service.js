import { Client } from './Client.js';
import { CloudinaryClient } from '../../data/api/CloudinaryClient.js';

export class ClientService {
  constructor(repo) {
    this.repo = repo;
    this.cloudinaryClient = new CloudinaryClient(); 
  }

  async list() {
    return this.repo.list();
  }

  async create(client) {
    if (!(client instanceof Client)) {
      client = new Client(client);
    }
    if (!client.isValid()) {
      throw new Error("Client invalide");
    }
    return this.repo.createFull(client);
  }

async uploadImage(file) {
  if (!file) return "";
  
  // Validation supplémentaire
  if (!(file instanceof File)) {
    console.warn('Fichier invalide:', file);
    return "";
  }

  try {
    const result = await this.cloudinaryClient.uploadImage(file);
    return result.secure_url || result.url || "";
  } catch (error) {
    console.error("Échec upload Cloudinary:", {
      fileName: file.name,
      fileType: file.type,
      error: error.message
    });
    throw error; // Propage l'erreur pour gestion UI
  }
}

  async update(client) {
    if (!(client instanceof Client)) {
      client = new Client(client);
    }
    if (!client.id_utilisateur) {
      throw new Error("ID utilisateur manquant");
    }
    if (!client.isValid()) {
      throw new Error("Client invalide");
    }
    return this.repo.update(client);
  }

  async trash(id_utilisateur) {
    if (!id_utilisateur) throw new Error("ID utilisateur manquant");
    return this.repo.trash(id_utilisateur);
  }

  async restore(id) {
    if (!id) throw new Error("ID manquant");
    return this.repo.restore(id);
  }
}
