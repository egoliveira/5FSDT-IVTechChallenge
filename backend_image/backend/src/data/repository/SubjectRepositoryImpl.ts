import {Logger} from "tslog";
import {SortOrder} from "../../domain/vo/common/SortOrder";
import {SubjectRepository} from "../../domain/repository/SubjectRepository";
import {SubjectDAO} from "../dao/SubjectDAO";
import {SubjectMapper} from "../mapper/SubjectMapper";
import {Subject} from "../../domain/vo/subject/Subject";

export class SubjectRepositoryImpl implements SubjectRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly subjectDAO: SubjectDAO,
        private readonly subjectMapper: SubjectMapper
    ) {
        this.logger = new Logger({name: 'SubjectRepositoryImpl'});
    }

    async getAll(): Promise<Subject[]> {
        this.logger.debug('Retrieving all subjects...');

        const subjectEntities = await this.subjectDAO.find({
            order: {
                name: SortOrder.ASC,
            }
        });

        const subjects = this.subjectMapper.fromSubjectEntities(subjectEntities);

        this.logger.debug(`Number of subjects retrieved: ${subjects.length}`);

        return subjects;
    }

    async getById(id: number): Promise<Subject | undefined> {
        this.logger.debug(`Retrieving subject by id ${id}...`);

        let subject: Subject | undefined = undefined;

        const subjectEntity = await this.subjectDAO.findOneBy({id: id});

        if (subjectEntity) {
            subject = this.subjectMapper.fromSubjectEntity(subjectEntity);
        }

        if (subject) {
            this.logger.debug(`Subject with id ${id} retrieved successfully.`);
        } else {
            this.logger.debug(`Subject with id ${id} not found.`);
        }

        return subject;
    }
}