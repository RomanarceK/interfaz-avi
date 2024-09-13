import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ selectedUser }) => {
    const messagesEndRef = useRef(null);
    console.log(selectedUser);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser?.content.length]);

    return (
        <div className="flex-1 flex flex-col bg-gray-100">
            <div className="p-5 bg-indigo-900 text-white border-b border-indigo-700 font-bold">
                {selectedUser ? `${selectedUser.username}` : 'Seleccione un usuario'}
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-gray-200">
            {selectedUser ? (
            selectedUser.content.map((msg, index) => {
            // Dividimos el string por 'role: ' y luego por 'content: '
            const roleContentArray = msg.split(', content: ');
            const role = roleContentArray[0].split('role: ')[1]; // Obtener el rol (user o assistant)
            const content = roleContentArray[1]; // Obtener el contenido del mensaje
            const isAssistant = role === 'assistant';

            return (
            <div key={index} className="mb-4">
                {/* Mensaje del usuario o AVI */}
                <div
                className={`p-3 rounded-lg shadow-md max-w-lg ${
                    isAssistant ? 'bg-green-100 ml-auto text-right' : 'bg-white text-left'
                }`}
                >
                {/* Mostrar nombre de usuario o "AVI" dentro de la viñeta del mensaje */}
                <p className={`text-sm font-semibold ${isAssistant ? 'text-blue-400' : 'text-blue-400'}`}>
                    {isAssistant ? 'AVI:' : selectedUser.username + ':'}
                </p>
                {/* Contenido del mensaje */}
                <p>{content}</p>
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
        </div>
    );
};

export default ChatWindow;