import { get } from 'env-var';

export const Envs = {
  PORT: get('PORT').required().asPortNumber(),
  NATS_SERVER: get('NATS_SERVER').required().asUrlString(),
  ORIGINS: get('ORIGINS').required().asArray(),
  METHODS: get('METHODS').required().asString(),
  ALLOWED_HEADERS: get('ALLOWED_HEADERS').required().asString(),
};
