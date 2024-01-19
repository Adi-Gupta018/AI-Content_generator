import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Registration from './components/Users/Register'
import Login from './components/Users/Login'
import Dashboard from './components/Users/UserDashboard'
import PrivateNavbar from './components/Navbar/PrivateNavbar'
import PublicNavbar from './components/Navbar/PublicNavbar'
import Home from './components/Home/Home'
import { useAuth } from './AuthContext/AuthContext'
import AuthRoute from './components/Users/AuthRoute/AuthRoute'
import BlogPostAIAssistant from './components/ContentGeneration/ContentGeneration'
import Plans from './Plan/Plan'
import FreePlanSignup from './components/StripePayment/FreePlanSignup'
import CheckoutForm from './components/StripePayment/CheckoutForm'
import PaymentSuccess from './components/StripePayment/PaymentSuccess'
import ContentGenerationHistory from './components/ContentGeneration/ContentGenerationHistory'
import AppFeatures from './components/Features/Features'
import AboutUs from './components/About/AboutUs'



export default function App() {
  const {isAuthenticated} = useAuth()
  return (
    <>
    <BrowserRouter>
    {isAuthenticated? <PrivateNavbar/> : <PublicNavbar/>}
      <Routes>
        <Route path='/register' element={<Registration/>} /> {/*have to pass Home as component i.e <Home/> */}
        <Route path='/login' element={<Login/>} /> 
        <Route path='/dashboard' element = {
          <AuthRoute>
            <Dashboard/> 
            </AuthRoute>
        } />
         <Route path='/generate-content' element = {
        
            <BlogPostAIAssistant/>
            
        } />
         <Route path='/history' element = {
          
            <ContentGenerationHistory/>
            
        } />
        <Route path='/' element = {<Home/>} />
        <Route path='/plans' element = {<Plans/>} />
        <Route path='/free-plan' element = {
         
            <FreePlanSignup/>
            
        } />
        <Route path='/checkout/:plan' element = {
         
            <CheckoutForm/>
            
        } />
        <Route path='/success' element = {
          
            <PaymentSuccess/>
           
        } />
        <Route path='/features' element = {<AppFeatures/>} />
        <Route path='/about' element = {<AboutUs/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}