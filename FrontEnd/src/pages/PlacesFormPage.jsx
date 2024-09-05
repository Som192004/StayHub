import { useEffect, useState } from "react";
import Perks from "../components/Perks";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";



const PlacesFormPage = () => {
    const {id} = useParams() ;
    const [title , setTitle] = useState('') ;
    const [address , setAddress] = useState('') ;
    const [addedPhotos , setAddedPhotos] = useState([]) ;
    const [photoLink , setPhotoLink] = useState('') ;
    const [description , setDescription] = useState('') ;
    const [perks , setPerks] = useState([]) ;
    const [extraInfo , setExtraInfo] = useState('') ;
    const[checkIn , setCheckIn] = useState('') ;
    const[checkOut , setCheckOut] = useState('') ;
    const [maxGuests , setMaxGuests] = useState(1) ;
    const [redirect , setRedirect] = useState(false) ;
    const [price , setPrice] = useState(100) ;

    useEffect(() => {
        if(!id){

        }
        else{
            axios.get('/places/'+id)
            .then(res => {
                const {data} = res ; 
                setTitle(data.title) ;
                setAddress(data.address);
                setAddedPhotos(data.photos);
                setDescription(data.description);
                setPerks(data.perks);
                setExtraInfo(data.extraInfo);
                setCheckIn(data.checkIn) ;
                setCheckOut(data.checkOut) ;
                setMaxGuests(data.maxGuests);
                setPrice(data.price) ;
            }) ;
        }
    },[id])
    async function addPhotoByLink(e){
        e.preventDefault() ;
        const {data:filename} = await axios.post('/upload-by-link' , {link : photoLink}) ;
        setAddedPhotos(prev => {
            return [...prev , filename];
        })
        setPhotoLink('') ;
    }

    async function uploadPhoto(e){
       const files = e.target.files ;
       const data = new FormData() ;
       for(let i = 0 ; i<files.length ; i++){
        data.append('files' , files[i]) ;
       }
      
       const res = await axios.post('/upload' , data , {
        headers : {'Content-type' : 'multipart/form-data'} ,
       }) ;
       
       setAddedPhotos(prev => {
        return [...prev , ...res.data];
    })
    }

    async function addNewPlace(e){
        e.preventDefault() ;
        if(id){
            //update
            
            await axios.put('/places' , {id , title ,address , addedPhotos , description , perks , extraInfo , checkIn , checkOut , maxGuests , price}) ;
            setRedirect(true) ;

        }   
        else{
            //new place
            
            await axios.post('/place' , {title ,address , addedPhotos , description , perks , extraInfo , checkIn , checkOut , maxGuests , price}) ;
            setRedirect(true) ;
        }
        
    }

    function removePhoto(e , link){
        e.preventDefault() ;
        setAddedPhotos([...addedPhotos.filter(photo => photo !== link)])
    }
        if(redirect){
            return <Navigate to={'/account/places'} />
        }
    
    function setAsMain(e , link){
        e.preventDefault();
        const addedWithOutSelected = addedPhotos.filter(fname => fname !== link)
        const newAddedPhtos = [link , ...addedWithOutSelected] ;
        setAddedPhotos(newAddedPhtos);
    }

    return <>
                   <div>       
                <AccountNav />
                <form onSubmit={addNewPlace}>
                    <h2 className="text-2xl mt-4">Title</h2>
                    <p className="text-gray-500 text-sm">Title for your place. should be short and  catchy as in advertisment</p> 
                    <input type='text'
                     value={title}
                     onChange={e => setTitle(e.target.value)} placeholder = "title , for example: My lovely apt " />

                    <h2 className = "text-2xl mt-4">Address</h2>
                    <p className = "text-gray-500 text-sm">Address to this place</p>
                    <input type='text' 
                     value={address} onChange = {e => setAddress(e.target.value)} placeholder="address"/>

                    <h2 className = "text-2xl mt-4">Photos</h2>
                    <p className = "text-gray-500 text-sm">more = better</p>
                    <div className = "flex gap-2">
                        <input type='text'
                        value={photoLink}
                        onChange={e => setPhotoLink(e.target.value)} placeholder="Add using a link ...jpg" />

                        <button onClick = {addPhotoByLink} className ="bg-primary px-4 rounded-2xl">Add&nbsp;Photo</button>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6">
                        {addedPhotos.length > 0 && addedPhotos.map(link => (
                            <div key={link} className="flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden">
                                <img src={`http://localhost:8080${link}`} alt="Place" className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 ease-in-out transform hover:scale-105" />
                                <div className="flex-1 flex items-center justify-center p-4">
                                    <button
                                    onClick={(e) => removePhoto(e , link)}
                                     style={{ backgroundColor: 'red' }} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 m-2">
                                        Delete
                                    </button>

                                    <button
                                        onClick={(e) => setAsMain(e , link)}
                                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 m-2">
                                        {(link !== addedPhotos[0] ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                        :<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                      </svg>
                                      )}
                                    </button>

                                </div>
                            </div>
                        ))}
                        <label className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg p-6 text-xl text-gray-600 cursor-pointer hover:bg-gray-200 transition duration-300">
                            <input type="file" className="hidden" onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <span>Upload</span>
                        </label>
                    </div>



                    <h2 className="text-2xl mt-14">Description</h2>
                    <p className="text-gray-500 text-sm">description of the place</p>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}/>

                    <h2 className="text-2xl mt-4">Perks</h2>
                    <p className="text-gray-500 text-sm">select all the perks of your place </p>
                    <Perks selected={perks} onChange={setPerks}/>

                    <h2 className="text-2xl mt-4">Extra Info</h2>
                    <p className="text-gray-500 text-sm">house rules , etc</p>
                    <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>

                    <h2 className="text-2xl mt-4">chceck in&out times , max guests</h2>
                    <p className="text-gray-500 text-sm">add check in and out times , remember to have some time window for cleaning the room between guests </p>
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check In time</h3>
                        <input type='text' placeholder="14:00"
                        value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out time </h3>
                        <input type='text' placeholder="11:00"
                        value={checkOut} onChange={e => setCheckOut(e.target.value)} />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Max number of guests</h3>
                        <input type='number' value={maxGuests} onChange={e => setMaxGuests(e.target.value)}/>
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Price per night</h3>
                        <input type='number' value={price} onChange={e => setPrice(e.target.value)}/>
                    </div>
                    </div>
                    <div className="primary my-4">
                        <button className="primary">Save</button>
                    </div>
                </form>
            </div>
    </>


 

}

export default PlacesFormPage ;