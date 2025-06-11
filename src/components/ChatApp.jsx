import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import NoAuthMessage from './NoAuthMessage';
import { io } from 'socket.io-client';

const socket = io('https://aira-api-xm50.onrender.com');

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
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [lastMessageReceived, setLastMessageReceived] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchUserAndConversations = async () => {
        setLoading(true);
        try {
          const token = await getAccessTokenSilently();

          // Recuperar las conversaciones del usuario
          const conversationsResponse = await axios.get('https://aira-api-xm50.onrender.com/api/conversations/get-conversations', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const conversationsData = conversationsResponse.data;
          setConversations(conversationsData);
          setFilteredConversations(conversationsData);

          const userResponse = await axios.get(`https://aira-api-xm50.onrender.com/api/users/get-user/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });

          const userData = userResponse?.data;

          // Obtener los IDs de las conversaciones
          const conversationIds = conversationsData.map(conv => conv._id);

          // Recuperar los unreadCounts para las conversaciones
          const unreadCountsResponse = await axios.post('https://aira-api-xm50.onrender.com/api/conversations/unread-messages', {
            userId: user.sub,
            conversationIds,
            client: userData.client,
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Actualizar el estado con los unreadCounts
          setUnreadCounts(unreadCountsResponse.data.unreadCounts);
          setLoading(false);
        } catch (error) {
          console.error('Error al recuperar conversaciones o mensajes no leídos:', error);
          setError('Error al recuperar conversaciones o mensajes no leídos');
          setLoading(false);
        }
      };

      fetchUserAndConversations();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, lastMessageReceived]);


  useEffect(() => {
    socket.on('connect', () => {
      console.log('Conectado al servidor Socket.IO');
    });

    socket.on('newMessage', async (data) => {
      const token = await getAccessTokenSilently();
  
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === data.conversationId) {
            const updatedContent = [...conversation.content, ...data.messages];
            return {
              ...conversation,
              content: updatedContent
            };
          }
          return conversation;
        });

        return updatedConversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });
  
      setFilteredConversations((prevFiltered) => {
        const updatedFilteredConversations = prevFiltered.map((conversation) => {
          if (conversation._id === data.conversationId) {
            const updatedContent = [...conversation.content, ...data.messages];
            return {
              ...conversation,
              content: updatedContent
            };
          }
          return conversation;
        });

        return updatedFilteredConversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });
      
      setLastMessageReceived(new Date());

      const userResponse = await axios.get(`https://aira-api-xm50.onrender.com/api/users/get-user/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      const userData = userResponse?.data;
  
      // Actualizamos los unreadCounts como antes
      const conversationIds = filteredConversations.map(conv => conv._id);
      const response = await axios.post('https://aira-api-xm50.onrender.com/api/conversations/unread-messages', {
        userId: user.sub,
        conversationIds,
        client: userData.client,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setUnreadCounts(response.data.unreadCounts);
    });
  
    return () => {
      socket.off('connect');
      socket.off('newMessage');
    };
  }, [selectedConversation, getAccessTokenSilently, user.sub, filteredConversations]);

  useEffect(() => {
    if (lastMessageReceived) {
      setConversations((prevConversations) => {
        return [...prevConversations].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });
  
      setFilteredConversations((prevFiltered) => {
        return [...prevFiltered].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      });
    }
  }, [lastMessageReceived]);

  useEffect(() => {
    // Filtrar conversaciones cuando cambia el término de búsqueda
    const filtered = conversations.filter(conversation =>
      conversation.username?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-screen w-full">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-400 h-12 w-12 m-auto animate-spin"></div>
          <p className="text-xl font-semibold text-gray-700">Cargando...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <p className="text-lg text-center font-semibold text-red-600">
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

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);

    const now = new Date();

    try {
      const token = await getAccessTokenSilently();
      // Actualizar el lastReadTimestamp en el servidor o en la base de datos
      await axios.post('https://aira-api-xm50.onrender.com/api/conversations/update-read-status', {
        userId: user.sub,
        conversationId: conversation._id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Actualizar el estado local para reflejar el cambio en la UI
      const updatedConversations = conversations.map(conv =>
        conv._id === conversation._id ? { ...conv, lastReadTimestamp: now } : conv
      );
      setConversations(updatedConversations);

      const updatedFilteredConversations = filteredConversations.map(conv =>
        conv._id === conversation._id ? { ...conv, lastReadTimestamp: now } : conv
      );
      setFilteredConversations(updatedFilteredConversations);


      // Restablecer el conteo de mensajes no leídos
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [conversation._id]: 0
      }));
    } catch (error) {
      console.error('Error al actualizar el estado de lectura:', error);
    }
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
            unreadCounts={unreadCounts}
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
            unreadCounts={unreadCounts}
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