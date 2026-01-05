import swaggerAutogen from 'swagger-autogen';
import config from "./config/config";

const doc = {
    info: {
        title: 'Schola Blog API',
        description: 'Schola Blog API'
    },

    schemes: ['http', 'https'],

    host: `${config.host}:${config.port}`,

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        },
        schemas: {
            loginRequest: {
                type: 'object',
                properties: {
                    username: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 100,
                        required: true,
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 100,
                        required: true,
                    }
                }
            },
            loginResponse: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string'
                    }
                }
            },
            createUserRequest: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        required: true,
                        properties: {
                            username: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 100,
                                required: true
                            },
                            name: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 255,
                                required: true
                            },
                            email: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 255,
                                required: true
                            },
                            password: {
                                type: 'string',
                                minLength: 8,
                                maxLength: 100,
                                required: true
                            }
                        }
                    },
                    userRoles: {
                        type: 'object',
                        required: true,
                        properties: {
                            admin: {
                                type: 'boolean',
                                required: true,
                            },
                            teacher: {
                                type: 'boolean',
                                required: true,
                            },
                            student: {
                                type: 'boolean',
                                required: true,
                            }
                        }
                    }
                }
            },
            userResponse: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    username: {
                        type: 'string',
                        required: true,
                    },
                    name: {
                        type: 'string',
                        required: true,
                    },
                    email: {
                        type: 'string',
                        required: true,
                    },
                    active: {
                        type: 'boolean',
                        required: true,
                    }
                }
            },
            findUsersResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: '#components/schemas/userResponse',
                        required: true,
                    },
                    page: {
                        type: 'integer',
                        required: true,
                    },
                    pageSize: {
                        type: 'integer',
                        required: true,
                    },
                    total: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            updateUserRequest: {
                type: 'object',
                properties: {
                    type: 'object',
                    required: true,
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 255,
                            required: false
                        },
                        email: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 255,
                            required: false
                        },
                        active: {
                            type: 'boolean',
                            required: false
                        }
                    }
                }
            },
            userRolesResponse: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    admin: {
                        type: 'boolean',
                        required: true,
                    },
                    teacher: {
                        type: 'boolean',
                        required: true,
                    },
                    student: {
                        type: 'boolean',
                        required: true,
                    }
                }
            },
            updateUserRolesRequest: {
                type: 'object',
                required: true,
                properties: {
                    admin: {
                        type: 'boolean',
                        required: true
                    },
                    teacher: {
                        type: 'boolean',
                        required: true
                    },
                    student: {
                        type: 'boolean',
                        required: true
                    }
                }
            },
            teachingLevel: {
                type: 'object',
                required: true,
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    name: {
                        type: 'string',
                        required: true,
                    },
                    order: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            teachingLevelsResponse: {
                type: 'array',
                required: true,
                items: '#components/schemas/teachingLevel',
            },
            teachingGrade: {
                type: 'object',
                required: true,
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    teachingLevelId: {
                        type: 'integer',
                        required: true,
                    },
                    teachingLevel: {
                        type: 'object',
                        properties: '#components/schemas/teachingLevel',
                        required: true,
                    },
                    name: {
                        type: 'string',
                        required: true,
                    },
                    order: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            teachingGradesResponse: {
                type: 'array',
                required: true,
                items: '#components/schemas/teachingGrade',
            },
            subject: {
                type: 'object',
                required: true,
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    name: {
                        type: 'string',
                        required: true,
                    },
                }
            },
            subjectsResponse: {
                type: 'array',
                required: true,
                items: '#components/schemas/subject',
            },
            student: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    userId: {
                        type: 'integer',
                        required: true,
                    },
                    user: {
                        type: 'object',
                        properties: '#components/schemas/userResponse',
                        required: true,
                    },
                    teachingGradeId: {
                        type: 'integer',
                        required: false,
                    },
                    teachingGrade: {
                        type: 'object',
                        properties: '#components/schemas/teachingGrade',
                        required: false,
                    }
                }
            },
            findStudentsResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: '#components/schemas/student',
                        required: true,
                    },
                    page: {
                        type: 'integer',
                        required: true,
                    },
                    pageSize: {
                        type: 'integer',
                        required: true,
                    },
                    total: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            updateStudentRequest: {
                type: 'object',
                properties: {
                    teachingGradeId: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            userListResponse: {
                type: 'array',
                item: '#components/schemas/userResponse',
            },
            createPostRequest: {
                type: 'object',
                required: true,
                properties: {
                    title: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 512,
                        required: true
                    },
                    content: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 32767,
                        required: true
                    },
                    subjectId: {
                        type: 'integer',
                        required: true,
                    },
                    teachingGradeId: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            postResponse: {
                type: 'object',
                required: true,
                properties: {
                    id: {
                        type: 'integer',
                        required: true,
                    },
                    title: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 512,
                        required: true
                    },
                    content: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 32767,
                        required: true
                    },
                    userId: {
                        type: 'integer',
                        required: true,
                    },
                    user: {
                        properties: '#components/schemas/userResponse'
                    },
                    subjectId: {
                        type: 'integer',
                        required: true,
                    },
                    subject: {
                        properties: '#components/schemas/subject',
                    },
                    teachingGradeId: {
                        type: 'integer',
                        required: true,
                    },
                    teachingGrade: {
                        properties: '#components/schemas/teachingGrade'
                    },
                    createdAt: {
                        type: 'string',
                        required: true
                    },
                    updatedAt: {
                        type: 'string',
                        required: true
                    },
                }
            },
            findPostsResponse: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: '#components/schemas/postResponse',
                        required: true,
                    },
                    page: {
                        type: 'integer',
                        required: true,
                    },
                    pageSize: {
                        type: 'integer',
                        required: true,
                    },
                    total: {
                        type: 'integer',
                        required: true,
                    }
                }
            },
            updatePostRequest: {
                type: 'object',
                properties: {
                    type: 'object',
                    required: true,
                    properties: {
                        title: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 512,
                            required: false
                        },
                        content: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 32767,
                            required: false
                        },
                        subjectId: {
                            type: 'integer',
                            required: false,
                        },
                        teachingGradeId: {
                            type: 'integer',
                            required: false,
                        },
                    }
                }
            },
            changeUserPasswordRequest: {
                type: 'object',
                properties: {
                    password: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 100,
                        required: true,
                    }
                }
            },
            errorMessage: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            }
        },
        parameters: {
            partialUsername: {
                in: 'query',
                name: 'username',
                type: 'string',
                required: false,
                description: 'Partial username',
            },
            partialName: {
                in: 'query',
                name: 'name',
                type: 'string',
                required: false,
                description: 'Partial name',
            },
            partialEmail: {
                in: 'query',
                name: 'email',
                type: 'string',
                required: false,
                description: 'Partial e-mail address',
            },
            userActiveFlag: {
                in: 'query',
                name: 'active',
                type: 'boolean',
                required: false,
                description: 'Active user flag',
            },
            userRole: {
                in: 'query',
                name: 'userRole',
                schema: {
                    type: 'string',
                    enum: ['admin', 'teacher', 'student'],
                },
                required: false,
                description: 'User role',
            },
            findUsersSortBy: {
                in: 'query',
                name: 'sortBy',
                schema: {
                    type: 'string',
                    enum: ['username', 'name', 'email', 'active'],
                },
                required: false,
                description: 'Sort field',
            },
            sortOrder: {
                in: 'query',
                name: 'sortOrder',
                schema: {
                    type: 'string',
                    enum: ['ASC', 'DESC'],
                },
                required: false,
                description: 'Sort order',
            },
            page: {
                in: 'query',
                name: 'page',
                type: 'integer',
                minimum: 0,
                required: false,
                description: 'Data page number',
            },
            pageSize: {
                in: 'query',
                name: 'pageSize',
                type: 'integer',
                minimum: 1,
                required: false,
                description: 'Page size (number of records)',
            },
            userId: {
                in: 'path',
                name: 'userId',
                type: 'integer',
                minimum: 1,
                required: true,
                description: 'User id',
            },
            teachingLevelId: {
                in: 'query',
                name: 'teachingLevelId',
                type: 'integer',
                minimum: 1,
                required: false,
                description: 'Teaching level id',
            },
            teachingGradeId: {
                in: 'query',
                name: 'teachingGradeId',
                type: 'integer',
                minimum: 1,
                required: false,
                description: 'Teaching grade id',
            },
            findStudentsSortBy: {
                in: 'query',
                name: 'sortBy',
                schema: {
                    type: 'string',
                    enum: ['name', 'email', 'teaching_level', 'teaching_grade'],
                },
                required: false,
                description: 'Sort field',
            },
            studentId: {
                in: 'path',
                name: 'studentId',
                type: 'integer',
                minimum: 1,
                required: true,
                description: 'Student id',
            },
            partialPostContent: {
                in: 'query',
                name: 'fullContent',
                type: 'string',
                required: false,
                description: 'Partial content contained in the post, it must be in the title or in its content.',
            },
            subjectId: {
                in: 'query',
                name: 'subjectId',
                type: 'integer',
                minimum: 1,
                required: false,
                description: 'Subject id',
            },
            queryUserId: {
                in: 'query',
                name: 'userId',
                type: 'integer',
                minimum: 1,
                required: false,
                description: 'User id',
            },
            findPostsSortBy: {
                in: 'query',
                name: 'sortBy',
                schema: {
                    type: 'string',
                    enum: ['title', 'subject', 'teaching_grade', 'teacher'],
                },
                required: false,
                description: 'Sort field',
            },
            postId: {
                in: 'path',
                name: 'postId',
                type: 'integer',
                minimum: 1,
                required: true,
                description: 'Post id',
            },
        },
        examples: {
            adminLoginRequest: {
                value: {
                    username: 'admin',
                    password: 'admin@123',
                },
                summary: "Administrator login request example"
            },
            teacherLoginRequest: {
                value: {
                    username: 'teacher1',
                    password: 'teacher@123',
                },
                summary: "Teacher login request example"
            },
            studentLoginRequest: {
                value: {
                    username: 'student1',
                    password: 'student@123',
                },
                summary: "Student login request example"
            },
            loginResponse: {
                value: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsIm5hbWUiOiJTY2hvbGEgQmxvZyBBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkBzY2hvbGEuYmxvZyIsImFjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzUzMDQyODY1LCJleHAiOjE3NTMxMjkyNjV9.yYJ7ScPcHMqm3jHwu4x3dR0xalRUy_pev1fYR1F0gUM'
                },
                summary: "Login response example"
            },
            createAdminUserRequest: {
                value: {
                    user: {
                        username: 'admin',
                        name: 'Administrator',
                        email: 'admin@schola.blog',
                        password: 'admin@123',
                    },
                    userRoles: {
                        admin: true,
                        teacher: false,
                        student: false
                    }
                }
            },
            createTeacherUserRequest: {
                value: {
                    user: {
                        username: 'teacher1',
                        name: 'Teacher 1',
                        email: 'teacher1@schola.blog',
                        password: 'teacher@123',
                    },
                    userRoles: {
                        admin: false,
                        teacher: true,
                        student: false
                    }
                }
            },
            createStudentUserRequest: {
                value: {
                    user: {
                        username: 'student1',
                        name: 'Student 1',
                        email: 'student1@schola.blog',
                        password: 'student@123',
                    },
                    userRoles: {
                        admin: false,
                        teacher: false,
                        student: true
                    }
                }
            },
            userResponse: {
                value: {
                    id: 10,
                    username: 'admin',
                    name: 'Administrator',
                    email: 'admin@schola.blog',
                    active: true
                }
            },
            findUsersResponse: {
                value: {
                    data: [
                        {
                            id: 10,
                            username: 'admin',
                            name: 'Administrator',
                            email: 'admin@schola.blog',
                            active: true
                        },
                        {
                            id: 11,
                            username: 'teacher1',
                            name: 'Teacher 1',
                            email: 'teacher1@schola.blog',
                            active: true
                        }
                    ],
                    page: 0,
                    pageSize: 10,
                    total: 2
                }
            },
            updatePartialUserInfoRequest: {
                value: {
                    email: 'student1@schola.blog',
                }
            },
            updateFullUserInfoRequest: {
                value: {
                    name: 'Student 1',
                    email: 'student1@schola.blog',
                    active: false,
                }
            },
            userRolesResponse: {
                value: {
                    userId: 1,
                    admin: true,
                    teacher: false,
                    student: false
                }
            },
            updateUserRolesRequest: {
                value: {
                    admin: false,
                    teacher: true,
                    student: false
                }
            },
            teachingLevelsResponse: {
                value: [
                    {
                        id: 1,
                        name: 'Ensino Fundamental',
                        order: 1
                    },
                    {
                        id: 2,
                        name: 'Ensino Médio',
                        order: 2
                    }
                ]
            },
            teachingGradesResponse: {
                value: [
                    {
                        id: 10,
                        teachingLevelId: 2,
                        teachingLevel: {
                            id: 2,
                            name: 'Ensino Médio',
                            order: 2
                        },
                        name: 'Primeiro Ano',
                        order: 10
                    },
                    {
                        id: 11,
                        teachingLevelId: 2,
                        teachingLevel: {
                            id: 2,
                            name: 'Ensino Médio',
                            order: 2
                        },
                        name: 'Segundo Ano',
                        order: 11
                    },
                    {
                        id: 12,
                        teachingLevelId: 2,
                        teachingLevel: {
                            id: 2,
                            name: 'Ensino Médio',
                            order: 2
                        },
                        name: 'Terceiro Ano',
                        order: 12
                    }
                ]
            },
            subjectsResponse: {
                value: [
                    {
                        id: 6,
                        name: "Arte"
                    },
                    {
                        id: 10,
                        name: 'Biologia'
                    },
                    {
                        id: 3,
                        name: 'Ciências'
                    },
                    {
                        id: 7,
                        name: 'Educação Física'
                    },
                    {
                        id: 13,
                        name: 'Espanhol'
                    },
                    {
                        id: 9,
                        name: 'Filosofia'
                    },
                    {
                        id: 11,
                        name: 'Física'
                    },
                    {
                        id: 4,
                        name: 'Geografia'
                    },
                    {
                        id: 5,
                        name: 'História'
                    },
                    {
                        id: 8,
                        name: 'Inglês'
                    },
                    {
                        id: 2,
                        name: 'Matemática'
                    },
                    {
                        id: 1,
                        name: 'Português'
                    },
                    {
                        id: 12,
                        name: 'Química'
                    }
                ]
            },
            findStudentsResponse: {
                value: {
                    data: [
                        {
                            id: 1,
                            userId: 3,
                            user: {
                                id: 3,
                                username: 'student1',
                                name: 'Student 1',
                                email: 'student1@schola.blog',
                                active: true
                            },
                            teachingGradeId: 5,
                        },
                        {
                            id: 2,
                            userId: 5,
                            user: {
                                id: 5,
                                username: 'student2',
                                name: 'Student 2',
                                email: 'student2@schola.blog',
                                active: true
                            },
                            teachingGradeId: 7,
                        }
                    ],
                    page: 0,
                    pageSize: 10,
                    total: 2
                }
            },
            studentResponse: {
                value: {
                    id: 10,
                    userId: 14,
                    user: {
                        id: 14,
                        username: 'student1',
                        name: 'Student 1',
                        email: 'student1@schola.blog',
                        active: true
                    },
                    teachingGradeId: 5,
                    teachingGrade: {
                        id: 5,
                        teachingLevelId: 1,
                        teachingLevel: {
                            id: 1,
                            name: 'Ensino Fundamental',
                            order: 1
                        },
                        name: 'Quinto Ano',
                        order: 5
                    }
                }
            },
            updateStudentRequest: {
                value: {
                    teachingGradeId: 5
                }
            },
            userListResponse: {
                value: [
                    {
                        id: 3,
                        username: 'teacher1',
                        name: 'Teacher 1',
                        email: 'teacher1@schola.blog',
                        active: true
                    },
                    {
                        id: 7,
                        username: 'teacher2',
                        name: 'Teacher 2',
                        email: 'teacher2@schola.blog',
                        active: true
                    }
                ]
            },
            createPostRequest: {
                value: {
                    title: 'Post title',
                    content: 'Post content',
                    subjectId: 5,
                    teachingGradeId: 7
                }
            },
            postResponse: {
                value: {
                    id: 4,
                    title: 'Post title',
                    content: 'Post content',
                    userId: 15,
                    user: {
                        id: 15,
                        username: 'teacher1',
                        name: 'Teacher 1',
                        email: 'teacher1@schola.blog',
                        active: true
                    },
                    subjectId: 5,
                    subject: {
                        id: 5,
                        name: 'História'
                    },
                    teachingGradeId: 7,
                    teachingGrade: {
                        id: 7,
                        teachingLevelId: 1,
                        teachingLevel: {
                            id: 1,
                            name: 'Ensino Fundamental',
                            order: 1
                        },
                        name: 'Sétimo Ano',
                        order: 7
                    },
                    createdAt: '2025-07-24T21:12:00.449Z',
                    updatedAt: '2025-07-24T21:12:00.449Z'
                }
            },
            findPostsResponse: {
                value: {
                    data: [
                        {
                            id: 4,
                            title: 'Post title',
                            content: 'Post content',
                            userId: 15,
                            user: {
                                id: 15,
                                username: 'teacher1',
                                name: 'Teacher 1',
                                email: 'teacher1@schola.blog',
                                active: true
                            },
                            subjectId: 5,
                            subject: {
                                id: 5,
                                name: 'História'
                            },
                            teachingGradeId: 7,
                            teachingGrade: {
                                id: 7,
                                teachingLevelId: 1,
                                teachingLevel: {
                                    id: 1,
                                    name: 'Ensino Fundamental',
                                    order: 1
                                },
                                name: 'Sétimo Ano',
                                order: 7
                            },
                            createdAt: '2025-07-24T21:12:00.449Z',
                            updatedAt: '2025-07-24T21:12:00.449Z'
                        }
                    ],
                    page: 0,
                    pageSize: 10,
                    total: 1
                }
            },
            updatePartialPostInfoRequest: {
                value: {
                    title: 'New post title',
                }
            },
            updateFullPostInfoRequest: {
                value: {
                    title: 'New post title',
                    content: 'New post content',
                    userId: 5,
                    subjectId: 8,
                    teachingGradeId: 7
                }
            },
            changeUserPasswordRequest: {
                value: {
                    password: 'n3w@Passw0rd'
                }
            },
            noTokenProvidedErrorResponse: {
                value: {
                    message: 'No token provided',
                },
                summary: 'No JWT token provided',
            },
            invalidTokenErrorResponse: {
                value: {
                    message: 'Invalid token',
                },
                summary: 'Invalid JWT token',
            },
            insufficientPermissionErrorResponse: {
                value: {
                    message: 'Forbidden',
                },
                summary: 'User does not have the role needed to execute the operation',
            }
        }
    }
};

const outputFile = './swagger-output.json';
const routes = [
    './presentation/routes/routes.js',
];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);