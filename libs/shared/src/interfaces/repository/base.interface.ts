import { IDeleteRepository } from './operations/delete.interface';
import { IQueryRepository } from './queries/query.interface';
import { IReadRepository } from './operations/read.interface';
import { IWriteRepository } from './operations/write.interface';

export interface IBaseRepository<T, TCreate, TUpdate>
  extends IReadRepository<T>,
    IQueryRepository<T>,
    IWriteRepository<T, TCreate, TUpdate>,
    IDeleteRepository {}
