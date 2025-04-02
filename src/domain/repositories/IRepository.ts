interface Page<T> {
    total: number,
    items: T[],
}

export interface IRepository<T> {
    ExistsById(id: string): boolean,
    GetAll(): Page<T>,
    GetById(): T | null,
    Create(item: T): T,
    Update(item: Partial<T>): T | null,
    Delete(id: string): void
}