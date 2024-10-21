import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ selectedUser, onBack }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser, selectedUser?.content.length]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const extractMessageParts = (msg) => {
        if (typeof msg === 'string') {
            // Expresión regular para extraer las partes del mensaje de un string
            const roleMatch = msg.match(/role: ([^,]+)/);
            const contentMatch = msg.match(/content: ([\s\S]+?)(, timestamp|$)/);
            const timestampMatch = msg.match(/timestamp: (.+)/);
    
            const role = roleMatch ? roleMatch[1] : 'unknown';
            const content = contentMatch ? contentMatch[1] : 'No content';
            const timestamp = timestampMatch ? new Date(timestampMatch[1]).toISOString() : null;
    
            return { role, content, timestamp };
        }
    
        if (typeof msg === 'object') {
            if (msg.content.includes('role:') && msg.content.includes('timestamp:')) {
                // Aquí el contenido está preformateado, lo procesamos como un string anidado
                const roleMatch = msg.content.match(/role: ([^,]+)/);
                const contentMatch = msg.content.match(/content: ([\s\S]+?)(, timestamp|$)/);
                const timestampMatch = msg.content.match(/timestamp: (.+)/);
    
                const role = roleMatch ? roleMatch[1] : msg.role || 'unknown';
                const content = contentMatch ? contentMatch[1] : 'No content';
                const timestamp = timestampMatch ? new Date(timestampMatch[1]).toISOString() : msg.timestamp || null;
    
                return { role, content, timestamp };
            } else {
                // Si no tiene el formato anidado, tomamos el objeto normal
                const role = msg.role || 'unknown';
                const content = msg.content || 'No content';
                const timestamp = msg.timestamp ? new Date(msg.timestamp).toISOString() : null;
    
                return { role, content, timestamp };
            }
        }

        return { role: 'unknown', content: 'Invalid message format', timestamp: null };
    };
    
    const formattedMessages = selectedUser ? selectedUser.content : [];

    return (
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
            <div className="p-5 bg-indigo-900 text-white border-l border-gray-900 font-bold flex justify-between sticky top-0 z-10">
                {selectedUser ? `${selectedUser.username}` : 'Seleccione un usuario'}
                {onBack && (
                    <button className="text-white" onClick={onBack}>
                        Volver
                    </button>
                )}
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-gray-200 h-full">
                {selectedUser ? (
                    formattedMessages.map((msg, index) => {
                        const { role, content, timestamp } = extractMessageParts(msg);
                        const isAssistant = role === 'assistant';

                        return (
                            <div key={index} className="mb-4">
                                <div className={`flex ${isAssistant ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`p-3 rounded-lg shadow-md inline-block max-w-lg ${
                                            isAssistant ? 'bg-green-100 text-left' : 'bg-white text-left'
                                        }`}
                                    >
                                        <p className={`text-sm font-semibold ${isAssistant ? 'text-blue-400' : 'text-blue-400'}`}>
                                            {isAssistant ? 'AVI:' : (selectedUser.username ? selectedUser.username : 'Desconocido') + ':'}
                                        </p>
                                        <ReactMarkdown>{content}</ReactMarkdown>
                                        {timestamp && <p className="text-xs text-gray-500 text-right">{formatTime(timestamp)}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-600 text-lg font-semibold">
                            Seleccione un usuario para ver los mensajes.
                        </p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {selectedUser && (
                <div className="p-4 sticky bottom-0 bg-gray-100">
                    <a
                        href={`https://wa.me/+${selectedUser.phone}`}
                        className="max-w-lg m-auto block text-center p-3 bg-white border border-gray-300 text-gray-500 rounded-full cursor-pointer hover:border-gray-400 focus:outline-none 
                        sm:p-2 sm:text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px' }}
                    >
                        Contactar a <b>{selectedUser.username ? selectedUser.username : 'Desconocido'}</b>
                    </a>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;