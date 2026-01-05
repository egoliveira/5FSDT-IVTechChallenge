export enum StudentListSortField {
    NAME = 'name',
    EMAIL = 'email',
    TEACHING_LEVEL = 'teaching_level',
    TEACHING_GRADE = 'teaching_grade'
}

export function stringToStudentListSortField(str: string): StudentListSortField | undefined {
    let sortField: StudentListSortField | undefined = undefined;

    switch (str) {
        case StudentListSortField.NAME:
            sortField = StudentListSortField.NAME;
            break;
        case StudentListSortField.EMAIL:
            sortField = StudentListSortField.EMAIL;
            break;
        case StudentListSortField.TEACHING_LEVEL:
            sortField = StudentListSortField.TEACHING_LEVEL;
            break;
        case StudentListSortField.TEACHING_GRADE:
            sortField = StudentListSortField.TEACHING_GRADE;
            break;
        default:
            break;
    }

    return sortField;
}