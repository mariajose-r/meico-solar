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
                    perPage: 10,
                },
            });
            setLoading(false);
            setTasks(response.data.data);
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
        if(event.target.value == "Todos"){
            setPrioridadFilter('');
        }
        setCurrentPage(1);
    };

    const handlePrioridadFilterChange = (event) => {
        setPrioridadFilter(event.target.value);
        if(event.target.value == "Todas"){
            setEstadoFilter('');
        }
        setCurrentPage(1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
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
                {/* Filters */}

                <div  className="dropdown">
                    <label>
                        Estado:
                        <select
                        className="dropdown-menu"
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
                        className="dropdown-menu2"
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
                                    <td>{formatDate(task.fecha)}</td>
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
                            className="btn-pagination"
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                        
                    ))}
                </div>
            </div>
        </div>
    );
}
