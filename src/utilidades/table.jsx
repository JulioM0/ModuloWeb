import React, { useState, useEffect, useRef } from "react";
import "../estilos/TableStyle.css";
import Formulario from './formulario.jsx';
import axios from "axios";

const Table = () => {
  const [data, setData] = useState([]);
  const [logsData, setLogsData] = useState([]);
  const [selectedIP, setSelectedIP] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const ipInicioRef = useRef(null);
  const ipFinRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerLogs();
  }, []);

  function formatearAtributos(clave) {
    return clave
        .replace(/_/g, " ") 
        .toLowerCase() 
        .replace(/\b\w/g, (l) => l.toUpperCase()); 
}

  const obtenerLogs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/logs");
      setLogsData(response.data);
    } catch (error) {
      console.error("Error obteniendo logs:", error);
    }
  };

  const generarRangoIPs = (ipInicio, ipFin) => {
    if (typeof ipInicio !== "string" || typeof ipFin !== "string") return [];
    const ipA = ipInicio.trim().split(".").map(Number);
    const ipB = ipFin.trim().split(".").map(Number);
    if (ipA.length !== 4 || ipB.length !== 4 || ipA.some(isNaN) || ipB.some(isNaN)) return [];

    if (ipA[0] !== ipB[0] || ipA[1] !== ipB[1]) return [];

    let subredInicio = ipA[2];
    let subredFin = ipB[2];
    if (subredInicio > subredFin) return [];

    const ips = [];
    for (let i = subredInicio; i <= subredFin; i++) {
      ips.push(`192.168.${i}.99`);
    }

    return ips;
  };

  const consultarIPs = async () => {
    setLoading(true)
    const ip1 = ipInicioRef.current.value.trim();
    const ip2 = ipFinRef.current.value.trim();

    if (!ip1 || !ip2) return;

    const ips = generarRangoIPs(ip1, ip2);
    if (ips.length === 0) return;

    try {
      let datosFormateados = [];
      let idNumber = 1;

      for (const ip of ips) {
        const response = await axios.get("http://localhost:8080/snmp", { params: { ip } });
        const jsonData = response.data;

        if (!jsonData) continue;

        const key = Object.keys(jsonData)[0]; 
        const data = jsonData[key]; 

        datosFormateados.push({
          id: idNumber++,
          ip: ip,
          datos: data,
          estatus: logsData.find((log) => log.Content?.includes(ip))?.Content || "Sin información",
        });
      }

      setData(datosFormateados);
    } catch (error) {
      console.error("Error en la petición:", error);
    }finally {
      setLoading(false); 
    }
  };

  const handleRowClick = (ip, datos) => {
    setSelectedIP(ip);
    setSelectedData(datos);
  };

  return (
    <div>
      <label className="txt">Ingrese un rango de IPs:</label>
      <input ref={ipInicioRef} className="txtIP1" type="text" placeholder="Ingrese la primera IP" />
      <input ref={ipFinRef} className="txtIP2" type="text" placeholder="Ingrese la segunda IP" />
      <button className="btnConsultarIPs" onClick={consultarIPs}>Consultar IPs</button>
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Consultando IPs...</p>
        </div>
      )}
  
      {!loading && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IP</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} onClick={() => handleRowClick(item.ip, item.datos)} style={{ cursor: "pointer" }}>
                <td>{item.id}</td>
                <td>{item.datos?.nombre_Del_Sistema || "desconocido"}, {item.ip}</td>
                <td>{item.estatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedIP && selectedData && (
        <div className="info-box">
          <h3>Detalles de {selectedData.nombre_Del_Sistema || selectedIP}</h3>
          <ul>
            {Object.entries(selectedData).map(([key, value]) => (
              <li key={key}>
                <strong>{formatearAtributos(key)}:</strong> {typeof value === "object" ? JSON.stringify(value) : value.toString()}
              </li>
            ))}
          </ul>
          <button className="btn1" onClick={Formulario}>Agregar Atributos</button>
          <button className="btn2" onClick={() => setSelectedIP(null)}>Cerrar</button>
        </div>
      )}

    </div>
  ); 
};
export default Table;