import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ selectedUser, onBack }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser?.content.length]);

    return (
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
            {/* Header fijo con el nombre del usuario y el botón Volver */}
            <div className="p-5 bg-indigo-900 text-white border-b border-indigo-700 font-bold flex justify-between sticky top-0 z-10">
                {selectedUser ? `${selectedUser.username}` : 'Seleccione un usuario'}
                {onBack && (
                    <button className="text-white" onClick={onBack}>
                        Volver
                    </button>
                )}
            </div>

            {/* Área de mensajes con scroll */}
            <div className="flex-1 p-5 overflow-y-auto bg-gray-200 h-full">
                {selectedUser ? (
                    selectedUser.content.map((msg, index) => {
                        const roleContentArray = msg.split(', content: ');
                        const role = roleContentArray[0].split('role: ')[1]; 
                        const content = roleContentArray[1]; 
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
                                            {isAssistant ? 'AVI:' : selectedUser.username + ':'}
                                        </p>
                                        <p>{content}</p>
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

            {/* El enlace fijo para contactar al usuario */}
            {selectedUser && (
                <div className="p-4 sticky bottom-0 bg-gray-100">
                    <a
                        href={`https://wa.me/+${selectedUser.phone}`}
                        className="max-w-lg m-auto block text-center p-3 bg-white border border-gray-300 text-gray-500 rounded-full cursor-pointer hover:border-gray-400 focus:outline-none 
                        sm:p-2 sm:text-sm" // Ajustes para que en móvil sea más pequeño
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px' }}
                    >
                        Contactar a <b>{selectedUser.username}</b>
                    </a>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;