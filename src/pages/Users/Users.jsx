"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  Button,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  InputAdornment,
  useMediaQuery,
} from "@mui/material"
import { BsTrash, BsPencil, BsEye, BsEyeSlash } from "react-icons/bs"

// Preguntas de seguridad ampliadas
const securityQuestions = [
  { question: "¿Cuánto es 2 + 3?", answer: "5" },
  { question: "¿Cuál es la capital de Francia?", answer: "paris" },
  { question: "¿Cuántos días tiene una semana?", answer: "7" },
  { question: "¿De qué color es el cielo en un día despejado?", answer: "azul" },
  { question: "¿Cuántas patas tiene un gato?", answer: "4" },
  { question: "¿En qué año comenzó la Segunda Guerra Mundial?", answer: "1939" },
  { question: "¿Cuál es el planeta más grande del sistema solar?", answer: "jupiter" },
  { question: "¿Cuántos lados tiene un triángulo?", answer: "3" },
  { question: "¿Cuál es el símbolo químico del oro?", answer: "au" },
  { question: "¿Cuál es el río más largo del mundo?", answer: "amazonas" },
  { question: "¿Quién pintó la Mona Lisa?", answer: "leonardo da vinci" },
  { question: "¿Cuál es el océano más grande?", answer: "pacifico" },
  { question: "¿Cuántos continentes hay en el mundo?", answer: "7" },
  { question: "¿Cuál es el metal más abundante en la corteza terrestre?", answer: "aluminio" },
  { question: "¿En qué año se fundó la ONU?", answer: "1945" },
]

