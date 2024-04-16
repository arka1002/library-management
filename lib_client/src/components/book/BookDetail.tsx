import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { type Book, type BookFormErrorMessages } from "../../utils/types.js";
import styles from "../intro/Intro.module.css";
import { FormEvent, useRef, useState } from "react";
import { BOOK_FORM } from "../../utils/utilities.js";

const BookDetail = () => {
  // useQueryClient hook
  let queryClient = useQueryClient();

  // navigation hook
  let navigate = useNavigate();

  let { book_id } = useParams();

  let title_field = useRef<HTMLInputElement | null>(null);

  let {
    isPending: is_bookdetail_pending,
    isError: is_bookdetail_error,
    isSuccess: is_bookdetail_passed,
    error: bookdetail_err,
    data: bookdetail_data,
  } = useQuery({
    queryKey: ["details of a book"],
    queryFn: (): Promise<Book> =>
      fetch(`/list/books/detail/${book_id}/`).then((res) => res.json()),
  });

  let {
    isPending: is_bookedit_pending,
    isError: is_bookedit_error,
    isSuccess: is_bookedit_success,
    error: bookedit_err,
    mutate: mut_op
  } = useMutation({
    mutationFn: (body: any) =>
      fetch(`/list/books/edit/${book_id}/`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["details of a book"],
      });
      let form = title_field.current.parentNode.parentNode as HTMLFormElement;
      form.reset();
      title_field.current.focus();
    },
  });

  // error states
  let [errorState, setErrorState] = useState<BookFormErrorMessages>({
    book_id: false,
    author: false,
    title: false,
  });
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
      (data.get(BOOK_FORM.TITLE_FIELD) as string).trim() === "" ||
      (data.get(BOOK_FORM.AUTHOR_FIELD) as string).trim() === ""
    ) {
      let foosh = structuredClone(errorState);
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

    const object_to_send = {};
    data.forEach((value, key) => (object_to_send[key] = value));

    mut_op({ ...object_to_send, book_id });
  };
  return (
    <>
      {is_bookdetail_pending && <p>Pending</p>}
      {is_bookdetail_error && <p>{bookdetail_err.message}</p>}
      {is_bookdetail_passed && (
        <>
          <p>Book id - {bookdetail_data.book_id}</p>
          <p>Book title - {bookdetail_data.title}</p>
          <p>Book author - {bookdetail_data.author}</p>
        </>
      )}
      <hr />
      <p className={styles.edit}>
        <strong>
          <em>Edit</em>
        </strong>
      </p>
      <form onSubmit={formSubmitHandler}>
        {errorState.title && <p>Please write the Book title</p>}
        <label>
          Book Title
          <input type="text" name={BOOK_FORM.TITLE_FIELD} ref={title_field} />
        </label>
        {errorState.author && <p>Please write the Book author</p>}
        <label>
          Book Author
          <input type="text" name={BOOK_FORM.AUTHOR_FIELD} />
        </label>
        <button type="submit">Submit</button>
        {is_bookedit_pending && <p>Pending...</p>}
        {is_bookedit_error && <p>{bookedit_err.message}</p>}
        {is_bookedit_success && <p>Edited!</p>}
      </form>
    </>
  );
};

export { BookDetail };
