import { v4 as uuidv4 } from 'uuid';

export class Guid {
  static NewGuid(): string {
    return uuidv4();
  }
}
