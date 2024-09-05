import { useContext , useState } from "react"
import { UserContext } from "../store/UserContext"
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";

export default function Account(){
    const {user , ready , setUser} = useContext(UserContext) ;
    const [redirect , setRedirect] = useState(null);
    const {subpage } = useParams() ;

    if(!ready){
        return <>
            Loading . . .
        </>
    }
    else if(ready && !user && !redirect){
        return <>
            <Navigate to={'/login'} />
        </>
    }
    else{

    }

    async function logout(){
        await axios.post('/logout' ) ;
        setRedirect('/');
        setUser(null);
        
    }
    

    

    if(redirect){
        return <Navigate to={redirect} />
    }
    return <>
    <div>
        <AccountNav />
        
        
        
        {subpage === undefined && (
            <div className="text-center max-w-lg mx-auto">
                <span className="font-bold text-center">Logged in as {user.name}</span>
                <br />
                <span className="font-bold text-center">{user.email}</span><br />

                <button onClick = {logout}className="primary max-w-md mt-2">LogOut</button>
            </div>
        )}

        {subpage === 'places' && (<div><PlacesPage></PlacesPage></div>)}



    </div>
    </>
}