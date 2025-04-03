import { UserRole } from "../shared/enum/user-role";

export class UserEntity {
    readonly id: string;
    readonly avatar: string | null;
    readonly name: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
    readonly emailVerified: boolean;
    readonly active: boolean
    readonly createdAt: Date;
    readonly updatedAt: Date;


    constructor(props: UserEntity) {
        this.id = props.id;
        this.avatar = props.avatar;
        this.name = props.name;
        this.lastName = props.lastName;
        this.email = props.email;
        this.password = props.password;
        this.role = props.role;
        this.emailVerified = props.emailVerified;
        this.active = props.active;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}