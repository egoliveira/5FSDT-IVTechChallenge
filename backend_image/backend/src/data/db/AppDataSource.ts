import {DataSource} from "typeorm";
import config from "../../config/config";
import {UserEntity} from "../entity/UserEntity";
import {UserRolesEntity} from "../entity/UserRolesEntity";
import {TeachingLevelEntity} from "../entity/TeachingLevelEntity";
import {TeachingGradeEntity} from "../entity/TeachingGradeEntity";
import {SubjectEntity} from "../entity/SubjectEntity";
import {StudentEntity} from "../entity/StudentEntity";
import {PostEntity} from "../entity/PostEntity";

export class AppDataSource extends DataSource {
    constructor() {
        super({
            type: "postgres",
            host: config.databaseHost,
            port: config.databasePort,
            username: config.databaseUser,
            password: config.databasePassword,
            database: config.databaseName,
            synchronize: false,
            logging: true,
            entities: [UserEntity, UserRolesEntity, TeachingLevelEntity, TeachingGradeEntity, SubjectEntity, StudentEntity, PostEntity],
            migrations: [],
            subscribers: [],
        });
    }
}