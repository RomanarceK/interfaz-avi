import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ChatApp = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchConversations = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://bbbexpresswhatsappsender.onrender.com/get-conversations');
          console.log(response.data);
          setConversations(response.data);
          setFilteredConversations(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error al recuperar conversaciones:', error);
          setError('Error al recuperar conversaciones');
          setLoading(false);
        }
      };
  
      fetchConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Filtrar conversaciones cuando cambia el término de búsqueda
    const filtered = conversations.filter(conversation =>
      conversation.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  if (loading || isLoading) {
    return <p>Cargando conversaciones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Función para manejar la selección de conversación desde la barra lateral
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Función para manejar el cambio en el filtro de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        users={filteredConversations}
        selectUser={handleSelectConversation}
        selectedUser={selectedConversation}
        onSearch={handleSearch}
      />
      <ChatWindow selectedUser={selectedConversation} />
    </div>
  );
};

export default ChatApp;