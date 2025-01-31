import { useState, useEffect } from "react"
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
} from "@mui/material"
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [form, setForm] = useState({
    imagen: null,
    nombre: "",
    descripcion: "",
    visible: false,
  })

  const apiGET = import.meta.env.VITE_APP_API_CATEGORIES_GET
  const apiPOST = import.meta.env.VITE_APP_API_CATEGORIES_POST
  const apiPATCH = import.meta.env.VITE_APP_API_CATEGORIES_PUT
  const apiDELETE = import.meta.env.VITE_APP_API_CATEGORIES_DELETE
  const token = JSON.parse(sessionStorage.getItem("access"))

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  const fetchCategories = async () => {
    try {
      const response = await fetch(apiGET, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setCategories(data)
      setFilteredCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imagen: e.target.files[0] }))
  }

  const handleToggle = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setForm({
      imagen: null,
      nombre: "",
      descripcion: "",
      visible: false,
    })
    setDialogOpen(true)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setForm({
      imagen: null,
      nombre: category.nombre,
      descripcion: category.descripcion,
      visible: category.visible,
    })
    setDialogOpen(true)
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await fetch(`${apiDELETE}${selectedCategory.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCategories()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append("nombre", form.nombre)
    formData.append("descripcion", form.descripcion)
    if (form.imagen) formData.append("imagen", form.imagen)
    formData.append("visible", form.visible)

    try {
      if (selectedCategory) {
        await fetch(`${apiPATCH}${selectedCategory.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      } else {
        await fetch(apiPOST, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      }
      fetchCategories()
      setDialogOpen(false)
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  return (
    <div style={{ width:"81vw",boxSizing: "border-box", padding: "1.2em" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <TextField
          label="Buscar categoría"
          style={{ width: "78%", background: "#f1eadb" }}
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          style={{ background: "var(--terciary-color)" }}
          startIcon={<BsPlus />}
          onClick={handleAdd}
        >
          Añadir categoría
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(20em, 1fr))",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            sx={{
              width: "20em",
              height: "400px",
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: "200px",
                objectFit: "contain",
                backgroundColor: "#f0f0f0", // Un fondo neutro para las imágenes
              }}
              image={category.imagen || "/placeholder.svg"}
              alt={category.nombre}
            />
            <CardContent sx={{ flexGrow: 1, overflow: "auto" }}>
              <Typography gutterBottom variant="h5" component="div">
                {category.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {category.descripcion}
              </Typography>
              <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                <Typography variant="body2">Visible:</Typography>
                <Switch checked={category.visible} disabled style={{ color: "var(--primary-color)" }} />
              </div>
            </CardContent>
            <CardActions>
              <Button startIcon={<BsPencil />} onClick={() => handleEdit(category)}>
                Editar
              </Button>
              <Button startIcon={<BsTrash />} onClick={() => handleDelete(category)}>
                Eliminar
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {/* Dialog para añadir o editar categoría */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedCategory ? "Editar Categoría" : "Añadir Categoría"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleInputChange}
            required
            fullWidth
            margin="dense"
          />
          <TextField
            label="Descripción"
            name="descripcion"
            value={form.descripcion}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <div style={{display:"flex",flexDirection:"column"}}>
            <label>Cambiar Imagen</label>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ margin: "10px 0" }} />
          </div>
          <div>
            <label>Visible:</label>
            <Switch checked={form.visible} onChange={() => handleToggle("visible")} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCategory ? "Guardar Cambios" : "Añadir"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar la categoría "{selectedCategory?.nombre}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Categories


