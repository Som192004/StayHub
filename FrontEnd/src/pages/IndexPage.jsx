import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/all-places')
      .then(res => {setPlaces(res.data) })
      .catch(err => console.error("Error fetching places:", err));
  }, []);

  return (
    <div>
      {
        places.length > 0 && (
          <div className="gap-x-6 gap-y-8 mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {places.map((place) => (

              <Link to={`/place/${place._id}`} key={place._id} className="bg-gray-500 rounded-2xl mb-2">
                {
                  place.photos?.[0] && (
                    <img
                      className='mb-2 rounded-2xl object-cover aspect-square transition-transform duration-300 ease-in-out transform hover:scale-105'
                      src={`http://localhost:8080${place.photos[0]}`}
                      alt={place.title} // Added alt attribute for accessibility
                    />
                  )
                }
                <h2 className="font-bold">
                  {place.address}
                </h2>
                <h3 className="text-sm leading-4">{place.title}</h3>
                <div className="mt-1">
                  <span>${place.price}</span> per night
                </div>
              </Link>
            ))}
          </div>
        )
      }
    </div>
  );
}
