import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function Generals() {
  const { control, handleSubmit, setValue } = useForm();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const apiUrlGET = import.meta.env.VITE_APP_API_EMPRESA_GET;
  const apiUrlPUT = apiUrlGET+"edit/";
  const token = JSON.parse(sessionStorage.getItem("access"));

  useEffect(() => {
    const fetchEmpresa = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrlGET, {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        });
        const data = response.data[0]; // Solo se toma el primer objeto
        setEmpresa(data);

        // Prellenar valores en el formulario
        Object.keys(data).forEach((key) => setValue(key, data[key]));
      } catch (error) {
        console.error("Error al obtener los datos de la empresa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmpresa();
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${apiUrlPUT}${empresa.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpresa(data); // Actualiza los datos con la respuesta del servidor
      setEditing(false); // Vuelve al formulario no editable
    } catch (error) {
      console.error("Error al actualizar los datos de la empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (!empresa) {
    return (
      <Typography style={styles.noData}>No hay datos de la empresa.</Typography>
    );
  }

  return (
    <Paper style={styles.paper}>
      <Typography variant="h4" className="bold" gutterBottom style={styles.title}>
        Datos de la Empresa
      </Typography>
            <Button
              type="button"
              style={{
                backgroundColor: "var(--terciary-color)",
                color: "var(--text-color-secondary)",
                display: !editing ? "block" : "none",
                marginBottom:"5vh"
            }}
              onClick={() => setEditing(true)}
            >
              Editar Datos de Empresa
            </Button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {Object.keys(empresa).map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <Controller
                name={key}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={key.toUpperCase()}
                    variant="outlined"
                    fullWidth
                    disabled={!editing}
                    style={styles.textField}
                    InputProps={{
                      style: editing
                        ? styles.textFieldEditable
                        : styles.textFieldDisabled,
                    }}
                    InputLabelProps={{ style: styles.label }}
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
        <div style={styles.buttonsContainer}>
          {!editing ? (""
          ) : (
            <>
              <Button
                type="submit"
                variant="contained"
                style={styles.saveButton}
              >
                Guardar
              </Button>
              <Button
                type="button"
                variant="outlined"
                style={styles.cancelButton}
                onClick={() => setEditing(false)}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </form>
    </Paper>
  );
}

const styles = {
  paper: {
    padding: "20px",
    margin: "20px",
    color: "var(--text-color-primary)",
    borderRadius: "8px",
  },
  title: {
    color: "var(--primary-color)",
    textAlign: "center",
    fontWeight: "bold",
  },
  textField: {
    backgroundColor: "var(--text-color-secondary)",
    borderRadius: "4px",
  },
  textFieldEditable: {
    color: "var(--text-color-primary)",
    backgroundColor: "#f1eadb",
  },
  textFieldDisabled: {
    color: "var(--text-color-primary)",
    backgroundColor: "white",
  },
  label: {
    color: "var(--primary-color)",
  },
  buttonsContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "var(--primary-color)",
    color: "var(--text-color-secondary)",
    marginRight: "10px",
  },
  cancelButton: {
    borderColor: "var(--terciary-color)",
    color: "var(--terciary-color)",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "var(--background-color)",
  },
  noData: {
    textAlign: "center",
    color: "var(--primary-color)",
    marginTop: "20px",
  },
};
