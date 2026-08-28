import React, { createContext, useState, useEffect } from 'react';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('forvia_tickets');
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse tickets', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('forvia_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket) => {
    setTickets(prev => [{ ...ticket, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const addMultipleTickets = (newTickets) => {
    const ticketsWithIds = newTickets.map(t => ({
      ...t,
      id: t.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    setTickets(prev => [...ticketsWithIds, ...prev]);
  };

  const updateTicket = (id, updatedFields) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const deleteTicket = (id) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os chamados da base de dados local?')) {
      setTickets([]);
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, addMultipleTickets, updateTicket, deleteTicket, clearAll }}>
      {children}
    </TicketContext.Provider>
  );
};
