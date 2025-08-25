import { Link, useParams } from 'react-router-dom';
import styles from './CityItem.module.css';
import { useCities } from '../contexts/CitiesContextProvider';


export default function CityItem({city}) {

   
  const {cityName,emoji,date,id,position} = city;
  const {currentCity,deleteCity} = useCities();

  const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function handleClick(e){
e.preventDefault();
deleteCity(id);
}
    return (
    <li >
      <Link className={`${styles.cityItem} ${id===currentCity.id? styles["cityItem--active"] :''}`}
       to={`${id}`} >
        <span className={styles.emoji}>{emoji}</span>
        
        <span className={styles.cityItem}>{cityName}</span>
        
        {/* <time className={styles.date}>{formatDate(date)}</time> */}
        <button onClick={handleClick} className={styles.deleteBtn}>&times;</button>
    </Link>
    </li>
  )
}
