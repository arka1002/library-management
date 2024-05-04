const STUDENT_FORM = {
    ROLL_NO_FIELD: 'roll_no',
    FIRST_NAME_FIELD: 'first_name',
    MIDDLE_NAME_FIELD: 'middle_name',
    LAST_NAME_FIELD: 'last_name',
};

const BOOK_FORM = {
    BOOK_ID_FIELD: "book_id",
    AUTHOR_FIELD: "author",
    TITLE_FIELD: "title",
};

const NEW_LOG = {
    BOOK_ID_FIELD: BOOK_FORM.BOOK_ID_FIELD,
    STUD_ROLL_FIELD: STUDENT_FORM.ROLL_NO_FIELD,
    CHECKED_OUT: "checked_out",
    DUE_DATE: "due_date",
};

const diffDate = (due_date: Date | any) => {
    if (due_date > new Date()) {
        // if due date is in future ... don't charge
        return 0;
    } else {
        const today = new Date();
        const diffTime = Math.abs(today as any - due_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

};

export { STUDENT_FORM, BOOK_FORM, NEW_LOG, diffDate };