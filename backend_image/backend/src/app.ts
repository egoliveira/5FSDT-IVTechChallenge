import express from 'express';

import {container} from "./di/di";
import {ConnectDatabaseUseCase} from "./domain/usecase/config/ConnectDatabaseUseCase";
import {errorHandler} from "./presentation/middleware/error_handler";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
// @ts-ignore
import swaggerDocument from './swagger-output.json';
import routes from "./presentation/routes/routes";
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4000',
}));

app.use('/', routes);

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Schola Blog API',
            version: '1.0.0',
            description: 'Schola Blog API documentation',
        },
    },
    apis: ['./presentation/routes/routes.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerDocs));

app.use(errorHandler);

container.resolve(ConnectDatabaseUseCase).execute().then();

export default app;