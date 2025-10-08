// Body.jsx (Updated Routing Logic)

// 1. Correct Imports (adjust paths based on your file structure)
import LandingPage from './pages/LandingPage' // <-- Use the LandingPage we built
import Login from './pages/Login'           // <-- Use the separate Login page
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            // The root path should be your Landing Page
            path: "/",
            element: <LandingPage/>, 
        },
        {
            // The separate path for your Login form
            path: "/login",
            element: <Login/>,

        },
        {
            // The main app dashboard path
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