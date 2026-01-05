import {StudentRepository} from "../../domain/repository/StudentRepository";
import {FindParams} from "../../domain/vo/common/FindParams";
import {DataPage} from "../../domain/vo/common/DataPage";
import {Student} from "../../domain/vo/student/Student";
import {Logger} from "tslog";
import {StudentDAO} from "../dao/StudentDAO";
import {StudentMapper} from "../mapper/StudentMapper";
import {FindManyOptions, FindOptionsOrder, FindOptionsWhere, ILike} from "typeorm";
import {StudentEntity} from "../entity/StudentEntity";
import {FindStudentsSortField} from "../../domain/vo/common/FindStudentsSortField";
import {SortOrder} from "../../domain/vo/common/SortOrder";

export class StudentRepositoryImpl implements StudentRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly studentDAO: StudentDAO,
        private readonly studentMapper: StudentMapper
    ) {
        this.logger = new Logger({name: 'StudentRepositoryImpl'});
    }

    async find(name?: string, email?: string, teachingLevelId?: number, teachingGradeId?: number, findParams?: FindParams<FindStudentsSortField>): Promise<DataPage<Student>> {
        this.logger.debug(`Finding students by parameters (name: ${name}, email: ${email}, 
        teachingLevelId: ${teachingLevelId}, teachingGradeId: ${teachingGradeId}, pageSize: ${findParams?.pageSize}, 
        page: ${findParams?.page}, sortBy: ${findParams?.sortBy}, sortOrder: ${findParams?.sortOrder})...`);

        const pageSize = findParams?.pageSize || FindParams.DEFAULT_PAGE_SIZE;
        const page = findParams?.page || 0;

        const findOptions: FindManyOptions<StudentEntity> = {
            relations: {
                user: true,
                teachingGrade: {
                    teachingLevel: true
                },
            },
            take: pageSize,
            skip: pageSize * page
        }

        const findOptionsWhere: FindOptionsWhere<StudentEntity> = {}

        findOptionsWhere.user = {}
        findOptionsWhere.teachingGrade = {}

        findOptions.where = findOptionsWhere;

        const findOptionsOrder: FindOptionsOrder<StudentEntity> = {}

        findOptions.order = findOptionsOrder;


        if (name) {
            findOptionsWhere.user.name = ILike(`%${name}%`)
        }

        if (email) {
            findOptionsWhere.user.email = ILike(`%${email}%`)
        }

        if (teachingLevelId) {
            findOptionsWhere.teachingGrade.teachingLevelId = teachingLevelId;
        }

        if (teachingGradeId) {
            findOptionsWhere.teachingGradeId = teachingGradeId;
        }

        findOptionsWhere.user.active = true;

        if (findParams && findParams.sortBy && findParams.sortOrder) {
            switch (findParams.sortBy) {
                case FindStudentsSortField.NAME:
                    findOptionsOrder.user = {
                        name: findParams.sortOrder
                    }
                    break;
                case FindStudentsSortField.EMAIL:
                    findOptionsOrder.user = {
                        email: findParams.sortOrder
                    }
                    break;
                case FindStudentsSortField.TEACHING_LEVEL:
                    findOptionsOrder.teachingGrade = {
                        teachingLevel: {
                            order: findParams.sortOrder
                        }
                    }
                    break;
                case FindStudentsSortField.TEACHING_GRADE:
                    findOptionsOrder.teachingGrade = {
                        order: findParams.sortOrder
                    }
                    break;
            }
        }

        findOptionsOrder.createdAt = SortOrder.DESC

        const [studentEntities, count] = await this.studentDAO.findAndCount(findOptions);
        const students = this.studentMapper.fromStudentEntities(studentEntities);

        this.logger.debug(`Total of students found: ${students.length}.`);

        return new DataPage<Student>(students, page, pageSize, count)
    }

    async getById(id: number): Promise<Student | undefined> {
        this.logger.debug(`Retrieving student by id ${id}...`);

        const studentEntity = await this.studentDAO.findOne({
            where: {
                id: id,
                user: {
                    active: true
                }
            }
        });

        let student: Student | undefined;

        if (studentEntity) {
            student = this.studentMapper.fromStudentEntity(studentEntity);

            this.logger.debug(`Student ${id} retrieved successfully.`);
        } else {
            this.logger.debug(`Student ${id} not found.`);
        }

        return student;
    }

    async getByUserId(id: number): Promise<Student | undefined> {
        this.logger.debug(`Retrieving student by user id ${id}...`);

        const studentEntity = await this.studentDAO.findOne({
            where: {
                user: {
                    id: id,
                    active: true
                }
            }
        });

        let student: Student | undefined;

        if (studentEntity) {
            student = this.studentMapper.fromStudentEntity(studentEntity);

            this.logger.debug(`Student by user id ${id} retrieved successfully.`);
        } else {
            this.logger.debug(`Student by user id ${id} not found.`);
        }

        return student;
    }


    async update(id: number, teachingGradeId: number): Promise<Student | undefined> {
        this.logger.debug(`Updating student id ${id}...`);

        let student: Student | undefined = undefined;

        const studentEntity = await this.studentDAO.findOne({
            where: {
                id: id
            }
        });

        if (studentEntity) {
            studentEntity.teachingGradeId = teachingGradeId;

            await this.studentDAO.update({id: id}, {teachingGradeId: teachingGradeId});

            const newStudentEntity = await this.studentDAO.findOne({
                where: {
                    id: id
                }
            });

            student = this.studentMapper.fromStudentEntity(newStudentEntity!);

            this.logger.debug(`Student id ${id} updated successfully.`);
        } else {
            this.logger.debug(`Student id ${id} not found.`);
        }

        return student;
    }

}