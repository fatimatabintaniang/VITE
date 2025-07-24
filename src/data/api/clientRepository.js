export class ClientRepository {
  async list(page = 1, perPage = 12) {
    const resClients = await fetch("http://localhost:3000/clients");
    const clients = await resClients.json();

    const resUsers = await fetch("http://localhost:3000/utilisateurs");
    const users = await resUsers.json();

    // Combiner client + user
    const combined = clients.map(client => {
      const user = users.find(u => u.id === client.id_utilisateur) || {};
      return {
        ...client,
        id: client.id,
        id_utilisateur: client.id_utilisateur,
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        password: user.password || "",
        image: user.image || "",
        deleted: client.deleted || false,
      };
    });

    // Pagination
    const start = (page - 1) * perPage;
    const paginated = combined.slice(start, start + perPage);

    return {
      data: paginated,
      total: combined.length,
    };
  }

 async createFull(client) {
  // 1. Créer l'utilisateur
  const userRes = await fetch("http://localhost:3000/utilisateurs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      password: client.password,
      image: client.image,
      id_role: "2",
    }),
  });

  if (!userRes.ok) {
    const error = await userRes.text();
    throw new Error("Échec création utilisateur: " + error);
  }

  const newUser = await userRes.json();

  if (!newUser.id) {
    throw new Error("ID utilisateur non retourné par l'API");
  }

  // 2. Créer le client lié
  const clientRes = await fetch("http://localhost:3000/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_utilisateur: newUser.id,
      deleted: false,
    }),
  });

  if (!clientRes.ok) {
    const error = await clientRes.text();
    throw new Error("Échec création client: " + error);
  }

  const newClient = await clientRes.json();

  // 3. Retourne utilisateur + client créés
  return {
    utilisateur: newUser,
    client: newClient,
  };
}


  async update(client) {
    // Update utilisateur
    await fetch(`http://localhost:3000/utilisateurs/${client.id_utilisateur}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: client.id_utilisateur,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        password: client.password,
        image: client.image,
        id_role: "2",
      }),
    });

    // Update client
    await fetch(`http://localhost:3000/clients/${client.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: client.id,
        id_utilisateur: client.id_utilisateur,
        deleted: client.deleted || false,
      }),
    });
    return client;
  }

  async trash(id_utilisateur) {
    // Récupérer le client lié
    const resClients = await fetch("http://localhost:3000/clients");
    const clients = await resClients.json();
    const client = clients.find(c => c.id_utilisateur === id_utilisateur);
    if (!client) throw new Error("Client non trouvé");

    // Delete client
    await fetch(`http://localhost:3000/clients/${client.id}`, { 
      method: "PATCH",
          headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deleted: true }),


     });

    // Delete utilisateur
    await fetch(`http://localhost:3000/utilisateurs/${id_utilisateur}`, {
       method: "PATCH",
           headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ deleted: true }),

       });
}

  async restore(id_utilisateur) {
    const resClients = await fetch("http://localhost:3000/clients");
    const clients = await resClients.json();
    const client = clients.find(c => c.id_utilisateur === id_utilisateur);
    if (!client) throw new Error("Client non trouvé");

    await fetch(`http://localhost:3000/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deleted: false }),
    });
  }
}
