import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ListOfStudents,
  type studentFormErrorMessages,
} from "../../utils/types.js";
import { STUDENT_FORM } from "../../utils/utilities.js";
import styles from "./Student.module.css";
import { FormEvent, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const Student = () => {
  // useQueryClient hook
  let queryClient = useQueryClient();
  const {
    isPending,
    error: student_list_error,
    data: student_list,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["List of students"],
    queryFn: (): Promise<ListOfStudents> =>
      fetch("/list/students/").then((res) => res.json()),
  });

  let rollField = useRef<HTMLInputElement | null>(null);
  const {
    isPending: is_student_ongoing,
    isError: is_mutation_error,
    isSuccess: is_mutation_success,
    error: mutation_error,
    mutate: mut_op,
  } = useMutation({
    mutationFn: (body: any) => {
      return fetch("/add/students/", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["List of students"],
      });
      let notes_form = rollField.current?.parentNode
        .parentNode as HTMLFormElement;
      notes_form.reset();
      rollField.current?.focus();
    },
  });

  // error states
  let [errorState, setErrorState] = useState<studentFormErrorMessages>({
    roll_no: false,
    first_name: false,
    middle_name: false,
    last_name: false,
  });

  let ifRollNoIsEmpty = (
    text: string,
    clonedStateObject: studentFormErrorMessages
  ) => {
    if (text === "") {
      clonedStateObject.roll_no = true;
      setErrorState(clonedStateObject);
      return;
    }
    clonedStateObject.roll_no = false;
    setErrorState(clonedStateObject);
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
      (data.get(STUDENT_FORM.ROLL_NO_FIELD) as string).trim() === "" ||
      (data.get(STUDENT_FORM.FIRST_NAME_FIELD) as string).trim() === "" ||
      (data.get(STUDENT_FORM.LAST_NAME_FIELD) as string).trim() === ""
      /* if the fields are empty ....... */
    ) {
      let foosh = structuredClone(errorState);
      ifRollNoIsEmpty(
        (data.get(STUDENT_FORM.ROLL_NO_FIELD) as string).trim(),
        foosh
      );
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

    mut_op(object_to_send);
  };

  return (
    <>
      <div className={styles.singleRow}>
        <div className={styles.specialClass}>Roll no.</div>
        <div>Name</div>
      </div>
      {isPending ? <p>Loading</p> : null}
      {isError ? <p>{student_list_error.message}</p> : null}
      {isSuccess
        ? student_list.map((item) => (
            <div className={styles.singleRow} key={item.roll_no}>
              <div>{item.roll_no}</div>
              <div>
                <NavLink to={`/details/students/${item.roll_no}`}>
                  {item.first_name +
                    " " +
                    item.middle_name +
                    " " +
                    item.last_name}
                </NavLink>
              </div>
            </div>
          ))
        : null}

      <form onSubmit={formSubmitHandler}>
        {errorState.roll_no ? <p>please write the roll no.</p> : null}
        <label>
          Roll number
          <input
            type="text"
            name={STUDENT_FORM.ROLL_NO_FIELD}
            ref={rollField}
          />
        </label>
        {errorState.first_name ? <p>please write the first name</p> : null}
        <label>
          First Name
          <input type="text" name={STUDENT_FORM.FIRST_NAME_FIELD} />
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
        {is_student_ongoing && <p>Pending ...</p>}
        {is_mutation_error && <p>{mutation_error.message}</p>}
        {is_mutation_success && <p>Success!</p>}
      </form>
    </>
  );
};
export { Student };
