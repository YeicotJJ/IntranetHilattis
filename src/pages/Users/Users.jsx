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
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
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
  const [currentUser, setCurrentUser] = useState(null); // To hold the user data for editing
  const isMobile = useMediaQuery("(max-width:600px)");

  const { register, handleSubmit, setValue } = useForm();
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
    // Pre-filling the form for editing
    setValue("dni", user.dni);
    setValue("username", user.username);
    setValue("nombre", user.nombre);
    setValue("apellidos", user.apellidos);
    setValue("email", user.email);
    setValue("phone", user.phone);
    setValue("address", user.address);
    setValue("password", ""); // Initialize password field when editing
  };

  const handleDeleteUser = async (dni) => {
    const token = JSON.parse(sessionStorage.getItem("access"));
    const apiUrlDELETE = `${import.meta.env.VITE_APP_API_USERS_DELETE}/${dni}`;
    try {
      await axios.delete(apiUrlDELETE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.dni !== dni));
      setVisibleUsers(visibleUsers.filter((user) => user.dni !== dni));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const onSubmit = async (data) => {
    const token = JSON.parse(sessionStorage.getItem("access"));
    const apiUrl = currentUser ? `${import.meta.env.VITE_APP_API_USERS_UPDATE}${currentUser.dni}` : import.meta.env.VITE_APP_API_USERS_POST;
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
      setCurrentUser(null); // Reset current user
      setSearchTerm(""); // Clear search
      setPage(1); // Reset page
      // Reload users after adding/editing
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers(response.data);
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
        }}
        onClick={() => {
          setOpenDialog(true);
          setCurrentUser(null); // For creating a new user
        }}
      >
        Añadir Usuario
      </Button>
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
                        onClick={() => handleDeleteUser(user.dni)}
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
              {...register("dni", { required: true })}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("username", { required: true })}
            />
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("nombre", { required: true })}
            />
            <TextField
              label="Apellidos"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("apellidos", { required: true })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("email", { required: true })}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("phone", { required: true })}
            />
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("address", { required: true })}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              {...register("password", { required: currentUser ? false : true })} // Only required for new users
            />
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
    </div>
  );
}