const Users = () => {
  const token = JSON.parse(sessionStorage.getItem("access"))
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [securityQuestion, setSecurityQuestion] = useState(null)
  const [securityAnswer, setSecurityAnswer] = useState("")
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [isHelping, setHelping] = useState(false)
  const sessionUserDni = JSON.parse(sessionStorage.getItem("user-data"))?.dni
  const urlFetch = import.meta.env.VITE_APP_API_USERS_GET
  const urlReg = import.meta.env.VITE_APP_API_AUTH_URL + "register"
  const isMobile = useMediaQuery("(max-width:600px)")

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${urlFetch}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [token, urlFetch])

  const handleAddUser = async (data) => {
    if (securityAnswer.toLowerCase() !== securityQuestion.answer.toLowerCase()) {
      alert("La respuesta a la pregunta de seguridad es incorrecta")
      return
    }

    // Comprobar si el DNI ya existe
    const dniExists = users.some((user) => user.dni === data.dni)
    if (dniExists) {
      alert("El DNI ya existe en el sistema")
      return
    }

    try {
      data.is_active = true
      const response = await fetch(`${urlReg}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      setIsAdding(false)
      setSecurityQuestion(null)
      setSecurityAnswer("")
      fetchUsers()
    } catch (error) {
      console.error("Error adding user:", error)
    }
  }

  const handleEditUser = async (data) => {
    try {
      const response = await fetch(`${urlFetch}edit/${selectedUser.dni}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      setIsEditing(false)
      fetchUsers()
    } catch (error) {
      console.error("Error editing user:", error)
    }
  }

  const handleChangeState = async (dni, isActive) => {
    try {
      const response = await fetch(`${urlFetch}change-state/${dni}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !isActive }),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      fetchUsers()
    } catch (error) {
      console.error("Error changing state:", error)
    }
  }

  const handleDeleteUser = async (dni) => {
    try {
      const response = await fetch(`${urlFetch}delete/${dni}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      setConfirmDelete(false)
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setIsEditing(true)
    reset(user)
  }

  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setConfirmDelete(true)
  }

  const openAddModal = () => {
    setIsAdding(true)
    setSecurityQuestion(securityQuestions[Math.floor(Math.random() * securityQuestions.length)])
  }

  if (isMobile) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Para acceder a los usuarios necesita estar en una computadora.
        </Typography>
      </div>
    )
  }

  return (
    <div
      style={{
        marginLeft: "2vw",
        width: "76.5vw",
      }}
    >
      <h1>Gestión de Usuarios</h1>
      <div style={{ marginTop: "20px", width: "100%", display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={openAddModal}
          style={{
            width: "20vw",
            backgroundColor: "var(--terciary-color)",
            color: "var(--text-color-secondary)",
            borderRadius: "0.5vw",
          }}
        >
          Añadir Usuario
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setHelping(true)}
          style={{
            width: "20vw",
            backgroundColor: "var(--terciary-color)",
            color: "var(--text-color-secondary)",
            borderRadius: "0.5vw",
          }}
        >
          Ayuda
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: "20px", maxWidth: "76.5vw" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>DNI</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.dni}>
                <TableCell>{user.dni}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.apellidos}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.rol === "admin" ? "Administrador" : "Trabajador"}</TableCell>
                <TableCell>{user.is_active ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => openEditModal(user)}>
                      <BsPencil />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => openDeleteModal(user)} disabled={user.is_active}>
                      <BsTrash />
                    </IconButton>
                  </Tooltip>
                  <Button
                    size="small"
                    onClick={() => handleChangeState(user.dni, user.is_active)}
                    disabled={sessionUserDni === user.dni}
                  >
                    {user.is_active ? "Inactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isAdding || isEditing}
        onClose={() => {
          setIsAdding(false)
          setIsEditing(false)
          setSecurityQuestion(null)
          setSecurityAnswer("")
        }}
      >
        <DialogTitle>{isAdding ? "Añadir Usuario" : "Editar Usuario"}</DialogTitle>
        <form onSubmit={handleSubmit(isAdding ? handleAddUser : handleEditUser)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="DNI"
                  disabled={isEditing}
                  {...register("dni", { required: true, minLength: 8, maxLength: 8 })}
                  error={!!errors.dni}
                  helperText={errors.dni && "DNI debe ser de 8 caracteres"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Usuario"
                  {...register("username", { required: true })}
                  error={!!errors.username}
                  helperText={errors.username && "El nombre de usuario es obligatorio"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: isAdding })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <BsEyeSlash /> : <BsEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled={isEditing}
                  error={!!errors.password}
                  helperText={errors.password && "La contraseña es obligatoria"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  {...register("nombre", { required: true })}
                  error={!!errors.nombre}
                  helperText={errors.nombre && "El nombre es obligatorio"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellidos"
                  {...register("apellidos", { required: true })}
                  error={!!errors.apellidos}
                  helperText={errors.apellidos && "Los apellidos son obligatorios"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  })}
                  error={!!errors.email}
                  helperText={errors.email && "Debe ser un correo válido"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  {...register("phone", { required: true, minLength: 9, maxLength: 9 })}
                  error={!!errors.phone}
                  helperText={errors.phone && "Debe ser un teléfono válido de 9 dígitos"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Dirección"
                  {...register("address", { required: true })}
                  error={!!errors.address}
                  helperText={errors.address && "La dirección es obligatoria"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    defaultValue={null}
                    {...register("rol", { required: true })}
                    error={!!errors.rol}
                    disabled={isEditing && selectedUser.dni === sessionUserDni}
                  >
                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="default">Trabajador</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {isAdding && securityQuestion && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pregunta de seguridad (minúsculas): {securityQuestion.question}
                  </Typography>
                  <TextField
                    fullWidth
                    label="Respuesta"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    error={!!errors.securityAnswer}
                    helperText={errors.securityAnswer && "La respuesta es obligatoria"}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsAdding(false)
                setIsEditing(false)
                setSecurityQuestion(null)
                setSecurityAnswer("")
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <p>¿Estás seguro de que deseas eliminar a este usuario?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancelar</Button>
          <Button color="error" onClick={() => handleDeleteUser(selectedUser.dni)}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isHelping} onClose={() => setHelping(false)}>
        <DialogTitle>Ayuda</DialogTitle>
        <DialogContent>
          <ul>
            <li>Para poder eliminar un usuario debe estar inactivo</li>
            <li>Un usuario inactivo no se puede editar, tienes que activarlo de nuevo</li>
            <li>Un usuario inactivo no puede ingresar al sistema</li>
            <li>Se recomienda no colocar tu usuario inactivo</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setHelping(false)}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Users

