import {PostRepository} from "../../domain/repository/PostRepository";
import {Logger} from "tslog";
import {PostDAO} from "../dao/PostDAO";
import {PostMapper} from "../mapper/PostMapper";
import {Post} from "../../domain/vo/post/Post";
import {DataPage} from "../../domain/vo/common/DataPage";
import {FindParams} from "../../domain/vo/common/FindParams";
import {FindPostsSortField} from "../../domain/vo/common/FindPostsSortField";
import {FindManyOptions, FindOptionsOrder, FindOptionsWhere, ILike} from "typeorm";
import {PostEntity} from "../entity/PostEntity";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {SortOrder} from "../../domain/vo/common/SortOrder";

export class PostRepositoryImpl implements PostRepository {
    private readonly logger: Logger<any>;

    constructor(
        private readonly postDAO: PostDAO,
        private readonly postMapper: PostMapper
    ) {
        this.logger = new Logger({name: 'PostRepositoryImpl'});
    }

    async find(fullContent?: string, subjectId?: number, teachingLevelId?: number, teachingGradeId?: number, userId?: number, findParams?: FindParams<FindPostsSortField>): Promise<DataPage<Post>> {
        this.logger.debug(`Finding posts by parameters (fullContent: ${fullContent}, subjectId: ${subjectId}, 
        teachingLevelId: ${teachingLevelId}, teachingGradeId: ${teachingGradeId}, userId: ${userId}, 
        pageSize: ${findParams?.pageSize}, page: ${findParams?.page}, sortBy: ${findParams?.sortBy}, sortOrder: 
        ${findParams?.sortOrder})...`);

        const pageSize = findParams?.pageSize || FindParams.DEFAULT_PAGE_SIZE;
        const page = findParams?.page || 0;

        const findOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            take: pageSize,
            skip: pageSize * page
        }

        const defaultFindOptionsWhere: FindOptionsWhere<PostEntity> = {}

        const findOptionsWhere: FindOptionsWhere<PostEntity>[] = []

        findOptions.where = findOptionsWhere;

        const findOptionsOrder: FindOptionsOrder<PostEntity> = {}

        findOptions.order = findOptionsOrder;

        if (subjectId) {
            defaultFindOptionsWhere.subjectId = subjectId;
        }

        if (teachingLevelId) {
            defaultFindOptionsWhere.teachingGrade = {
                teachingLevel: {
                    id: teachingLevelId
                }
            }
        }

        if (teachingGradeId) {
            defaultFindOptionsWhere.teachingGradeId = teachingGradeId;
        }

        if (userId) {
            defaultFindOptionsWhere.userId = userId;
        }

        if (fullContent) {
            const parts = fullContent.split(' ')
                .filter((value: string) => value.trim().length > 0)
                .map((value: string) => value.toLowerCase());

            const uniqueParts = new Set(parts);

            if (uniqueParts.size > 0) {
                uniqueParts.forEach((part) => {
                    const partTitleFindOptionsWhere = {...defaultFindOptionsWhere};
                    const partContentFindOptionsWhere = {...defaultFindOptionsWhere};

                    partTitleFindOptionsWhere.title = ILike(`%${part}%`);
                    partContentFindOptionsWhere.content = ILike(`%${part}%`);

                    findOptionsWhere.push(partTitleFindOptionsWhere);
                    findOptionsWhere.push(partContentFindOptionsWhere);
                });
            }
        }

        if (findOptionsWhere.length == 0) {
            findOptionsWhere.push(defaultFindOptionsWhere);
        }

        if (findParams && findParams.sortBy && findParams.sortOrder) {
            switch (findParams.sortBy) {
                case FindPostsSortField.TITLE:
                    findOptionsOrder.title = findParams.sortOrder;
                    break;
                case FindPostsSortField.SUBJECT:
                    findOptionsOrder.subject = {
                        name: findParams.sortOrder
                    }
                    break;
                case FindPostsSortField.TEACHER:
                    findOptionsOrder.user = {
                        name: findParams.sortOrder
                    }
                    break;
                case FindPostsSortField.TEACHING_GRADE:
                    findOptionsOrder.teachingGrade = {
                        teachingLevel: {
                            order: findParams.sortOrder
                        },
                        order: findParams.sortOrder
                    }
                    break;
            }
        }

        findOptionsOrder.createdAt = SortOrder.DESC

        const [postEntities, count] = await this.postDAO.findAndCount(findOptions)

        const posts = this.postMapper.fromPostEntities(postEntities);

        this.logger.debug(`Total of posts found: ${posts.length}.`);

        return new DataPage<Post>(posts, page, pageSize, count);
    }

    async getById(id: number): Promise<Post | undefined> {
        this.logger.debug(`Retrieving post by id ${id}...`);

        const postEntity = await this.postDAO.findOne({
            where: {
                id: id
            }
        });

        let post: Post | undefined;

        if (postEntity) {
            post = this.postMapper.fromPostEntity(postEntity);

            this.logger.debug(`Post ${id} retrieved successfully.`);
        } else {
            this.logger.debug(`Post ${id} not found.`);
        }

        return post;
    }

    async create(post: Post): Promise<Post> {
        this.logger.debug(`Creating post ${post.title})...`);

        const postEntity = this.postMapper.toPostEntity(post);

        const realPostEntity = await this.postDAO.save(postEntity);

        this.logger.debug(`Post ${post.title} created successfully.`);

        return this.postMapper.fromPostEntity(realPostEntity);
    }

    async update(id: number, title?: string, content?: string, subjectId?: number, teachingGradeId?: number): Promise<Post | undefined> {
        let updatedPost: Post | undefined = undefined;

        this.logger.debug(`Updating post id ${id}...`);

        const currentPostEntity = await this.postDAO.findOne({
            where: {
                id: id
            }
        });

        if (currentPostEntity) {
            const params: QueryDeepPartialEntity<PostEntity> = {}

            if (title) {
                params.title = title;
            }

            if (content) {
                params.content = content;
            }

            if (subjectId) {
                params.subjectId = subjectId;
            }

            if (teachingGradeId) {
                params.teachingGradeId = teachingGradeId;
            }

            await this.postDAO.createQueryBuilder()
                .update(PostEntity)
                .set(params)
                .where('id = :id', {id: id})
                .execute();

            const updatedPostEntity = await this.postDAO.findOne({
                where: {
                    id: id
                }
            });

            if (updatedPostEntity) {
                updatedPost = this.postMapper.fromPostEntity(updatedPostEntity);
            }
        } else {
            this.logger.warn(`Post ${id} not found. Can't update it.`);
        }

        return updatedPost;
    }

    async deleteById(id: number): Promise<boolean> {
        this.logger.debug(`Deleting post id ${id}...`);

        let deleted = false;

        const post = await this.getById(id);

        if (post) {
            await this.postDAO.remove(post)

            this.logger.debug(`Post id ${id} deleted successfully.`);

            deleted = true;
        } else {
            this.logger.debug(`Can't delete post id ${id}. Post doesn't exist.`);
        }

        return deleted;
    }
}