import React, { useState } from "react";

const Formulario = () => {
    const NuevaVentana = window.open("","_blank","width=500,height=400")
    return (
        NuevaVentana.document.write(
            <html>
                <div className="form-1">
                    <label> INGRESA LOS DATOS</label>
                    <input type="text" />
                </div>
            </html>
        )
    );
};
export default Formulario; 