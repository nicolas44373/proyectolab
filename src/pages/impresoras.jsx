import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import NavbarClient from '../componentes/navbar/NavbarClient';
import '../assets/styles/pagesCSS/impresora.css';

const ImpresoraForm = () => {
  const [tipoEquipo, setTipoEquipo] = useState('impresora'); // Estado para el tipo de equipo
  const [equipo, setEquipo] = useState({ nombre: '', marca: '', modelo: '', color: false });

  const handleTipoEquipoChange = (e) => {
    setTipoEquipo(e.target.value);
  };

  const handleEquipoChange = (e) => {
    if (e.target.name === 'color') {
      setEquipo({ ...equipo, [e.target.name]: e.target.checked });
    } else {
      setEquipo({ ...equipo, [e.target.name]: e.target.value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:5000/${tipoEquipo}`, equipo, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Respuesta del servidor:', response.data);
      alert('Equipo guardado correctamente');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un problema al guardar el equipo');
    }
  };

  return (
    <div className="impresora-form-container">
      <NavbarClient />

      <Form onSubmit={handleFormSubmit} className="impresora-form">
        <Form.Group controlId="formTipoEquipo">
          <Form.Label>Tipo de Equipo</Form.Label>
          <Form.Control as="select" value={tipoEquipo} onChange={handleTipoEquipoChange}>
            <option value="impresora">Impresora</option>
            <option value="fotocopiadora">Fotocopiadora</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="nombre" placeholder="Nombre del equipo" value={equipo.nombre} onChange={handleEquipoChange} required />
        </Form.Group>

        <Form.Group controlId="formMarca">
          <Form.Label>Marca</Form.Label>
          <Form.Control type="text" name="marca" placeholder="Marca del equipo" value={equipo.marca} onChange={handleEquipoChange} required />
        </Form.Group>

        <Form.Group controlId="formModelo">
          <Form.Label>Modelo</Form.Label>
          <Form.Control type="text" name="modelo" placeholder="Modelo del equipo" value={equipo.modelo} onChange={handleEquipoChange} required />
        </Form.Group>

        <Form.Group controlId="formColor">
          <Form.Check type="checkbox" label="A color" name="color" checked={equipo.color} onChange={handleEquipoChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar
        </Button>
      </Form>
    </div>
  );
};

export default ImpresoraForm;
