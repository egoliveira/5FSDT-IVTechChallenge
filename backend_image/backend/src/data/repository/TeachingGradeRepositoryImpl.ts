import {TeachingGradeRepository} from "../../domain/repository/TeachingGradeRepository";
import {TeachingGrade} from "../../domain/vo/teachinggrade/TeachingGrade";
import {Logger} from "tslog";
import {TeachingGradeDAO} from "../dao/TeachingGradeDAO";
import {TeachingGradeMapper} from "../mapper/TeachingGradeMapper";
import {SortOrder} from "../../domain/vo/common/SortOrder";

export class TeachingGradeRepositoryImpl implements TeachingGradeRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly teachingGradeDAO: TeachingGradeDAO,
        private readonly teachingGradeMapper: TeachingGradeMapper
    ) {
        this.logger = new Logger({name: 'TeachingGradeRepositoryImpl'});
    }

    async getByTeachingLevelId(teachingLevelId: number): Promise<TeachingGrade[]> {
        this.logger.debug(`Retrieving teaching grades by teaching level id ${teachingLevelId}...`);

        const teachingGradesEntities = await this.teachingGradeDAO.find({
            where: {
                teachingLevelId: teachingLevelId
            },
            order: {
                order: SortOrder.ASC,
            }
        });

        const teachingGrades = this.teachingGradeMapper.fromTeachingGradeEntities(teachingGradesEntities);

        this.logger.debug(`Number of teaching grades retrieved: ${teachingGrades.length}`);

        return teachingGrades;
    }

    async getById(teachingGradeId: number): Promise<TeachingGrade | undefined> {
        this.logger.debug(`Retrieving teaching grade by teaching grade id ${teachingGradeId}...`);

        let teachingGrade: TeachingGrade | undefined;

        const teachingGradeEntity = await this.teachingGradeDAO.findOneBy({
            id: teachingGradeId,
        });

        if (teachingGradeEntity) {
            teachingGrade = this.teachingGradeMapper.fromTeachingGradeEntity(teachingGradeEntity);

            this.logger.debug(`Teaching grade id ${teachingGradeId} found.`);
        } else {
            this.logger.debug(`Teaching grade id ${teachingGradeId} not found.`);
        }

        return teachingGrade;
    }
}