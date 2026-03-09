import React from "react";

function Boton({ text = "" }) {
    return (
        <button
            type="submit"
            className='btn btn-primary'
        >
            {text}
        </button>
    );
}

export default Boton;
