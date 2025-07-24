export class CommandeRepository {
  async list() {
    // Dans une vraie implémentation, vous feriez un appel API
    // Pour l'exemple, nous utilisiors les données de db.json
    const response = await fetch('/db.json');
    const data = await response.json();
    
    // Transformer les dettes en commandes
    const orders = data.dette.map(dette => {
      const client = data.utilisateurs.find(u => u.id === data.clients.find(c => c.id === dette.id_client)?.id_utilisateur);
      const items = data.detteArticle
        .filter(da => da.id_dette === dette.id)
        .map(da => {
          const article = data.articles.find(a => a.id === da.id_article);
          return {
            id: da.id,
            articleId: da.id_article,
            name: article?.libelle || 'Article inconnu',
            price: da.prix_unitaire,
            quantity: da.quantite,
            image: article?.image
          };
        });
      
      return {
        id: dette.id,
        date: dette.date,
        clientId: dette.id_client,
        clientName: client ? `${client.prenom} ${client.nom}` : 'Client inconnu',
        boutiquierId: dette.id_boutique,
        total: dette.montant_total,
        status: 'pending', // À adapter selon votre logique
        items
      };
    });

    return { data: orders };
  }

  async updateStatus(orderId, status) {
    // Dans une vraie implémentation, vous feriez un appel API pour mettre à jour
    console.log(`Mise à jour commande ${orderId} -> ${status}`);
    return { success: true };
  }
}