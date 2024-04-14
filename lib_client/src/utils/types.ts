type Student = {
    roll_no: number;
    first_name: number;
    middle_name: number;
    last_name: number;
}

type ListOfStudents = Array<Student>;

type formErrorMessages = {
    roll_no: boolean;
    first_name: boolean;
    middle_name: boolean;
    last_name: boolean;
};

export { type ListOfStudents, type formErrorMessages, type Student };