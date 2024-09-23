import React from 'react';
import { FaComments, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import Filters from './Filters';
import { useAuth0 } from '@auth0/auth0-react';
import { format, isToday, isYesterday, differenceInCalendarDays } from 'date-fns';
import { es } from 'date-fns/locale';

const Sidebar = ({ users, selectUser, selectedUser, onSearch, onFilterChange }) => {
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

    const sortedUsers = users.slice().sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });

    return (
        <div className="flex h-full w-full sm:w-1/3 bg-indigo-900 text-white">
            <div className="flex flex-col justify-start items-center w-16 bg-indigo-800 p-5 space-y-6">
                <FaComments className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Mensajes' />
                <FaUserFriends className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Usuarios' />
                <FaSignOutAlt
                    onClick={() => logout({ returnTo: '/' })}
                    title="Cerrar sesión"
                    className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500 mt-auto"
                />
            </div>
            <div className="flex-1 bg-indigo-900 text-white flex flex-col h-full">
                {/* Ajuste del ancho del sombreado y borde */}
                <div className="p-5 shadow-lg bg-indigo-900 w-full border-b border-gray-900">
                    <img src="https://flyup.ar/img/Logo-W.png" alt="Logo" className="w-1/2" />
                </div>
                
                {/* Filtro alineado a la izquierda */}
                <div className="pl-4 pr-4 mt-2">
                    <Filters onSearch={onSearch} onFilterChange={onFilterChange} />
                </div>

                <div className="flex-1 hover:overflow-y-auto overflow-x-hidden overflow-hidden">
                    <ul className="list-none p-0 m-0">
                        {sortedUsers.map((user) => (
                            <li
                                key={user.userId}
                                onClick={() => selectUser(user)}
                                className={`p-3 cursor-pointer flex justify-between items-center bg-indigo-900 border-b border-indigo-700 transition duration-300 ease-in-out 
                                ${selectedUser?.userId === user.userId ? 'bg-pink-600 text-white' : 'hover:bg-pink-600'}`}
                            >
                                {/* Sección de texto */}
                                <div className="flex flex-col">
                                    <span className={`font-bold ${selectedUser?.userId === user.userId ? 'text-white' : 'text-gray-300'}`}>
                                        {user.username}
                                    </span>
                                    <span className={`text-sm ${selectedUser?.userId === user.userId ? 'text-gray-200' : 'text-gray-400'}`}>
                                        {user.content.length > 0 && user.content[user.content.length - 1].split(', content: ')[1].slice(0, 30) + '...'}
                                    </span>
                                </div>
                                
                                {/* Sección de hora o día */}
                                <div className={`text-sm ${selectedUser?.userId === user.userId ? 'text-gray-200' : 'text-gray-400'}`}>
                                    {formatUpdatedAt(user.updated_at)}
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