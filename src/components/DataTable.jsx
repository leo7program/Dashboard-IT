import React, { useContext, useState } from 'react';
import { TicketContext } from '../context/TicketContext';
import { Trash2, Search } from 'lucide-react';

const DataTable = () => {
  const { tickets, deleteTicket, clearAll } = useContext(TicketContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t => 
    (t.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.requester || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3>Base de Dados - Chamados ({tickets.length})</h3>
        
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--forvia-text-light)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Pesquisar..." 
              style={{ paddingLeft: 36, width: 250 }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-outline" onClick={clearAll} style={{ color: 'var(--forvia-danger)', borderColor: 'var(--forvia-danger)' }}>
            Apagar Tudo
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Origem</th>
              <th>Número</th>
              <th>Tipo</th>
              <th>Solicitante</th>
              <th>Departamento / Área</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: 32, color: 'var(--forvia-text-light)' }}>
                  Nenhum chamado encontrado.
                </td>
              </tr>
            ) : (
              filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>
                    <span style={{ 
                      fontWeight: 'bold', 
                      color: ticket.source === 'FITS' ? '#003087' : '#eab308' 
                    }}>
                      {ticket.source}
                    </span>
                  </td>
                  <td>{ticket.number || '-'}</td>
                  <td>
                    <span className={`badge ${ticket.type === 'Incident' ? 'badge-incident' : 'badge-request'}`}>
                      {ticket.type}
                    </span>
                  </td>
                  <td>{ticket.requester}</td>
                  <td>{ticket.department}</td>
                  <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ticket.title || ticket.description}
                  </td>
                  <td>{ticket.date}</td>
                  <td>
                    <button 
                      style={{ background: 'transparent', border: 'none', color: 'var(--forvia-danger)', cursor: 'pointer', padding: 4 }}
                      onClick={() => {
                        if (window.confirm('Excluir este registro?')) {
                          deleteTicket(ticket.id);
                        }
                      }}
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
