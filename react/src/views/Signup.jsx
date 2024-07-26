import { Link } from "react-router-dom"
import { useRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();

    const emailRef = useRef();
    
    const passwordRef = useRef();
    
    const confirmationRef = useRef();

    const [errors, setErrors] = useState(null)
    
    const {setUser, setToken} = useStateContext()

    const onSubmit = (ev) =>{
        ev.preventDefault()
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: confirmationRef.current.value,
        }

        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors);
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Crea tu cuenta</h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>}
                    <input ref={nameRef} placeholder="Nombre"/>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Contraseña"/>
                    <input ref={confirmationRef} type="password" placeholder="Confirma la contraseña"/>
                    <button className="btn btn-block">Crear tu cuenta</button>
                    <p className="message">
                        Ya tienes cuenta? <Link to="/login">Ingresa a tu cuenta</Link>
                    </p>
                </form>
            </div>
        </div>
    )
 }