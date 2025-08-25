
import styles from './CityList.module.css';
import CityItem from './CityListItem';
import Message from './Message';
import Spinner from './Spinner';
import { useCities } from '../contexts/CitiesContextProvider';
import { useState } from 'react';
export default function CityList() {
  
  const {cities,isLoading} = useCities();
  const [date,setDate] = useState(new Date());
   if(isLoading) return<Spinner/>
  console.log(cities);
   if(!cities.length) return <Message message ='Add your first city by clicking on city on the map' />
  console.log(date);
  
  return (
      <ul className={styles.cityList}>
        {cities.map((city)=>{
          return <CityItem key={city.id} city={city} />
        })}
      
          
        </ul> 
  )
}



