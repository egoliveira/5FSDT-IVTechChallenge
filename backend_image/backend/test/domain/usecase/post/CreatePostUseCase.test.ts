import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {CreatePostUseCase} from "../../../../src/domain/usecase/post/CreatePostUseCase";
import {PostRepository} from "../../../../src/domain/repository/PostRepository";
import {TeachingGradeRepository} from "../../../../src/domain/repository/TeachingGradeRepository";
import {SubjectRepository} from "../../../../src/domain/repository/SubjectRepository";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";
import {Subject} from "../../../../src/domain/vo/subject/Subject"
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {Post} from "../../../../src/domain/vo/post/Post";

describe('CreatePostUseCase class tests', () => {
    let postRepository: MockProxy<PostRepository>;
    let teachingGradeRepository: MockProxy<TeachingGradeRepository>;
    let subjectRepository: MockProxy<SubjectRepository>;

    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let subject: Subject;
    let user: User;
    let createdPost: Post;

    let useCase: CreatePostUseCase;

    beforeEach(() => {
        postRepository = mock<PostRepository>()
        teachingGradeRepository = mock<TeachingGradeRepository>();
        subjectRepository = mock<SubjectRepository>()

        teachingLevel = new TeachingLevel(
            1,
            'Ensino Fundamental',
            1,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGrade = new TeachingGrade(
            2,
            teachingLevel.id,
            teachingLevel,
            'Segundo Ano',
            2,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        subject = new Subject(
            1,
            'Matemática',
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        user = new User(
            1,
            'teacher',
            'Teacher',
            'teacher@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        createdPost = new Post(
            1,
            'Post Title',
            'Post Content',
            user.id,
            user,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        teachingGradeRepository.getById.calledWith(2).mockReturnValue(Promise.resolve(teachingGrade));

        subjectRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(subject));

        useCase = new CreatePostUseCase(postRepository, teachingGradeRepository, subjectRepository);
    });

    afterEach(() => {
        mockReset(postRepository);
        mockReset(teachingGradeRepository);
        mockReset(subjectRepository);

        jest.restoreAllMocks();
    })

    test('Should create a post successfully when use case is executed', async () => {
        // Prepare

        const post = new Post(
            0,
            'Post Title',
            'Post Content',
            1,
            undefined,
            1,
            undefined,
            2,
            undefined
        );

        postRepository.create.calledWith(post).mockReturnValue(Promise.resolve(createdPost));

        // Act

        const result = await useCase.execute(post);

        // Assert

        expect(result).toBeDefined();

        expect(result).toEqual(createdPost);

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);

        expect(subjectRepository.getById).toHaveBeenCalledWith(1);

        expect(postRepository.create).toHaveBeenCalledWith(post);
    });

    test('Should not create a post successfully due to invalid teaching grade id when use case is executed', async () => {
        // Prepare

        const post = new Post(
            0,
            'Post Title',
            'Post Content',
            1,
            undefined,
            1,
            undefined,
            1,
            undefined
        );

        // Act

        await expect(useCase.execute(post)).rejects.toThrow('Invalid teaching grade id.');

        // Assert

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(1);
    });

    test('Should not create a post successfully due to invalid subject id when use case is executed', async () => {
        // Prepare

        const post = new Post(
            0,
            'Post Title',
            'Post Content',
            1,
            undefined,
            2,
            undefined,
            2,
            undefined
        );

        // Act

        await expect(useCase.execute(post)).rejects.toThrow('Invalid subject id.');

        // Assert

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);

        expect(subjectRepository.getById).toHaveBeenCalledWith(2);
    });
});