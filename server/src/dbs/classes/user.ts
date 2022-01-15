export interface IUser {
    username?: string;
    password?: string;
    email?: string;
    oauth?: string;
    picture?: string;
} 

export class User implements IUser {

    username?: string;
    password?: string;
    email?: string;
    oauth?: string;
    picture?: string;

    constructor(user: IUser) {
        this.username   = user.username;
        this.password   = user.password;
        this.email      = user.email;
        this.oauth      = user.oauth;
        this.picture    = user.picture;
    }
    
}
