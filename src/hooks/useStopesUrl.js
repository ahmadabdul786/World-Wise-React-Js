import { useEffect, useState } from "react";

export default function useStopesUrl() {
  const [stops,setStops] = useState([]);
  
    useEffect(()=>{
        async function fetchStops() {
           const res = await fetch(`https://transit.land/api/v2/rest/stops?name =${'Union Station'}&apikey=${'HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx'}`);
           const data = await res.json();
           console.log(data);
           const stopsArr = data.stops.map((stop)=>{
            return {
                coordinates:stop.geometry.coordinates,
                stopName:stop.stop_name ,
                stopId:stop.feed_version.feed.onestop_id
            }
            
           })
        //   console.log(stopsArr)
       setStops(stopsArr);
        }
        fetchStops();
    },[])
  return {stops};

}
