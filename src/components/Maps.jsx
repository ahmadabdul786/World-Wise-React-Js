import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContextProvider';
import useGeolocation from '../hooks/useGeoLocation';
import Button from './Button';
import useUrlLocation from '../hooks/useUrlLocation';

export default function Maps() {
   
    const [Maplat, Maplng] = useUrlLocation();
    const [mapPosition, setMapPosition] = useState([44, 44]);
    const {cities} =useCities();
    const {isLoading:isloadingPosition,position:geoLocationPosition,getPosition} =useGeolocation();
    

    useEffect(()=>{
    if(Maplat && Maplng){
      setMapPosition([Maplat, Maplng]);
    }  // Default position if no lat/lng provided
    },[Maplat, Maplng]);
  
    useEffect(()=>{
      setMapPosition([geoLocationPosition.lat||42, geoLocationPosition.lng||0]);
    },[geoLocationPosition]) 
  return (
    <div  className={styles.mapContainer} >
      <div className ={styles.positionBtn}>
        {!geoLocationPosition.lat&&<Button  type='position' OnClick={getPosition}>
        {isloadingPosition?'loading...':'Get Your Position'}</Button>}
  </div>
  
      <MapContainer className={styles.map} center={mapPosition} zoom={3} scrollWheelZoom={true}>    
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {cities.map((city) => {
     return <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
      <Popup>
        <span>{city.emoji}</span> <span>{city.cityName}</span>
      </Popup>
    </Marker>
    })}

   <MapCenter position={mapPosition} /> 
    <DetectClick />
  </MapContainer>
  
  </div>
  )
  function MapCenter({position}){
   const map =  useMap();
   map.setView(position);
    return null;
  }
function DetectClick (){
    const nevigate = useNavigate();
    useMapEvent('click',(e)=>nevigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`));
  return null;
}
}
