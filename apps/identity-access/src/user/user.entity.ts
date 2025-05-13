interface Props {
    id: string;
    profileImg?: string | null;
    name: string;
    lastName: string;
    email: string;
    password: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class UserEntity {
    readonly id: string;
    readonly profileImg: string | null;
    readonly name: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly active: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor(props: Props) {
        this.id = props.id;
        this.profileImg = props.profileImg ?? null;;
        this.name = props.name;
        this.lastName = props.lastName;
        this.email = props.email;
        this.password = props.password;
        this.active = props.active;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}