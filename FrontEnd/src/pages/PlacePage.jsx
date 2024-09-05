import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, redirect, useParams } from "react-router-dom";
import { differenceInCalendarDays } from 'date-fns';

export default function PlacePage() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos , setShowAllPhotos] = useState(false);
    const [checkIn , setCheckIn] = useState('');
    const [checkOut , setCheckOut] = useState('');
    const [numberOfGuests , setNumberOfGuests] = useState('');
    const [nameOfGuest , setNameOfGuest] = useState('');
    const [phoneNum , setPhoneNum] = useState('');
    const [redirect , setRedirect] = useState() ;
    const [numberOfNights , setNumberOfNights] = useState(0) ;
                    

    useEffect(() => {
        if (!id) {
            return;
        }
        if(checkIn && checkOut){
            let numberOfNights = differenceInCalendarDays(new Date(checkOut) , new Date(checkIn)) ; 
            setNumberOfNights(numberOfNights);
        }   
        axios.get(`/places/${id}`)
            .then(res => {
                setPlace(res.data);
            })
            .catch(err => {
                console.error("Error fetching place:", err);
                // Handle errors here (e.g., set an error state)
            });
    }, [id , checkIn , checkOut]);

    if (place === null) {
        return <div className="text-center">Loading...</div>; // Show a loading state or message
    }

    if (showAllPhotos) {
        return (
            <div className="inset-0 min-h-screen">
                <div className="p-8 grid gap-4">
                    <div className="flex justify-between items-center ">
                        <h2 className="text-3xl mr-30">Photos of {place.title}</h2>
                        <button
                            onClick={() => setShowAllPhotos(false)}
                            className="flex gap-1 py-2 px-4 rounded-2xl shadow shadow-gray-900"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Close Photos
                        </button>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map((photo, index) => (
                         <div key={index}>
                            <img
                                src={`http://localhost:8080${photo}`}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-200 object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    async function book() {
        try {
            const data = {
                checkIn, 
                checkOut, 
                numberOfGuests, 
                nameOfGuest, 
                phoneNum,
                place: place._id, 
                price: numberOfNights * place.price
            };
    
            const res = await axios.post('/bookings', data);
    
            const bookingId = res.data._id;
            setRedirect(`/account/bookings/${bookingId}`);
        } catch (error) {
            if (error.response && error.response.status === 401) { // Unauthorized error
                alert("You are not authorized to perform this action. Please log in.");
            } else {
                console.error("An error occurred during booking:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    }

    if(redirect){
        return <Navigate to={redirect}/>
    }
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Heading Section */}
                <div className="p-6">
                    <h1 className="text-4xl font-bold mb-4">{place.title}</h1>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://maps.google.com/?q=${place.address}`}
                        className="text-lg text-blue-500 hover:underline flex gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                        </svg>

                        {place.address}
                    </a>
                </div>
                
                {/* Image and Gallery Section */}
                <div className="flex items-stretch">
                    {/* Main Image on the Left */}
                    <div className="flex-1">
                        <img
                            src={`http://localhost:8080${place.photos[0]}`}
                            alt="Main"
                            onClick={() => setShowAllPhotos(true)}
                            className="w-full h-full object-cover cursor-pointer"
                        />
                    </div>

                    {/* Smaller Images on the Right */}
                    <div className="flex-1 flex flex-col gap-4 p-4">
                        {place.photos?.slice(1).map((photo, index) => (
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
                
                
                    {/* Description Section */}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        <p className="text-gray-700">{place.description}</p>
                    </div>

                <div className="px-6 py-4 grid grid-cols-2">
                            <div>
                                <b>CheckIn : {place.checkIn}</b>
                            <br/>
                            <b>CheckOut : {place.checkOut}</b>
                            <br />

                            <b>Maximum Number of Guests : {place.maxGuests}</b>
                            </div>

                            {/* //Booking Form . . . */}
                            <div>
                                <div className="bg-gray-300 p-4 rounded-2xl shadow text-center">
                                    <b>Price : ${place.price} per night</b>
                                    <div className="px-6 py-4 bg-white mt-4">
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Check in:
                                            </label>
                                            <input
                                                type="date"
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                                Check out:
                                            </label>
                                            <input
                                                type="date"
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    
                                    <div className="flex mt-2">
                                        <input type="number" placeholder="Enter the Number of Guests" 
                                            value={numberOfGuests}
                                            onChange={(e) => setNumberOfGuests(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex mt-2">
                                        <input type="text" placeholder="Enter the Name : " 
                                            value={nameOfGuest}
                                            onChange={(e) => setNameOfGuest(e.target.value)}
                                        />

                                        <input type="text" placeholder="Enter the Contact Number: " 
                                            value={phoneNum}
                                            onChange={(e) => setPhoneNum(e.target.value)}
                                        />
                                    </div>

                                    {
                                        <span>${Number(numberOfNights) * Number(place.price)}</span> 
                                    }
                                    
                                    <button onClick={book} className="primary mt-4">Book Now</button>
                                </div>
                            </div>
                </div>
                <div className="px-6 py-2">
                    <h2 className="text-2xl font-semibold">Extra Info</h2>
                </div>
                <div className=" text-sm text-gray-800 leading-6 p-4 border border-gray-300 bg-gray-50">
                    {place.extraInfo}
                </div>
            </div>
            
        </div>
    );
}
