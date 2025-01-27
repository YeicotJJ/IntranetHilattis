import { Container, Grid, Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { BsBuilding, BsPeople, BsFolder, BsBox, BsListCheck, BsGrid, BsCart } from "react-icons/bs"



const menuItems = [
  { title: "Datos de Empresa", icon: BsBuilding, route: "/generals" },
  { title: "Usuarios", icon: BsPeople, route: "/users" },
  { title: "Mis Proyectos", icon: BsFolder, route: "/projects" },
  { title: "Mis Productos", icon: BsBox, route: "/products" },
  { title: "Variables de Productos", icon: BsListCheck, route: "/variables" },
  { title: "Categorias de Productos", icon: BsGrid, route: "/categories" },
  { title: "Mis Pedidos", icon: BsCart, route: "/orders" },
]

const Home = () => {
  const user= JSON.parse(sessionStorage.getItem("user-data"));
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{width:"100%"}}>
      <Typography variant="h4" component="h1" gutterBottom>
        {user ? `¡Bienvenid@, ${user.nombre}!` : "Cargando..."}
      </Typography>
      <div className="Image" 
      style={{
        height:"15vh",
        backgroundImage:"url('https://live.staticflickr.com/2861/12836913143_e0c7759b47_b.jpg')",
        backgroundRepeat:"no-repeat",
        backgroundSize:"cover",
        backgroundPositionY:"center",
        borderRadius:"0.5em",
        marginBottom:"15px"
      }}
        ></div>
      <Grid container spacing={5}>
        {menuItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Button
              component={Link}
              to={item.route}
              variant="contained"
              startIcon={<item.icon style={{fontSize:"2em"}}/>}
              fullWidth
              sx={{
                height: "15vh",
                display: "flex",
                color:"#f1eadb",
                fontSize:"1.1em",
                fontWeight:"bold",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                "& .MuiButton-startIcon": {
                  marginBottom: "8px",
                  marginRight: "0",
                },
                background:"var(--terciary-color)"
              }}
            >
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Home

