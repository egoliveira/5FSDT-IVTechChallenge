import {RequestHandler} from "express";
import {container} from "../../di/di";
import {jsonStringifier} from "./JSONStringifier";
import {NotFoundError} from "../../domain/error/NotFoundError";
import {FindStudentsRequestValidation} from "../validation/student/FindStudentsRequestValidation";
import {FindStudentsUseCase, FindStudentsUseCaseParams} from "../../domain/usecase/student/FindStudentsUseCase";
import {StudentRequestValidation} from "../validation/student/StudentRequestValidation";
import {RetrieveStudentByIdUseCase} from "../../domain/usecase/student/RetrieveStudentByIdUseCase";
import {UpdateStudentRequestValidation} from "../validation/student/UpdateStudentRequestValidation";
import {UpdateStudentUseCase, UpdateStudentUseCaseParams} from "../../domain/usecase/student/UpdateStudentUseCase";

export const findStudentsController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Student']

        #swagger.description = 'Endpoint to find students'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/partialName', '#components/parameters/partialEmail',
            '#components/parameters/teachingLevelId', '#components/parameters/teachingGradeId',
            '#components/parameters/findStudentsSortBy', '#components/parameters/sortOrder',
            '#components/parameters/page', '#components/parameters/pageSize']
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
                                message: 'String must contain at least 2 character(s) (path: name)'
                            },
                            summary: "Find students error due to missing information"
                        }
                    }
                }
            }
        }
    */

    const queryData = FindStudentsRequestValidation.parse(req.query);

    const params = new FindStudentsUseCaseParams(
        queryData.name,
        queryData.email,
        queryData.teachingLevelId,
        queryData.teachingGradeId,
        queryData.sortBy,
        queryData.sortOrder,
        queryData.page,
        queryData.pageSize
    );

    const dataPage = await container.resolve(FindStudentsUseCase).execute(params);

    /*
        #swagger.responses[200] = {
            description: "Find students response",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/findStudentsResponse"
                    },
                    examples: {
                        findStudentsResponse: { $ref: "#components/examples/findStudentsResponse" }
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
                            summary: "Find students error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const retrieveStudentController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Student']

        #swagger.description = 'Endpoint to retrieve information about a student'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/studentId']
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
                            summary: "Retrieve student information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const userId = StudentRequestValidation.parse(req.params.studentId);

    const user = await container.resolve(RetrieveStudentByIdUseCase).execute(userId);

    if (user) {
        /*
            #swagger.responses[200] = {
                description: "Student information retrieved successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/student"
                        },
                        examples: {
                            studentResponse: { $ref: "#components/examples/studentResponse" }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(user));
    } else {
        /*
            #swagger.responses[404] = {
                description: "Student not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            studentNotFound: {
                                value: {
                                    message: 'Student not found'
                                },
                                summary: "Student for the given student id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("Student not found");
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
                            summary: "Retrieve student information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}

export const updateStudentController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Student']

        #swagger.description = 'Endpoint to update a student'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/studentId']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/updateStudentRequest"
                    },
                    examples: {
                        updateStudentRequest: { $ref: "#components/examples/updateStudentRequest" }
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
                                message: 'Number must be greater than or equal to 1'
                            },
                            summary: "Update student information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */

    const studentId = StudentRequestValidation.parse(req.params.studentId);
    const bodyData = UpdateStudentRequestValidation.parse(req.body);

    const params = new UpdateStudentUseCaseParams(studentId, bodyData.teachingGradeId);

    const student = await container.resolve(UpdateStudentUseCase).execute(params);

    if (student) {
        /*
            #swagger.responses[200] = {
                description: "Student information updated successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/student"
                        },
                        examples: {
                            userUpdateResponse: { $ref: "#components/examples/studentResponse" }
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
                            invalidTeachingGradeId: {
                                value: {
                                    message: 'Invalid teaching grade id.'
                                },
                                summary: "The given teaching grade id is invalid."
                            }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(student));
    } else {
        /*
            #swagger.responses[404] = {
                description: "Student not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            studentNotFound: {
                                value: {
                                    message: 'Student not found'
                                },
                                summary: "Student for the given student id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("Student not found");
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
                            summary: "Update student information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}