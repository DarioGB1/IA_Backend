import { IsDate, IsString } from "class-validator";

export class Token {
    @IsString()
    value: string;

    @IsDate()
    expires: Date;
}