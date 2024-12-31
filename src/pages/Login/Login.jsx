import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useState,useEffect } from "react";

export default function Login() {
	const { register, handleSubmit, formState: { errors } } = useForm();
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
	const isAuthenticated = sessionStorage.getItem("user-info");

	useEffect(() => {
    // Si el usuario ya está autenticado, redirigirlo a /home
    if (isAuthenticated) {
		navigate("/home");
    }
	}, [isAuthenticated, navigate]);

	async function onSubmit(data) {
		const username = data.usuario;
		const password = data.contraseña;
		const apiUrl = import.meta.env.VITE_APP_API_LOGIN_URL;
	try {
		const result = await fetch(apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "*/*"
		},
		body: JSON.stringify({ username, password }),
		});
		if (result.ok) {
			const resultData = await result.json();
			sessionStorage.setItem("user-info", "true"); // Guardar en sessionStorage
			sessionStorage.setItem("user-data",JSON.stringify(resultData.usuario));
			sessionStorage.setItem("token",JSON.stringify(resultData.access));
			sessionStorage.setItem("toke-refresh",JSON.stringify(resultData.refresh));
			navigate("/home"); // Redirigir a la página de inicio
		} else {
		setError("Usuario o contraseña incorrectos");
		}
	} catch (err) {
		console.error("Error:", err);
		setError("Error al iniciar sesión");
	}
}

// Si ya está autenticado, no mostramos el formulario de login
	if (isAuthenticated) {
	return null;
	}

  return (
    <div className="bodyLogin" style={{width:"100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ width: "100px", height: "100px", backgroundImage: 'url("/logo.png")', backgroundSize: "cover", backgroundPosition: "center", position: "relative", left: "30%" }}></div>
        <h2 className="bold" style={{textAlign:"center"}}>Hilattis Intranet</h2>
        <div id="Estilos" style={{ height: "50vh", width: "20vw", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Usuario</label>
            <input
              id="User"
              style={{ background: "#beac8b", boxSizing: "border-box", color: "#1c160f", padding: "1em", paddingLeft: "2em", paddingRight: "2em", borderRadius: "1em", borderStyle: "solid", borderColor: "#8a5834" }}
              {...register("usuario", { required: "Este campo es obligatorio" })}
              placeholder="Ingresa tu usuario"
            />
            {errors.usuario && <span style={{ color: "red", fontSize: "0.8em" }}>{errors.usuario.message}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Contraseña</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                style={{ background: "#beac8b", boxSizing: "border-box", color: "#1c160f", padding: "1em", paddingLeft: "2em", paddingRight: "2em", borderRadius: "1em", borderStyle: "solid", borderColor: "#8a5834" }}
                type={showPassword ? "text" : "password"}
                {...register("contraseña", { required: "Este campo es obligatorio" })}
                placeholder="Ingresa tu contraseña"
              />
              <a type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: "#1c160f", position: "absolute", marginLeft: "11.5em", marginTop: "0.2em" }}>
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </a>
            </div>
            {errors.contraseña && <span style={{ color: "red", fontSize: "0.8em" }}>{errors.contraseña.message}</span>}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <input
            style={{ background: "#1c160f", boxSizing: "border-box", color: "#beac8b", padding: "1em", paddingLeft: "5em", paddingRight: "5em", borderRadius: "1em", borderStyle: "none", cursor: "pointer" }}
            type="submit"
            value="Iniciar sesión"
            className="btnIniciar"
          />
        </div>
      </form>
      <div style={{ marginTop: "8vh", color: "#615944" }}>
        <p>Incorporated by APY Tech</p>
      </div>
    </div>
  );
}
