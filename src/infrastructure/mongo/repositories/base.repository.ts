import { IBaseRepository, Page } from 'src/domain/repositories/base.repository';
import { Document, Model } from 'mongoose';

export abstract class BaseMongoRepository<TEntity, TDocument extends Document>
  implements IBaseRepository<TEntity>
{
  constructor(protected readonly model: Model<TDocument>) {}

  protected abstract toEntity(document: TDocument): TEntity;
  protected abstract toDocument(entity: Partial<TEntity>): Partial<TDocument>;

  async existsById(id: string): Promise<boolean> {
    return !!(await this.model.exists({ _id: id }));
  }

  async getAll(): Promise<Page<TEntity>> {
    const [items, total] = await Promise.all([
      this.model.find().exec(),
      this.model.countDocuments(),
    ]);

    return {
      total,
      items: items.map(this.toEntity),
    };
  }

  async getById(id: string): Promise<TEntity | null> {
    const document = await this.model.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  async create(item: Record<string, any>): Promise<TEntity> {
    const createdDocument = await this.model.create(item);
    return this.toEntity(createdDocument);
  }

  async update(id: string, item: Partial<TEntity>): Promise<TEntity | null> {
    const document = await this.model
      .findByIdAndUpdate(id, this.toDocument(item), { new: true })
      .exec();

    return document ? this.toEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
