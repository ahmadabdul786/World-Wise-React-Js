import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const base_url = "http://localhost:9000";
const KEY = 'HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx';

export default function CitiesContextProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrenCity] = useState({});
  
  const [stops,setStops] = useState([]);

  //fetching all cities
  //ye useEffect first time chly ga or cities ko fetch kry ga islye terminal mn npm run server kr lein
  useEffect(() => {
    async function fetchCities() {
      setIsLoading(true);
      try {
        const res = await fetch(`${base_url}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  //getting current city by id
  //this  function will be used in City.jsx
  async function fetchCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${base_url}/cities/${id}`);
      const data = await res.json();
      setCurrenCity(data);
    } catch (err) {
      throw new Error(`Error fetching city `);
    } finally {
      setIsLoading(false);
    }
  }
  //when user click on add button in form

  async function createCity(city) {
    try {
      setIsLoading(true);
      const res = await fetch(`${base_url}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      const data = await res.json();
      setCities([...cities, data]);
      setCurrenCity(data);
    } catch (err) {
      throw new Error(`Error fetching city `);
    } finally {
      setIsLoading(false);
      console.log(cities);
    }
  }
  //when user delete any city from the list
  async function deleteCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${base_url}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      throw new Error(`Error fetching city `);
    } finally {
      setIsLoading(false);
    }
  }

  
  
      //   async function fetchStops(bboxString) {
      //     //  const res = await fetch(`https://transit.land/api/v2/rest/stops?name=${query}&apikey=${'HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx'}`);
       
      //     const res = await fetch(`https://transit.land/api/v2/rest/stops?bbox=${[...bboxString]}&apikey=HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx`)
          
      //   const data = await res.json();
      //      console.log(data);
      //      if(data.error|| data.stops.length===0) {
           
      //       console.log('please click somewhere else or zoom more')
      //       return null;
      //      }
           
      //      const stopsArr = data.stops.map((stop)=>{
      //       return {
      //           coordinates:stop.geometry.coordinates,
      //           stopName:stop.stop_name ,
      //           oneStopId:stop.feed_version.feed.onestop_id,
      //           stopId: stop.id,

      //       }            
      //      })
      //      setStops(stopsArr);
      //      console.log()
      //   //   console.log(stopsArr)
           
      // const departureRes =   await fetch(`https://transit.land/api/v2/rest/stops/${data.stops[0]?.onestop_id}/departures?apikey=HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx`)
      // const departureData = await departureRes.json();
      // console.log(departureData);
      
       
      //   }
      async  function fetchStops(lat,lon,radius){
       const url = `https://transit.land/api/v2/rest/stops?lat=${lat}&lon=${lon}&radius=${radius}&api_key=${KEY}`;
       try{
        const res =    await fetch(url);
        const data = await res.json();
        console.log(data);
        if(data.stops.length===0){
          return null;
        }
        const stopsArr = data.stops.map((stop)=>{
            return {
                coordinates:stop.geometry.coordinates,
                stopName:stop.stop_name ,
                oneStopId:stop.onestop_id,
                stopId: stop.id,

            }            
           })
           setStops(stopsArr);
       }
       catch(err){
       console.log(err);
       }
      }
async  function getStopDetails(stopId){
       const url = `https://transit.land/api/v1/stops/s-dqcjqb8eu3-virginiaavenw~21ststnw?&apikey=${KEY}`;
       try{
        const res =    await fetch(url);
        const data = await res.json();
        console.log(data);
        // try{ 
      //console.log('abc');
      
      // const departureRes =   await fetch(`/api/api/v2/rest/stops/${stopId}/departures?apikey=HGgNd0mYjI1l70NRbi0tXdH0eqGHpnhx`)
      // const departureData = await departureRes.json();
      // console.log(departureData);

        // if(data.stops.length===0){
        //   return null;
        // }
        // const stopsArr = data.stops.map((stop)=>{
        //     return {
        //         coordinates:stop.geometry.coordinates,
        //         stopName:stop.stop_name ,
        //         oneStopId:stop.onestop_id,
        //         stopId: stop.id,

        //     }            
        //    })
        //    setStops(stopsArr);
       }
       catch(err){
       console.log(err);
       }
      }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        fetchCity,
        currentCity,
        createCity,
        deleteCity,
        fetchStops,
        stops,getStopDetails
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesContextProvider");
  }
  return context;
}

export { CitiesContextProvider, useCities };
