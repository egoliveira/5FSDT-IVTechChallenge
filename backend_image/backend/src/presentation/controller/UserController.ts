import {RequestHandler} from "express";
import {CreateUserRequestValidation} from "../validation/user/CreateUserRequestValidation";
import {UserMapper} from "../mapper/UserMapper";
import {UserRolesMapper} from "../mapper/UserRolesMapper";
import {CreateUserUseCase, CreateUserUseCaseParams} from "../../domain/usecase/user/CreateUserUseCase";
import {container} from "../../di/di";
import {LoginRequestValidation} from "../validation/user/LoginRequestValidation";
import {PerformLoginUseCase, PerformLoginUseCaseParams} from "../../domain/usecase/user/PerformLoginUseCase";
import {AuthenticationError} from "../../domain/error/AuthenticationError";
import {sign} from "jsonwebtoken";
import config from "../../config/config";
import {FindUsersUseCase, FindUsersUseCaseParams} from "../../domain/usecase/user/FindUsersUseCase";
import {FindUsersRequestValidation} from "../validation/user/FindUsersRequestValidation";
import {UserRequestValidation} from "../validation/user/UserRequestValidation";
import {RetrieveUserByIdUseCase} from "../../domain/usecase/user/RetrieveUserByIdUseCase";
import {jsonStringifier} from "./JSONStringifier";
import {NotFoundError} from "../../domain/error/NotFoundError";
import {UpdateUserRequestValidation} from "../validation/user/UpdateUserRequestValidation";
import {UpdateUserUseCase, UpdateUserUseCaseParams} from "../../domain/usecase/user/UpdateUserUseCase";
import {RetrieveUserRolesByUserIdUseCase} from "../../domain/usecase/userroles/RetrieveUserRolesByUserIdUseCase";
import {UpdateUserRolesRequestValidation} from "../validation/user/UpdateUserRolesRequestValidation";
import {
    UpdateUserRolesByUserIdUseCase,
    UpdateUserRolesByUserIdUseCaseParams
} from "../../domain/usecase/userroles/UpdateUserRolesByUserIdUseCase";
import {UserToken} from "../../domain/vo/user/UserToken";
import {UserRoleFilter} from "../vo/UserRoleFilter";
import {AppRequest} from "../middleware/AppRequest";
import {RetrieveUsersWithPostsUseCase} from "../../domain/usecase/user/RetrieveUsersWithPostsUseCase";
import {ChangeUserPasswordRequestValidation} from "../validation/user/ChangeUserPasswordRequestValidation";
import {
    ChangeUserPasswordUseCase,
    ChangeUserPasswordUseCaseParams
} from "../../domain/usecase/user/ChangeUserPasswordUseCase";

export const loginController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to log in a specific user'

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/loginRequest"
                    },
                    examples: {
                        adminLoginRequest: { $ref: "#components/examples/adminLoginRequest" },
                        teacherLoginRequest: { $ref: "#components/examples/teacherLoginRequest" },
                        studentLoginRequest: { $ref: "#components/examples/studentLoginRequest" }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        missingInformation: {
                            value: {
                                message: 'String must contain at least 3 character(s) (path: username)'
                            },
                            summary: "Login error due to missing information"
                        }
                    }
                }
            }
        }
    */
    const bodyData = LoginRequestValidation.parse(req.body);

    const loginParams = new PerformLoginUseCaseParams(bodyData.username, bodyData.password);

    const user = await container.resolve(PerformLoginUseCase).execute(loginParams);

    if (user) {
        const sanitizedUser = JSON.parse(jsonStringifier(user));
        const jwt = sign(sanitizedUser, config.jwtSecret, {expiresIn: 60 * 60 * 24});

        /*
        #swagger.responses[200] = {
            description: "Login performed successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/loginResponse"
                    },
                    examples: {
                        loginResponse: { $ref: "#components/examples/loginResponse" }
                    }
                }
            }
        }
        */
        res.status(200).send(new UserToken(jwt));
    } else {
        /*
            #swagger.responses[401] = {
                description: "Invalid username or password",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            invalidUserNameOrPassword: {
                                value: {
                                    message: 'Invalid username or password'
                                },
                                summary: "Login error due to invalid username or password"
                            }
                        }
                    }
                }
            }
        */
        throw new AuthenticationError("Invalid username or password");
    }

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Login error due to internal server error"
                        }
                    }
                }
            }
        }
    */
};

