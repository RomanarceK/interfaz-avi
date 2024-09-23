import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import NoAuthMessage from './NoAuthMessage';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

const ChatApp = () => {
  const { user, getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUserAndConversations = async () => {
        setLoading(true);
        try {
          const token = await getAccessTokenSilently();
          let userResponse;
  
          try {
            // Paso 1: Verificar si el usuario ya existe en la base de datos
            userResponse = await axios.get(`https://bbbexpresswhatsappsender.onrender.com/api/users/get-user/${user.sub}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            });
            console.log('Usuario encontrado:', userResponse.data);
          } catch (error) {
            // Si el error es 404, significa que el usuario no existe
            if (error.response && error.response.status === 404) {
              console.log('Usuario no encontrado, creando un nuevo usuario...');
      
              // Paso 2: Si no existe, intentar crear el usuario
              try {
                userResponse = await axios.post('https://bbbexpresswhatsappsender.onrender.com/api/users/create-user', {
                  user_id: user.sub,
                  username: user.name,
                  email: user.email,
                  gender: user.gender,
                  birthday: user.birthdate,
                  picture: user.picture
                }, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                console.log('Usuario creado:', userResponse.data);
              } catch (createError) {
                // Manejar el caso donde el usuario ya existe (código 409)
                if (createError.response && createError.response.status === 409) {
                  console.log('Usuario ya existe en la base de datos, continuando con el flujo...');
                } else {
                  // Si hay otro error, manejarlo
                  console.error('Error al crear el usuario:', createError);
                  setError('Error al crear el usuario');
                  setLoading(false);
                  return;
                }
              }
            } else {
              // Si hay otro error que no sea 404, manejarlo
              console.error('Error al verificar el usuario:', error);
              setError('Error al verificar el usuario');
              setLoading(false);
              return;
            }
          }
  
          // Paso 3: Recuperar las conversaciones del usuario
          const conversationsResponse = await axios.get('https://bbbexpresswhatsappsender.onrender.com/api/conversations/get-conversations', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setConversations(conversationsResponse.data);
          setFilteredConversations(conversationsResponse.data);
          setLoading(false);
        } catch (error) {
          console.error('Error al recuperar conversaciones:', error);
          setError('Error al recuperar conversaciones');
          setLoading(false);
        }
      };
  
      fetchUserAndConversations();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);
  
  

  useEffect(() => {
    // Filtrar conversaciones cuando cambia el término de búsqueda
    const filtered = conversations.filter(conversation =>
      conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 h-screen w-full">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-400 h-12 w-12 m-auto animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-semibold text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <NoAuthMessage/>
    );
  }

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        selectedConversation ? (
          <div className="w-full">
            <ChatWindow selectedUser={selectedConversation} onBack={() => setSelectedConversation(null)} />
          </div>
        ) : (
          <Sidebar
            users={filteredConversations}
            selectUser={handleSelectConversation}
            selectedUser={selectedConversation}
            onSearch={handleSearch}
          />
        )
      ) : (
        <>
          {/* En vista de escritorio mostramos lista y conversación juntos */}
          <Sidebar
            users={filteredConversations}
            selectUser={handleSelectConversation}
            selectedUser={selectedConversation}
            onSearch={handleSearch}
          />
          <div className="flex w-2/3">
            <ChatWindow selectedUser={selectedConversation} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatApp;