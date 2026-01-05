import {describe} from "node:test";
import {DeepMockProxy, mockDeep, MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {FindManyOptions, FindOneOptions, ILike, SelectQueryBuilder, UpdateQueryBuilder} from "typeorm";
import {UserEntity} from "../../../src/data/entity/UserEntity";
import {PostRepositoryImpl} from "../../../src/data/repository/PostRepositoryImpl";
import {PostDAO} from "../../../src/data/dao/PostDAO";
import {PostMapper} from "../../../src/data/mapper/PostMapper";
import {User} from "../../../src/domain/vo/user/User";
import {FindParams} from "../../../src/domain/vo/common/FindParams";
import {PostEntity} from "../../../src/data/entity/PostEntity";
import {SortOrder} from "../../../src/domain/vo/common/SortOrder";
import {Post} from "../../../src/domain/vo/post/Post";
import {Subject} from "../../../src/domain/vo/subject/Subject";
import {SubjectEntity} from "../../../src/data/entity/SubjectEntity";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {FindPostsSortField} from "../../../src/domain/vo/common/FindPostsSortField";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

describe('PostRepositoryImpl class tests', () => {
    let postDAO: DeepMockProxy<PostDAO>;
    let postMapper: MockProxy<PostMapper>;
    let selectQueryBuilder: MockProxy<SelectQueryBuilder<PostEntity>>;
    let updateQueryBuilder: MockProxy<UpdateQueryBuilder<PostEntity>>;

    let repository: PostRepositoryImpl;

    let user1: User;
    let user1Entity: UserEntity;
    let subject: Subject;
    let subjectEntity: SubjectEntity;
    let teachingLevel: TeachingLevel;
    let teachingLevelEntity: TeachingLevelEntity;
    let teachingGrade: TeachingGrade;
    let teachingGradeEntity: TeachingGradeEntity;
    let post1: Post;
    let post2: Post;
    let post1Entity: PostEntity;
    let post2Entity: PostEntity;
    let posts: Array<Post>;
    let postEntities: Array<PostEntity>;

    beforeEach(() => {
        postDAO = mockDeep<PostDAO>();
        postMapper = mock<PostMapper>();
        selectQueryBuilder = mock<SelectQueryBuilder<PostEntity>>();
        updateQueryBuilder = mock<UpdateQueryBuilder<PostEntity>>();

        postDAO.createQueryBuilder.mockReturnValue(selectQueryBuilder);
        selectQueryBuilder.update.mockReturnValue(updateQueryBuilder);
        updateQueryBuilder.set.mockReturnValue(updateQueryBuilder);
        updateQueryBuilder.where.mockReturnValue(updateQueryBuilder);

        user1 = new User(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user1Entity = new UserEntity(
            1,
            'user1',
            'User 1',
            'user1@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subjectEntity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post1 = new Post(
            1,
            'Post 1 Title',
            'Post 1 Content',
            user1.id,
            user1,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post2 = new Post(
            2,
            'Post 2 Title',
            'Post 2 Content',
            user1.id,
            user1,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post1Entity = new PostEntity(
            1,
            'Post 1 Title',
            'Post 1 Content',
            user1Entity.id,
            user1Entity,
            subjectEntity.id,
            subjectEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post2Entity = new PostEntity(
            2,
            'Post 2 Title',
            'Post 2 Content',
            user1Entity.id,
            user1Entity,
            subjectEntity.id,
            subjectEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        posts = [post1, post2];

        postEntities = [post1Entity, post2Entity];

        repository = new PostRepositoryImpl(postDAO, postMapper);
    });

    afterEach(() => {
        mockReset(postDAO);
        mockReset(postMapper);
        mockReset(selectQueryBuilder);
        mockReset(updateQueryBuilder);

        jest.restoreAllMocks();
    });

    test('Should find posts successfully when find method is executed without any parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find();

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            order: {
                createdAt: SortOrder.DESC
            },
            where: [{}],
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed with full content parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find('title content');

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [
                {
                    title: ILike('%title%'),
                },
                {
                    content: ILike('%title%')
                },
                {
                    title: ILike('%content%')
                },
                {
                    content: ILike('%content%')
                }
            ],
            order: {
                createdAt: SortOrder.DESC
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed with subject id parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find(undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [
                {
                    subjectId: 1,
                }
            ],
            order: {
                createdAt: SortOrder.DESC
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed with teaching level id parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find(undefined, undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [
                {
                    teachingGrade: {
                        teachingLevel: {
                            id: 1
                        }
                    }
                }
            ],
            order: {
                createdAt: SortOrder.DESC
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed with teaching grade id parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find(undefined, undefined, undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [
                {
                    teachingGradeId: 1
                }
            ],
            order: {
                createdAt: SortOrder.DESC
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed with user id parameter', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const result = await repository.find(undefined, undefined, undefined, undefined, 1);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [
                {
                    userId: 1
                }
            ],
            order: {
                createdAt: SortOrder.DESC
            },
            take: 10,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(FindParams.DEFAULT_PAGE_SIZE);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed sorting posts by title', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const findParams = new FindParams<FindPostsSortField>(
            FindPostsSortField.TITLE,
            SortOrder.ASC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [{}],
            order: {
                title: SortOrder.ASC,
                createdAt: SortOrder.DESC
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed sorting posts by subject', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const findParams = new FindParams<FindPostsSortField>(
            FindPostsSortField.SUBJECT,
            SortOrder.ASC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [{}],
            order: {
                subject: {
                    name: SortOrder.ASC
                },
                createdAt: SortOrder.DESC
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed sorting posts by teacher', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const findParams = new FindParams<FindPostsSortField>(
            FindPostsSortField.TEACHER,
            SortOrder.ASC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [{}],
            order: {
                user: {
                    name: SortOrder.ASC
                },
                createdAt: SortOrder.DESC
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should find posts successfully when find method is executed sorting posts by teaching grade', async () => {
        // Arrange

        postDAO.findAndCount.mockReturnValue(Promise.resolve([postEntities, postEntities.length]));

        postMapper.fromPostEntities.calledWith(postEntities).mockReturnValue(posts);

        // Act

        const findParams = new FindParams<FindPostsSortField>(
            FindPostsSortField.TEACHING_GRADE,
            SortOrder.ASC,
            0,
            5
        );

        const result = await repository.find(undefined, undefined, undefined, undefined, undefined, findParams);

        // Assert

        const expectedFindOptions: FindManyOptions<PostEntity> = {
            relations: {
                user: true,
                subject: true,
                teachingGrade: {
                    teachingLevel: true
                }
            },
            where: [{}],
            order: {
                teachingGrade: {
                    teachingLevel: {
                        order: SortOrder.ASC
                    },
                    order: SortOrder.ASC
                },
                createdAt: SortOrder.DESC
            },
            take: 5,
            skip: 0
        }

        expect(result.data).toEqual(posts);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(5);
        expect(result.total).toEqual(posts.length);

        expect(postDAO.findAndCount).toHaveBeenCalledWith(expectedFindOptions);
        expect(postMapper.fromPostEntities).toHaveBeenCalledWith(postEntities);
    });

    test('Should retrieve a post by its id successfully when getById method is executed', async () => {
        // Arrange

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity));

        postMapper.fromPostEntity.calledWith(post1Entity).mockReturnValue(post1);

        // Act

        const result = await repository.getById(1);

        // Assert

        expect(result).toEqual(post1);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenCalledWith(options);
        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(post1Entity);
    });

    test('Should not retrieve a post by its id successfully due to invalid post id when getById method is executed', async () => {
        // Arrange

        postDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.getById(1);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenCalledWith(options);
    });

    test('Should create a post successfully when create method is executed', async () => {
        // Arrange

        const createdPostEntity = {...post1Entity}
        const createdPost = {...post1}

        post1.id = 0;
        post1Entity.id = 0;

        postMapper.toPostEntity.calledWith(post1).mockReturnValue(post1Entity);

        postDAO.save.calledWith(post1Entity).mockReturnValue(Promise.resolve(createdPostEntity));

        postMapper.fromPostEntity.calledWith(createdPostEntity).mockReturnValue(createdPost);

        // Act

        const result = await repository.create(post1);

        // Assert

        expect(result).toEqual(createdPost);

        expect(postMapper.toPostEntity).toHaveBeenCalledWith(post1);
        expect(postDAO.save).toHaveBeenCalledWith(post1Entity);
        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(createdPostEntity);
    });

    test('Should update a post successfully when update method is executed with title parameter', async () => {
        // Arrange

        const updatedPostEntity = structuredClone(post1Entity);
        const updatedPost = structuredClone(post1);

        updatedPostEntity.title = 'New Title';
        updatedPost.title = 'New Title';

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity))
            .mockReturnValue(Promise.resolve(updatedPostEntity));

        postMapper.fromPostEntity.calledWith(updatedPostEntity).mockReturnValue(updatedPost);

        // Act

        const result = await repository.update(1, 'New Title');

        // Assert

        expect(result).toEqual(updatedPost);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenNthCalledWith(2, options);
        expect(postDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(PostEntity);

        const updateOptions: QueryDeepPartialEntity<PostEntity> = {
            title: 'New Title'
        }

        expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateOptions);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalledWith();

        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(updatedPostEntity);
    });

    test('Should update a post successfully when update method is executed with content parameter', async () => {
        // Arrange

        const updatedPostEntity = structuredClone(post1Entity);
        const updatedPost = structuredClone(post1);

        updatedPostEntity.content = 'New Content';
        updatedPost.content = 'New Content';

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity))
            .mockReturnValue(Promise.resolve(updatedPostEntity));

        postMapper.fromPostEntity.calledWith(updatedPostEntity).mockReturnValue(updatedPost);

        // Act

        const result = await repository.update(1, undefined, 'New Content');

        // Assert

        expect(result).toEqual(updatedPost);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenNthCalledWith(2, options);
        expect(postDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(PostEntity);

        const updateOptions: QueryDeepPartialEntity<PostEntity> = {
            content: 'New Content'
        }

        expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateOptions);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalledWith();

        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(updatedPostEntity);
    });

    test('Should update a post successfully when update method is executed with subject id parameter', async () => {
        // Arrange

        const updatedPostEntity = structuredClone(post1Entity);
        const updatedPost = structuredClone(post1);

        updatedPostEntity.subjectId = 2;
        updatedPost.subjectId = 2;

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity))
            .mockReturnValue(Promise.resolve(updatedPostEntity));

        postMapper.fromPostEntity.calledWith(updatedPostEntity).mockReturnValue(updatedPost);

        // Act

        const result = await repository.update(1, undefined, undefined, 2);

        // Assert

        expect(result).toEqual(updatedPost);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenNthCalledWith(2, options);
        expect(postDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(PostEntity);

        const updateOptions: QueryDeepPartialEntity<PostEntity> = {
            subjectId: 2
        }

        expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateOptions);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalledWith();

        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(updatedPostEntity);
    });

    test('Should update a post successfully when update method is executed with teaching grade id parameter', async () => {
        // Arrange

        const updatedPostEntity = structuredClone(post1Entity);
        const updatedPost = structuredClone(post1);

        updatedPostEntity.teachingGradeId = 2;
        updatedPost.teachingGradeId = 2;

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity))
            .mockReturnValue(Promise.resolve(updatedPostEntity));

        postMapper.fromPostEntity.calledWith(updatedPostEntity).mockReturnValue(updatedPost);

        // Act

        const result = await repository.update(1, undefined, undefined, undefined, 2);

        // Assert

        expect(result).toEqual(updatedPost);

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenNthCalledWith(2, options);
        expect(postDAO.createQueryBuilder).toHaveBeenCalled();
        expect(selectQueryBuilder.update).toHaveBeenCalledWith(PostEntity);

        const updateOptions: QueryDeepPartialEntity<PostEntity> = {
            teachingGradeId: 2
        }

        expect(updateQueryBuilder.set).toHaveBeenCalledWith(updateOptions);
        expect(updateQueryBuilder.where).toHaveBeenCalledWith('id = :id', {id: 1});
        expect(updateQueryBuilder.execute).toHaveBeenCalledWith();

        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(updatedPostEntity);
    });

    test('Should not update a post successfully due to invalid post id when update method is executed', async () => {
        // Arrange

        postDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.update(1, undefined, undefined, undefined, 2);

        // Assert

        expect(result).toBeUndefined();

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenCalledWith(options);
    });

    test('Should delete a post by its id successfully when deleteById method is executed', async () => {
        // Arrange

        postDAO.findOne.mockReturnValue(Promise.resolve(post1Entity));

        postMapper.fromPostEntity.calledWith(post1Entity).mockReturnValue(post1);

        // Act

        const result = await repository.deleteById(1);

        // Assert

        expect(result).toBeTruthy();

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenCalledWith(options);
        expect(postMapper.fromPostEntity).toHaveBeenCalledWith(post1Entity);
        expect(postDAO.remove).toHaveBeenCalledWith(post1Entity);
    });

    test('Should not delete a post by its id successfully due to invalid post id when deleteById method is executed', async () => {
        // Arrange

        postDAO.findOne.mockReturnValue(Promise.resolve(null));

        // Act

        const result = await repository.deleteById(1);

        // Assert

        expect(result).toBeFalsy();

        const options: FindOneOptions<PostEntity> = {
            where: {
                id: 1
            }
        }

        expect(postDAO.findOne).toHaveBeenCalledWith(options);
    });
});