import {RequestHandler} from "express";
import {container} from "../../di/di";
import {jsonStringifier} from "./JSONStringifier";
import {RetrieveAllTeachingLevelsUseCase} from "../../domain/usecase/teachinglevel/RetrieveAllTeachingLevelsUseCase";

export const retrieveTeachingLevelsController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Teaching Level']

        #swagger.description = 'Endpoint to retrieve all available teaching levels'
    */

    const teachingLevels = await container.resolve(RetrieveAllTeachingLevelsUseCase).execute();

    /*
        #swagger.responses[200] = {
            description: "Teaching levels response",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/teachingLevelsResponse"
                    },
                    examples: {
                        teachingLevelsResponse: { $ref: "#components/examples/teachingLevelsResponse" }
                    }
                }
            }
        }
    */
    res.status(200).send(jsonStringifier(teachingLevels));

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
                            summary: "Retrieve teaching levels error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}