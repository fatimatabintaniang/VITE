export class User {
  constructor({
    id = null,
    email = "",
    password = "",
    name = "",
    tel = "",
    roleId = null,
    photo = null,
    localisation = null,
    deleted = false,
  }) {
    this.id = id;
    this.email = email.trim();
    this.password = password;
    this.name = name.trim();
    this.tel = tel;
    this.roleId = roleId;
    this.photo = photo;
    this.localisation = localisation;
    this.deleted = deleted;
  }

  isValid() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      this.name.length >= 2 &&
      emailRegex.test(this.email) &&
      this.password.length >= 6 &&
      this.roleId !== null
    );
  }

  toDto() {
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      roleId: this.roleId,
      photo: this.photo,
      localisation: this.localisation,
      tel: this.tel,
      deleted: this.deleted,
    };
  }

  static fromDto(dto) {
    return new User(dto);
  }
}
