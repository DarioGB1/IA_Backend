import { Token } from "./token.dto";

export interface Tokens {
    accessToken: Token;
    refreshToken: Token | null
}