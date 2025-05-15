export interface IReadRepository<T> {
  existsById(id: string): Promise<boolean>;
  getById(id: string): Promise<T | null>;
}
