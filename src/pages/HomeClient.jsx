import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/components/homeClient.css';

function HomeClient() {
  const navigate = useNavigate();
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleNavigateToOrderPage = () => {
    navigate('/order-form');
  };

  const handleNavigateToProductList = () => {
    // Verificar la clave antes de redirigir
    if (clave === 'admin') { // Reemplaza 'tuclave' con tu clave real
      navigate('/impresora');
    } else {
      setError('Clave incorrecta. Inténtalo de nuevo.');
    }
  };

  const handleChangeClave = (e) => {
    setClave(e.target.value);
  };

  return (
    <div className="contentHomeClient">
      <h1 className="titleHomeClient">fotocopia</h1>

      <div className="contentHome">
        {/* Catálogo de Precios */}
        <section className="CP1 catalogo-precios">
          <div className="container">
            <h2 className="titleCP1">Catálogo de Precios</h2>
            <div className="listado-precios">
              <article className="article">$50</article>
              <article className="article">$100</article>
              <article className="article">$150</article>
              <article className="article">$200</article>
            </div>
          </div>
        </section>

        {/* Panel de Pedido de Impresión */}
        <section className="PPI2 cards panel-pedido-impresion" onClick={handleNavigateToOrderPage}>
          <h2>Panel de Pedido de Impresión</h2>
          <p>Aquí irá el contenido del panel de pedido de impresión.</p>
        </section>

        {/* Panel de Impresoras/Fotocopiadoras */}
        <section className="PPP3 cards panel-pedido-productos" onClick={handleNavigateToProductList}>
          <h2>Panel de Impresoras/Fotocopiadoras</h2>
          <p>Aquí irá el contenido del panel de Máquinas.</p>
          <div className="clave-input">
            <input type="password" placeholder="Ingrese la clave" value={clave} onChange={handleChangeClave} />
            <button onClick={handleNavigateToProductList}>Acceder</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </section>

        {/* Información Adicional */}
        <section className="IA4">
          <h2>Bienvenidos a Fotocopier</h2>
          <h4>
En Fotocopier, nos enorgullece ofrecer servicios de fotocopiado y soluciones de impresión de alta calidad. Somos una empresa dedicada a satisfacer las necesidades de nuestros clientes con rapidez, precisión y atención personalizada.

Nuestros Servicios
Fotocopiado y Escaneado: Ofrecemos servicios de fotocopiado y escaneado de documentos en blanco y negro y a color. Utilizamos equipos de última generación para garantizar la mejor calidad en cada copia.
Impresión Digital: Imprimimos desde pequeños volúmenes hasta grandes tiradas con la misma calidad y precisión. Ideal para trabajos escolares, presentaciones empresariales y proyectos creativos.
Anillado y Encuadernación: Proporcionamos servicios de anillado y encuadernación para dar un toque profesional a tus documentos y presentaciones.
Impresión de Tarjetas y Folletos: Diseñamos e imprimimos tarjetas de presentación, folletos, flyers y más, ayudando a nuestros clientes a destacarse en cualquier evento o campaña publicitaria.
Servicio de Envío por Correo Electrónico: Facilitamos el envío de documentos impresos y escaneados directamente a tu correo electrónico, ahorrándote tiempo y esfuerzo.
Nuestra Misión
En Fotocopier, nuestra misión es proporcionar servicios de fotocopiado y soluciones de impresión que superen las expectativas de nuestros clientes. Nos comprometemos a ofrecer productos de alta calidad, tiempos de entrega rápidos y precios competitivos.</h4>
        </section>
      </div>
    </div>
  );
}

export default HomeClient;
