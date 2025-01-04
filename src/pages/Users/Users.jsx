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
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axios from "axios";
import { useForm } from "react-hook-form";
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility of password
  const isMobile = useMediaQuery("(max-width:600px)");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const PAGE_SIZE = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const token = JSON.parse(sessionStorage.getItem("access"));
      const apiUrlGET = import.meta.env.VITE_APP_API_USERS_GET;

      try {
        const response = await axios.get(apiUrlGET, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data;
        setUsers(data);
        setVisibleUsers(data.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredUsers = users.filter(
      (user) =>
        user.dni.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.nombre.toLowerCase().includes(term) ||
        user.apellidos.toLowerCase().includes(term)
    );
    setVisibleUsers(filteredUsers.slice(0, PAGE_SIZE));
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const newVisibleUsers = users
      .filter(
        (user) =>
          user.dni.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.nombre.toLowerCase().includes(searchTerm) ||
          user.apellidos.toLowerCase().includes(searchTerm)
      )
      .slice(0, PAGE_SIZE * nextPage);
    setVisibleUsers(newVisibleUsers);
    setPage(nextPage);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
    setValue("dni", user.dni);
    setValue("username", user.username);
    setValue("nombre", user.nombre);
    setValue("apellidos", user.apellidos);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("address", user.address);
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setConfirmDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    const token = JSON.parse(sessionStorage.getItem("access"));
    const apiUrlDELETE = `${import.meta.env.VITE_APP_API_USERS_DELETE}${userToDelete.dni}`;

    try {
      await axios.delete(apiUrlDELETE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user.dni !== userToDelete.dni));
      setVisibleUsers(visibleUsers.filter((user) => user.dni !== userToDelete.dni));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setConfirmDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const onSubmit = async (data) => {
    const token = JSON.parse(sessionStorage.getItem("access"));
    const apiUrl = currentUser
      ? `${import.meta.env.VITE_APP_API_USERS_UPDATE}${currentUser.dni}`
      : import.meta.env.VITE_APP_API_USERS_POST;
    const method = currentUser ? "PUT" : "POST";

    try {
      if (method === "PUT") {
        await axios.put(apiUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        await axios.post(apiUrl, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      setOpenDialog(false);
      setCurrentUser(null);
      window.location.reload(); // Reload the page after saving
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  if (isMobile) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Para acceder a los usuarios necesita estar en una computadora.
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", height: "100%" }}>
      <div style={{display:"flex"}}>
      <TextField
        label="Buscar usuarios"
        variant="outlined"
        fullWidth
        style={{ marginBottom: "20px" }}
        onChange={handleSearch}
      />
      <Button
        variant="contained"
        color="primary"
        style={{
          marginBottom: "20px",
          backgroundColor: "var(--terciary-color)",
          color: "var(--text-color-secondary)",
          width:"20vw",
          marginLeft:"4vw"
        }}
        onClick={() => {
          setOpenDialog(true);
          setCurrentUser(null);
        }}
      >
        Añadir Usuario
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
                  <TableCell>DNI</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleUsers.map((user) => (
                  <TableRow key={user.dni}>
                    <TableCell>{user.dni}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.apellidos}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleEditUser(user)}
                        startIcon={<BsFillPencilFill />}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteConfirmation(user)}
                        startIcon={<BsFillTrashFill />}
                        color="error"
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {visibleUsers.length < users.length && (
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
                style={{ margin: "20px" }}
              >
                Cargar más
              </Button>
            </div>
          )}
        </Paper>
      )}

      {/* Dialog for adding/editing a user */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{currentUser ? "Editar Usuario" : "Añadir Usuario"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("dni", {
                required: "El DNI es obligatorio.",
                minLength: {
                  value: 8,
                  message: "El DNI debe tener exactamente 8 dígitos.",
                },
                maxLength: {
                  value: 8,
                  message: "El DNI debe tener exactamente 8 dígitos.",
                },
              })}
              error={!!errors.dni}
              helperText={errors.dni?.message}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("username", { required: "El nombre de usuario es obligatorio." })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("nombre", { required: "El nombre es obligatorio." })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Apellidos"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("apellidos", { required: "Los apellidos son obligatorios." })}
              error={!!errors.apellidos}
              helperText={errors.apellidos?.message}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "El email es obligatorio.",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Ingrese un email válido.",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("phone", {
                required: "El teléfono es obligatorio.",
                minLength: {
                  value: 9,
                  message: "El teléfono debe tener exactamente 9 dígitos.",
                },
                maxLength: {
                  value: 9,
                  message: "El teléfono debe tener exactamente 9 dígitos.",
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("address", { required: "La dirección es obligatoria." })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
            {!currentUser && (
              <TextField
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("password", {
                  required: "La contraseña es obligatoria.",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres.",
                  },
                })}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </IconButton>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="secondary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Guardar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar al usuario seleccionado?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            color="secondary"
          >
            Cancelar
          </Button>
          <Button onClick={confirmDeleteUser} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
