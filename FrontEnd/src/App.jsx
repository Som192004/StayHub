import './App.css'
import {Routes , Route} from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './store/UserContext'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'
import BookingsPage from './pages/BookingsPage'
import SingleBookingPage from './pages/SingleBookingPage'

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.withCredentials = true ;
                 

const App = () => {
  
  return (
    <UserContextProvider>
  <Routes>
    <Route path='/' element={<Layout />}>
      <Route index element = {<IndexPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/register' element={<RegisterPage />}></Route>
      <Route path='/account/' element={<ProfilePage />}></Route>
      <Route path='/account/places' element={<PlacesPage />}></Route>
      <Route path='/account/places/new' element={<PlacesFormPage />}></Route>
      <Route path='/account/places/:id' element={<PlacesFormPage />}></Route>
      <Route path='/place/:id' element={<PlacePage />} />
      <Route path='/account/bookings' element={<BookingsPage/>} />
      <Route path='/account/bookings/:id' element = {<SingleBookingPage />} />
    </Route>
      
  </Routes>
  </UserContextProvider>)
}

export default App ; 