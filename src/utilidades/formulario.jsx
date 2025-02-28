import React from "react";
import "../estilos/modal.css"; 
import Table from "./table";

const Modal = ({ isOpen, onClose }) => {

if (!isOpen) return null; 
  return (
    
    <div className="modal-overlay">
      <div className="modal-contenido">
        <h2>Agregar Atributos</h2>
        <label>Nombre:</label>
            <input type="text" placeholder="Ingrese el nombre" />
        <label>Valor:</label>
        <input type="text" placeholder="Ingrese el valor" />
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
