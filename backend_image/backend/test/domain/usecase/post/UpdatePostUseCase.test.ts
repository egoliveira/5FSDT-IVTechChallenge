import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {PostRepository} from "../../../../src/domain/repository/PostRepository";
import {TeachingGradeRepository} from "../../../../src/domain/repository/TeachingGradeRepository";
import {SubjectRepository} from "../../../../src/domain/repository/SubjectRepository";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";
import {Subject} from "../../../../src/domain/vo/subject/Subject"
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {Post} from "../../../../src/domain/vo/post/Post";
import {UpdatePostUseCase, UpdatePostUseCaseParams} from "../../../../src/domain/usecase/post/UpdatePostUseCase";

describe('UpdatePostUseCase class tests', () => {
    let postRepository: MockProxy<PostRepository>;
    let teachingGradeRepository: MockProxy<TeachingGradeRepository>;
    let subjectRepository: MockProxy<SubjectRepository>;

    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let subject: Subject;
    let user: User;
    let updatedPost: Post;

    let useCase: UpdatePostUseCase;

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

        updatedPost = new Post(
            1,
            'New Post Title',
            'New Post Content',
            user.id,
            user,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 1, 1, 0, 0, 0)
        );

        teachingGradeRepository.getById.calledWith(2).mockReturnValue(Promise.resolve(teachingGrade));

        subjectRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(subject));

        useCase = new UpdatePostUseCase(postRepository, teachingGradeRepository, subjectRepository);
    });

    afterEach(() => {
        mockReset(postRepository);
        mockReset(teachingGradeRepository);
        mockReset(subjectRepository);

        jest.restoreAllMocks();
    })

    test('Should update a post successfully when use case is executed', async () => {
        // Prepare

        postRepository.update.calledWith(1, 'New Post Title', 'New Post Content', 1, 2).mockReturnValue(Promise.resolve(updatedPost));

        const params = new UpdatePostUseCaseParams(1, 'New Post Title', 'New Post Content', 1, 2);

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(result).toEqual(updatedPost);

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);

        expect(subjectRepository.getById).toHaveBeenCalledWith(1);

        expect(postRepository.update).toHaveBeenCalledWith(1, 'New Post Title', 'New Post Content', 1, 2);
    });

    test('Should not update a post successfully due to invalid teaching grade id when use case is executed', async () => {
        // Prepare

        teachingGradeRepository.getById.calledWith(2).mockReturnValue(Promise.resolve(undefined));

        const params = new UpdatePostUseCaseParams(1, 'New Post Title', 'New Post Content', 1, 2);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('Invalid teaching grade id.');

        // Assert

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);
    });

    test('Should not update a post successfully due to invalid subject id when use case is executed', async () => {
        // Prepare

        teachingGradeRepository.getById.calledWith(2).mockReturnValue(Promise.resolve(teachingGrade));

        subjectRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(undefined));

        const params = new UpdatePostUseCaseParams(1, 'New Post Title', 'New Post Content', 1, 2);

        // Act

        await expect(useCase.execute(params)).rejects.toThrow('Invalid subject id.');

        // Assert

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);

        expect(subjectRepository.getById).toHaveBeenCalledWith(1);
    });

    test('Should not update a post successfully due to invalid post id when use case is executed', async () => {
        // Prepare

        postRepository.update.calledWith(1, 'New Post Title', 'New Post Content', 1, 2).mockReturnValue(Promise.resolve(undefined));

        const params = new UpdatePostUseCaseParams(1, 'New Post Title', 'New Post Content', 1, 2);

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeUndefined();

        expect(teachingGradeRepository.getById).toHaveBeenCalledWith(2);

        expect(subjectRepository.getById).toHaveBeenCalledWith(1);

        expect(postRepository.update).toHaveBeenCalledWith(1, 'New Post Title', 'New Post Content', 1, 2);
    });
});