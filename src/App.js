import React, { useEffect } from 'react';
import ChatApp from './components/ChatApp'; 
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CallbackPage from './components/CallbackPage';

const App = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const isCallback = window.location.search.includes('code=');

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, isCallback]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-400 h-12 w-12 m-auto animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="flex flex-row h-screen w-full overflow-hidden">
        {isAuthenticated ? (
        <Router>
          <Routes>
            <Route exact path="/" element={<ChatApp/>} />
            
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            
            {/* Redirige cualquier ruta no existente al chat principal */}
            <Route path="/callback" element={<CallbackPage/>} />
          </Routes>
        </Router>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <button
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Iniciar sesión
            </button>
          </div>
        )}
      </div>
  );
};

export default App;