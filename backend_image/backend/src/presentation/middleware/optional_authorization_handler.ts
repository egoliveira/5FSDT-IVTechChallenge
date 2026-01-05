import {RequestHandler} from "express";

import jwt from 'jsonwebtoken';
import config from "../../config/config";
import {AppRequest} from "./AppRequest";
import {container} from "../../di/di";
import {UserMapper} from "../mapper/UserMapper";
import {RetrieveUserByIdUseCase} from "../../domain/usecase/user/RetrieveUserByIdUseCase";
import {RetrieveUserRolesByUserIdUseCase} from "../../domain/usecase/userroles/RetrieveUserRolesByUserIdUseCase";
import {AuthenticationError} from "../../domain/error/AuthenticationError";

export const optionalAuthorizationHandler: RequestHandler = async (req: AppRequest, res, next) => {

    const authorizationHeader = req.header('Authorization');
    let token: string | undefined = undefined;

    if (authorizationHeader) {
        const result = /Bearer (.+)/.exec(authorizationHeader);

        if (result) {
            token = result[1];
        }

        if (token) {
            try {
                const payload = jwt.verify(token, config.jwtSecret);
                const userFromPayload = container.resolve(UserMapper).fromJWTPayload(payload);

                if (userFromPayload) {
                    const user = await container.resolve(RetrieveUserByIdUseCase).execute(userFromPayload.id);

                    if (user) {
                        if (user.active) {
                            const userRoles = await container.resolve(RetrieveUserRolesByUserIdUseCase).execute(user.id);

                            if (userRoles) {
                                req.user = user;
                                req.userRoles = userRoles;

                                next();
                            } else {
                                throw new Error("Can't retrieve user roles.");
                            }
                        } else {
                            // It will be caught below
                            throw new Error("User isn't active anymore");
                        }
                    } else {
                        // It will be caught below
                        throw new Error("User does not exist");
                    }
                } else {
                    // It will be caught below
                    throw new Error("Invalid JWT token");
                }
            } catch (error) {
                throw new AuthenticationError('Invalid token');
            }
        } else {
            next();
        }
    } else {
        next();
    }
}