import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/FakeAuthContext"

export default function ProtectedRout({children}) {
  
const {isAuthenticated} = useAuth();
const navigate = useNavigate();

useEffect(()=>{

    if(!isAuthenticated) navigate('/');

},[isAuthenticated,navigate])

    return isAuthenticated ? children:null

}