export const createUserController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to create users'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/createUserRequest"
                    },
                    examples: {
                        createAdminUserRequest: { $ref: "#components/examples/createAdminUserRequest" },
                        createTeacherUserRequest: { $ref: "#components/examples/createTeacherUserRequest" },
                        createStudentUserRequest: { $ref: "#components/examples/createStudentUserRequest" }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        missingInformation: {
                            value: {
                                message: 'String must contain at least 3 character(s) (path: username)'
                            },
                            summary: "Create user error due to missing information"
                        }
                    }
                }
            }
        }
    */
    const bodyData = CreateUserRequestValidation.parse(req.body);

    const user = container.resolve(UserMapper).fromZodObject(bodyData.user);
    const userRoles = container.resolve(UserRolesMapper).fromZodObject(bodyData.userRoles);

    const params = new CreateUserUseCaseParams(user, userRoles);

    const newUser = await container.resolve(CreateUserUseCase).execute(params);

    /*
        #swagger.responses[201] = {
            description: "User created successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/userResponse"
                    },
                    examples: {
                        createUserResponse: { $ref: "#components/examples/userResponse" }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[409] = {
            description: "User already exists",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        userAlreadyExistsErrorResponse: {
                            value: {
                                message: 'User admin already exists.'
                            },
                        }
                    }
                }
            }
        }
     */

    res.status(201).send(jsonStringifier(newUser));

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Create user error due to internal server error"
                        }
                    }
                }
            }
        }
    */
};

