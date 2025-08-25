import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
 import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from './components/Form'
import ProtectedRout from './pages/ProtectedRout';
import { CitiesContextProvider,useCities } from "./contexts/CitiesContextProvider";
import {AuthProvider,useAuth} from "./contexts/FakeAuthContext";

export default function App() {
 

  return(
 <AuthProvider>
 <CitiesContextProvider>
 <BrowserRouter>
    <Routes>

      <Route index element = {<HomePage/>}/>
      <Route path="product" element = {<Product/>}/>
      <Route path="pricing" element = {<Pricing/>}/>
      <Route path = "app" element = {<ProtectedRout><AppLayout/></ProtectedRout>}
       >
         <Route path="cities" element={<CityList />} />
         <Route path="cities/:id" element ={<City/>}/>

        <Route path="contries" element={<CountryList />} />
        <Route path ="form" element={<Form/>} />
        <Route index element ={<Navigate replace to='cities'/> }/>
x
      </Route>
      <Route path="login" element={<Login/>} />
      <Route path="*" element = {<PageNotFound/>}/>
      
    </Routes>
    </BrowserRouter>
 </CitiesContextProvider>
 </AuthProvider>
  )
}
