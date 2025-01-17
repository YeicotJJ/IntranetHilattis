import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Switch } from '@mui/material';
import { BsPlus, BsTrash, BsPencil, BsImage } from 'react-icons/bs';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(null); // 'add', 'edit', 'image'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({
    imagen: null,
    nombre: '',
    descripcion: '',
    visible: false,
  });

  const apiGET = import.meta.env.VITE_APP_API_CATEGORIES_GET;
  const apiPOST = import.meta.env.VITE_APP_API_CATEGORIES_POST;
  const apiPUT = import.meta.env.VITE_APP_API_CATEGORIES_PUT;
  const apiDELETE = import.meta.env.VITE_APP_API_CATEGORIES_DELETE;
  const token = JSON.parse(sessionStorage.getItem('access'));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(apiGET, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imagen: e.target.files[0] }));
  };

  const handleToggle = (name) => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Formulario para añadir categoría (nombre, descripcion, imagen, visible)
  const handleSubmitAdd = async () => {
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('descripcion', form.descripcion);
    if (form.imagen) formData.append('imagen', form.imagen);
    formData.append('visible', form.visible);

    try {
      await fetch(apiPOST, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      fetchCategories();
      setDialogOpen(false);
      setForm({ imagen: null, nombre: '', descripcion: '', visible: false });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Formulario para editar categoría (nombre, descripcion, visible)
  const handleSubmitEdit = async () => {
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('descripcion', form.descripcion);
    formData.append('visible', form.visible);

    try {
      await fetch(`${apiPUT}${selectedCategory.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      fetchCategories();
      setDialogOpen(false);
      setForm({nombre: '', descripcion: '', visible: false });
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  // Formulario para editar solo la imagen de la categoría
  const handleSubmitImage = async () => {
    const formData = new FormData();
    formData.append('nombre', selectedCategory.nombre);
    if (form.imagen) formData.append('imagen', form.imagen);
    formData.append('visible', selectedCategory.visible);

    try {
      await fetch(`${apiPUT}${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      fetchCategories();
      setDialogOpen(false);
      setForm({ imagen: null, nombre: '', descripcion: '', visible: false });
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleEdit = (category) => {
    setDialogType('edit');
    setSelectedCategory(category);
    setForm({
      nombre: category.nombre,
      descripcion: category.descripcion,
      visible: category.visible,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setDialogType('add');
    setForm({
      imagen: null,
      nombre: '',
      descripcion: '',
      visible: false,
    });
    setDialogOpen(true);
  };

  const handleEditImage = (category) => {
    setDialogType('image');
    setSelectedCategory(category);
    setForm({
      imagen: null,
      nombre: category.nombre, // Mantener el nombre por defecto
      descripcion: category.descripcion,
      visible: category.visible,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiDELETE}${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div
    style={{
      boxSizing:"border-box",
      padding:"1.2em",
    }}
    >
      <div style={{ display: 'flex', justifyContent:"space-between", marginBottom: '20px' }}>
        <TextField label="Buscar categoría" style={{width:"78%"}} variant="outlined" />
        <Button variant="contained" style={{background:"var(--terciary-color)"}} startIcon={<BsPlus />} onClick={handleAdd}>
          Añadir categoría
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Fecha Modificación</TableCell>
              <TableCell>Visible</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  {category.imagen && <img src={category.imagen} alt={category.nombre} width="50" height="50" />}
                </TableCell>
                <TableCell>{category.nombre}</TableCell>
                <TableCell>{category.descripcion}</TableCell>
                <TableCell>{category.fecha_creacion}</TableCell>
                <TableCell>{category.fecha_modificacion}</TableCell>
                <TableCell>
                  <Switch checked={category.visible} disabled style={{color:"var(--primary-color)"}} />
                </TableCell>
                <TableCell style={{width:"8em"}}>
                  <IconButton onClick={() => handleEdit(category)}
                  style={{
                    color:"var(--primary-color)",
                    display:"flex",
                    justifyContent:"space-between",
                  }}>
                    <BsPencil />
                    <h6 style={{marginLeft:"10px"}}>Editar</h6>
                  </IconButton>
                  <IconButton onClick={() => handleEditImage(category)}
                    style={{
                      color:"var(--primary-color)",
                      display:"flex",
                      justifyContent:"space-between",
                    }}>
                    <BsImage />
                    <h6 style={{marginLeft:"10px"}}>Imagen</h6>
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)}
                    style={{
                      color:"var(--primary-color)",
                      display:"flex",
                      justifyContent:"space-between",
                    }}>
                    <BsTrash />
                    <h6 style={{marginLeft:"10px"}}>Eliminar</h6>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para añadir, editar o editar imagen */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogType === 'add' && 'Añadir Categoría'}
          {dialogType === 'edit' && 'Editar Categoría'}
          {dialogType === 'image' && 'Editar Imagen'}
        </DialogTitle>
        <DialogContent>
          {dialogType !== 'image' && (
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              required
              fullWidth
              margin="dense"
            />
          )}

          {dialogType !== 'image' && (
            <TextField
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleInputChange}
              fullWidth
              margin="dense"
            />
          )}

          {dialogType !== 'edit' && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ margin: '10px 0' }}
            />
          )}

          {dialogType !== 'image' && (
            <div>
              <label>Visible:</label>
              <Switch checked={form.visible} onChange={() => handleToggle('visible')} />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button onClick={dialogType === 'add' ? handleSubmitAdd : dialogType === 'edit' ? handleSubmitEdit : handleSubmitImage} variant="contained">
            {dialogType === 'add' && 'Añadir'}
            {dialogType === 'edit' && 'Guardar Cambios'}
            {dialogType === 'image' && 'Actualizar Imagen'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Categories;
