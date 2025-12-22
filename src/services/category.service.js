import { Category } from "../domain/category/Category.js";
import { ApiClient } from "../data/api-client.js";

export class CategoryService {
  constructor(base = "http://localhost:3000/categories") {
    this.api = new ApiClient(base);
  }

  async list(page = 1, limit = 10, boutiquier_id = null) {
    const params = {
      _page: page,
      _limit: limit,
    };
    if (boutiquier_id) {
      params.boutiquier_id = boutiquier_id;
    }

    const { data, headers } = await this.api.get('', params);
    return {
      data: data.map(Category.fromDto),
      headers,
    };
  }

  async create(c) {
    if (!c.isValid()) throw new Error("Invalid");
    const { id, ...body } = c.toDto();
    const data = await this.api.post('', body);
    return Category.fromDto(data);
  }

  async update(c) {
  if (!c.isValid()) throw new Error("Invalid");
  if (c.id == null) throw new Error('id manquant pour update');
  const data = await this.api.put("", c.id, c.toDto());
  return Category.fromDto(data);
}
  async trash(id) {
    return this._toggle(id, true);
  }

  async restore(id) {
    return this._toggle(id, false);
  }

  async _toggle(id, deleted) {
    if (id == null) throw new Error('id manquant');
    const data = await this.api.patch('', id, { deleted });
    return Category.fromDto(data);
  }

  async get(id) {
    const data = await this.api.get(id);
    return Category.fromDto(data);
  }
async listAll(boutiquier_id = null) {
  const params = {
    _limit: 1000, // ou une valeur suffisamment grande
    deleted: false,
    actif: true,
  };
  if (boutiquier_id) {
    params.boutiquier_id = boutiquier_id;
  }
  const { data } = await this.api.get('', params);
  return data.map(Category.fromDto);
}


}
