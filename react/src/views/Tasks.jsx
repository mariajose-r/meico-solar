import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [estadoFilter, setEstadoFilter] = useState("");
    const [prioridadFilter, setPrioridadFilter] = useState("");

    useEffect(() => {
        getTasks();
    }, [currentPage, estadoFilter, prioridadFilter]);

    const onDelete = (task) => {
        if (!window.confirm("Quieres borrar esta tarea?")) {
            return;
        }

        axiosClient.delete(`/tasks/${task.id}`).then(() => {
            setNotification("La tarea ha sido eliminada");
            getTasks();
        });
    };

    const getTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/tasks", {
                params: {
                    page: currentPage,
                    estado: estadoFilter,
                    prioridad: prioridadFilter,
                    perPage: 10, // Number of items per page
                },
            });
            setLoading(false);
            setTasks(response.data.data); // Assuming Laravel pagination data structure
            setTotalPages(response.data.last_page);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching tasks:", error.message);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEstadoFilterChange = (event) => {
        setEstadoFilter(event.target.value);
        //setPrioridadFilter('');
        if(event.target.value == "Todos"){
            setPrioridadFilter('');
        }
        setCurrentPage(1);
    };

    const handlePrioridadFilterChange = (event) => {
        setPrioridadFilter(event.target.value);
        //setEstadoFilter('');
        if(event.target.value == "Todas"){
            setEstadoFilter('');
        }
        setCurrentPage(1);
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Tareas</h1>
                <Link className="btn-add" to="/tasks/new">
                    Agregar nueva tarea
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Descripción</th>
                            <th>Fecha límite</th>
                            <th>Estado</th>
                            <th>Prioridad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Cargando...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.titulo}</td>
                                    <td>{task.descripcion}</td>
                                    <td>{task.fecha}</td>
                                    <td>{task.estado}</td>
                                    <td>{task.prioridad}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={"/tasks/" + task.id}
                                        >
                                            Editar
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={(ev) => onDelete(task)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                {/* Pagination */}
                <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                {/* Filters */}

                <div>
                    <label>
                        Estado:
                        <select
                            value={estadoFilter}
                            onChange={handleEstadoFilterChange}
                        >
                            <option value="">Todos</option>

                            <option value="pendiente">Pendiente</option>

                            <option value="en progreso">En Progreso</option>

                            <option value="completado">Completada</option>
                        </select>
                    </label>

                    <label>
                        Prioridad:
                        <select
                            value={prioridadFilter}
                            onChange={handlePrioridadFilterChange}
                        >
                            <option value="">Todas</option>

                            <option value="alta">Alta</option>

                            <option value="media">Media</option>

                            <option value="baja">Baja</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
}
