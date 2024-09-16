import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

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
  const { isAuthenticated, isLoading } = useAuth0();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (isAuthenticated) {
      const fetchConversations = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://bbbexpresswhatsappsender.onrender.com/get-conversations');
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