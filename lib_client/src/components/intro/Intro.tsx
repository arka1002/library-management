import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type studentFormErrorMessages,
  type Student,
  type Books_not_returned_list,
  type mark_as_ret_err_messages,
} from "../../utils/types.js";
import styles from "./Intro.module.css";
import { FormEvent, useRef, useState } from "react";
import { NEW_LOG, STUDENT_FORM, diffDate } from "../../utils/utilities.js";

const Intro = () => {
  // useQueryClient hook
  let queryClient = useQueryClient();

  // navigation hook
  let navigate = useNavigate();
  const { student_roll } = useParams();
  const {
    isPending,
    isError,
    isSuccess,
    error,
    data: student,
  } = useQuery({
    queryKey: ["student detail"],
    queryFn: (): Promise<Student> =>
      fetch(`/list/students/${student_roll}`).then((res) => res.json()),
  });
  const first_name_field = useRef<HTMLInputElement | null>(null);
  const book_id_field = useRef<HTMLInputElement | null>(null);

  const {
    isPending: is_edit_pending,
    isError: is_edit_error,
    isSuccess: is_edit_success,
    error: edit_error,
    mutate: mut_op,
  } = useMutation({
    mutationFn: (body: any) =>
      fetch(`/list/students/${student_roll}/edit`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student detail"],
      });
      let notes_form = first_name_field.current?.parentNode
        .parentNode as HTMLFormElement;
      notes_form.reset();
      first_name_field.current?.focus();
    },
  });

  const {
    isPending: is_delete_pending,
    isError: is_delete_error,
    error: delete_error,
    mutate: mut_delete,
  } = useMutation({
    mutationFn: () =>
      fetch(`/list/students/${student_roll}/delete`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["List of students"],
      });
      navigate("/details/students");
    },
  });

  let {
    isPending: is_books_notreturn_pending,
    isError: is_books_notreturn_err,
    isSuccess: is_books_notreturn_passed,
    data: books_not_returned,
    error: books_not_returned_error,
  } = useQuery({
    queryKey: ["books not returned"],
    queryFn: (): Promise<Books_not_returned_list> =>
      fetch(`/list/account/not-returned/${student_roll}/`).then((res) =>
        res.json()
      ),
  });

  let {
    isPending: is_mark_as_returned_pending,
    isError: is_mark_as_returned_err,
    isSuccess: is_mark_as_returned_passed,
    mutate: mark_as_returned_mut,
    error: mark_as_returned_err,
  } = useMutation({
    mutationFn: (body: any) =>
      fetch("/list/account/returned/", {
        method: "POST",
        body: JSON.stringify(body),
      }).then((res) => res.text()),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books not returned"],
      });
    },
  });

  let {
    isPending: is_add_acc_pending,
    isSuccess: is_add_acc_success,
    isError: is_add_acc_err,
    error: add_acc_error,
    mutate: mut_add_acc,
  } = useMutation({
    mutationFn: (body: any) =>
      fetch("/list/account/add/", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status === 400) {
            throw new Error(
              "Book doesn't exist. Please check the Book ID once again."
            ); // lets try...
          } else {
            return res.text();
          }
        })
        .catch((err) => {
          throw new Error(err);
        }),
    onError: (err) => {
      alert(err.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["books not returned"],
      });
      let formy = book_id_field.current.parentNode.parentNode as HTMLFormElement;
      formy.reset();
      book_id_field.current.focus();
    },
  });

  let [errorState, setErrorState] = useState<studentFormErrorMessages>({
    roll_no: false,
    first_name: false,
    middle_name: false,
    last_name: false,
  });

  let [returnState, setReturnState] = useState<mark_as_ret_err_messages>({
    roll_no: false,
    book_id: false,
    checked_out: false,
    due_date: false,
  });
  let ifBookIdIsEmpty = (
    text: string,
    clonedStateObject: mark_as_ret_err_messages
  ) => {
    if (text === "") {
      clonedStateObject.book_id = true;
      setReturnState(clonedStateObject);
      return;
    }
    clonedStateObject.book_id = false;
    setReturnState(clonedStateObject);
  };
  let ifCheckedOutIsEmpty = (
    text: string,
    clonedStateObject: mark_as_ret_err_messages
  ) => {
    if (text === "") {
      clonedStateObject.checked_out = true;
      setReturnState(clonedStateObject);
      return;
    }
    clonedStateObject.checked_out = false;
    setReturnState(clonedStateObject);
  };
  let ifDueDateIsEmpty = (
    text: string,
    clonedStateObject: mark_as_ret_err_messages
  ) => {
    if (text === "") {
      clonedStateObject.due_date = true;
      setReturnState(clonedStateObject);
      return;
    }
    clonedStateObject.due_date = false;
    setReturnState(clonedStateObject);
  };

  let ifFirstNameIsEmpty = (
    text: string,
    clonedStateObject: studentFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.first_name = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.first_name = false;
    setErrorState(clonedStateObject);
  };

  let ifLastNameIsEmpty = (
    text: string,
    clonedStateObject: studentFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.last_name = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.last_name = false;
    setErrorState(clonedStateObject);
  };

  let formSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    let data = new FormData(event.target as HTMLFormElement);
    if (
      (data.get(STUDENT_FORM.FIRST_NAME_FIELD) as string).trim() === "" ||
      (data.get(STUDENT_FORM.LAST_NAME_FIELD) as string).trim() === ""
      /* if the fields are empty ....... */
    ) {
      let foosh = structuredClone(errorState);
      ifFirstNameIsEmpty(
        (data.get(STUDENT_FORM.FIRST_NAME_FIELD) as string).trim(),
        foosh
      );
      ifLastNameIsEmpty(
        (data.get(STUDENT_FORM.LAST_NAME_FIELD) as string).trim(),
        foosh
      );
      return;
    }

    // if it reaches here ---> fields arent empty it means;

    // react will update the state after the event handler finishes its execution - source - https://github.com/reactwg/react-18/discussions/46#discussioncomment-846862
    let buzz = structuredClone(errorState);
    buzz.roll_no = false;
    buzz.first_name = false;
    buzz.middle_name = false;
    buzz.last_name = false;
    setErrorState(buzz);

    const object_to_send = {};
    data.forEach((value, key) => (object_to_send[key] = value));

    mut_op({ ...object_to_send, roll_no: student_roll });
  };

  let file_for_return = (event: FormEvent): undefined => {
    event.preventDefault();
    let submit_time = new Date().toISOString();
    let data = new FormData(event.target as HTMLFormElement);
    const object_to_send = {};
    data.forEach((value, key) => (object_to_send[key] = value));

    if (Object.values(object_to_send).length === 0) {
      alert("The form won't submit unless one item is checked!");
      return;
    }

    const lets_test = structuredClone(books_not_returned);

    for (const ids in object_to_send) {
      let id = Number(ids);
      for (const items of lets_test) {
        if (items.id !== id) {
          continue;
        } else if (items.id === id) {
          items.has_returned = true;
          items.return_date = submit_time;
        }
      }
    }
    let things_to_send = lets_test.filter((joe) => joe.has_returned);
    Promise.all(things_to_send.map((t) => mark_as_returned_mut(t)));
  };
  let new_log_handler = (event: FormEvent) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    if (
      (data.get(NEW_LOG.BOOK_ID_FIELD) as string).trim() === "" ||
      (data.get(NEW_LOG.CHECKED_OUT) as string).trim() === "" ||
      (data.get(NEW_LOG.DUE_DATE) as string).trim() === ""
      /* if the fields are empty ....... */
    ) {
      let foosh = structuredClone(returnState);
      ifBookIdIsEmpty(
        (data.get(NEW_LOG.BOOK_ID_FIELD) as string).trim(),
        foosh
      );
      ifCheckedOutIsEmpty(
        (data.get(NEW_LOG.CHECKED_OUT) as string).trim(),
        foosh
      );
      ifDueDateIsEmpty((data.get(NEW_LOG.DUE_DATE) as string).trim(), foosh);
      return;
    }
    const object_to_send = {};
    data.forEach((value, key) => (object_to_send[key] = value));
    object_to_send["roll_no"] = student_roll;
    object_to_send["has_returned"] = false;
    // date conversions to iso strings .....

    object_to_send[NEW_LOG.CHECKED_OUT] = new Date(
      object_to_send[NEW_LOG.CHECKED_OUT]
    ).toISOString();
    object_to_send[NEW_LOG.DUE_DATE] = new Date(
      object_to_send[NEW_LOG.DUE_DATE]
    ).toISOString();
    mut_add_acc(object_to_send);
  };

  return (
    <>
      {isPending && <p>Pending</p>}
      {isError && <p>{error.message}</p>}
      {isSuccess && (
        <>
          <p>Roll no. - {student.roll_no}</p>
          <p>First Name. - {student.first_name}</p>
          <p>Middle Name. - {student.middle_name}</p>
          <p>Last Name. - {student.last_name}</p>
        </>
      )}
      <hr />
      <p className={styles.edit}>
        <strong>
          <em>Edit</em>
        </strong>
      </p>

      <form onSubmit={formSubmitHandler}>
        {errorState.first_name ? <p>please write the first name</p> : null}
        <label>
          First Name
          <input
            type="text"
            name={STUDENT_FORM.FIRST_NAME_FIELD}
            ref={first_name_field}
          />
        </label>
        <label>
          Middle Name
          <input type="text" name={STUDENT_FORM.MIDDLE_NAME_FIELD} />
        </label>
        {errorState.last_name ? <p>please write the last name</p> : null}
        <label>
          Last Name
          <input type="text" name={STUDENT_FORM.LAST_NAME_FIELD} />
        </label>
        <button type="submit">Submit</button>
        {is_edit_pending && <p>Pending....</p>}
        {is_edit_error && <p>{edit_error.message}</p>}
        {is_edit_success && <p>Edited!</p>}
      </form>

      <p className={styles.edit}>
        <strong>
          <em>Delete Student</em>
        </strong>
      </p>
      <button onClick={() => mut_delete()}>Delete</button>
      {is_delete_pending && <p>Pending</p>}
      {is_delete_error && <p>{delete_error.message}</p>}
      <hr />
      <p className={styles.edit}>
        <strong>
          <em>Books not returned by student</em>
        </strong>
      </p>
      {is_books_notreturn_pending && <p>Pending ...</p>}
      {is_books_notreturn_err && <p>{books_not_returned_error.message}</p>}
      <form onSubmit={file_for_return}>
        {is_books_notreturn_passed &&
          !is_mark_as_returned_pending &&
          books_not_returned.length > 0 &&
          books_not_returned.map((book) => (
            <div>
              <label key={book.book_id.book_id}>
                Title - {book.book_id.title}, Author - {book.book_id.author}
                <input type="checkbox" name={`${book.id}`} />
              </label>
            </div>
          ))}
        {is_mark_as_returned_pending && (
          <p>
            Pending ... This is an expensive computation so it might take some
            time.
          </p>
        )}
        {is_mark_as_returned_err && <p>{mark_as_returned_err.message}</p>}
        {is_mark_as_returned_passed && <p>Edited !!</p>}
        <button type="submit">Submit</button>
      </form>
      {is_books_notreturn_passed && books_not_returned.length === 0 && (
        <p>The student has returned all books</p>
      )}
      <p className={styles.edit}>
        <strong>
          <em>Add books taken by the student</em>
        </strong>
      </p>
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
        onSubmit={new_log_handler}
      >
        {returnState.book_id && <p>Please write Book ID</p>}
        <label>
          Book ID
          <input type="text" name={NEW_LOG.BOOK_ID_FIELD} ref={book_id_field} />
        </label>
        {returnState.checked_out && <p>Please write checked out date</p>}
        <label>
          Checked Out
          <input type="datetime-local" name={NEW_LOG.CHECKED_OUT} />
        </label>
        {returnState.due_date && <p>Please write due date</p>}
        <label>
          Due Date
          <input type="datetime-local" name={NEW_LOG.DUE_DATE} />
        </label>
        <div></div>
        <button
          type="submit"
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "3",
          }}
        >
          Submit
        </button>
      </form>
      {is_add_acc_err && (
        <p style={{ color: "red", textAlign: "center" }}>
          {add_acc_error.message}
        </p>
      )}
      {is_add_acc_success && (
        <p style={{ color: "green", textAlign: "center" }}>Added!</p>
      )}
      {is_add_acc_pending && <p>Pending...</p>}
      <hr />
      <p className={styles.edit}>
        <strong>
          <em>Add books taken by the student</em>
        </strong>
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        }}
      >
        <div>Book ID</div>
        <div>Book Title</div>
        <div>Checked Out Date</div>
        <div>Due Date</div>
        <div>Due Amount</div>
        {is_books_notreturn_passed &&
          !is_mark_as_returned_pending &&
          books_not_returned.length > 0 &&
          books_not_returned.map((book) => (
            <>
              <div>{book.book_id.book_id}</div>
              <div>{book.book_id.title}</div>
              <div>{`${new Date(book.checked_out).getDate()} - ${
                new Date(book.checked_out).getMonth() + 1
              } - ${new Date(book.checked_out).getFullYear()}`}</div>
              <div>{`${new Date(book.due_date).getDate()} - ${
                new Date(book.due_date).getMonth() + 1
              } - ${new Date(book.due_date).getFullYear()}`}</div>
              <div>{`${diffDate(new Date(book.due_date)) * 2}`}</div>
            </>
          ))}
      </div>
    </>
  );
};
// AccountLogs - Table of all transactions of books
// contains student info, book info, taken from library date, due date(optional), has returned, return date(have to implement),

export { Intro };
