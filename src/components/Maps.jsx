import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent, useMapEvents } from 'react-leaflet';
import styles from './Map.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContextProvider';
import useGeolocation from '../hooks/useGeoLocation';
import Button from './Button';
import useUrlLocation from '../hooks/useUrlLocation';
import Transitland from '../transitLand/Transitland';
import useStopesUrl from '../hooks/useStopesUrl';
import L from 'leaflet';
import debounce from 'lodash.debounce';
const KEY = 'HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx';

export default function Maps() {
   
    const [Maplat, Maplng] = useUrlLocation();
    const [mapPosition, setMapPosition] = useState([44, 44]);
    const [searchStop,setSearchStop] = useState('abc');
  
    const {cities,fetchStops,stops,getStopDetails} =useCities();
    // const {stops} = useStopesUrl();
    const {isLoading:isloadingPosition,position:geoLocationPosition,getPosition} =useGeolocation();
    console.log(stops);

    useEffect(()=>{
    if(Maplat && Maplng){
      setMapPosition([Maplat, Maplng]);
    }  // Default position if no lat/lng provided
    },[Maplat, Maplng]);
  
    useEffect(()=>{
      setMapPosition([geoLocationPosition.lat||42, geoLocationPosition.lng||0]);
    },[geoLocationPosition]) 

//   useEffect(()=>{

//     function stopDetails(stopId){
//       console.log(stopId);
//      // getStopDetails(stop.oneStopId);

//      }
// },[])
  //  useEffect(()=>{
  //   fetchStops(-74.02,40.70,-73.95,40.75);

  //  },[])

  return (
    <div  className={styles.mapContainer} >
      <div className=''><Transitland searchStop ={searchStop} setSearchStop ={setSearchStop}/></div>
      <div className ={styles.positionBtn}>
        {!geoLocationPosition.lat&&<Button  type='position' OnClick={getPosition}>
        {isloadingPosition?'loading...':'Get Your Position'}</Button>}
  </div>
  
      <MapContainer className={styles.map} center={mapPosition} zoom={3} scrollWheelZoom={true}>    
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {/* {cities && cities.map((city) => {
     return <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
      <Popup>
        <span>{city.emoji}</span> <span>{city.cityName}</span>
      </Popup>
    </Marker>
    })} */}
    {stops && stops.map((stop) => {
     
     return <Marker position={[stop.coordinates[1], stop.coordinates[0]]} key={stop.stopId}>
      <Popup>
        <div onClick={()=>getStopDetails(stop.oneStopId)} className={styles.popup}><span>{stop.stopName}</span>
        
        </div>
         
      </Popup>
    </Marker>
    })}


   <MapCenter position={mapPosition} /> 
    <DetectClick />
    {/* <StopFetcher/> */}
<RouteManager apiKey={KEY} />
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
   const map = useMap();
    useMapEvent('click',(e)=>{
      if(cities.length !== 0){
        nevigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
      }
      const { lat, lon, radius } = getMapParams(map);
            fetchStops(lat, lon, radius);
           setMapPosition([lat,lon]);
      // here we are running the stop fetcher on click
        // fetchStopsForCurrentView(map);
    });
  return null;
}
}


 function getMapParams(map) {
 const center = map.getCenter();
 return {
        lat: center.lat,
        lon: center.lng,
        radius: 2000 // meters
    };
} 

function TransitStopFetcherThroughRadius(){

  const map = useMapEvents({
        // Fetch stops when the map is finished moving (drag or zoom)
        moveend() {
            const { lat, lon, radius } = getMapParams(map);
            // fetchStops(lat, lon, radius);
        },
        // Optionally fetch stops on the initial load, once the map is ready
        load() {
            const { lat, lon, radius } = getMapParams(map);
            // fetchStops(lat, lon, radius);
        }
    });

}


