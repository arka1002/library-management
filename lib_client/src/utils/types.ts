type Student = {
    roll_no: number;
    first_name: number;
    middle_name: number;
    last_name: number;
}

type Book = {
    book_id: number;
    title: string;
    author: string;
};

type BookList = Book[];

type ListOfStudents = Array<Student>;

type studentFormErrorMessages = {
    roll_no: boolean;
    first_name: boolean;
    middle_name: boolean;
    last_name: boolean;
};

type mark_as_ret_err_messages = {
    book_id: boolean;
    roll_no: boolean;
    checked_out: boolean;
    due_date: boolean;
};

type BookFormErrorMessages = {
    book_id: boolean;
    title: boolean;
    author: boolean;
};

type Books_not_returned = {
    id: number;
    book_id: {
        book_id: string;
        title: string;
        author: string;
    };
    checked_out: string;
    due_date: string;
    has_returned: boolean;
    return_date: null | string;
    roll_no: string;
};

type Books_not_returned_list = Books_not_returned[];

export { type ListOfStudents, type studentFormErrorMessages, type Student, type BookList, type BookFormErrorMessages, type Book, type Books_not_returned, type Books_not_returned_list, type mark_as_ret_err_messages };