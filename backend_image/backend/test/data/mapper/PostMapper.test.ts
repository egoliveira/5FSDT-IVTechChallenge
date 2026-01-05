import {describe} from "node:test";
import {UserMapper} from "../../../src/data/mapper/UserMapper";
import {User} from "../../../src/domain/vo/user/User";
import {UserEntity} from "../../../src/data/entity/UserEntity";
import {PostMapper} from "../../../src/data/mapper/PostMapper";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {SubjectMapper} from "../../../src/data/mapper/SubjectMapper";
import {mock, mockReset} from "jest-mock-extended";
import {TeachingGradeMapper} from "../../../src/data/mapper/TeachingGradeMapper";
import {Post} from "../../../src/domain/vo/post/Post";
import {Subject} from "../../../src/domain/vo/subject/Subject";
import {TeachingLevel} from "../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../src/domain/vo/teachinggrade/TeachingGrade";
import {SubjectEntity} from "../../../src/data/entity/SubjectEntity";
import {TeachingLevelEntity} from "../../../src/data/entity/TeachingLevelEntity";
import {TeachingGradeEntity} from "../../../src/data/entity/TeachingGradeEntity";
import {PostEntity} from "../../../src/data/entity/PostEntity";

describe('PostMapper class tests', () => {
    let userMapper: MockProxy<UserMapper>;
    let subjectMapper: MockProxy<SubjectMapper>;
    let teachingGradeMapper: MockProxy<TeachingGradeMapper>;

    let mapper: PostMapper;

    beforeEach(() => {
        userMapper = mock<UserMapper>();
        subjectMapper = mock<SubjectMapper>();
        teachingGradeMapper = mock<TeachingGradeMapper>();

        mapper = new PostMapper(userMapper, subjectMapper, teachingGradeMapper);
    });

    afterEach(() => {
        mockReset(userMapper);
        mockReset(subjectMapper);
        mockReset(teachingGradeMapper);

        jest.restoreAllMocks();
    })

    test('Should map a post value object to a post entity successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subjectEntity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const post = new Post(
            1,
            'Post Title',
            'Post Content',
            user.id,
            user,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.toUserEntity.calledWith(user).mockReturnValue(userEntity);
        subjectMapper.toSubjectEntity.calledWith(subject).mockReturnValue(subjectEntity);
        teachingGradeMapper.toTeachingGradeEntity.calledWith(teachingGrade).mockReturnValue(teachingGradeEntity);

        // Act

        const result = mapper.toPostEntity(post);

        // Assert

        expect(result.id).toEqual(post.id);
        expect(result.title).toEqual(post.title);
        expect(result.content).toEqual(post.content);
        expect(result.userId).toEqual(post.userId);
        expect(result.user).toEqual(userEntity);
        expect(result.subjectId).toEqual(post.subjectId);
        expect(result.subject).toEqual(subjectEntity);
        expect(result.teachingGradeId).toEqual(post.teachingGradeId);
        expect(result.teachingGrade).toEqual(teachingGradeEntity);
        expect(result.createdAt).toEqual(post.createdAt);
        expect(result.updatedAt).toEqual(post.updatedAt);

        expect(userMapper.toUserEntity).toHaveBeenCalledWith(user);
        expect(subjectMapper.toSubjectEntity).toHaveBeenCalledWith(subject);
        expect(teachingGradeMapper.toTeachingGradeEntity).toHaveBeenCalledWith(teachingGrade);
    });

    test('Should map a post entity object to a post value object successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subjectEntity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const postEntity = new PostEntity(
            1,
            'Post Title',
            'Post Content',
            userEntity.id,
            userEntity,
            subjectEntity.id,
            subjectEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);
        subjectMapper.fromSubjectEntity.calledWith(subjectEntity).mockReturnValue(subject);
        teachingGradeMapper.fromTeachingGradeEntity.calledWith(teachingGradeEntity).mockReturnValue(teachingGrade);

        // Act

        const result = mapper.fromPostEntity(postEntity);

        // Assert

        expect(result.id).toEqual(postEntity.id);
        expect(result.title).toEqual(postEntity.title);
        expect(result.content).toEqual(postEntity.content);
        expect(result.userId).toEqual(postEntity.userId);
        expect(result.user).toEqual(user);
        expect(result.subjectId).toEqual(postEntity.subjectId);
        expect(result.subject).toEqual(subject);
        expect(result.teachingGradeId).toEqual(postEntity.teachingGradeId);
        expect(result.teachingGrade).toEqual(teachingGrade);
        expect(result.createdAt).toEqual(postEntity.createdAt);
        expect(result.updatedAt).toEqual(postEntity.updatedAt);

        expect(userMapper.fromUserEntity).toHaveBeenCalledWith(userEntity);
        expect(subjectMapper.fromSubjectEntity).toHaveBeenCalledWith(subjectEntity);
        expect(teachingGradeMapper.fromTeachingGradeEntity).toHaveBeenCalledWith(teachingGradeEntity);
    });

    test('Should map a list of post entity objects to a list of post value object list successfully', () => {
        // Prepare

        const user = new User(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const userEntity = new UserEntity(
            1,
            'username',
            'User',
            'user@email.com',
            'password',
            true,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const subjectEntity = new SubjectEntity(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingLevelEntity = new TeachingLevelEntity(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGrade = new TeachingGrade(
            1,
            teachingLevel.id,
            teachingLevel,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const teachingGradeEntity = new TeachingGradeEntity(
            1,
            teachingLevelEntity.id,
            teachingLevelEntity,
            'Primeiro Ano',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const postEntity1 = new PostEntity(
            1,
            'Post Title 1',
            'Post Content 1',
            userEntity.id,
            userEntity,
            subjectEntity.id,
            subjectEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        const postEntity2 = new PostEntity(
            2,
            'Post Title 2',
            'Post Content 2',
            userEntity.id,
            userEntity,
            subjectEntity.id,
            subjectEntity,
            teachingGradeEntity.id,
            teachingGradeEntity,
            new Date(2024, 0, 1, 0, 0, 0),
            new Date(2025, 11, 31, 24, 59, 59)
        );

        userMapper.fromUserEntity.calledWith(userEntity).mockReturnValue(user);
        subjectMapper.fromSubjectEntity.calledWith(subjectEntity).mockReturnValue(subject);
        teachingGradeMapper.fromTeachingGradeEntity.calledWith(teachingGradeEntity).mockReturnValue(teachingGrade);

        // Act

        const result = mapper.fromPostEntities([postEntity1, postEntity2]);

        // Assert
        expect(result.length).toEqual(2);

        expect(result[0].id).toEqual(postEntity1.id);
        expect(result[0].title).toEqual(postEntity1.title);
        expect(result[0].content).toEqual(postEntity1.content);
        expect(result[0].userId).toEqual(postEntity1.userId);
        expect(result[0].user).toEqual(user);
        expect(result[0].subjectId).toEqual(postEntity1.subjectId);
        expect(result[0].subject).toEqual(subject);
        expect(result[0].teachingGradeId).toEqual(postEntity1.teachingGradeId);
        expect(result[0].teachingGrade).toEqual(teachingGrade);
        expect(result[0].createdAt).toEqual(postEntity1.createdAt);
        expect(result[0].updatedAt).toEqual(postEntity1.updatedAt);

        expect(result[1].id).toEqual(postEntity2.id);
        expect(result[1].title).toEqual(postEntity2.title);
        expect(result[1].content).toEqual(postEntity2.content);
        expect(result[1].userId).toEqual(postEntity2.userId);
        expect(result[1].user).toEqual(user);
        expect(result[1].subjectId).toEqual(postEntity2.subjectId);
        expect(result[1].subject).toEqual(subject);
        expect(result[1].teachingGradeId).toEqual(postEntity2.teachingGradeId);
        expect(result[1].teachingGrade).toEqual(teachingGrade);
        expect(result[1].createdAt).toEqual(postEntity2.createdAt);
        expect(result[1].updatedAt).toEqual(postEntity2.updatedAt);

        expect(userMapper.fromUserEntity).toHaveBeenNthCalledWith(2, userEntity);
        expect(subjectMapper.fromSubjectEntity).toHaveBeenNthCalledWith(2, subjectEntity);
        expect(teachingGradeMapper.fromTeachingGradeEntity).toHaveBeenNthCalledWith(2, teachingGradeEntity);
    });
});