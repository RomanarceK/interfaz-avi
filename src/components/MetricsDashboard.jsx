/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  groupMessagesByDay,
  groupConversationsByDay,
  groupNewUsersByDay,
  groupActiveConversationsByDay
} from '../utils/metricsUtils';

const MetricsDashboard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messagesData, setMessagesData] = useState([]);
  const [newUsersData, setNewUsersData] = useState([]);

  const [limitedNewUsersData, setLimitedNewUsersData] = useState([]);
  const [limitedActiveConversationsData, setLimitedActiveConversationsData] = useState([]);

  function filterLast30Days(array) {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);
    return array.filter(item => new Date(item.day) >= last30);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          'https://bbbexpresswhatsappsender.onrender.com/api/conversations/get-conversations',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = response.data;
        setConversations(data);

        const groupedMsg = groupMessagesByDay(data);
        const groupedNewUsers = groupNewUsersByDay(data);
        const groupedActiveConversations = groupActiveConversationsByDay(data);
        setMessagesData(groupedMsg);
        setNewUsersData(groupedNewUsers);

        setLimitedNewUsersData(filterLast30Days(groupedNewUsers));
        setLimitedActiveConversationsData(filterLast30Days(groupedActiveConversations));
      } catch (error) {
        console.error('Error al obtener conversaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 w-full">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-400 h-12 w-12 m-auto animate-spin"></div>
          <p className="text-xl font-semibold mt-2 text-black">Cargando...</p>
        </div>
      </div>
    );
  }

  const totalConversations = conversations.length;
  const totalMessages = messagesData.reduce((acc, item) => acc + item.total, 0);
  // const totalNewUsers = newUsersData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="bg-indigo-900 text-white w-full h-screen flex flex-col">
      <div className="flex items-center p-4 border-b border-indigo-800">
        <img
          src="https://flyup.ar/img/Logo-W.png"
          alt="Logo"
          className="h-16"
        />
        <Link
          to="/"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded ml-auto"
        >
          Volver
        </Link>
      </div>

      <div className="p-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 mt-4">
          <div className="bg-indigo-800 p-4 rounded shadow">
            <h2 className="text-gray-300 font-bold">Total Conversaciones</h2>
            <p className="text-2xl font-semibold">{totalConversations}</p>
          </div>
          <div className="bg-indigo-800 p-4 rounded shadow">
            <h2 className="text-gray-300 font-bold">Total Mensajes</h2>
            <p className="text-2xl font-semibold">{totalMessages}</p>
          </div>
          {/* <div className="bg-indigo-800 p-4 rounded shadow">
            <h2 className="text-gray-300 font-bold">Usuarios Nuevos</h2>
            <p className="text-2xl font-semibold">{totalNewUsers}</p>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gráfico: Conversaciones por día */}
          <div className="bg-indigo-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Conversaciones por Día (últimos 30 días)</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={limitedActiveConversationsData}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#4c51bf', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="count" fill="#F59E0B" name="Conversaciones" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico: Usuarios nuevos por día */}
          <div className="bg-indigo-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Usuarios Nuevos por Día (últimos 30 días)</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={limitedNewUsersData}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#4c51bf', border: 'none' }}
                    labelStyle={{ color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#fff' }} />
                  <Bar dataKey="count" fill="#10B981" name="Usuarios Nuevos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;