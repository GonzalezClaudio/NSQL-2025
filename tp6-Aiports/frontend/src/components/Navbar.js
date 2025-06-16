import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>✈️ AeroMap</h2>
      <ul style={styles.ul}>
        <li><Link to="/" style={styles.link}>Inicio</Link></li>
        <li><Link to="/add-airport" style={styles.link}>Agregar Aeropuerto</Link></li>
        <li><Link to="/popular" style={styles.link}>Populares</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "#1e293b",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: "1.5rem",
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  },
};

export default Navbar;
