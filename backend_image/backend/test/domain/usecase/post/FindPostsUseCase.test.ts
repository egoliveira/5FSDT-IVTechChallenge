import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {User} from "../../../../src/domain/vo/user/User";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {FindParams} from "../../../../src/domain/vo/common/FindParams";
import {DataPage} from "../../../../src/domain/vo/common/DataPage";
import {PostRepository} from "../../../../src/domain/repository/PostRepository";
import {Post} from "../../../../src/domain/vo/post/Post";
import {TeachingLevel} from "../../../../src/domain/vo/teachinglevel/TeachingLevel";
import {TeachingGrade} from "../../../../src/domain/vo/teachinggrade/TeachingGrade";
import {Subject} from "../../../../src/domain/vo/subject/Subject";
import {FindPostsSortField} from "../../../../src/domain/vo/common/FindPostsSortField";
import {FindPostsUseCase, FindPostsUseCaseParams} from "../../../../src/domain/usecase/post/FindPostsUseCase";

describe('FindPostsUseCase class tests', () => {
    let postRepository: MockProxy<PostRepository>;
    let useCase: FindPostsUseCase;

    let teachingLevel: TeachingLevel;
    let teachingGrade: TeachingGrade;
    let subject: Subject;
    let teacherUser: User;
    let post1: Post;
    let post2: Post;
    let dataPage: DataPage<Post>;

    beforeEach(() => {
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

        teacherUser = new User(
            1,
            'teacher',
            'Teacher',
            'teacher@email.com',
            '$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q',
            true,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post1 = new Post(
            1,
            'Post Title 1',
            'Post Content 1',
            teacherUser.id,
            teacherUser,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        post2 = new Post(
            2,
            'Post Title 2',
            'Post Content 2',
            teacherUser.id,
            teacherUser,
            subject.id,
            subject,
            teachingGrade.id,
            teachingGrade,
            new Date(2025, 0, 1, 0, 0, 0),
            new Date(2025, 0, 1, 0, 0, 0)
        );

        const posts = [post1, post2];

        dataPage = new DataPage(
            posts,
            0,
            10,
            posts.length
        );

        postRepository = mock<PostRepository>();

        useCase = new FindPostsUseCase(postRepository);
    });

    afterEach(() => {
        mockReset(postRepository);

        jest.restoreAllMocks();
    })

    test('Should find posts successfully when use case is executed', async () => {
        // Prepare

        const params = new FindPostsUseCaseParams();

        const findParams = new FindParams<FindPostsSortField>(undefined, undefined);

        postRepository.find.mockReturnValue(Promise.resolve(dataPage));

        // Act

        const result = await useCase.execute(params);

        // Assert

        expect(result).toBeDefined();

        expect(result.data.length).toEqual(2)
        expect(result.data[0]).toEqual(post1);
        expect(result.data[1]).toEqual(post2);
        expect(result.page).toEqual(0);
        expect(result.pageSize).toEqual(10);
        expect(result.total).toEqual(2);

        expect(postRepository.find).toHaveBeenCalledWith(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            findParams
        );
    });
});
