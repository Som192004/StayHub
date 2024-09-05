import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import axios from "axios";
import { UserContext } from "../store/UserContext";
export default function LoginPage(){
    const [email , setEmail] = useState('') ;
    const [password , setPassword] = useState('');
    const [redirect , setRedirect] = useState(false); 
    const {setUser} =  useContext(UserContext);

    const loginUser = async (e) => {
        e.preventDefault() ;

        try{
        const res = await axios.post('/login' , {email , password} ) ;
        setUser(res.data);
        alert("You're logged in Successfully") ;
        setRedirect(true) ;
        }catch(err){
            console.log(err) ;
            alert('Error while login') ;
        }

    }

    if(redirect){
        return <Navigate to={'/'}/>
    }
    return <>
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md
        mx-auto" onSubmit={loginUser}>
            <input type="email"
            placeholder="your@gmail.com" value={email} onChange={(e) => setEmail(e.target.value
            )}/>
            <input type="password" placeholder="password" 
            value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="primary">Login</button>
            <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link className='underline'to={'/register'}>Register Now</Link></div>
        </form>
            </div>
            
        </div>
    
    </>
}