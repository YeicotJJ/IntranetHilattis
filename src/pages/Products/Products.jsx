import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { BsPlus, BsPencil, BsTrash, BsImage } from "react-icons/bs";
import { useForm } from "react-hook-form";

const API_PRODUCTS = import.meta.env.VITE_APP_API_PRODUCTS_GET; // URL de productos
const API_CATEGORIES = import.meta.env.VITE_APP_API_CATEGORIES_GET; // URL de categorías
const bearerToken = JSON.parse(sessionStorage.getItem("access")); // Token de sesión

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Nuevo estado para el diálogo de eliminación
  const [dialogType, setDialogType] = useState(""); // 'add', 'edit', 'image', 'delete'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_CATEGORIES, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddProduct = async (data) => {
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("imagen_default", data.imagen_default[0]);
    
    if (data.img1 && data.img1[0]) {
      formData.append("img1", data.img1[0]);
    }
    if (data.img2 && data.img2[0]) {
      formData.append("img2", data.img2[0]);
    }
    if (data.img3 && data.img3[0]) {
      formData.append("img3", data.img3[0]);
    }
    
    formData.append("is_variable", data.is_variable === "true");
    formData.append("precio", data.precio);
    formData.append("descripcion", data.descripcion);
    formData.append("estatus", data.estatus);
    formData.append("id_categoria", data.id_categoria);
  
    try {
      await axios.post(`${API_PRODUCTS}create/`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      fetchProducts();
      setOpenDialog(false);
      reset();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (data) => {
    const updatedData = {
      nombre: data.nombre,
      is_variable: data.is_variable === "true",
      precio: data.precio,
      descripcion: data.descripcion,
      estatus: data.estatus,
      id_categoria: data.id_categoria,
    };

    try {
      await axios.patch(`${API_PRODUCTS}edit/${selectedProduct.id_producto}`, updatedData, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      fetchProducts();
      setOpenDialog(false);
      reset();
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${API_PRODUCTS}delete/${selectedProduct.id_producto}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      fetchProducts();
      setOpenDeleteDialog(false);
      setSelectedProduct(null); // Reset product selection
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Box>
      {/* Barra de búsqueda y botón de añadir */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar productos"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<BsPlus />}
          onClick={() => {
            setDialogType("add");
            setOpenDialog(true);
          }}
        >
          Añadir Producto
        </Button>
      </Box>

      {/* Tabla de productos */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Imágenes Adicionales</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Estatus</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((product) => (
            <TableRow key={product.id_producto}>
              <TableCell>{product.nombre}</TableCell>
              <TableCell>
                <img
                  src={product.imagen_default || "/placeholder.png"}
                  alt={product.nombre}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </TableCell>
              <TableCell>{product.descripcion}</TableCell>
              <TableCell>
                <div>
                  <img
                    src={product.img1 || product.imagen_default}
                    alt="img1"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <img
                    src={product.img2 || product.imagen_default}
                    alt="img2"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                  <img
                    src={product.img3 || product.imagen_default}
                    alt="img3"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </div>
              </TableCell>
              <TableCell>{product.precio}</TableCell>
              <TableCell>{product.estatus}</TableCell>
              <TableCell>{categories.find(c => c.id === product.id_categoria)?.nombre || 'Sin categoría'}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setSelectedProduct(product);
                    setDialogType("edit");
                    setValue("estatus", product.estatus);
                    setValue("id_categoria", product.id_categoria);
                    setValue("descripcion", product.descripcion);
                    setOpenDialog(true);
                  }}
                >
                  <BsPencil />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedProduct(product);
                    setDialogType("image");
                    setOpenDialog(true);
                  }}
                >
                  <BsImage />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpenDeleteDialog(true); // Mostrar el diálogo de eliminación
                  }}
                >
                  <BsTrash />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>¿Estás seguro de eliminar este producto?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteProduct}
            variant="contained"
            color="secondary"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para Añadir y Editar Producto */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dialogType === "add" ? "Añadir Producto" : "Editar Producto"}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(
              dialogType === "add" ? handleAddProduct : handleEditProduct
            )}
          >
            <TextField
              {...register("nombre")}
              label="Nombre"
              fullWidth
              margin="dense"
              required
              defaultValue={dialogType === "edit" ? selectedProduct?.nombre : ""}
            />
            {dialogType === "add" && (
              <>
                <TextField
                  {...register("imagen_default")}
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  fullWidth
                  margin="dense"
                  required
                />
                <TextField {...register("img1")} type="file" inputProps={{ accept: "image/*" }} fullWidth margin="dense" />
                <TextField {...register("img2")} type="file" inputProps={{ accept: "image/*" }} fullWidth margin="dense" />
                <TextField {...register("img3")} type="file" inputProps={{ accept: "image/*" }} fullWidth margin="dense" />
              </>
            )}
            <TextField
              {...register("descripcion")}
              label="Descripción"
              fullWidth
              margin="dense"
              required
              defaultValue={dialogType === "edit" ? selectedProduct?.descripcion : ""}
            />
            <TextField
              {...register("precio")}
              label="Precio"
              fullWidth
              margin="dense"
              required
              defaultValue={dialogType === "edit" ? selectedProduct?.precio : ""}
            />
            <TextField
              id="estatus"
              select
              label="Estatus"
              fullWidth
              margin="dense"
              defaultValue={dialogType === "edit" ? selectedProduct?.estatus : "DISPONIBLE"}
              {...register("estatus")}
            >
              <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
              <MenuItem value="AGOTADO">AGOTADO</MenuItem>
            </TextField>
            <TextField
              id="id_categoria"
              select
              label="Categoría"
              fullWidth
              margin="dense"
              defaultValue={dialogType === "edit" ? selectedProduct?.id_categoria : ""}
              {...register("id_categoria")}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.nombre}
                </MenuItem>
              ))}
            </TextField>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                {dialogType === "add" ? "Añadir" : "Guardar"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products;
