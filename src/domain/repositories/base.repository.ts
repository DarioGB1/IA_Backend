export interface Page<T> {
    total: number,
    items: T[],
}

export interface IBaseRepository<T> {
    ExistsById(id: string): Promise<boolean>,
    GetAll(): Promise<Page<T>>,
    GetById(id: string): Promise<T | null>,
    Create(item: Record<string, any>): Promise<T>,
    Update(id: string, item: Partial<T>): Promise<T | null>,
    Delete(id: string): Promise<void>
}