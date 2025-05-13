import { IDENTITY_ACCESS_MS, UserPattern, UserResponse, UserUpdate } from "@app/shared";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UserService {
    constructor(
        @Inject(IDENTITY_ACCESS_MS) private readonly userMS: ClientProxy,
    ) { }


    async findById(id: string): Promise<UserResponse> {
        return firstValueFrom(this.userMS.send(UserPattern.GET_ACCOUNT, id));
    }

    async update(userUpdate: UserUpdate): Promise<UserResponse> {
        return firstValueFrom(this.userMS.send(UserPattern.UPDATE_ACCOUNT, userUpdate));
    }

    async delete(id: string): Promise<boolean> {
        return firstValueFrom(this.userMS.send(UserPattern.DELETE_ACCOUNT, id));
    }
}