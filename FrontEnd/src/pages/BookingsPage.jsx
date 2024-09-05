import { useState } from "react";
import AccountNav from "./AccountNav";
import { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from 'date-fns';


export default function BookingsPage(){
    const [bookings , setBookings] = useState([]) ;
    useEffect(() => {
        axios.get('/all-bookings').then(res => {
            setBookings(res.data) ;
        })
    },[]);
    return <div>
        <AccountNav />
        <div>
            {
                bookings?.length > 0 && bookings.map(booking => {
                    return <div>
                        <div>
                            {<Link to = {`/account/bookings/${booking._id}`} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
                                {booking.bookingplace.photos.length > 0 && (
                                    <img src = {`http://localhost:8080${booking.bookingplace.photos[0]}`} alt=""/>
                                )}
                            </div>
                            <div className="grow-0 shrink">
                            <h2 className="text-xl">{booking.bookingplace.title} </h2>
                            <p className="text-m mt-2 mb-1">{booking.bookingplace.description}</p>
                            {format(new Date(booking.checkIn), 'yyyy-MM-dd')} to {format(new Date(booking.checkOut), 'yyyy-MM-dd')}
                            </div>
                        </Link>
                            }
                        </div>

                        
                    </div>
                })
            }
        </div>
    </div>
}