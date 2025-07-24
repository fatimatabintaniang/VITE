export default class ClientScreen {
  constructor(root) {
    this.root = root;
  }

  render() {
    this.root.innerHTML = `<h1>Bienvenue Client</h1>`;
  }
}
