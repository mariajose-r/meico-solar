import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

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

    const onSubmit = (ev) => {
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
                        <input
                            value={task.fecha}
                            onChange={(ev) =>
                                setTask({ ...task, fecha: ev.target.value })
                            }
                            placeholder="Fecha límite"
                        />
                        <input
                            value={task.estado}
                            onChange={(ev) =>
                                setTask({ ...task, estado: ev.target.value })
                            }
                            placeholder="Estado"
                        />
                        <input
                            value={task.prioridad}
                            onChange={(ev) => {
                                const newPrioridad = ev.target.value;

                                setTask((prevTask) => {
                                    const updatedTask = {
                                        ...prevTask,
                                        prioridad: newPrioridad,
                                    };

                                    // Set email based on prioridad value

                                    if (newPrioridad !== "alta") {
                                        updatedTask.email = "example@mail.com";
                                    } else {
                                        updatedTask.email =
                                            prevTask.email || "";
                                    }
                                    return updatedTask;
                                });
                            }}
                            placeholder="Prioridad"
                        />
                        {task.prioridad == "alta" && (
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
