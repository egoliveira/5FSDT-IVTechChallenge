import {TeachingLevelRepository} from "../../domain/repository/TeachingLevelRepository";
import {TeachingLevel} from "../../domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelMapper} from "../mapper/TeachingLevelMapper";
import {TeachingLevelDAO} from "../dao/TeachingLevelDAO";
import {Logger} from "tslog";
import {SortOrder} from "../../domain/vo/common/SortOrder";

export class TeachingLevelRepositoryImpl implements TeachingLevelRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly teachingLevelDAO: TeachingLevelDAO,
        private readonly teachingLevelMapper: TeachingLevelMapper
    ) {
        this.logger = new Logger({name: 'TeachingLevelRepositoryImpl'});
    }

    async getAll(): Promise<TeachingLevel[]> {
        this.logger.debug('Retrieving all teaching levels...');

        const teachingLevelEntities = await this.teachingLevelDAO.find({
            order: {
                order: SortOrder.ASC,
            }
        });

        const teachingLevels = this.teachingLevelMapper.fromTeachingLevelEntities(teachingLevelEntities);

        this.logger.debug(`Number of teaching levels retrieved: ${teachingLevels.length}`);

        return teachingLevels;
    }
}