import { get } from 'env-var';

export const Envs = {
  PORT: get('PORT').required().asPortNumber(),
  NATS_SERVER: get('NATS_SERVER').required().asUrlString(),
};
