import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    titulo: "",
    descripcion: "",
    imagen1: null,
    imagen2: null,
    imagen3: null,
    fecha_proyecto: "",
    deleteImages: {
      imagen1: false,
      imagen2: false,
      imagen3: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiUrlGET = import.meta.env.VITE_APP_API_PROJECTS_GET;
  const apiUrlPUT = import.meta.env.VITE_APP_API_PROJECTS_PUT;
  const apiUrlDELETE = import.meta.env.VITE_APP_API_PROJECTS_DELETE;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("access"));
        const response = await fetch(`${apiUrlGET}${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setProject({
          titulo: data.titulo || "",
          descripcion: data.descripcion || "",
          imagen1: data.imagen1 || null,
          imagen2: data.imagen2 || null,
          imagen3: data.imagen3 || null,
          fecha_proyecto: data.fecha_proyecto || "",
          deleteImages: {
            imagen1: false,
            imagen2: false,
            imagen3: false,
          },
        });
      } catch (error) {
        console.error("Error al obtener el proyecto:", error);
        setError("No se pudo cargar el proyecto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setProject({ ...project, [name]: file || null });
  };

  const handleDeleteImage = async (imageName) => {
    const updatedDeleteImages = { ...project.deleteImages, [imageName]: true };
    setProject({ ...project, deleteImages: updatedDeleteImages });

    try {
      const token = JSON.parse(sessionStorage.getItem("access"));
      const response = await fetch(`/projects/delete-images/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedDeleteImages),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert(`Imagen ${imageName} eliminada correctamente.`);
    } catch (error) {
      console.error(`Error al eliminar la ${imageName}:`, error);
      setError(`No se pudo eliminar la ${imageName}.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(sessionStorage.getItem("access"));

      const formData = new FormData();
      formData.append("titulo", project.titulo);
      formData.append("descripcion", project.descripcion);
      formData.append("fecha_proyecto", project.fecha_proyecto);

      if (project.imagen1) formData.append("imagen1", project.imagen1);
      if (project.imagen2) formData.append("imagen2", project.imagen2);
      if (project.imagen3) formData.append("imagen3", project.imagen3);

      const response = await fetch(`${apiUrlPUT}${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      navigate("/projects");
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      setError("No se pudo actualizar el proyecto.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      const token = JSON.parse(sessionStorage.getItem("access"));

      const response = await fetch(`${apiUrlDELETE}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      alert("Proyecto eliminado correctamente.");
      navigate("/projects");
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
      setError("No se pudo eliminar el proyecto.");
    }
  };

  // Función para verificar si la imagen es válida para URL.createObjectURL
  const createImageURL = (image) => {
    if (image && image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image || null; // Si no es una instancia de File, simplemente regresa el valor
  };

  if (loading) {
    return <p>Cargando proyecto...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px", width: "81vw", margin: "auto" }}>
      <h1>Editar Proyecto</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "80%", margin: "auto" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="titulo" style={{ display: "block", marginBottom: "5px" }}>
            Título
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={project.titulo}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="descripcion" style={{ display: "block", marginBottom: "5px" }}>
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={project.descripcion}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              height: "100px",
              boxSizing: "border-box",
              resize:"none",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fecha_proyecto" style={{ display: "block", marginBottom: "5px" }}>
            Fecha del Proyecto
          </label>
          <input
            type="date"
            id="fecha_proyecto"
            name="fecha_proyecto"
            value={project.fecha_proyecto}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
        {[1, 2, 3].map((num) => (
          <div key={num} style={{ marginBottom: "15px" }}>
            <label htmlFor={`imagen${num}`} style={{ display: "block", marginBottom: "5px" }}>
              {`Imagen ${num}`}
            </label>
            <input
              type="file"
              id={`imagen${num}`}
              name={`imagen${num}`}
              onChange={handleFileChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
            {createImageURL(project[`imagen${num}`]) && (
              <div>
                <img
                  src={createImageURL(project[`imagen${num}`])}
                  alt={`Imagen ${num}`}
                  style={{ width: "350px", marginTop: "10px" }}
                />
              </div>
            )}
            {project[`imagen${num}`] && num !== 1 && (  // Solo mostrar el botón si hay imagen
              <div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(`imagen${num}`)}
                  style={{
                    marginTop: "5px",
                    backgroundColor: "#DC3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    padding: "5px 10px",
                  }}
                >
                  Eliminar Imagen {num}
                </button>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#007BFF",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Guardar Proyecto
          </button>
        </div>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              backgroundColor: "#DC3545",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Eliminar Proyecto
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
