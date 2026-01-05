import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";
import {RetrievePostByIdUseCase} from "../../../../src/domain/usecase/post/RetrievePostByIdUseCase";
import {PostRepository} from "../../../../src/domain/repository/PostRepository";
import {Subject} from "../../../../src/domain/vo/subject/Subject";
import {Post} from "../../../../src/domain/vo/post/Post";

describe('RetrievePostByIdUseCase class tests', () => {
    let postRepository: MockProxy<PostRepository>;

    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let subject: Subject;
    let user: User;
    let post: Post;

    let useCase: RetrievePostByIdUseCase;

    beforeEach(() => {
        postRepository = mock<PostRepository>();

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

        post = new Post(
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

        useCase = new RetrievePostByIdUseCase(postRepository);
    });

    afterEach(() => {
        mockReset(postRepository);

        jest.restoreAllMocks();
    })

    test('Should retrieve a post by its id successfully when use case is executed', async () => {
        // Prepare

        postRepository.getById.calledWith(1).mockReturnValue(Promise.resolve(post));

        // Act

        const result = await useCase.execute(1);

        // Assert

        expect(result).toBeDefined();

        expect(result).toEqual(post);

        expect(postRepository.getById).toHaveBeenCalledWith(1);
    });

    test('Should not retrieve a post by its id successfully due to invalid post id when use case is executed', async () => {
        // Act

        const result = await useCase.execute(2);

        // Assert

        expect(result).toBeUndefined();

        expect(postRepository.getById).toHaveBeenCalledWith(2);
    });
});