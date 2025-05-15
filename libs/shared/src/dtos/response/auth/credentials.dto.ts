import { UserResponse } from '../user/user.response.dto';

export interface CredentialsResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string | null;
}
