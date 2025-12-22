import { Article } from './Article.js';
import { CloudinaryClient } from '../../data/api/CloudinaryClient.js';

export class ArticleService {
  constructor(repository) {
    this.repo = repository;
    this.cloudinaryClient = new CloudinaryClient();
  }

 async list(params = {}) {
    return this.repo.list(params);
  }

  async create(article) {
    if (!(article instanceof Article)) {
      article = new Article(article);
    }
    if (!article.isValid()) {
      throw new Error('Article invalide');
    }
    return this.repo.create(article);
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

  async update(article) {
    if (!(article instanceof Article)) {
      article = new Article(article);
    }
    if (!article.id) {
      throw new Error('ID manquant pour la mise à jour');
    }
    if (!article.isValid()) {
      throw new Error('Article invalide');
    }
    return this.repo.update(article);
  }

  async trash(id) {
    if (!id) throw new Error('ID manquant');
    return this.repo.trash(id);
  }

  async restore(id) {
    if (!id) throw new Error('ID manquant');
    return this.repo.restore(id);
  }
  async get(id) {
    if (!id) throw new Error('ID manquant');
    return this.repo.get(id);
  }

  async listByCategory(categoryId, excludeId = null, limit = 4) {
    if (!categoryId) throw new Error('categoryId manquant');
    return this.repo.listByCategory(categoryId, excludeId, limit);
  }
}
