import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formErrorMessages, type Student } from "../../utils/types.js";
import styles from "./Intro.module.css";
import { FormEvent, useRef, useState } from "react";
import { STUDENT_FORM } from "../../utils/utilities.js";

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

  const {
    isPending: is_edit_pending,
    isError: is_edit_error,
    isSuccess: is_edit_success,
    error: edit_error,
    mutate: mut_op
  } = useMutation({
    mutationFn: (body: any) => fetch(`/list/students/${student_roll}/edit`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student detail"]
      });
      let notes_form = first_name_field.current?.parentNode
        .parentNode as HTMLFormElement;
      notes_form.reset();
      first_name_field.current?.focus();
    }
  });

  const {
    isPending: is_delete_pending,
    isError: is_delete_error,
    error: delete_error,
    mutate: mut_delete
  } = useMutation({
    mutationFn: () => fetch(`/list/students/${student_roll}/delete`, {
      method: "POST"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["List of students"]
      });
      navigate("/details/students");
    }
  })

  let [errorState, setErrorState] = useState<formErrorMessages>({
    roll_no: false,
    first_name: false,
    middle_name: false,
    last_name: false,
  });

  let ifFirstNameIsEmpty = (
    text: string,
    clonedStateObject: formErrorMessages
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
    clonedStateObject: formErrorMessages
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
          <input type="text" name={STUDENT_FORM.FIRST_NAME_FIELD} ref={first_name_field} />
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
    </>
  );
};

export { Intro };
