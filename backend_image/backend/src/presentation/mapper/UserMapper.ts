import {injectable} from "tsyringe";
import {CreateUserRequestUser} from "../validation/user/CreateUserRequestValidation";
import {User} from "../../domain/vo/user/User";
import {JwtPayload} from "jsonwebtoken";
import {Logger} from "tslog";

@injectable()
export class UserMapper {
    private readonly logger = new Logger({name: 'UserMapper'});

    fromZodObject(zodUser: CreateUserRequestUser): User {
        return new User(0, zodUser.username, zodUser.name, zodUser.email, zodUser.password, true);
    }

    fromJWTPayload(payload: JwtPayload | string): User | undefined {
        let id: any;
        let username: any;
        let name: any;
        let email: any;
        let active: any;

        let payloadObj: any;

        if (typeof payload === 'string') {
            try {
                payloadObj = JSON.parse(payload)
            } catch (error) {
                this.logger.error('Payload isn\'t a valid JSON object');
            }
        } else {
            payloadObj = payload;
        }

        id = payloadObj.id;
        username = payloadObj.username;
        name = payloadObj.name;
        email = payloadObj.email;
        active = payloadObj.active;

        let user: User | undefined = undefined;

        if ((typeof id === 'number') &&
            (typeof username === 'string') &&
            (typeof name === 'string') &&
            (typeof email === 'string') &&
            (typeof active === 'boolean')) {
            user = new User(
                id as number, username, name, email, undefined, active
            )
        }

        return user;
    }
}