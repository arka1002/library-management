import style from "./Shell.module.css";
import { NavLink, Outlet } from "react-router-dom";

const ShellRoot = () => {
  return (
    <>
      <nav className={style.navigation}>
        <ul className={style.unorderedList}>
          <li className={style.listItem}>
            <NavLink to={`/`}>Home</NavLink>
          </li>
          <li className={style.listItem}>
            <NavLink to="/details/students">Students</NavLink>
          </li>
          <li className={style.listItem}>
            <NavLink to="/details/books">Books</NavLink>
          </li>
        </ul>
      </nav>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export { ShellRoot };
