import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "../student/Student.module.css";
import { BookFormErrorMessages, BookList } from "../../utils/types.js";
import { FormEvent, useRef, useState } from "react";
import { BOOK_FORM } from "../../utils/utilities.js";
import { NavLink } from "react-router-dom";

const Book = () => {
  // useQueryClient hook
  let queryClient = useQueryClient();

  let book_id_ref = useRef<HTMLInputElement | null>(null);

  const {
    isPending: is_booklist_pending,
    isError: is_booklist_error,
    isSuccess: is_booklist_success,
    data: booklist_data,
    error: booklist_error,
  } = useQuery({
    queryKey: ["List of books"],
    queryFn: (): Promise<BookList> =>
      fetch("/list/books/").then((res) => res.json()),
  });

  let {
    isPending: is_addbook_pending,
    isError: is_addbook_err,
    isSuccess: is_addbook_success,
    mutate: mut_op,
    error: add_book_err,
  } = useMutation({
    mutationFn: (body: any) =>
      fetch("/add/books/", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["List of books"],
      });
      let book_form = book_id_ref.current?.parentNode
        .parentNode as HTMLFormElement;
      book_form.reset();
      book_id_ref.current.focus();
    },
  });

  // error states
  let [errorState, setErrorState] = useState<BookFormErrorMessages>({
    book_id: false,
    author: false,
    title: false,
  });
  let ifBookIdIsEmpty = (
    text: string,
    clonedStateObject: BookFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.book_id = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.book_id = false;
    setErrorState(clonedStateObject);
  };
  let ifTitleIsEmpty = (
    text: string,
    clonedStateObject: BookFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.title = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.title = false;
    setErrorState(clonedStateObject);
  };
  let ifAuthorIsEmpty = (
    text: string,
    clonedStateObject: BookFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.author = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.author = false;
    setErrorState(clonedStateObject);
  };
  let formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    let data = new FormData(event.target as HTMLFormElement);
    if (
      (data.get(BOOK_FORM.BOOK_ID_FIELD) as string).trim() === "" ||
      (data.get(BOOK_FORM.TITLE_FIELD) as string).trim() === "" ||
      (data.get(BOOK_FORM.AUTHOR_FIELD) as string).trim() === ""
    ) {
      let foosh = structuredClone(errorState);
      ifBookIdIsEmpty(
        (data.get(BOOK_FORM.BOOK_ID_FIELD) as string).trim(),
        foosh
      );
      ifTitleIsEmpty((data.get(BOOK_FORM.TITLE_FIELD) as string).trim(), foosh);
      ifAuthorIsEmpty(
        (data.get(BOOK_FORM.AUTHOR_FIELD) as string).trim(),
        foosh
      );
      return;
    }
    // if it reaches here ---> fields arent empty it means;

    // react will update the state after the event handler finishes its execution - source - https://github.com/reactwg/react-18/discussions/46#discussioncomment-846862
    let buzz = structuredClone(errorState);
    buzz.author = false;
    buzz.book_id = false;
    buzz.title = false;
    setErrorState(buzz);

    // yeeee......
    const object_to_send = {};
    data.forEach((value, key) => (object_to_send[key] = value));

    mut_op(object_to_send);
  };
  return (
    <>
      <div className={styles.singleRow}>
        <div>Book ID</div>
        <div>Book Name</div>
        <div>Book author</div>
      </div>
      {is_booklist_pending && <p>Pending</p>}
      {is_booklist_error && <p>{booklist_error.message}</p>}
      {is_booklist_success &&
        booklist_data.map((book) => (
          <div className={styles.singleRow} key={book.book_id}>
            <div>{book.book_id}</div>
            <div>
              {" "}
              <NavLink to={`/details/books/${book.book_id}`}>
                {" "}
                {book.title}
              </NavLink>
            </div>
            <div>{book.author}</div>
          </div>
        ))}

      <form onSubmit={formSubmitHandler}>
        {errorState.book_id && <p>Please write the Book ID</p>}
        <label>
          Book ID
          <input type="text" name={BOOK_FORM.BOOK_ID_FIELD} ref={book_id_ref} />
        </label>
        {errorState.title && <p>Please write the Book title</p>}
        <label>
          Book Title
          <input type="text" name={BOOK_FORM.TITLE_FIELD} />
        </label>
        {errorState.author && <p>Please write the Book author</p>}
        <label>
          Book Author
          <input type="text" name={BOOK_FORM.AUTHOR_FIELD} />
        </label>
        <button type="submit">Submit</button>
        {is_addbook_pending && <p>Pending</p>}
        {is_addbook_err && <p>{add_book_err.message}</p>}
        {is_addbook_success && <p>Submitted!</p>}
      </form>
    </>
  );
};

export { Book };
