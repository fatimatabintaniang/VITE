export default class AdminScreen {
  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.innerHTML = `
    <div class="p-4 text-center">
      <h1 class="text-4xl font-bold mb-4 ">Bienvenue Admin</h1>
      <p class="text-gray-700">Vous pouvez gérer les utilisateurs, les rôles, et les permissions depuis cette interface.</p>  
    </div>
    `;
   
  }
}
