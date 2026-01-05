import {RequestHandler} from "express";
import {container} from "../../di/di";
import {jsonStringifier} from "./JSONStringifier";
import {FindPostsRequestValidation} from "../validation/post/FindPostsRequestValidation";
import {FindPostsUseCase, FindPostsUseCaseParams} from "../../domain/usecase/post/FindPostsUseCase";
import {CreatePostRequestValidation} from "../validation/post/CreatePostRequestValidation";
import {PostMapper} from "../mapper/PostMapper";
import {CreatePostUseCase} from "../../domain/usecase/post/CreatePostUseCase";
import {PostRequestValidation} from "../validation/post/PostRequestValidation";
import {RetrievePostByIdUseCase} from "../../domain/usecase/post/RetrievePostByIdUseCase";
import {NotFoundError} from "../../domain/error/NotFoundError";
import {UpdatePostRequestValidation} from "../validation/post/UpdatePostRequestValidation";
import {UpdatePostUseCase, UpdatePostUseCaseParams} from "../../domain/usecase/post/UpdatePostUseCase";
import {DeletePostByIdUseCase} from "../../domain/usecase/post/DeletePostByIdUseCase";
import {AppRequest} from "../middleware/AppRequest";
import {DataPage} from "../../domain/vo/common/DataPage";
import {Post} from "../../domain/vo/post/Post";
import {
    FindPostsForStudentUseCase,
    FindPostsForStudentUseCaseParams
} from "../../domain/usecase/post/FindPostsForStudentUseCase";

export const findPostsController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['Post']

        #swagger.description = 'Endpoint to find posts. The access to this endpoint doesn\'t demand authentication,
                                anyone can access it, however, when an authenticated student access it, the posts are
                                filtered according to the student\'s teaching grade automatically, regardless the
                                teaching level id and teaching grade id provided using the parameters.'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/partialPostContent', '#components/parameters/subjectId',
            '#components/parameters/teachingLevelId', '#components/parameters/teachingGradeId',
            '#components/parameters/queryUserId', '#components/parameters/findPostsSortBy',
            '#components/parameters/sortOrder', '#components/parameters/page',
            '#components/parameters/pageSize']
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
                                message: 'String must contain at least 2 character(s) (path: title)'
                            },
                            summary: "Find posts error due to missing or wrong information"
                        }
                    }
                }
            }
        }
    */

    let dataPage: DataPage<Post>;

    const queryData = FindPostsRequestValidation.parse(req.query);

    if (req.user && req.userRoles && req.userRoles.student) {
        const params = new FindPostsForStudentUseCaseParams(
            req.user.id,
            queryData.fullContent,
            queryData.subjectId,
            queryData.userId,
            queryData.sortBy,
            queryData.sortOrder,
            queryData.page,
            queryData.pageSize
        );

        dataPage = await container.resolve(FindPostsForStudentUseCase).execute(params);
    } else {
        const params = new FindPostsUseCaseParams(
            queryData.fullContent,
            queryData.subjectId,
            queryData.teachingLevelId,
            queryData.teachingGradeId,
            queryData.userId,
            queryData.sortBy,
            queryData.sortOrder,
            queryData.page,
            queryData.pageSize
        );

        dataPage = await container.resolve(FindPostsUseCase).execute(params);
    }

    /*
        #swagger.responses[200] = {
            description: "Find posts response",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/findPostsResponse"
                    },
                    examples: {
                        findPostsResponse: { $ref: "#components/examples/findPostsResponse" }
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
                            summary: "Find posts error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const createPostController: RequestHandler = async (req: AppRequest, res) => {
    /*
        #swagger.tags = ['Post']

        #swagger.description = 'Endpoint to create posts'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/createPostRequest"
                    },
                    examples: {
                        createPostRequest: { $ref: "#components/examples/createPostRequest" }
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
                            summary: "Create post error due to missing information"
                        }
                    }
                }
            }
        }
    */

    const bodyData = CreatePostRequestValidation.parse(req.body);

    const post = container.resolve(PostMapper).fromZodObject(bodyData);

    const userId = req.user!!.id

    post.userId = userId;
    post.user.id = userId;

    const newPost = await container.resolve(CreatePostUseCase).execute(post);

    /*
        #swagger.responses[201] = {
            description: "Post created successfully",
            content: {
                "application/json": {
                    schema:{
                        $ref: "#components/schemas/postResponse"
                    },
                    examples: {
                        createPostResponse: { $ref: "#components/examples/postResponse" }
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
                        },
                        invalidSubjectId: {
                            value: {
                                message: 'Invalid subject id.'
                            },
                            summary: "The given subject id is invalid."
                        }
                    }
                }
            }
        }
    */

    res.status(201).send(jsonStringifier(newPost));

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
                            summary: "Create post error due to internal server error"
                        }
                    }
                }
            }
        }
    */

};

