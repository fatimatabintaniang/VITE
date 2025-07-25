export class Category {
  constructor({ id = null, libelle = '', deleted = false, boutiquier_id = null }) {
    this.id = id;
    this.libelle = libelle.trim();
    this.deleted = !!deleted;
    this.boutiquier_id = boutiquier_id;
  }

  isValid() {
    return this.libelle.length > 1;
  }

  toDto() {
    return {
      id: this.id,
      libelle: this.libelle,
      deleted: this.deleted,
      boutiquier_id: this.boutiquier_id,
    };
  }

  static fromDto(dto) {
    return new Category(dto);
  }
}
