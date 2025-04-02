import { UserResponseDto } from '../../user/response/user.dto';

export class CredentialsDto {
    user: UserResponseDto;
    accessToken: string;
    refreshToken: string;
}