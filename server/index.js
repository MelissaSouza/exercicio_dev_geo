import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());

// Dados mock
const users = [
  {
    id: 1,
    username: "admin",
    password: "admin", 
    role: "admin",
  },
];


app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Credenciais inválidas" });
  }
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign({ userId: user.id }, "secretToken", {
      expiresIn: "1h", 
    });

    
    res.json({ token });
  } else {
  
    res.status(401).json({
      error: "Credenciais inválidas",
      code: "INVALID_CREDENTIALS",
    });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});