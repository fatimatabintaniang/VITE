import { CloudinaryClient } from '../../data/api/CloudinaryClient.js';
export class BoutiquierService {
  constructor(repository) {
    this.repo = repository;
     this.cloudinaryClient = new CloudinaryClient(); 
  }

  async list(includeDeleted = false) {
    return this.repo.list(includeDeleted);
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
    throw error; 
  }
}

  async create(boutiquier) {
    return this.repo.create(boutiquier);
  }

  async get(id) {
    return this.repo.get(id);
  }

  async update(id, data) {
    return this.repo.update(id, data);
  }

  async softDelete(id) {
    return this.repo.softDelete(id);
  }

  async restore(id) {
    return this.repo.restore(id);
  }
}