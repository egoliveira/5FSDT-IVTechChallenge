import {RequestHandler} from "express";
import {container} from "../../di/di";
import {jsonStringifier} from "./JSONStringifier";
import {RetrieveAllSubjectsUseCase} from "../../domain/usecase/subject/RetrieveAllSubjectsUseCase";

export const retrieveSubjectsController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Subject']

        #swagger.description = 'Endpoint to retrieve all available subjects'
    */

    const subjects = await container.resolve(RetrieveAllSubjectsUseCase).execute();

    /*
        #swagger.responses[200] = {
            description: "Subjects response",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/subjectsResponse"
                    },
                    examples: {
                        subjectsResponse: { $ref: "#components/examples/subjectsResponse" }
                    }
                }
            }
        }
    */

    res.status(200).send(jsonStringifier(subjects));

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
                            summary: "Retrieve subjects error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}