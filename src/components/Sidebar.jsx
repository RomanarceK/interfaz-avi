import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaUserFriends, FaSignOutAlt, FaChartBar } from 'react-icons/fa';
import Filters from './Filters';
import { useAuth0 } from '@auth0/auth0-react';
import { format, isToday, isYesterday, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Sidebar = ({ users, selectUser, selectedUser, onSearch, onFilterChange, unreadCounts }) => {
    const { logout } = useAuth0();

    const formatUpdatedAt = (updatedAt) => {
        const date = new Date(updatedAt);
        const today = new Date();
        const daysDifference = differenceInCalendarDays(today, date);

        if (isToday(date)) {
            return format(date, 'HH:mm', { locale: es });
        } else if (isYesterday(date)) {
            return 'Ayer';
        } else if (daysDifference <= 7) {
            return format(date, 'EEEE', { locale: es });
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    const sortedUsers = users.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return (
        <div className="flex h-full w-full sm:w-1/3 bg-indigo-900 text-white">
            <div className="flex flex-col justify-start items-center w-16 bg-indigo-800 p-5 space-y-6">
                <FaComments className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Mensajes' />
                <FaUserFriends className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Usuarios' />
                <FaSignOutAlt
                    onClick={() => logout({ returnTo: 'https://avi-flyup.ar' })}
                    title="Cerrar sesión"
                    className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500 mt-auto"
                />
                <Link to="/metrics" title="Métricas">
                    <FaChartBar className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" />
                </Link>
            </div>

            <div className="flex-1 bg-indigo-900 text-white flex flex-col h-full">
                <div className="p-5 shadow-lg bg-indigo-900 w-full border-b border-gray-900 hover:cursor-pointer" onClick={() => window.open('https://flyup.ar', '_blank')}>
                    <img src="https://flyup.ar/img/Logo-W.png" alt="Logo" className="w-1/2" />
                </div>
                
                <div className="pl-4 pr-4 mt-2">
                    <Filters onSearch={onSearch} onFilterChange={onFilterChange} />
                </div>

                <div className="flex-1 hover:overflow-y-auto overflow-x-hidden overflow-hidden">
                    <ul className="list-none p-0 m-0">
                        {sortedUsers.map((conversation) => (
                            <li
                                key={conversation._id}
                                onClick={() => selectUser(conversation)}
                                className={`p-3 cursor-pointer flex justify-between items-center bg-indigo-900 border-b border-indigo-700 transition duration-300 ease-in-out 
                                ${selectedUser?.userId === conversation.userId ? 'bg-pink-600 text-white' : 'hover:bg-pink-600'}`}
                            >
                                <div className="flex flex-col">
                                    <span className={`font-bold ${selectedUser?.userId === conversation.userId ? 'text-white' : 'text-gray-300'}`}>
                                        {conversation.username ? conversation.username : 'Desconocido'}
                                    </span>
                                    <span className={`text-sm ${selectedUser?.userId === conversation.userId ? 'text-gray-200' : 'text-gray-400'}`}>
                                        {conversation.content.length > 0 ? (
                                            typeof conversation.content[conversation.content.length - 1] === 'string' ? (
                                                // Si el último mensaje es una cadena, extraer la parte después de 'content: '
                                                conversation.content[conversation.content.length - 1].split(', content: ')[1]?.slice(0, 30) + '...'
                                            ) : (
                                                // Si el último mensaje es un objeto, mostrar directamente el contenido
                                                conversation.content[conversation.content.length - 1].content.split(', content: ')[1]?.slice(0, 30) + '...'
                                            )
                                        ) : (
                                            'No hay contenido disponible'
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`text-sm ${selectedUser?.userId === conversation.userId ? 'text-gray-200' : 'text-gray-400'} text-right mr-2`}>
                                        {formatUpdatedAt(conversation.updated_at)}
                                    </div>
                                    {/* Mostrar el conteo de mensajes no leídos */}
                                    {unreadCounts[conversation._id] > 0 && (
                                        <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                            {unreadCounts[conversation._id]}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;