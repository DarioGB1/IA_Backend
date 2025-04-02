import { UserEntity } from "../entities/user.entity";
import { IRepository } from "./IRepository";

export interface IUserRepository extends IRepository<UserEntity>{
    
}