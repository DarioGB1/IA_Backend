import { UserEntity } from "../entities/user.entity";
import { IBaseRepository } from "./base.repository";

export const UserRepository = "UserRepository"
export interface IUserRepository extends IBaseRepository<UserEntity> {
    GetByEmail(email: string): Promise<UserEntity | null>,
}