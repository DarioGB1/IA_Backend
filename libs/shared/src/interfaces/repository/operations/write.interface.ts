export interface IWriteRepository<T, TCreate, TUpdate> {
    create(item: TCreate): Promise<T>;
    update(id: string, item: TUpdate): Promise<T>;
}