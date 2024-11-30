import {Role} from 'src/auth/decorators/role.decorator'
export class RegisterDto{
    name:string;
    email:string;
    username:string;
    password:string;
    isAdmin:boolean;
    phoneNo:string;
}