export interface IDeleteRepository {
    deleteById(id: string): Promise<boolean>;
}