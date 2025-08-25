import { NavLink } from "react-router-dom";
import styles from './AppNav.module.css';
export default function AppNav() {
  return (<nav className={styles.nav}>
    <ul >
    <li>
      <NavLink to='cities'>city</NavLink>
    </li>
    <li>
      <NavLink to='contries'>cont</NavLink>
    </li>
  </ul>
  </nav>
  )
}
