import { IsNotEmpty, IsString } from "class-validator"
import { UserUpdateDto } from "../../request"

export class UserUpdate {
    @IsNotEmpty()
    @IsString()
    id: string

    @IsNotEmpty()
    updateData: UserUpdateDto
}