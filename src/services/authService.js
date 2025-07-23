export class AuthService {
  async login(email, password) {
    const response = await fetch("/src/data/data.json");
    const data = await response.json();
    const users = data.utilisateurs;
    const roles = data.roles;

    const user = users.find(
      u => u.email === email && u.password === password && u.deleted !== "true"
    );

    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const role = roles.find(r => r.id === user.id_role);
    user.role = role ? role.libelle : "inconnu";

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}
