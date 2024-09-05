import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";

export default function SingleBookingPage(){
    const {id} = useParams() ;
    const [booking , setBooking] = useState() ;
    useEffect(() => {
        if(id){
            axios.get('/all-bookings').then(res => {
                const foundBooking = res.data.find(({_id}) => _id === id) ;
                console.log(res.data);

                if(foundBooking){
                    setBooking(foundBooking);
                    console.log(foundBooking);
                }
            })

        }
    } , [id]);

    if(!booking){
        return '' ;
    }

    return <> <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Heading Section */}
                <div className="p-6">
                    <h1 className="text-4xl font-bold mb-4">{booking.bookingplace.title}</h1>
                    <div className="p-2 flex justify-between">
                        <span>Number of Guests: {booking.bookingplace.numberOfGuests}</span>
                        <span className="text-lg font-bold">Total: ${booking.bookingplace.price}</span>
                    </div>

                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://maps.google.com/?q=${booking.bookingplace.address}`}
                        className="text-lg text-blue-500 hover:underline flex gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                        </svg>

                        {booking.bookingplace.address}
                    </a>
                </div>
                
                {/* Image and Gallery Section */}
                <div className="flex items-stretch">
                    {/* Main Image on the Left */}
                    <div className="flex-1">
                        <img
                            src={`http://localhost:8080${booking.bookingplace.photos[0]}`}
                            alt="Main"
                            onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                    </div>

                    {/* Smaller Images on the Right */}
                    <div className="flex-1 flex flex-col gap-4 p-4">
                        {booking.bookingplace.photos?.slice(1).map((photo, index) => (
                            <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
                                <img
                                    src={`http://localhost:8080${photo}`}
                                    alt={`Place Photo ${index + 1}`}
                                    onClick={() => setShowAllPhotos(true)}
                                    className="object-cover w-full h-48 transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                />
                            </div>
                        ))}
                        
                    </div>
                    
                    
                </div>
                
                    <div className="text-center p-6">
                        <button
                            onClick={() => setShowAllPhotos(true)}
                            className="py-2 px-4 bg-white rounded-2xl shadow shadow-d shadow-gray-500 gap-2 flex"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            Show More Photos
                        </button>
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        <p className="text-gray-700">{booking.bookingplace.description}</p>
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-semibold">Extra Info</h2>
                        <p className="text-gray-700">{booking.bookingplace.extraInfo}</p>
                    </div>

            </div>          
        </>
}