export const findUsersController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to find users'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/partialUsername','#components/parameters/partialName',
            '#components/parameters/partialEmail', '#components/parameters/userActiveFlag',
            '#components/parameters/userRole', '#components/parameters/findUsersSortBy',
            '#components/parameters/sortOrder', '#components/parameters/page',
            '#components/parameters/pageSize']
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        missingInformation: {
                            value: {
                                message: 'String must contain at least 2 character(s) (path: username)'
                            },
                            summary: "Find users error due to missing information"
                        }
                    }
                }
            }
        }
    */
    const queryData = FindUsersRequestValidation.parse(req.query);

    const params = new FindUsersUseCaseParams(
        queryData.username,
        queryData.name,
        queryData.email,
        queryData.active,
        queryData.userRole == UserRoleFilter.ADMIN ? true : undefined,
        queryData.userRole == UserRoleFilter.TEACHER ? true : undefined,
        queryData.userRole == UserRoleFilter.STUDENT ? true : undefined,
        queryData.sortBy,
        queryData.sortOrder,
        queryData.page,
        queryData.pageSize
    );

    const dataPage = await container.resolve(FindUsersUseCase).execute(params);

    /*
        #swagger.responses[200] = {
            description: "Find users response",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/findUsersResponse"
                    },
                    examples: {
                        findUsersResponse: { $ref: "#components/examples/findUsersResponse" }
                    }
                }
            }
        }
    */
    res.status(200).send(jsonStringifier(dataPage));

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Find users error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const retrieveUserController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to retrieve information about an user'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/userId']
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        missingInformation: {
                            value: {
                                message: 'Number must be greater than or equal to 1'
                            },
                            summary: "Retrieve user information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */

    const userId = UserRequestValidation.parse(req.params.userId);

    const user = await container.resolve(RetrieveUserByIdUseCase).execute(userId);

    if (user) {
        /*
            #swagger.responses[200] = {
                description: "User information retrieved successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/userResponse"
                        },
                        examples: {
                            userResponse: { $ref: "#components/examples/userResponse" }
                        }
                    }
                }
            }
        */
        res.status(200).send(jsonStringifier(user));
    } else {
        /*
            #swagger.responses[404] = {
                description: "User not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            userNotFound: {
                                value: {
                                    message: 'User not found'
                                },
                                summary: "User for the given user id does not exist"
                            }
                        }
                    }
                }
            }
        */
        throw new NotFoundError("User not found");
    }

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Retrieve user information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const retrieveCurrentUserController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to retrieve information about the current user'

        #swagger.security = [{
            "bearerAuth": []
        }]
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    const user = req.user!!;

    /*
        #swagger.responses[200] = {
            description: "User information retrieved successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/userResponse"
                    },
                    examples: {
                        userResponse: { $ref: "#components/examples/userResponse" }
                    }
                }
            }
        }
    */
    res.status(200).send(jsonStringifier(user));

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Retrieve current user information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const updateUserController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to update an user'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/userId']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/updateUserRequest"
                    },
                    examples: {
                        updatePartialUserInfoRequest: { $ref: "#components/examples/updatePartialUserInfoRequest" },
                        updateFullUserInfoRequest: { $ref: "#components/examples/updateFullUserInfoRequest" }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        invalidInformation: {
                            value: {
                                message: 'Invalid email (path: email)'
                            },
                            summary: "Update user information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const userId = UserRequestValidation.parse(req.params.userId);
    const bodyData = UpdateUserRequestValidation.parse(req.body);

    const params = new UpdateUserUseCaseParams(req.user!!.id, userId, bodyData.name, bodyData.email, bodyData.active);

    const user = await container.resolve(UpdateUserUseCase).execute(params);

    if (user) {
        /*
            #swagger.responses[200] = {
                description: "User information updated successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/userResponse"
                        },
                        examples: {
                            userUpdateResponse: { $ref: "#components/examples/userResponse" }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(user));
    } else {
        /*
            #swagger.responses[404] = {
                description: "User not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            userNotFound: {
                                value: {
                                    message: 'User not found'
                                },
                                summary: "User for the given user id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("User not found");
    }
    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Update user information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}

export const retrieveUserRolesController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User Roles']

        #swagger.description = 'Endpoint to retrieve the roles information of an user'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/userId']
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        missingInformation: {
                            value: {
                                message: 'Number must be greater than or equal to 1'
                            },
                            summary: "Retrieve user roles information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */

    const userId = UserRequestValidation.parse(req.params.userId);

    const userRoles = await container.resolve(RetrieveUserRolesByUserIdUseCase).execute(userId);

    if (userRoles) {
        /*
            #swagger.responses[200] = {
                description: "User roles information retrieved successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/userRolesResponse"
                        },
                        examples: {
                            userRolesResponse: { $ref: "#components/examples/userRolesResponse" }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(userRoles));
    } else {
        /*
            #swagger.responses[404] = {
                description: "User not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            userNotFound: {
                                value: {
                                    message: 'User not found'
                                },
                                summary: "User for the given user id does not exist"
                            }
                        }
                    }
                }
            }
        */
        throw new NotFoundError("User not found");
    }
    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Retrieve user roles information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const retrieveCurrentUserRolesController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['User Roles']

        #swagger.description = 'Endpoint to retrieve the roles information of the current user'

        #swagger.security = [{
            "bearerAuth": []
        }]
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    const userRoles = req.userRoles!!;

    /*
        #swagger.responses[200] = {
            description: "User roles information retrieved successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/userRolesResponse"
                    },
                    examples: {
                        userRolesResponse: { $ref: "#components/examples/userRolesResponse" }
                    }
                }
            }
        }
    */

    res.status(200).send(jsonStringifier(userRoles));

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Retrieve current user roles information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const updateUserRolesController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['User Roles']

        #swagger.description = 'Endpoint to update the roles of an user'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/userId']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/updateUserRolesRequest"
                    },
                    examples: {
                        updateUserRolesRequest: { $ref: "#components/examples/updateUserRolesRequest" },
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        invalidInformation: {
                            value: {
                                message: 'Expected number, received nan'
                            },
                            summary: "Update user roles information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const userId = UserRequestValidation.parse(req.params.userId);
    const bodyData = UpdateUserRolesRequestValidation.parse(req.body);

    const params = new UpdateUserRolesByUserIdUseCaseParams(req.user!!.id, userId, bodyData.admin, bodyData.teacher, bodyData.student);

    const userRoles = await container.resolve(UpdateUserRolesByUserIdUseCase).execute(params);

    if (userRoles) {
        /*
            #swagger.responses[200] = {
                description: "User information updated successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/userRolesResponse"
                        },
                        examples: {
                            userUpdateResponse: { $ref: "#components/examples/userRolesResponse" }
                        }
                    }
                }
            }
        */

        /*
            #swagger.responses[412] = {
                description: "Business logic error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            bothTeacherAndStudentRolesError: {
                                value: {
                                    message: 'An user can\'t have both teacher and student roles.'
                                },
                                summary: "An user can\'t have both teacher and student roles."
                            },
                            removeCurrentUserAdminRoleError: {
                                value: {
                                    message: 'The current user can\'t remove its own admin role.'
                                },
                                summary: "The current user can\'t remove its own admin role."
                            }
                        }
                    }
                }
            }
        */
        res.status(200).send(jsonStringifier(userRoles));
    } else {
        /*
            #swagger.responses[404] = {
                description: "User not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            userNotFound: {
                                value: {
                                    message: 'User not found'
                                },
                                summary: "User for the given user id does not exist"
                            }
                        }
                    }
                }
            }
        */
        throw new NotFoundError("User not found");
    }

    /*
    #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Update user roles information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const retrieveUsersWithPostsController: RequestHandler = async (_req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to retrieve users that created posts'
    */

    const users = await container.resolve(RetrieveUsersWithPostsUseCase).execute();

    /*
        #swagger.responses[200] = {
            description: "User information retrieved successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/userListResponse"
                    },
                    examples: {
                        userListResponse: { $ref: "#components/examples/userListResponse" }
                    }
                }
            }
        }
    */

    res.status(200).send(jsonStringifier(users));

    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Retrieve users that created posts information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const changeUserPasswordController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['User']

        #swagger.description = 'Endpoint to change an user\'s password'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/userId']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/changeUserPasswordRequest"
                    },
                    examples: {
                        changeUserPasswordRequest: { $ref: "#components/examples/changeUserPasswordRequest" },
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[401] = {
            description: "JWT token errors",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        noTokenProvided: {
                            $ref: "#components/examples/noTokenProvidedErrorResponse"
                        },
                        invalidToken: {
                            $ref: "#components/examples/invalidTokenErrorResponse"
                        }
                    }
                }
            }
        }
    */

    /*
        #swagger.responses[403] = {
            description: "Insufficient permission",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        insufficientPermissionErrorResponse: {
                            $ref: "#components/examples/insufficientPermissionErrorResponse"
                        }
                    }
                }
            }
        }
     */

    /*
        #swagger.responses[400] = {
            description: "Validation error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        invalidInformation: {
                            value: {
                                message: 'Invalid email (path: email)'
                            },
                            summary: "Change user information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const userId = UserRequestValidation.parse(req.params.userId);
    const bodyData = ChangeUserPasswordRequestValidation.parse(req.body);

    const params = new ChangeUserPasswordUseCaseParams(userId, bodyData.password);

    const user = await container.resolve(ChangeUserPasswordUseCase).execute(params);

    if (user) {
        /*
            #swagger.responses[200] = {
                description: "User password changed successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/userResponse"
                        },
                        examples: {
                            userUpdateResponse: { $ref: "#components/examples/userResponse" }
                        }
                    }
                }
            }
        */

        /*
            #swagger.responses[412] = {
                description: "Business logic error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            invalidUserId: {
                                value: {
                                    message: 'Invalid user id.'
                                },
                                summary: "Invalid user id."
                            }
                        }
                    }
                }
            }
        */
        res.status(200).send(jsonStringifier(user));
    } else {
        /*
            #swagger.responses[404] = {
                description: "User not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            userNotFound: {
                                value: {
                                    message: 'User not found'
                                },
                                summary: "User for the given user id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("User not found");
    }
    /*
        #swagger.responses[500] = {
            description: "Internal server error",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/errorMessage"
                    },
                    examples: {
                        internalServerError: {
                            value: {
                                message: 'Internal server error'
                            },
                            summary: "Change user password information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}