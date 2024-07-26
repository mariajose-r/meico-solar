import axios from "axios";

const axiosClient = axios.create({
    //api url
    baseURL: 'http://localhost:8000/api'
})

//request interceptor
axiosClient.interceptors.request.use( (config) =>{
    const token = localStorage.getItem('ACCESS_TOKEN')
    config.headers.Authorization = `Bearer ${token}`
    
    return config;
})

//response interceptor
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) =>{
    const {response}  = error;
    try{
        if(response.status === 401){
            localStorage.removeItem('ACCESS_TOKEN')
        } 
    } catch(error){
        console.log(error);
    }
    

    throw error;
})

export default axiosClient;