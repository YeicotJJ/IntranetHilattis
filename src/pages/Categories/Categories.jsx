import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const isMobile = useMediaQuery("(max-width:600px)");
  const apiUrlGET=import.meta.env.VITE_APP_API_CATEGORIES_GET;

  const PAGE_SIZE = 10;

  useEffect(() => {
    // Fetch categories data from API
    setLoading(true);
    fetch(apiUrlGET)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setVisibleCategories(data.slice(0, PAGE_SIZE));
      })
      .finally(() => setLoading(false))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredCategories = categories.filter(
      (category) =>
        category.nombre.toLowerCase().includes(term) ||
        category.descripcion.toLowerCase().includes(term)
    );
    setVisibleCategories(filteredCategories.slice(0, PAGE_SIZE));
    setPage(1); // Reset to the first page when searching
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const newVisibleCategories = categories
      .filter(
        (category) =>
          category.nombre.toLowerCase().includes(searchTerm) ||
          category.descripcion.toLowerCase().includes(searchTerm)
      )
      .slice(0, PAGE_SIZE * nextPage);
    setVisibleCategories(newVisibleCategories);
    setPage(nextPage);
  };

  if (isMobile) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Para acceder a las categorías necesita estar en una computadora.
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{display:"flex"}}>
      <TextField
        label="Buscar categorías"
        variant="outlined"
        fullWidth
        style={{ marginBottom: "20px" }}
        onChange={handleSearch}
      />
      <Button
        variant="contained"
        color="primary"
        style={{width:"20vw", marginBottom: "20px", marginLeft:"4vw"}}
        onClick={() => console.log("Add new category")}
      >
        Añadir Categoría
      </Button>
      </div>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Imagen</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha de Creación</TableCell>
                  <TableCell>Última Modificación</TableCell>
                  <TableCell>Visible</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      <img
                        src={category.imagen}
                        alt={category.nombre}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell>{category.nombre}</TableCell>
                    <TableCell>{category.descripcion}</TableCell>
                    <TableCell>
                      {new Date(category.fecha_creacion).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(category.fecha_modificacion).toLocaleString()}
                    </TableCell>
                    <TableCell>{category.visible ? "Sí" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginRight: "10px" }}
                        onClick={() => console.log("Edit category", category.id)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          console.log("Delete category", category.id)
                        }
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {visibleCategories.length < categories.length && (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
              >
                Cargar más
              </Button>
            </div>
          )}
        </Paper>
      )}
    </div>
  );
}
