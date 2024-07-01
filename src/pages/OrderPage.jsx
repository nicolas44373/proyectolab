import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import NavbarClient from '../componentes/navbar/NavbarClient';
import '../assets/styles/components/OrderPage.css';

const OrderPage = () => {
  const [usuario, setUsuario] = useState({ nombre: '', comision: '', legajo: '' });
  const [documento, setDocumento] = useState({ archivo: null, nombreArchivo: '', cantidadHojas: 0, implementacionIA: false });
  const [detallesImpresion, setDetallesImpresion] = useState({ color: '', dobleFaz: false, anillado: false });
  const [cotizacion, setCotizacion] = useState('');
  const [emailCliente, setEmailCliente] = useState('');

  const handleUsuarioChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setDocumento({ ...documento, archivo: e.target.files[0] });
  };

  const handleDocumentoChange = (e) => {
    setDocumento({ ...documento, [e.target.name]: e.target.value });
  };

  const handleDetallesImpresionChange = (e) => {
    if (e.target.type === 'checkbox') {
      setDetallesImpresion({ ...detallesImpresion, [e.target.name]: e.target.checked });
    } else {
      setDetallesImpresion({ ...detallesImpresion, [e.target.name]: e.target.value });
    }
  };

  const handleEmailClienteChange = (e) => {
    setEmailCliente(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nombre', usuario.nombre);
      formData.append('comision', usuario.comision);
      formData.append('legajo', usuario.legajo);
      formData.append('archivo', documento.archivo);
      formData.append('nombreArchivo', documento.nombreArchivo);
      formData.append('cantidadHojas', documento.cantidadHojas);
      formData.append('implementacionIA', documento.implementacionIA);
      formData.append('color', detallesImpresion.color);
      formData.append('dobleFaz', detallesImpresion.dobleFaz);
      formData.append('anillado', detallesImpresion.anillado);
      formData.append('cotizacion', cotizacion);
      formData.append('emailCliente', emailCliente); // Agregar emailCliente al FormData

      const response = await axios.post('http://localhost:5000/pedidos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Asegura que el token se incluya correctamente
        },
      });

      console.log('Respuesta del servidor:', response.data);
      alert('Pedido realizado correctamente');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un problema al realizar el pedido');
    }
  };

  return (
    <div className="order-page-container">
      <NavbarClient /> {/* Renderiza el componente NavbarClient */}

      <Form onSubmit={handleFormSubmit} className="order-form">
        <Form.Group controlId="formUsuario">
          <Form.Label>Usuario</Form.Label>
          <Form.Control type="text" name="nombre" placeholder="Nombre" value={usuario.nombre} onChange={handleUsuarioChange} required />
          <Form.Control type="text" name="comision" placeholder="Comisión" value={usuario.comision} onChange={handleUsuarioChange} required />
          <Form.Control type="text" name="legajo" placeholder="Legajo" value={usuario.legajo} onChange={handleUsuarioChange} required />
        </Form.Group>

        <Form.Group controlId="formDocumento">
          <Form.Label>Documento a Imprimir</Form.Label>
          <Form.Control type="file" name="archivo" onChange={handleFileChange} required />
          <Form.Control type="text" name="nombreArchivo" placeholder="Nombre del archivo" value={documento.nombreArchivo} onChange={handleDocumentoChange} required />
          <Form.Control type="number" name="cantidadHojas" placeholder="Cantidad de hojas" value={documento.cantidadHojas} onChange={handleDocumentoChange} required />
          <Form.Check type="checkbox" label="Implementación con IA" name="implementacionIA" checked={documento.implementacionIA} onChange={handleDetallesImpresionChange} />
        </Form.Group>

        <Form.Group controlId="formDetallesImpresion">
          <Form.Label>Detalles de Impresión</Form.Label>
          <Form.Control as="select" name="color" value={detallesImpresion.color} onChange={handleDetallesImpresionChange} required>
            <option value="">Seleccione el color</option>
            <option value="color">Color</option>
            <option value="BN">Blanco y Negro</option>
          </Form.Control>
          <Form.Check type="checkbox" label="Doble faz" name="dobleFaz" checked={detallesImpresion.dobleFaz} onChange={handleDetallesImpresionChange} />
          <Form.Check type="checkbox" label="Anillado" name="anillado" checked={detallesImpresion.anillado} onChange={handleDetallesImpresionChange} />
        </Form.Group>

        <Form.Group controlId="formCotizacion">
          <Form.Label>Cotización</Form.Label>
          <Form.Control type="text" placeholder="Total de precio" value={cotizacion} onChange={(e) => setCotizacion(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="formEmailCliente">
          <Form.Label>Email Cliente</Form.Label>
          <Form.Control type="email" placeholder="Email del cliente" value={emailCliente} onChange={handleEmailClienteChange} required />
        </Form.Group>

        <Button variant="primary" type="submit">
          Realizar Pedido
        </Button>
      </Form>
    </div>
  );
};

export default OrderPage;
