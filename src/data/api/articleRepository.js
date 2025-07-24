import { ApiClient } from '../api-client.js';
import { Article } from '../../domain/article/Article.js';

export class ArticleRepository {
  constructor(base = 'http://localhost:3000/articles') {
    this.api = new ApiClient(base);
  }

  /* ---------- READ ---------- */
async list(params = {}) {
  const query = {
    _page: params._page || 1,
    _limit: params._limit || 10,
    ...params
  };

  // Retirer nos paramètres personnalisés de la requête
  delete query._page;
  delete query._limit;

  const response = await this.api.get('', query);
  return {
    data: response.data.map(Article.fromDto),
    headers: response.headers
  };
}

  /* ---------- CREATE ---------- */
  create(article) {
    // On retire l'id car le serveur va le générer
    const { id, ...body } = article.toDto();
    return this.api.post('', body).then(Article.fromDto);
  }

  /* ---------- UPDATE ---------- */
  update(article) {
    if (article.id == null) throw new Error('id manquant pour update');
    return this.api.put('', article.id, article.toDto()).then(Article.fromDto);
  }

  /* ---------- SOFT-DELETE / RESTORE ---------- */
  trash(id)   { return this._toggle(id, true); }
  restore(id) { return this._toggle(id, false); }

  _toggle(id, del) {
    if (id == null) throw new Error('id manquant');
    return this.api
      .patch('', id, { deleted: del })
      .then(Article.fromDto);
  }
   async get(id) {
    const { data } = await this.api.get(id);
    return Article.fromDto(data);
  }

  async listByCategory(categoryId, excludeId = null, limit = 4) {
    const params = {
      categoryId: categoryId,
      deleted: false,
      _limit: limit
    };

    if (excludeId) {
      params.id_ne = excludeId; 
    }

    const { data } = await this.api.get('', params);
    return data.map(Article.fromDto);
  }
}
