import { get } from 'env-var';

export const Envs = {
  MAIL_HOST: get('MAIL_HOST').required().asString(),
  MAIL_PORT: get('MAIL_PORT').required().asInt(),
  MAIL_USERNAME: get('MAIL_USERNAME').required().asString(),
  MAIL_PASSWORD: get('MAIL_PASSWORD').required().asString(),
  NATS_SERVER: get('NATS_SERVER').required().asUrlString(),
};
