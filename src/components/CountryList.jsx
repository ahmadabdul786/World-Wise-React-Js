
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import Message from './Message';
import Spinner from './Spinner';
import { useCities } from '../contexts/CitiesContextProvider';
export default function CountryList() {
  
  const {cities,isLoading} = useCities();

  if(isLoading) return<Spinner/>
  if(!cities.length) return <Message message ='Add your first city by clicking on city on the map' />
 
 const contries = cities.reduce((Arr,cur)=>{
    if(!Arr.map((el)=>el.country).includes(cur.country)){
      return [...Arr, {country: cur.country, emoji: cur.emoji}]
    }
      else{
        return Arr
      }
    
 },[])
 console.log(contries);

  return (
      <ul className={styles.countryList}>
        {contries.map((cur)=>{
         return <CountryItem cur = {cur} key={cur.country}/>
        })}
        </ul> 
  )

}
    /**  
  return (
      <ul className={styles.cityList}>
        {contries.map((country)=>{
          return <CountryItem country={country} />
        })}
        </ul> 
  )
}
  const contries = cities.reduce((acc, cur) => {
        if(!acc.includes(cur.country)){
        acc.push(cur.country)
        }
  },[])
  console.log(contries);
  
*/
