export interface Page<T> {
  total: number;
  items: T[];
}

export interface IBaseRepository<T> {
  existsById(id: string): Promise<boolean>;
  getAll(): Promise<Page<T>>;
  getById(id: string): Promise<T | null>;
  create(item: Record<string, any>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}
