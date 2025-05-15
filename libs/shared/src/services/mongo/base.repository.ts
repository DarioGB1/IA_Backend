import {
  IBaseRepository,
  IOptionsRepository,
  IPaginationRepository,
} from '@app/shared/interfaces';
import { Document, Model, UpdateQuery } from 'mongoose';

export abstract class BaseMongoRepository<
  TEntity,
  TCreate,
  TUpdate,
  TDocument extends Document,
> implements IBaseRepository<TEntity, TCreate, TUpdate>
{
  constructor(protected readonly model: Model<TDocument>) {}

  protected abstract toEntity(document: TDocument): TEntity;

  async existsById(id: string): Promise<boolean> {
    return !!(await this.model.exists({ _id: id }));
  }

  async getAll(
    options: IOptionsRepository<TEntity>,
  ): Promise<IPaginationRepository<TEntity>> {
    const { limit = 10, skip = 0, filter = {}, sort = {} } = options;
    const [total, items] = await Promise.all([
      this.model.countDocuments(filter),
      this.model.find(filter).skip(skip).limit(limit).sort(sort),
    ]);

    return {
      total,
      items: items.map((item) => this.toEntity(item)),
    };
  }

  async getById(id: string): Promise<TEntity | null> {
    const document = await this.model.findById(id);
    return document ? this.toEntity(document) : null;
  }

  async create(item: TCreate): Promise<TEntity> {
    const document = await this.model.create(item);
    return this.toEntity(document);
  }

  async update(id: string, item: TUpdate): Promise<TEntity> {
    const document = (await this.model.findByIdAndUpdate(
      id,
      item as UpdateQuery<TDocument>,
      {
        new: true,
      },
    )) as TDocument;

    return this.toEntity(document);
  }

  async deleteById(id: string): Promise<boolean> {
    return (await this.model.deleteOne({ _id: id })).deletedCount > 0;
  }
}
