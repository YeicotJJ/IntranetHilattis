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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    imagen: null,
    nombre: "",
    descripcion: "",
    visible: true,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageChanged, setImageChanged] = useState(false); // Estado para controlar si la imagen se cambia

  const isMobile = useMediaQuery("(max-width:600px)");
  const apiUrlGET = import.meta.env.VITE_APP_API_CATEGORIES_GET;
  const apiUrlPOST = import.meta.env.VITE_APP_API_CATEGORIES_POST;
  const apiUrlPUT = import.meta.env.VITE_APP_API_CATEGORIES_PUT;
  const apiUrlDELETE = import.meta.env.VITE_APP_API_CATEGORIES_DELETE;
  const token = JSON.parse(sessionStorage.getItem("access"));

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    fetch(apiUrlGET)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
        setVisibleCategories(data.slice(0, PAGE_SIZE));
      })
      .finally(() => setLoading(false))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredCategories = categories.filter(
      (category) =>
        category.nombre.toLowerCase().includes(term) ||
        category.descripcion.toLowerCase().includes(term)
    );
    setVisibleCategories(filteredCategories.slice(0, PAGE_SIZE));
    setPage(1);
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

  const handleDialogOpen = (category = null) => {
    setSelectedCategory(category);
    setNewCategory(
      category || {
        imagen: null,
        nombre: "",
        descripcion: "",
        visible: true,
      }
    );
    setImageChanged(false); // Reset estado de cambio de imagen
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewCategory({
      imagen: null,
      nombre: "",
      descripcion: "",
      visible: true,
    });
    setImageChanged(false); // Reset estado al cerrar el diálogo
  };

  const handleSaveCategory = () => {
    const formData = new FormData();

    // Si el usuario ha cambiado la imagen, agregarla al formData
    if (imageChanged && newCategory.imagen) {
      formData.append("imagen", newCategory.imagen);
    }

    formData.append("nombre", newCategory.nombre);
    formData.append("descripcion", newCategory.descripcion);
    formData.append("visible", newCategory.visible);

    const method = selectedCategory ? "PUT" : "POST";
    const url = selectedCategory
      ? `${apiUrlPUT}${selectedCategory.id}`
      : apiUrlPOST;

    fetch(url, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        fetchCategories();
        handleDialogClose();
      })
      .catch((error) => console.error("Error saving category:", error));
  };

  const handleDeleteCategory = (id) => {
    fetch(`${apiUrlDELETE}${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => fetchCategories())
      .catch((error) => console.error("Error deleting category:", error));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, imagen: file });
      setImageChanged(true); // Marcar que se ha cambiado la imagen
    }
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
    <div style={{ padding: "20px", width:"81vw" }}>
      <div style={{ display: "flex" }}>
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
          style={{
            width: "20vw",
            marginBottom: "20px",
            marginLeft: "4vw",
            backgroundColor: "var(--terciary-color)",
            color: "var(--text-color-secondary)",
          }}
          onClick={() => handleDialogOpen()}
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
                      {category.visible ? "Sí" : "No"}
                    </TableCell>
                    <TableCell>
                      <Button
                        style={{ marginRight: "10px" }}
                        startIcon={<BsFillPencilFill />}
                        onClick={() => handleDialogOpen(category)}
                      >
                        Editar
                      </Button>
                      <Button
                        color="error"
                        startIcon={<BsFillTrashFill />}
                        onClick={() => handleDeleteCategory(category.id)}
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

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {selectedCategory ? "Editar Categoría" : "Nueva Categoría"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={newCategory.nombre}
            onChange={(e) =>
              setNewCategory({ ...newCategory, nombre: e.target.value })
            }
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            value={newCategory.descripcion}
            onChange={(e) =>
              setNewCategory({ ...newCategory, descripcion: e.target.value })
            }
          />
          <div style={{ margin: "10px 0" }}>
            {imageChanged ? (
              <Typography variant="body2">Imagen seleccionada</Typography>
            ) : (
              <Button variant="outlined" component="label">
                Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </div>
          <div>
            <Typography variant="body2">Visible</Typography>
            <Switch
              checked={newCategory.visible}
              onChange={(e) =>
                setNewCategory({ ...newCategory, visible: e.target.checked })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
