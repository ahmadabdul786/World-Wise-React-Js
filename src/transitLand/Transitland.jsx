import React, { useEffect, useState } from 'react'

function Transitland({searchStop,setSearchStop}) {
 //https://transit.land/api/v2/rest/stops/f-sf~bay~area~rg:mtc/departures?apikey=YOUR_API_KEY
    const [search,setSearch] = useState('');
   function handleSubmit(e){
       e.preventDefault();
     setSearchStop(search);
     
   }

    return (
    <div>
    <form onSubmit={handleSubmit} >
        <input type='text' value={search}
         onChange={(e)=>setSearch(e.target.value)}
          placeholder='search' 
          className='border w-1' />
    </form>
      
    </div>
  )
}

export default Transitland
