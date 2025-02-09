import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    titulo: "",
    descripcion: "",
    imagen1: null,
    imagen2: null,
    imagen3: null,
    fecha_proyecto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrlPOST = import.meta.env.VITE_APP_API_PROJECTS_GET+"create";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setProject({ ...project, [name]: file || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación de los campos obligatorios
    if (!project.titulo || !project.descripcion || !project.fecha_proyecto || !project.imagen1) {
      setError("Por favor, complete todos los campos obligatorios (Título, Descripción, Fecha del Proyecto, Imagen 1).");
      setLoading(false);
      return;
    }

    try {
      const token = JSON.parse(sessionStorage.getItem("access"));

      const formData = new FormData();
      formData.append("titulo", project.titulo);
      formData.append("descripcion", project.descripcion);
      formData.append("fecha_proyecto", project.fecha_proyecto);
      formData.append("imagen1", project.imagen1);

      if (project.imagen2) formData.append("imagen2", project.imagen2);
      if (project.imagen3) formData.append("imagen3", project.imagen3);

      const response = await fetch(apiUrlPOST, {
        method: "POST",
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
      console.error("Error al crear el proyecto:", error);
      setError("No se pudo crear el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", width: "81vw", margin: "auto" }}>
      <h1>Nuevo Proyecto</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            required
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
            required
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
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="imagen1" style={{ display: "block", marginBottom: "5px" }}>
            Imagen 1 (obligatoria)
          </label>
          <input
            type="file"
            id="imagen1"
            name="imagen1"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="imagen2" style={{ display: "block", marginBottom: "5px" }}>
            Imagen 2 (opcional)
          </label>
          <input
            type="file"
            id="imagen2"
            name="imagen2"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="imagen3" style={{ display: "block", marginBottom: "5px" }}>
            Imagen 3 (opcional)
          </label>
          <input
            type="file"
            id="imagen3"
            name="imagen3"
            onChange={handleFileChange}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Crear Proyecto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProject;
