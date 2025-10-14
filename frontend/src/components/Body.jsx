 
import LandingPage from './pages/LandingPage'  
         
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            
            path: "/",
            element: <LandingPage/>, 
        },
       
        {
            
            path: "/home", 
            element: <Home/>

        }
    ])
    return (
      <div>
        <RouterProvider router={appRouter}/>
      </div>
    )
}

export default Body;