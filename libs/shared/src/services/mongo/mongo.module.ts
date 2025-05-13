import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({})
export class MongoModule {
    static register(dbUrl: string, dbName: string): DynamicModule {
        return {
            module: MongoModule,
            imports: [
                MongooseModule.forRoot(dbUrl, {
                    dbName
                }),
            ],
            providers: [],
            exports: [],
        };
    }
}