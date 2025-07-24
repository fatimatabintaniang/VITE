export class Client {
  constructor({
    id = null,
    id_utilisateur = null, 
    nom = "",
    prenom = "",
    email = "",
    password = "",
    id_role = "2",
    image = "",
    deleted = false,
  }) {
    this.id = id;
    this.id_utilisateur = id_utilisateur;
    this.nom = nom.trim();
    this.prenom = prenom.trim();
    this.email = email.trim();
    this.password = password.trim();
    this.id_role = id_role || "2";
    this.image = image;
    this.deleted = !!deleted;
  }

  isValid() {
    return this.nom && this.prenom && this.email && this.password;
  }
}
