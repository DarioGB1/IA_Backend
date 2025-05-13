import { IsNotEmptyObject } from "class-validator";
import { UserResponse } from "../../response/user/user.response.dto";
import { Token } from "./token.dto";

export class Credentials {
    @IsNotEmptyObject()
    user: UserResponse

    @IsNotEmptyObject()
    accessToken: Token;

    @IsNotEmptyObject()
    refreshToken: Token | null
}