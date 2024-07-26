import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx"
import Signup from "./views/Signup.jsx"
import Tasks from "./views/Tasks.jsx"
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import TaskForm from "./views/TaskForm.jsx";

const router = createBrowserRouter ([
    {
        path:'/',
        element: <DefaultLayout />,
        children:[
            {
                path: '/',
                element: <Navigate to="/tasks" />
            },
            {
                path:'/tasks',
                element: <Tasks />
            },
            {
                path:'/tasks/new',
                element: <TaskForm key="taskCreate"/>
            },
            {
                path:'/tasks/:id',
                element: <TaskForm key="taskUpdate"/>
            },
            {
                path:'/dashboard',
                element: <Dashboard />
            },
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children: [
            {
                path:'/login',
                element: <Login />
            },
            {
                path:'/signup',
                element: <Signup />
            },
        ]
    },
   
    {
        path:'*',
        element: <NotFound />
    },
])

export default router;