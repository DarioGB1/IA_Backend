import { get } from "env-var";

export const Envs = {
    JWT_SECRET: get("JWT_SECRET").required().asString(),
    JWT_EXPIRATION_TIME_IN_MINUTES: get("JWT_EXPIRATION_TIME_IN_MINUTES").required().asIntPositive(),
    REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS: get("REFRESH_TOKEN_EXPIRATION_TIME_IN_DAYS").required().asIntPositive(),
    DATABASE_NAME: get("DATABASE_NAME").required().asString(),
    DATABASE_URL: get("DATABASE_URL").required().asUrlString(),
    REDIS_URL: get("REDIS_URL").required().asUrlString(),
    NATS_SERVER: get("NATS_SERVER").required().asUrlString(),
}