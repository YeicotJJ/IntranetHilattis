"use client"

import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"
import { useState, useEffect } from "react"
import { sanitizeInput } from "../../utils/sanitizer"

const MAX_ATTEMPTS = 3
const LOCKOUT_TIME = 10 * 60 * 1000 // 10 minutos en milisegundos

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const navigate = useNavigate()

  // Verificar si el usuario ya está autenticado
  const isAuthenticated = sessionStorage.getItem("user-info")

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigirlo a /home
    if (isAuthenticated) {
      navigate("/home")
    }

    // Verificar si el usuario está bloqueado
    const lockedUntil = localStorage.getItem("lockedUntil")
    if (lockedUntil) {
      const remainingTime = Number.parseInt(lockedUntil) - Date.now()
      if (remainingTime > 0) {
        setIsLocked(true)
        setLockoutTime(remainingTime)
        startLockoutTimer(remainingTime)
      } else {
        localStorage.removeItem("lockedUntil")
        localStorage.removeItem("loginAttempts")
      }
    }
  }, [isAuthenticated, navigate])

  function startLockoutTimer(duration) {
    const timer = setInterval(() => {
      setLockoutTime((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer)
          setIsLocked(false)
          localStorage.removeItem("lockedUntil")
          localStorage.removeItem("loginAttempts")
          return 0
        }
        return prevTime - 1000
      })
    }, 1000)
  }

  async function onSubmit(data) {
    if (isLocked) {
      setError(`Cuenta bloqueada. Intente nuevamente en ${Math.ceil(lockoutTime / 60000)} minutos.`)
      return
    }

    const username = sanitizeInput(data.usuario)
    const password = data.contraseña // No sanitizamos la contraseña para preservar su integridad

    if (!username || !password) {
      setError("Por favor, ingrese un usuario y contraseña válidos.")
      return
    }

    const apiUrl = import.meta.env.VITE_APP_API_AUTH_URL + "login"
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const resultData = await response.json()
        const user = resultData.usuario

        // Verificar si el usuario está inactivo
        if (!user.is_active) {
          setError("El usuario está inactivo. Contacte al administrador.")
          return // No permitir el ingreso
        }

        // Reiniciar los intentos de inicio de sesión
        localStorage.removeItem("loginAttempts")

        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem("user-info", "true")
        sessionStorage.setItem("user-data", JSON.stringify(sanitizeInput(user)))
        sessionStorage.setItem("access", JSON.stringify(resultData.access))
        sessionStorage.setItem("refresh", JSON.stringify(resultData.refresh))
        navigate("/home") // Redirigir a la página de inicio
      } else {
        // Incrementar el contador de intentos fallidos
        const attempts = Number.parseInt(localStorage.getItem("loginAttempts") || "0") + 1
        localStorage.setItem("loginAttempts", attempts.toString())

        if (attempts >= MAX_ATTEMPTS) {
          const lockedUntil = Date.now() + LOCKOUT_TIME
          localStorage.setItem("lockedUntil", lockedUntil.toString())
          setIsLocked(true)
          setLockoutTime(LOCKOUT_TIME)
          startLockoutTimer(LOCKOUT_TIME)
          setError(`Demasiados intentos fallidos. Cuenta bloqueada por 10 minutos.`)
        } else {
          setError(`Usuario o contraseña incorrectos. Intento ${attempts} de ${MAX_ATTEMPTS}.`)
        }
      }
    } catch (err) {
      console.error("Error:", err)
      setError("Error al iniciar sesión")
    }
  }

  // Si ya está autenticado, no mostramos el formulario de login
  if (isAuthenticated) {
    return null
  }

  return (
    <div
      className="bodyLogin"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundImage: 'url("/logo.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            left: "30%",
          }}
        ></div>
        <h2 className="bold" style={{ textAlign: "center" }}>
          Hilattis Intranet
        </h2>
        <div
          id="Estilos"
          style={{
            height: "50vh",
            width: "20vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="User">Usuario</label>
            <input
              id="User"
              style={{
                background: "#beac8b",
                boxSizing: "border-box",
                color: "#1c160f",
                padding: "1em",
                paddingLeft: "2em",
                paddingRight: "2em",
                borderRadius: "1em",
                borderStyle: "solid",
                borderColor: "#8a5834",
              }}
              {...register("usuario", {
                required: "Este campo es obligatorio",
                maxLength: {
                  value: 50,
                  message: "El usuario no puede tener más de 50 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "El usuario solo puede contener letras, números y guiones bajos",
                },
              })}
              placeholder="Ingresa tu usuario"
              disabled={isLocked}
            />
            {errors.usuario && <span style={{ color: "red", fontSize: "0.8em" }}>{errors.usuario.message}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="Password">Contraseña</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                id="Password"
                style={{
                  background: "#beac8b",
                  boxSizing: "border-box",
                  color: "#1c160f",
                  padding: "1em",
                  paddingLeft: "2em",
                  paddingRight: "2em",
                  borderRadius: "1em",
                  borderStyle: "solid",
                  borderColor: "#8a5834",
                }}
                type={showPassword ? "text" : "password"}
                {...register("contraseña", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                  maxLength: {
                    value: 100,
                    message: "La contraseña no puede tener más de 100 caracteres",
                  },
                })}
                placeholder="Ingresa tu contraseña"
                disabled={isLocked}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  color: "#1c160f",
                  position: "absolute",
                  marginLeft: "11.5em",
                  marginTop: "0.2em",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                disabled={isLocked}
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </button>
            </div>
            {errors.contraseña && <span style={{ color: "red", fontSize: "0.8em" }}>{errors.contraseña.message}</span>}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {isLocked && (
            <p style={{ color: "red" }}>
              Cuenta bloqueada. Intente nuevamente en {Math.ceil(lockoutTime / 60000)} minutos.
            </p>
          )}

          <input
            style={{
              background: "#1c160f",
              boxSizing: "border-box",
              color: "#beac8b",
              padding: "1em",
              paddingLeft: "5em",
              paddingRight: "5em",
              borderRadius: "1em",
              borderStyle: "none",
              cursor: isLocked ? "not-allowed" : "pointer",
            }}
            type="submit"
            value="Iniciar sesión"
            className="btnIniciar"
            disabled={isLocked}
          />
        </div>
      </form>
      <div style={{ marginTop: "8vh", color: "#615944" }}>
        <p>Incorporated by APY Tech</p>
      </div>
    </div>
  )
}

