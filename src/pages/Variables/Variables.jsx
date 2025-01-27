import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Switch,
} from "@mui/material"
import { BsPencil, BsTrash, BsPlus, BsUpload } from "react-icons/bs"
import axios from "axios"

const Variables = () => {
  const [products, setProducts] = useState([])
  const [variables, setVariables] = useState([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [currentVariable, setCurrentVariable] = useState(null)
  const [previews, setPreviews] = useState({ img1: null, img2: null, img3: null })
  const [searchTerm, setSearchTerm] = useState("")
  const { control: addControl, handleSubmit: handleAddSubmit, reset: resetAdd } = useForm()
  const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEdit, setValue } = useForm()

  const API_PRODUCTS = import.meta.env.VITE_APP_API_PRODUCTS_GET
  const API_VARIABLES = import.meta.env.VITE_APP_API_VARIABLES_GET
  const bearerToken = JSON.parse(sessionStorage.getItem("access"))

  useEffect(() => {
    fetchProducts()
    fetchVariables()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_PRODUCTS, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Failed to fetch products")
    }
  }

  const fetchVariables = async () => {
    try {
      const response = await axios.get(API_VARIABLES, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      setVariables(response.data)
    } catch (error) {
      console.error("Error fetching variables:", error)
      alert("Failed to fetch variables")
    }
  }

  const handleAddVariable = (productId) => {
    setCurrentVariable({ producto: productId })
    setPreviews({ img1: null, img2: null, img3: null })
    setIsAddModalVisible(true)
  }

  const handleEditVariable = (variable) => {
    setCurrentVariable(variable)
    Object.keys(variable).forEach((key) => {
      setValue(key, variable[key])
    })
    setPreviews({
      img1: variable.img1 || null,
      img2: variable.img2 || null,
      img3: variable.img3 || null,
    })
    setIsEditModalVisible(true)
  }

  const handleDeleteVariable = async (variableId) => {
    try {
      await axios.delete(`${API_VARIABLES}delete/${variableId}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      })
      alert("Variable deleted successfully")
      fetchVariables()
    } catch (error) {
      console.error("Error deleting variable:", error)
      alert("Failed to delete variable")
    }
  }

  const onAddSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === "img1" || key === "img2" || key === "img3") {
          if (data[key] instanceof FileList && data[key].length > 0) {
            formData.append(key, data[key][0])
          }
        } else {
          formData.append(key, data[key])
        }
      })

      await axios.post(`${API_VARIABLES}create`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      alert("Variable added successfully")
      setIsAddModalVisible(false)
      resetAdd()
      fetchVariables()
    } catch (error) {
      console.error("Error adding variable:", error)
      alert("Failed to add variable")
    }
  }

  const onEditSubmit = async (data) => {
    try {
      const formData = new FormData()
      Object.keys(data).forEach((key) => {
        if (key === "img1" || key === "img2" || key === "img3") {
          if (data[key] instanceof FileList && data[key].length > 0) {
            formData.append(key, data[key][0])
          }
        } else {
          formData.append(key, data[key])
        }
      })

      await axios.patch(`${API_VARIABLES}edit/${currentVariable.id_variante}`, formData, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      alert("Variable updated successfully")
      setIsEditModalVisible(false)
      resetEdit()
      fetchVariables()
    } catch (error) {
      console.error("Error updating variable:", error)
      alert("Failed to update variable")
    }
  }

  const handleImageChange = (event, field) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [field]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIsVariableChange = async (productId, newValue) => {
    try {
      await axios.patch(
        `${API_PRODUCTS}edit/${productId}`,
        { is_variable: newValue },
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        },
      )
      fetchProducts() // Refresh the products list after updating
    } catch (error) {
      console.error("Error updating is_variable:", error)
      alert("Failed to update product variable status")
    }
  }

  const columns = [
    { id: "id_producto", label: "ID", minWidth: 50 },
    { id: "nombre", label: "Nombre del Producto", minWidth: 170 },
    {
      id: "imagen_default",
      label: "Imagen del Producto",
      minWidth: 100,
      render: (image) => (
        <img src={image || "/placeholder.svg"} alt="Product" style={{ width: 50, height: 50, objectFit: "cover" }} />
      ),
    },
    {
      id: "is_variable",
      label: "Acepta Variables",
      minWidth: 120,
      render: (value, row) => (
        <Switch
          checked={value}
          onChange={(e) => handleIsVariableChange(row.id_producto, e.target.checked)}
          color="primary"
        />
      ),
    },
    {
      id: "variables",
      label: "Variables",
      minWidth: 170,
      render: (_, record) => (
        <>
          {variables
            .filter((v) => v.producto === record.id_producto)
            .map((v) => (
              <Button
                key={v.id_variante}
                onClick={() => handleEditVariable(v)}
                startIcon={<BsPencil />}
                disabled={!record.is_variable}
              >
                {v.nombre}
              </Button>
            ))}
        </>
      ),
    },
    {
      id: "add",
      label: "Añadir Variable",
      minWidth: 100,
      render: (_, record) => (
        <Button
          onClick={() => handleAddVariable(record.id_producto)}
          startIcon={<BsPlus />}
          disabled={!record.is_variable}
        >
          Añadir Variable
        </Button>
      ),
    },
  ]

  const renderImageFields = (control, isEdit = false) =>
    ["img1", "img2", "img3"].map((imgField, index) => (
      <Box key={imgField} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Imagen {index + 1}</Typography>
        {(isEdit ? previews[imgField] : null) && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <img
              src={previews[imgField] || "/placeholder.svg"}
              alt={`Preview ${index + 1}`}
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          </Box>
        )}
        <Controller
          name={imgField}
          control={control}
          defaultValue=""
          render={({ field: { onChange, ...field } }) => (
            <Button variant="outlined" component="label" startIcon={<BsUpload />}>
              {isEdit ? "Cambiar Imagen" : "Subir Imagen"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  onChange(e.target.files)
                  handleImageChange(e, imgField)
                }}
                {...field}
              />
            </Button>
          )}
        />
      </Box>
    ))

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variables.some(
        (variable) =>
          variable.producto === product.id_producto && variable.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  )

  return (
    <div style={{ width: "81vw", boxSizing: "border-box", padding: "1em" }}>
      <h2>Variables de Productos</h2>
      <TextField
        label="Buscar por nombre de producto o variable"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        style={{background:"#f1eadb",marginBottom:"15px"}}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TableContainer component={Paper} style={{ width: "100%" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id_producto}>
                  {columns.map((column) => {
                    const value = row[column.id]
                    return <TableCell key={column.id}>{column.render ? column.render(value, row) : value}</TableCell>
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para añadir variable */}
      <Dialog open={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
        <DialogTitle>Añadir Nueva Variable</DialogTitle>
        <form onSubmit={handleAddSubmit(onAddSubmit)}>
          <DialogContent>
            <Controller
              name="nombre"
              control={addControl}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Nombre" fullWidth margin="normal" />}
            />
            <Controller
              name="descripcion"
              control={addControl}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Descripción" fullWidth margin="normal" multiline rows={3} />
              )}
            />
            <Controller
              name="precio"
              control={addControl}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Precio" fullWidth margin="normal" type="number" />}
            />
            {renderImageFields(addControl)}
            <Controller
              name="producto"
              control={addControl}
              defaultValue={currentVariable?.producto || ""}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label="ID del Producto" fullWidth margin="normal" disabled />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddModalVisible(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Añadir Variable
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Diálogo para editar variable */}
      <Dialog open={isEditModalVisible} onClose={() => setIsEditModalVisible(false)}>
        <DialogTitle>Editar Variable</DialogTitle>
        <form onSubmit={handleEditSubmit(onEditSubmit)}>
          <DialogContent>
            <Controller
              name="nombre"
              control={editControl}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Nombre" fullWidth margin="normal" />}
            />
            <Controller
              name="descripcion"
              control={editControl}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} label="Descripción" fullWidth margin="normal" multiline rows={3} />
              )}
            />
            <Controller
              name="precio"
              control={editControl}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => <TextField {...field} label="Precio" fullWidth margin="normal" type="number" />}
            />
            {renderImageFields(editControl, true)}
            <Controller
              name="producto"
              control={editControl}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <TextField {...field} label="ID del Producto" fullWidth margin="normal" disabled />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditModalVisible(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary">
              Actualizar Variable
            </Button>
            <Button
              onClick={() => handleDeleteVariable(currentVariable.id_variante)}
              variant="contained"
              color="error"
              startIcon={<BsTrash />}
            >
              Eliminar Variable
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}

export default Variables

