import {RequestHandler} from "express";
import {container} from "../../di/di";
import {jsonStringifier} from "./JSONStringifier";
import {TeachingGradesRequestValidation} from "../validation/teachinggrade/TeachingGradesRequestValidation";
import {
    RetrieveTeachingGradesByTeachingLevelIdUseCase
} from "../../domain/usecase/teachinggrades/RetrieveTeachingGradesByTeachingLevelIdUseCase";
import {NotFoundError} from "../../domain/error/NotFoundError";

export const retrieveTeachingGradesController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Teaching Grade']

        #swagger.description = 'Endpoint to retrieve information about the teaching grades of a teaching level'

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
                            summary: "Retrieve teaching grades information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const teachingLevelId = TeachingGradesRequestValidation.parse(req.params.teachingLevelId);

    const teachingGrades = await container.resolve(RetrieveTeachingGradesByTeachingLevelIdUseCase).execute(teachingLevelId);

    if (teachingGrades.length > 0) {
        /*
            #swagger.responses[200] = {
                description: "Teaching grades information retrieved successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/teachingGradesResponse"
                        },
                        examples: {
                            teachingGradesResponse: { $ref: "#components/examples/teachingGradesResponse" }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(teachingGrades));
    } else {
        /*
            #swagger.responses[404] = {
                description: "Teaching grades not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            teachingGradesNotFound: {
                                value: {
                                    message: 'No teaching grades found.'
                                },
                                summary: "No teaching grades found."
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("No teaching grades found.");
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
                            summary: "Retrieve teaching grades information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}