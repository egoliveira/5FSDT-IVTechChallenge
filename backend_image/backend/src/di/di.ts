import {container, Lifecycle} from "tsyringe";
import {UserDAO} from "../data/dao/UserDAO";
import {UserEntity} from "../data/entity/UserEntity";
import {UserRepository} from "../domain/repository/UserRepository";
import {UserRepositoryImpl} from "../data/repository/UserRepositoryImpl";
import {UserMapper} from "../data/mapper/UserMapper";
import {UserRolesMapper} from "../data/mapper/UserRolesMapper";
import {UserRolesDAO} from "../data/dao/UserRolesDAO";
import {UserRolesEntity} from "../data/entity/UserRolesEntity";
import {DataSource} from "typeorm";
import {AppDataSource} from "../data/db/AppDataSource";
import {ConfigurationRepository} from "../domain/repository/ConfigurationRepository";
import {ConfigurationRepositoryImpl} from "../data/repository/ConfigurationRepositoryImpl";
import {UserRolesRepository} from "../domain/repository/UserRolesRepository";
import {UserRolesRepositoryImpl} from "../data/repository/UserRolesRepositoryImpl";
import {TeachingLevelRepository} from "../domain/repository/TeachingLevelRepository";
import {TeachingLevelRepositoryImpl} from "../data/repository/TeachingLevelRepositoryImpl";
import {TeachingLevelDAO} from "../data/dao/TeachingLevelDAO";
import {TeachingLevelEntity} from "../data/entity/TeachingLevelEntity";
import {TeachingLevelMapper} from "../data/mapper/TeachingLevelMapper";
import {TeachingGradeDAO} from "../data/dao/TeachingGradeDAO";
import {TeachingGradeEntity} from "../data/entity/TeachingGradeEntity";
import {TeachingGradeRepository} from "../domain/repository/TeachingGradeRepository";
import {TeachingGradeRepositoryImpl} from "../data/repository/TeachingGradeRepositoryImpl";
import {TeachingGradeMapper} from "../data/mapper/TeachingGradeMapper";
import {SubjectRepository} from "../domain/repository/SubjectRepository";
import {SubjectRepositoryImpl} from "../data/repository/SubjectRepositoryImpl";
import {SubjectDAO} from "../data/dao/SubjectDAO";
import {SubjectMapper} from "../data/mapper/SubjectMapper";
import {SubjectEntity} from "../data/entity/SubjectEntity";
import {StudentDAO} from "../data/dao/StudentDAO";
import {StudentEntity} from "../data/entity/StudentEntity";
import {StudentRepository} from "../domain/repository/StudentRepository";
import {StudentRepositoryImpl} from "../data/repository/StudentRepositoryImpl";
import {StudentMapper} from "../data/mapper/StudentMapper";
import {PostDAO} from "../data/dao/PostDAO";
import {PostEntity} from "../data/entity/PostEntity";
import {PostRepository} from "../domain/repository/PostRepository";
import {PostRepositoryImpl} from "../data/repository/PostRepositoryImpl";
import {PostMapper} from "../data/mapper/PostMapper";

container.register<DataSource>(
    "DataSource",
    {useClass: AppDataSource},
    {lifecycle: Lifecycle.Singleton}
);

container.register<UserDAO>('UserDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(UserEntity)
});

container.register<UserRolesDAO>('UserRolesDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(UserRolesEntity)
});

container.register<TeachingLevelDAO>('TeachingLevelDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(TeachingLevelEntity)
});

container.register<TeachingGradeDAO>('TeachingGradeDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(TeachingGradeEntity)
});

container.register<SubjectDAO>('SubjectDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(SubjectEntity)
});

container.register<StudentDAO>('StudentDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(StudentEntity)
});

container.register<PostDAO>('PostDAO', {
    useValue: container.resolve<DataSource>('DataSource').getRepository(PostEntity)
});

container.register<ConfigurationRepository>('ConfigurationRepository', {
    useValue: new ConfigurationRepositoryImpl(container.resolve<DataSource>('DataSource'))
});

container.register<UserRepository>('UserRepository', {
    useValue: new UserRepositoryImpl(
        container.resolve<UserDAO>('UserDAO'),
        container.resolve(UserMapper),
        container.resolve(UserRolesMapper)
    )
});

container.register<UserRolesRepository>('UserRolesRepository', {
    useValue: new UserRolesRepositoryImpl(
        container.resolve<UserRolesDAO>('UserRolesDAO'),
        container.resolve<StudentDAO>('StudentDAO'),
        container.resolve(UserRolesMapper)
    )
});

container.register<TeachingLevelRepository>('TeachingLevelRepository', {
    useValue: new TeachingLevelRepositoryImpl(
        container.resolve<TeachingLevelDAO>('TeachingLevelDAO'),
        container.resolve(TeachingLevelMapper)
    )
});

container.register<TeachingGradeRepository>('TeachingGradeRepository', {
    useValue: new TeachingGradeRepositoryImpl(
        container.resolve<TeachingGradeDAO>('TeachingGradeDAO'),
        container.resolve(TeachingGradeMapper)
    )
});

container.register<SubjectRepository>('SubjectRepository', {
    useValue: new SubjectRepositoryImpl(
        container.resolve<SubjectDAO>('SubjectDAO'),
        container.resolve(SubjectMapper)
    )
});

container.register<StudentRepository>('StudentRepository', {
    useValue: new StudentRepositoryImpl(
        container.resolve<StudentDAO>('StudentDAO'),
        container.resolve(StudentMapper)
    )
});

container.register<PostRepository>('PostRepository', {
    useValue: new PostRepositoryImpl(
        container.resolve<PostDAO>('PostDAO'),
        container.resolve(PostMapper)
    )
});

export {container};