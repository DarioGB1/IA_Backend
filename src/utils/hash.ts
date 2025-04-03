import * as bcrypt from 'bcrypt';

export class Hash {

    static generate(data: string | Buffer): Promise<string> {
        return bcrypt.genSalt(10).then(salt => bcrypt.hash(data, salt));
    }

    static compare(value: string, hash: string): Promise<boolean> {
        return bcrypt.compare(value, hash);
    }
}