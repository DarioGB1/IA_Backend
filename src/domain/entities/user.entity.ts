import { UserRole } from "../shared/enum/user-role";

export class UserEntity {
    readonly id: string;
    readonly avatar:string|null;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;

    constructor(props: UserEntity) {
        this.id = props.id
        this.avatar = props.avatar ?? null;
        this.name = props.name;
        this.email = props.email;
        this.password = props.password;
        this.role = props.role;
     }
}