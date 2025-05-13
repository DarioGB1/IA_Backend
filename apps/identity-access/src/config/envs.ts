import { get } from "env-var";

export const Envs = {
    DATABASE_NAME: get("DATABASE_NAME").required().asString(),
    DATABASE_URL: get("DATABASE_URL").required().asUrlString(),
    NATS_SERVER: get("NATS_SERVER").required().asUrlString(),
}