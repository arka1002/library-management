import style from "./Shell.module.css";

const ShellRoot = () => {
  return (
    <>
      <nav className={style.navigation}>
        <ul className={style.unorderedList}>
          <li className={style.listItem}>Students</li>
          <li className={style.listItem}>Books</li>
        </ul>
      </nav>
    </>
  );
};

export { ShellRoot };
