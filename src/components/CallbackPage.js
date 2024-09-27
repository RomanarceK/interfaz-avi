import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const { isAuthenticated, isLoading, handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Maneja el código de autorización y completa el flujo de autenticación
        await handleRedirectCallback();
        navigate('/');
      } catch (error) {
        console.error('Error al procesar el callback:', error);
      }
    };

    if (!isAuthenticated && !isLoading) {
      processCallback();
    }
  }, [isAuthenticated, isLoading, handleRedirectCallback, navigate]);

  return <div>Cargando...</div>;
};

export default CallbackPage;