export const retrievePostController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Post']

        #swagger.description = 'Endpoint to retrieve information about a post'

        #swagger.parameters['$ref'] = ['#components/parameters/postId']
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
                            summary: "Retrieve post information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */

    const postId = PostRequestValidation.parse(req.params.postId);

    const post = await container.resolve(RetrievePostByIdUseCase).execute(postId);

    if (post) {
        /*
            #swagger.responses[200] = {
                description: "Post information retrieved successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/postResponse"
                        },
                        examples: {
                            postResponse: { $ref: "#components/examples/postResponse" }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(post));
    } else {
        /*
            #swagger.responses[404] = {
                description: "Post not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            postNotFound: {
                                value: {
                                    message: 'Post not found'
                                },
                                summary: "Post for the given post id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("Post not found");
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
                            summary: "Retrieve post information error due to internal server error"
                        }
                    }
                }
            }
        }
    */
}

export const updatePostController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Post']

        #swagger.description = 'Endpoint to update a post'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/postId']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/updatePostRequest"
                    },
                    examples: {
                        updatePartialPostInfoRequest: { $ref: "#components/examples/updatePartialPostInfoRequest" },
                        updateFullPostInfoRequest: { $ref: "#components/examples/updateFullPostInfoRequest" }
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
                                message: 'String must contain at least 3 character(s) (path: title)'
                            },
                            summary: "Update post information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */

    const postId = PostRequestValidation.parse(req.params.postId);
    const bodyData = UpdatePostRequestValidation.parse(req.body);

    const params = new UpdatePostUseCaseParams(postId, bodyData.title, bodyData.content, bodyData.subjectId,
        bodyData.teachingGradeId);

    const post = await container.resolve(UpdatePostUseCase).execute(params);

    if (post) {
        /*
            #swagger.responses[200] = {
                description: "Post information updated successfully",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/postResponse"
                        },
                        examples: {
                            postUpdateResponse: { $ref: "#components/examples/postResponse" }
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
                            },
                            invalidSubjectId: {
                                value: {
                                    message: 'Invalid subject id.'
                                },
                                summary: "The given subject id is invalid."
                            }
                        }
                    }
                }
            }
        */

        res.status(200).send(jsonStringifier(post));
    } else {
        /*
            #swagger.responses[404] = {
                description: "Post not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            postNotFound: {
                                value: {
                                    message: 'Post not found'
                                },
                                summary: "Post for the given post id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("Post not found");
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
                            summary: "Update post information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}

export const deletePostController: RequestHandler = async (req, res) => {
    /*
        #swagger.tags = ['Post']

        #swagger.description = 'Endpoint to delete a post'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.parameters['$ref'] = ['#components/parameters/postId']
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
                                message: 'Number must be greater than or equal to 1 (path: postId)'
                            },
                            summary: "Delete post information error due to missing or invalid information"
                        }
                    }
                }
            }
        }
    */
    const postId = PostRequestValidation.parse(req.params.postId);

    const deleted = await container.resolve(DeletePostByIdUseCase).execute(postId);

    if (deleted) {
        /*
        #swagger.responses[204] = {
            description: "Post deleted successfully",
        }
        */

        res.status(204).send();
    } else {
        /*
            #swagger.responses[404] = {
                description: "Post not found error",
                content: {
                    "application/json": {
                        schema:{
                            $ref: "#components/schemas/errorMessage"
                        },
                        examples: {
                            postNotFound: {
                                value: {
                                    message: 'Post not found'
                                },
                                summary: "Post for the given post id does not exist"
                            }
                        }
                    }
                }
            }
        */

        throw new NotFoundError("Post not found");
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
                            summary: "Delete post information error due to internal server error"
                        }
                    }
                }
            }
        }
    */

}