//➡️ Component 1: Handles Map Events (Zoom/Pan)
const RouteManager = ({ apiKey }) => {
    const map = useMap();
    const [routeLayers, setRouteLayers] = useState({}); // Cache for route GeoJSON data
    const ROUTE_THRESHOLD = 11; // Display routes at zoom level 11 or higher

    const fetchAndRenderRoutes = useCallback(() => {
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        
        if (zoom < ROUTE_THRESHOLD) {
            // Logic to clear/hide layers
            map.eachLayer(layer => {
                if (layer.options && layer.options.isRouteLayer) {
                    map.removeLayer(layer);
                }
            });
            return;
        }

        // 1. Get visible Bounding Box (bbox)
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        
        // 2. 📞 Call Transitland API (via proxy) to get Route IDs in the bbox
        const routesUrl = `https://transit.land/api/v1/routes?bbox=${bbox}&apikey=${apiKey}`;
        
        fetch(routesUrl)
            .then(res => res.json())
            .then(data => {
                data.routes.forEach(route => {
                    if (routeLayers[route.onestop_id]) {
                        // Already in cache, skip fetching geometry
                        return;
                    }

                    // 3. 📞 Call Transitland API (via proxy) for Route Geometry
                    const geometryUrl = `https://transit.land/api/v1/routes/${route.onestop_id}/route_geometries?apikey=${apiKey}`;
                    fetch(geometryUrl)
                        .then(res => res.json())
                        .then(geometryData => {
                            // 4. Create Leaflet GeoJSON Layer
                            const geoJsonLayer = L.geoJSON(geometryData, {
                                style: { 
                                    color: route.route_color || '#3388ff',
                                    weight: 4,
                                },
                                isRouteLayer: true, // Custom option for easy removal
                            }).addTo(map);

                            // Cache and display
                            setRouteLayers(prev => ({ ...prev, [route.onestop_id]: geoJsonLayer }));
                        });
                });
            })
            .catch(err => console.error("Error fetching routes:", err));
    }, [map, apiKey, routeLayers]); // Depend on map, apiKey, and the cache object

    // ➡️ Step 3: Listen to map events
    useEffect(() => {
        // Debounce the fetch call to prevent excessive requests
        const debouncedFetch = debounce(fetchAndRenderRoutes, 500); 

        map.on('moveend', debouncedFetch); // Fired after zoom/pan finishes
        
        // Initial load
        fetchAndRenderRoutes(); 

        return () => {
            map.off('moveend', debouncedFetch);
        };
    }, [map, fetchAndRenderRoutes]); // Re-run effect only if map or fetch function changes

    return null; // This component doesn't render anything itself
};
// here we are fetching the stops by bbox strategy

// function StopFetcher() {
   
//   const map = useMapEvents({
//         // Attach listener to the 'moveend' event
//         moveend: () => {
//             fetchStopsForCurrentView(map);
//         },
//         // Also fetch stops immediately when the component mounts
//         load: () => {
//             fetchStopsForCurrentView(map);
//         }
//     });

//     return null; // This component doesn't render any visible UI elements
// }
// // Function to calculate the Bounding Box and call the API
// function fetchStopsForCurrentView(mapInstance) {
//     // 1. Get the LatLngBounds object
//     const bounds = mapInstance.getBounds(); 
    
//     // 2. Extract the four coordinates
//     const min_lon = bounds.getWest();
//     const min_lat = bounds.getSouth();
//     const max_lon = bounds.getEast();
//     const max_lat = bounds.getNorth();

//     // 3. Create the bbox string
//     const bboxString = [min_lon,min_lat,max_lon,max_lat];
    
//     console.log(`Fetching stops for BBOX: ${bboxString}`);

//     // Call the function to make the API request
//     // fetchStopsFromTransitland(bboxString, callback);
    
  
// fetchStops(bboxString);
    
// }


// }


// The Transitland API Fetch Function (Same as before, just passed a callback)
// async function fetchStopsFromTransitland(bbox, callback) {
//     const url = `https://transit.land/api/v2/rest/stops?bbox=${bbox}&apikey=${TRANSITLAND_API_KEY}`;
    
//     try {
//         const res = await fetch(url);
//         const data = await res.json();
        
//         // Transform the data into the structure your React component needs
//         const stopsArr = data.stops.map(stop => ({
//             // GeoJSON [lon, lat] is reversed for Leaflet [lat, lon]
//             position: [stop.geometry.coordinates[1], stop.geometry.coordinates[0]], 
//             stopName: stop.stop_name, 
//             stopId: stop.onestop_id
//         }));

//         // Pass the new data up to the parent component
//         callback(stopsArr); 

//     } catch (error) {
//         console.error("Error fetching or processing transit stops:", error);
//     }
// }

// export default StopFetcher;