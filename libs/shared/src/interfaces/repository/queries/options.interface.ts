export enum SortDirection {
    ASC = 1,
    DESC = -1
}

export interface IOptionsRepository<T> {
    filter?: Partial<T>;
    skip: number;
    limit: number;
    sort?: Record<keyof T, SortDirection>
}