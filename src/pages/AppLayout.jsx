import SideBar from "../components/sideBar"
import styles from './AppLayout.module.css'
import Maps from "../components/Maps";
import User from "../components/User";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      
    <SideBar/>
     <Maps/> 
     <User/>
    </div>
  )
}
