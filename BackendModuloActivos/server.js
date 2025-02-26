const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config(); 
const app = express();
const port = 5000;

const dbConfig = {
  server: process.env.DB_SERVER || '10.30.30.129',
  user: process.env.DB_USER || 'jmmedina',
  password: process.env.DB_PASSWORD || 'P5;r8F7D',
  database: process.env.DB_NAME || 'bdGestionConfiguracion2',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.use(cors());
app.use(express.json());

sql.connect(dbConfig).then(pool => {
  if (pool.connected) console.log('Conectado a la base de datos');
}).catch(err => console.error('Error al conectar:', err));

app.get('/api/data', async (req, res) => {
  try {
    const result = await sql.query("SELECT p.ObjetoAtributoValorPredeterminadoID, p.ObjetoAtributoID, t.TipoObjetoAtributo, p.Valor FROM Activos.ObjetoAtributoValorPredeterminado as p INNER JOIN Activos.TipoObjetosAtributos as t ON p.ObjetoAtributoID = t.TipoObjetoAtributoID ORDER BY ObjetoAtributoValorPredeterminadoID ASC");
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener datos:', err);
    res.status(500).send('Error al obtener los datos');
  }
});
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.delete("/api/data/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "ID inválido" });
  }
  try {
    const resultado = await sql.query`DELETE FROM Activos.ObjetoAtributoValorPredeterminado WHERE ID = ${id}`;
    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Registro no encontrado" });
    }
    res.json({ success: true, message: "Registro eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar los datos:", err);
    res.status(500).json({ success: false, message: "Error al eliminar los datos" });
  }
});



