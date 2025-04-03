import { IBaseRepository, Page } from "src/domain/repositories/base.repository";
import { Document, Model } from "mongoose";

export abstract class BaseMongoRepository<TEntity, TDocument extends Document>
    implements IBaseRepository<TEntity> {

    constructor(protected readonly model: Model<TDocument>) { }

    protected abstract toEntity(document: TDocument): TEntity;
    protected abstract toDocument(entity: Partial<TEntity>): Partial<TDocument>;

    async ExistsById(id: string): Promise<boolean> {
        return !!(await this.model.exists({ _id: id }));
    }

    async GetAll(): Promise<Page<TEntity>> {
        const [items, total] = await Promise.all([
            this.model.find().exec(),
            this.model.countDocuments()
        ]);

        return {
            total,
            items: items.map(this.toEntity)
        };
    }

    async GetById(id: string): Promise<TEntity | null> {
        const document = await this.model.findById(id).exec();
        return document ? this.toEntity(document) : null;
    }

    async Create(item: Record<string, any>): Promise<TEntity> {
        const createdDocument = await this.model.create(item);
        return this.toEntity(createdDocument);
    }

    async Update(id: string, item: Partial<TEntity>): Promise<TEntity | null> {
        const document = await this.model.findByIdAndUpdate(
            id,
            this.toDocument(item),
            { new: true }
        ).exec();

        return document ? this.toEntity(document) : null;
    }

    async Delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }
}