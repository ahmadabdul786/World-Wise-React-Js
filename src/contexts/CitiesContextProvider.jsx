import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const base_url = "http://localhost:9000";

export default function CitiesContextProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrenCity] = useState({});

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

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        fetchCity,
        currentCity,
        createCity,
        deleteCity,
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
