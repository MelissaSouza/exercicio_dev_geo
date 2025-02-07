import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import PropTypes from "prop-types";
import { theme } from "../../theme"; // Importe o tema

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha no login");
      }

      onLogin(data.token);
      navigate("/");
    } catch (error) {
      console.error("Erro de login:", error);
      setError(error.message || "Erro inesperado");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 8,
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.large,
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", color: theme.colors.accent }}>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Usuário"
          margin="normal"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />

        <TextField
          fullWidth
          label="Senha"
          type="password"
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            mt: 3,
            mb: 2,
            backgroundColor: theme.colors.accent,
            "&:hover": { backgroundColor: theme.colors.primary },
          }}
        >
          Entrar
        </Button>
      </form>
    </Container>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;