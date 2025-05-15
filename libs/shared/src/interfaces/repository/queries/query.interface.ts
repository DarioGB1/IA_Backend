import { IOptionsRepository } from './options.interface';
import { IPaginationRepository } from './pagination.interface';

export interface IQueryRepository<T> {
  getAll(options: IOptionsRepository<T>): Promise<IPaginationRepository<T>>;
}
