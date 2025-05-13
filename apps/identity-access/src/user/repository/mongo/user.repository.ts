import { BaseMongoRepository, UserCreateDto, UserUpdateDto } from "@app/shared";
import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "./user.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { IUserRepository } from "../../interfaces/user.repository.interface";
import { UserEntity } from "../../user.entity";

@Injectable()
export class MongoUserRepository extends BaseMongoRepository<UserEntity, UserCreateDto, UserUpdateDto, UserDocument> implements IUserRepository {
    constructor(@InjectModel(User.name) protected readonly model: Model<UserDocument>) {
        super(model);
    }

    toEntity(document: UserDocument): UserEntity {
        return new UserEntity({
            id: document._id,
            profileImg: document.profileImg,
            name: document.name,
            lastName: document.lastName,
            email: document.email,
            password: document.password,
            active: document.active,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    }
}