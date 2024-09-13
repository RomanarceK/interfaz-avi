import React from 'react';
import { FaComments, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import Filters from './Filters';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ users, selectUser, selectedUser, onSearch, onFilterChange }) => {
    const { logout } = useAuth0();
    return (
        <div className="flex h-full w-1/4 bg-indigo-900 text-white">
            <div className="flex flex-col justify-start items-center w-16 bg-indigo-800 p-5 space-y-6">
                <FaComments className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Mensajes' />
                <FaUserFriends className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500" title='Usuarios' />
                <FaSignOutAlt
                    onClick={() => logout({ returnTo: window.location.origin })}
                    title="Cerrar sesión"
                    className="text-white w-8 h-8 cursor-pointer transition duration-300 ease-in-out hover:text-pink-500 mt-auto" // mt-auto para ponerlo al final
                />
            </div>
            
            <div className="flex-1 bg-indigo-900 text-white overflow-y-auto">
                <div className="flex w-full p-5 shadow-md rounded-lg mx-4 mt-4">
                    <img src="https://flyup.ar/img/Logo-W.png" alt="Logo" className="w-2/3" />
                </div>

                <Filters onSearch={onSearch} onFilterChange={onFilterChange} />

                {/* Lista de usuarios */}
                <ul className="list-none p-0 m-0">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            onClick={() => selectUser(user)}
                            className={`p-3 cursor-pointer flex flex-col border-b border-indigo-700 transition duration-300 ease-in-out
                            hover:bg-pink-600`}
                        >
                            {/* Nombre del usuario */}
                            <span className={`font-bold ${user.id === selectedUser?.id ? 'text-white' : 'text-gray-300'}`}>
                                {user.username}
                            </span>

                            {/* Último mensaje */}
                            <span className={`text-sm ${user.id === selectedUser?.id ? 'text-gray-200' : 'text-gray-400'}`}>
                                {user.content.length > 0 && user.content[user.content.length - 1].split(', content: ')[1].slice(0, 30) + '...'}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;