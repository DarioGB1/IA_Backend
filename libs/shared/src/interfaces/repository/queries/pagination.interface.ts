export interface IPaginationRepository<T> {
  total: number;
  items: T[];
}
