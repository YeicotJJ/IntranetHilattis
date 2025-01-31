import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const apiUrlGET = import.meta.env.VITE_APP_API_PROJECTS_GET;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = JSON.parse(sessionStorage.getItem("access"));
        const response = await fetch(apiUrlGET, {
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
        setProjects(data);
      } catch (error) {
        console.error("Error al obtener los proyectos:", error);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px",alignItems:"center" }}>
        <input
          type="text"
          placeholder="Buscar proyectos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "10px",
            fontSize: "16px",
            background:"#f1eadb",
            border:"solid",
            borderColor:"grey",
            borderWidth:"1px", 
            height:"8vh",
            borderRadius:"0.5em",
        }}
        />
        <button
          onClick={() => navigate("/projects/new")}
          style={{
            marginBottom: "20px",
            marginTop: "20px",
            fontSize:"17px",
            backgroundColor: "var(--terciary-color)",
            color: "var(--text-color-secondary)",
            width:"20vw",
            border:"none",
            padding:"15px",
            height:"8vh",
            borderRadius:"0.5em",
            cursor:"pointer",
          }}
        >
          Añadir Proyecto
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/edit/${project.id}`)}
            style={{
              width: "20.5em",
              border: "1px solid #ccc",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
              background:"white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={project.imagen1}
              alt={project.titulo}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <div style={{ padding: "10px", textAlign: "center" }}>
              <h3 style={{ fontSize: "16px", margin: "0" }}>{project.titulo}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
