
export class BoutiquierRepository {
  constructor() {
    this.BASE_URL = "http://localhost:3000";
  }

 async list(includeDeleted = false) {
  try {
    // 1. Récupère TOUS les boutiquiers (sans filtre deleted)
    const usersResponse = await fetch(`${this.BASE_URL}/utilisateurs?id_role=3`);
    if (!usersResponse.ok) throw new Error("Erreur serveur");
    
    let users = await usersResponse.json();

    // 2. Filtrage côté client si nécessaire
    if (!includeDeleted) {
      users = users.filter(user => !user.deleted);
    }

    // 3. Récupère les infos spécifiques boutiquiers
    const boutiquiersResponse = await fetch(`${this.BASE_URL}/boutiquiers`);
    if (!boutiquiersResponse.ok) throw new Error("Erreur serveur");
    
    const boutiquiers = await boutiquiersResponse.json();

    // 4. Combine les données avec filtrage
    return users
      .filter(user => includeDeleted || !user.deleted) 
      .map(user => {
        const boutiquierInfo = boutiquiers.find(b => b.id_utilisateur === user.id);
        return {
          ...user,
          localisation: boutiquierInfo?.localisation || null
        };
      });

  } catch (error) {
    console.error("Erreur Repository:", error);
    throw new Error("Impossible de charger les boutiquiers");
  }
}

  async create(boutiquier) {
    // 1. Création de l'utilisateur dans la table utilisateurs
    const userResponse = await fetch(`${this.BASE_URL}/utilisateurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: boutiquier.nom,
        prenom: boutiquier.prenom,
        email: boutiquier.email,
        tel: boutiquier.tel,
        password: boutiquier.password,
        id_role: "3",
        photo: boutiquier.photo,
      }),
    });

    if (!userResponse.ok) {
      throw new Error("Erreur lors de la création de l'utilisateur boutiquier");
    }

    const newUser = await userResponse.json();

    // 2. Création de l'entrée dans la table boutiquiers
    const boutiquierResponse = await fetch(`${this.BASE_URL}/boutiquiers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilisateur: newUser.id,
        localisation: boutiquier.localisation,
      }),
    });

    if (!boutiquierResponse.ok) {
      // Si échec, on supprime l'utilisateur créé pour garder la cohérence
      await fetch(`${this.BASE_URL}/utilisateurs/${newUser.id}`, {
        method: "DELETE",
      });
      throw new Error("Erreur lors de la création des informations boutiquier");
    }

    // Retourne les données combinées
    return {
      ...newUser,
      localisation: boutiquier.localisation,
    };
  }

  async get(id) {
    // 1. Récupère l'utilisateur
    const userResponse = await fetch(`${this.BASE_URL}/utilisateurs/${id}`);
    if (!userResponse.ok) {
      throw new Error("Boutiquier non trouvé");
    }
    const user = await userResponse.json();

    // Vérifie que c'est bien un boutiquier
    if (user.id_role !== "3") {
      throw new Error("L'utilisateur n'est pas un boutiquier");
    }

    // 2. Récupère les infos spécifiques au boutiquier
    const boutiquierResponse = await fetch(
      `${this.BASE_URL}/boutiquiers?id_utilisateur=${id}`
    );
    if (!boutiquierResponse.ok) {
      throw new Error("Informations boutiquier non trouvées");
    }
    const [boutiquierInfo] = await boutiquierResponse.json();

    // Combine les données
    return {
      ...user,
      localisation: boutiquierInfo?.localisation || null,
    };
  }

 async update(id, data) {
    // 1. Mise à jour de l'utilisateur dans la table utilisateurs
    const userResponse = await fetch(`${this.BASE_URL}/utilisateurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        tel: data.tel,
        ...(data.password && { password: data.password }), // Ne met à jour le mot de passe que s'il est fourni
        photo: data.photo,
      }),
    });

    if (!userResponse.ok) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur boutiquier");
    }

    const updatedUser = await userResponse.json();

    // 2. Mise à jour des informations spécifiques au boutiquier
    // D'abord, on récupère l'ID de l'entrée dans la table boutiquiers
    const boutiquierInfoResponse = await fetch(
      `${this.BASE_URL}/boutiquiers?id_utilisateur=${id}`
    );
    
    if (!boutiquierInfoResponse.ok) {
      throw new Error("Erreur lors de la récupération des informations boutiquier");
    }

    const [boutiquierInfo] = await boutiquierInfoResponse.json();
    let updatedBoutiquierInfo = {};

    if (boutiquierInfo) {
      // Si une entrée existe déjà, on la met à jour
      const response = await fetch(
        `${this.BASE_URL}/boutiquiers/${boutiquierInfo.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            localisation: data.localisation,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des informations boutiquier");
      }
      updatedBoutiquierInfo = await response.json();
    } else if (data.localisation) {
      // Si aucune entrée n'existe mais qu'on a une localisation, on en crée une nouvelle
      const response = await fetch(`${this.BASE_URL}/boutiquiers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilisateur: id,
          localisation: data.localisation,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création des informations boutiquier");
      }
      updatedBoutiquierInfo = await response.json();
    }

    // Retourne les données combinées
    return {
      ...updatedUser,
      localisation: updatedBoutiquierInfo?.localisation || null,
    };
  }

  async softDelete(id) {
    const response = await fetch(`${this.BASE_URL}/utilisateurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleted: true, deletedAt: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression du boutiquier");
    }

    return await response.json();
  }

  async restore(id) {
    const response = await fetch(`${this.BASE_URL}/utilisateurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleted: false, deletedAt: null }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la restauration du boutiquier");
    }

    return await response.json();
  }
}



