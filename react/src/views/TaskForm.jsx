import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function TaskForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setNotification } = useStateContext();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState({
        id: null,
        titulo: "",
        descripcion: "",
        fecha: "",
        estado: "",
        prioridad: "",
        email: "",
    });
    const [startDate, setStartDate] = useState(new Date());
    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient
                .get(`/tasks/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setTask(data);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, []);
    }

    const handlePriorityChange = (ev) => {
        const newPriority = ev.target.value;
        setTask((prevTask) => ({
            ...prevTask,
            prioridad: newPriority,
            email: newPriority === "alta" ? "example@mail.com" : "",
        }));
    };

    const onSubmit = (ev) => {
        if (task.email === "") {
            task.email = "example@mail.com";
        }
        ev.preventDefault();
        if (task.id) {
            axiosClient
                .put(`/tasks/${task.id}`, task)
                .then(() => {
                    setNotification("Se ha actualizado la tarea");
                    navigate("/tasks");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post(`/tasks`, task)
                .then(() => {
                    setNotification("Se ha creado la tarea");
                    navigate("/tasks");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    return (
        <>
            {task.id && <h1>Editar tarea: {task.titulo}</h1>}
            {!task.id && <h1>Nueva tarea</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Cargando...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            value={task.titulo}
                            onChange={(ev) =>
                                setTask({ ...task, titulo: ev.target.value })
                            }
                            placeholder="Titulo"
                        />
                        <input
                            value={task.descripcion}
                            onChange={(ev) =>
                                setTask({
                                    ...task,
                                    descripcion: ev.target.value,
                                })
                            }
                            placeholder="Descripción"
                        />
                        <label>
                            Fecha límite:
                            <DatePicker
                                selected={startDate}
                                onChange={(date) =>{
                                    setTask({ ...task, fecha: date });
                                    setStartDate(date);
                                }}
                                dateFormat="yyyy/MM/dd"
                                className="datepicker"
                            />
                        </label>

                        <div className="dropdown">
                            <label>
                                Estado:
                                <select
                                    className="dropdown-menu"
                                    value={task.estado}
                                    onChange={(ev) =>
                                        setTask({
                                            ...task,
                                            estado: ev.target.value,
                                        })
                                    }
                                >
                                    <option value="pendiente">pendiente</option>
                                    <option value="en progreso">
                                        en progreso
                                    </option>
                                    <option value="completado">
                                        completada
                                    </option>
                                </select>
                            </label>
                        </div>
                        <div className="dropdown">
                            <label>
                                Prioridad:
                                <select
                                    className="dropdown-menu"
                                    value={task.prioridad}
                                    onChange={handlePriorityChange}
                                >
                                    <option value="baja">baja</option>
                                    <option value="media">media</option>
                                    <option value="alta">alta</option>
                                    
                                </select>
                            </label>
                        </div>

                        {task.prioridad == 'alta' && (
                            <input
                                type="email"
                                value={task.email}
                                onChange={(ev) =>
                                    setTask({ ...task, email: ev.target.value })
                                }
                                placeholder="Email del encargado"
                            />
                        )}
                        <button className="btn">Guardar</button>
                    </form>
                )}
            </div>
        </>
    );
}
