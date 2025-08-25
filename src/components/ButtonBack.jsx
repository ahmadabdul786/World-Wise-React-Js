import { useNavigate } from 'react-router-dom'
import Button from './Button'

export default function ButtonBack({children}) {
const nevigate = useNavigate();

    return (
   <Button OnClick={(e)=>{
          e.preventDefault();
          nevigate(-1);
        }}> 
        {children}
        </Button>

  )
}
