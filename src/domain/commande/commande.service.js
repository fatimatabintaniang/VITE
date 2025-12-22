export class CommandeService {
  constructor(repository) {
    this.repository = repository;
  }

  async list() {
    return this.repository.list();
  }

  async updateStatus(orderId, status) {
    return this.repository.updateStatus(orderId, status);
  }
}