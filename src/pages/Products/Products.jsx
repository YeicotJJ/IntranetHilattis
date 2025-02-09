import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  Skeleton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Pagination,
  FormLabel,
} from "@mui/material"
import { BsPlus, BsPencil, BsTrash, BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { useForm } from "react-hook-form"

const API_PRODUCTS = import.meta.env.VITE_APP_API_PRODUCTS_GET
const API_CATEGORIES = import.meta.env.VITE_APP_API_CATEGORIES_GET
const bearerToken = JSON.parse(sessionStorage.getItem("access"))

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  return (
    <Box position="relative" width="100%" height="150px" margin="8px">
      {loading && <Skeleton variant="rectangular" width="100%" height={150} />}
      <CardMedia
        component="img"
        image={images[currentIndex] || "/placeholder.svg"}
        alt={`Product Image ${currentIndex + 1}`}
        sx={{
          width: "100%",
          height: "150px",
          objectFit: "contain", // Cambiado de "cover" a "contain"
          display: loading ? "none" : "block",
          borderRadius: "4px",
        }}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/placeholder.png"
          setLoading(false)
        }}
      />
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <BsChevronLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.7)",
            }}
          >
            <BsChevronRight />
          </IconButton>
        </>
      )}
    </Box>
  )
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(12)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [dialogType, setDialogType] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { register, handleSubmit, reset, setValue } = useForm()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_CATEGORIES, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleAddProduct = async (data) => {
    const formData = new FormData()
    formData.append("nombre", data.nombre)
    formData.append("imagen_default", data.imagen_default[0])

    if (data.img1 && data.img1[0]) {
      formData.append("img1", data.img1[0])
    }
    if (data.img2 && data.img2[0]) {
      formData.append("img2", data.img2[0])
    }
    if (data.img3 && data.img3[0]) {
      formData.append("img3", data.img3[0])
    }

    formData.append("is_variable", data.is_variable === "true")
    formData.append("precio", data.precio)
    formData.append("descripcion", data.descripcion)
    formData.append("estatus", data.estatus)
    formData.append("id_categoria", data.id_categoria)

    try {
      await axios.post(`${API_PRODUCTS}create/`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      await fetchProducts()
      setOpenDialog(false)
      reset()
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const handleEditProduct = async (data) => {
    const formData = new FormData()
    formData.append("nombre", data.nombre)
    formData.append("is_variable", data.is_variable === "true")
    formData.append("precio", data.precio)
    formData.append("descripcion", data.descripcion)
    formData.append("estatus", data.estatus)
    formData.append("id_categoria", data.id_categoria)

    if (data.imagen_default && data.imagen_default[0]) {
      formData.append("imagen_default", data.imagen_default[0])
    }
    if (data.img1 && data.img1[0]) {
      formData.append("img1", data.img1[0])
    }
    if (data.img2 && data.img2[0]) {
      formData.append("img2", data.img2[0])
    }
    if (data.img3 && data.img3[0]) {
      formData.append("img3", data.img3[0])
    }

    try {
      await axios.patch(`${API_PRODUCTS}edit/${selectedProduct.id_producto}`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      await fetchProducts()
      setOpenDialog(false)
      reset()
    } catch (error) {
      console.error("Error editing product:", error)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`${API_PRODUCTS}delete/${selectedProduct.id_producto}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      await fetchProducts()
      setOpenDeleteDialog(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase()
    setSearchTerm(searchTerm)
    const filtered = products.filter(
      (product) =>
        product.nombre.toLowerCase().includes(searchTerm) ||
        product.descripcion.toLowerCase().includes(searchTerm) ||
        product.precio.toString().includes(searchTerm) ||
        product.estatus.toLowerCase().includes(searchTerm) ||
        categories
          .find((c) => c.id === product.id_categoria)
          ?.nombre.toLowerCase()
          .includes(searchTerm),
    )
    setFilteredProducts(filtered)
    setPage(1)
  }

  const handleDeleteImage = async (imageNumber) => {
    try {
      const response = await axios.patch(
        `${API_PRODUCTS}delete-images/${selectedProduct.id_producto}`,
        {
          img1: imageNumber === 1,
          img2: imageNumber === 2,
          img3: imageNumber === 3,
        },
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        },
      )
      if (response.status === 200) {
        // Actualizar el producto seleccionado localmente
        setSelectedProduct((prev) => ({ ...prev, [`img${imageNumber}`]: null }))
        // Forzar una actualización del componente
        setForceUpdate((prev) => prev + 1)
        // Actualizar la lista de productos
        await fetchProducts()
      }
    } catch (error) {
      console.error(`Error deleting image ${imageNumber}:`, error)
    }
  }

  const ImagePreview = ({ src, alt, imageNumber }) => {
    if (!src) return null
    return (
      <Box mt={1} mb={2} display="flex" alignItems="center">
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          style={{ maxWidth: "100%", maxHeight: "100px", objectFit: "contain" }}
        />
        <Button onClick={() => handleDeleteImage(imageNumber)} variant="outlined" color="secondary" sx={{ ml: 1 }}>
          Eliminar
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ boxSizing: "border-box", padding: "1em" }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Buscar productos"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: "78%", background: "#f1eadb" }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<BsPlus />}
          onClick={() => {
            setDialogType("add")
            setOpenDialog(true)
          }}
          sx={{ background: "var(--terciary-color)" }}
        >
          Añadir Producto
        </Button>
      </Box>

      <Grid container spacing={2}>
        {filteredProducts.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id_producto}>
            <Card>
              <ImageSlider
                images={[product.imagen_default, product.img1, product.img2, product.img3].filter(Boolean)}
              />
              <CardContent>
                <Typography variant="h6" component="div" noWrap>
                  {product.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {product.descripcion}
                </Typography>
                <Typography variant="body1">Precio: S/.{product.precio}</Typography>
                <Typography variant="body2">Estatus: {product.estatus}</Typography>
                <Typography variant="body2">
                  Categoría: {categories.find((c) => c.id === product.id_categoria)?.nombre || "Sin categoría"}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product)
                      setDialogType("edit")
                      setValue("nombre", product.nombre)
                      setValue("precio", product.precio)
                      setValue("descripcion", product.descripcion)
                      setValue("estatus", product.estatus)
                      setValue("id_categoria", product.id_categoria)
                      setOpenDialog(true)
                    }}
                  >
                    <BsPencil style={{ marginRight: "5px" }} />
                    <h6>Editar</h6>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedProduct(product)
                      setOpenDeleteDialog(true)
                    }}
                  >
                    <BsTrash style={{ marginRight: "5px" }} />
                    <h6>Eliminar</h6>
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={Math.ceil(filteredProducts.length / rowsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>¿Estás seguro de eliminar este producto? Todas las variables y el producto se eliminarán</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteProduct} variant="contained" color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{dialogType === "add" ? "Añadir Producto" : "Editar Producto"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(dialogType === "add" ? handleAddProduct : handleEditProduct)}>
            <TextField
              {...register("nombre")}
              label="Nombre"
              fullWidth
              margin="dense"
              required
              defaultValue={dialogType === "edit" ? selectedProduct?.nombre : ""}
            />
            <Box mt={2}>
              <FormLabel component="legend">Imagen Principal*</FormLabel>
              <TextField
                {...register("imagen_default")}
                type="file"
                inputProps={{ accept: "image/*" }}
                fullWidth
                margin="dense"
                required={dialogType === "add"}
              />
              {dialogType === "edit" && (
                <ImagePreview src={selectedProduct?.imagen_default || "/placeholder.svg"} alt="Imagen Principal" />
              )}
            </Box>
            {dialogType === "edit" && (
              <>
                <Box mt={2}>
                  <FormLabel component="legend">Imagen Opcional 1</FormLabel>
                  <TextField
                    {...register("img1")}
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    margin="dense"
                  />
                  <ImagePreview
                    src={selectedProduct?.img1 || "/placeholder.svg"}
                    alt="Imagen Opcional 1"
                    imageNumber={1}
                  />
                </Box>
                <Box mt={2}>
                  <FormLabel component="legend">Imagen Opcional 2</FormLabel>
                  <TextField
                    {...register("img2")}
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    margin="dense"
                  />
                  <ImagePreview
                    src={selectedProduct?.img2 || "/placeholder.svg"}
                    alt="Imagen Opcional 2"
                    imageNumber={2}
                  />
                </Box>
                <Box mt={2}>
                  <FormLabel component="legend">Imagen Opcional 3</FormLabel>
                  <TextField
                    {...register("img3")}
                    type="file"
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                    margin="dense"
                  />
                  <ImagePreview
                    src={selectedProduct?.img3 || "/placeholder.svg"}
                    alt="Imagen Opcional 3"
                    imageNumber={3}
                  />
                </Box>
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
              required
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
              required
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
  )
}

export default Products

