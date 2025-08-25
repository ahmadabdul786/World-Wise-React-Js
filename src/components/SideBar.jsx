import Logo from './Logo'
import {  Outlet } from 'react-router-dom'
import styles from './Sidebar.module.css'
import AppNav from './AppNav'
export default function SideBar() {
  return (
    <div className={styles.sidebar}>
        <Logo/>
        <AppNav/>
        <Outlet/>
        <footer className={styles.footer}>
            <p className={styles.copyright}> &copy; CopyRight {new Date().getFullYear()} by world wise inc. </p>
        </footer>
    </div>
  )
}
