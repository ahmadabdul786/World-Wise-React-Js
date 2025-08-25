// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import ButtonBack from "./ButtonBack";
import Button from "./Button";
import useUrlLocation from "../hooks/useUrlLocation";
import Spinner from "./Spinner";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContextProvider";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
function Form() {

  const [lat,lng] =useUrlLocation();

  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [locality,setLocality] = useState("");
  const [isloadingGeoCoding, setIsloadingGeoCoding] = useState(false);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
 
  const {createCity}=useCities();
  const nevigate = useNavigate();


useEffect(()=>{
if(!lat || !lng) return;

async function fetchCityData() {
    try{
 setIsloadingGeoCoding(true);
 const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
 const data =await res.json();
  
 setCityName(data.city || "");
 setCountry(data.countryName || "");
 setEmoji(convertToEmoji(data.countryCode || ""));
 setLocality(data.locality || "");
  console.log("City data fetched:", data);
}
catch(err){
 console.error("Error fetching city data:", err);
}
finally{
  setIsloadingGeoCoding(false);
}
  }
fetchCityData();
},[lat,lng])

 async function handleSubmit(e){
  
  e.preventDefault();
  if(!cityName || !date) return;

  const newCity = {
    cityName,
    country,
    emoji,
    date,
    notes,
    position:{
      lat,lng
    }
  }
  console.log(newCity);
  await createCity(newCity); 

  nevigate("/app/cities");
//return newCity;
}

  if(isloadingGeoCoding) return <Spinner/>
  if(!lat || !lng) return <Message message ={ `🧨 Please select a location on the map to add a city.`} />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName || locality}
        />
         <span className={styles.flag}>{emoji}</span> 
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date.toLocaleDateString()}
        /> */}
        <DatePicker id="date" selected={date} onChange={(date)=>setDate(date)} dateFormat='dd/MM/yyyy' />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button OnClick={handleSubmit} >Add</Button>
        <ButtonBack >&larr; Back</ButtonBack>
      </div>
    </form>
  );
}

export default Form;
