import React from 'react';
import { FaComments, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import Filters from './Filters';
import { useAuth0 } from '@auth0/auth0-react';

const Sidebar = ({ users, selectUser, selectedUser, onSearch, onFilterChange }) => {
    const { logout } = useAuth0();
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
                <div className="p-5 shadow-md rounded-lg mx-4 mt-4 hover:cursor-pointer" onClick={() => window.open('https://flyup.ar', '_blank')}>
                    <img src="https://flyup.ar/img/Logo-W.png" alt="Logo" className="w-2/3" />
                </div>
                <div className="mx-4 mt-2">
                    <Filters onSearch={onSearch} onFilterChange={onFilterChange} />
                </div>
                <div className="flex-1 hover:overflow-y-auto overflow-x-hidden overflow-hidden">
                    <ul className="list-none p-0 m-0">
                        {users.map((user) => (
                            <li
                                key={user.userId}
                                onClick={() => selectUser(user)}
                                className={`p-3 cursor-pointer flex flex-col bg-indigo-900 border-b border-indigo-700 transition duration-300 ease-in-out 
                                ${selectedUser?.userId === user.userId ? 'bg-pink-600 text-white' : 'hover:bg-pink-600'}`}
                            >
                                <span className={`font-bold ${selectedUser?.userId === user.userId ? 'text-white' : 'text-gray-300'}`}>
                                    {user.username}
                                </span>
                                <span className={`text-sm ${selectedUser?.userId === user.userId ? 'text-gray-200' : 'text-gray-400'}`}>
                                    {user.content.length > 0 && user.content[user.content.length - 1].split(', content: ')[1].slice(0, 30) + '...'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;