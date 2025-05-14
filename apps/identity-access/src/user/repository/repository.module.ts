import { Module } from "@nestjs/common";
import { User, UserSchema } from "./mongo/user.model";
import { MongooseModule } from "@nestjs/mongoose";
import { MongoUserRepository } from "./mongo/user.repository";
import { USER_REPOSITORY } from "../interfaces/user.repository.interface";
import { Envs } from "../../config";

@Module({
    imports: [
        MongooseModule.forRoot(Envs.DATABASE_URL, {
            dbName: Envs.DATABASE_NAME,
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            }
        ])
    ],
    providers: [{
        provide: USER_REPOSITORY,
        useClass: MongoUserRepository
    }],
    exports: [USER_REPOSITORY]
})
export class UserRepositoryModule { }