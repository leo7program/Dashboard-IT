import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import { CheckCircle } from 'lucide-react';

const ManualEntry = () => {
  const { addTicket } = useContext(TicketContext);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    requester: '',
    description: '',
    department: '',
    location: '',
    type: 'Incident',
    date: new Date().toISOString().split('T')[0] // today's date
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addTicket({
      source: 'EMAIL',
      number: `EML-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.description.substring(0, 50) + (formData.description.length > 50 ? '...' : ''),
      description: formData.description,
      department: formData.department,
      location: formData.location,
      requester: formData.requester,
      date: formData.date,
      type: formData.type
    });

    setSuccess(true);
    setFormData({
      ...formData,
      requester: '',
      description: '',
      department: '',
      location: ''
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3 style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
        Registrar Chamado via E-mail
      </h3>
      
      {success && (
        <div style={{ backgroundColor: 'var(--forvia-success)', color: 'white', padding: '12px 16px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={20} />
          Chamado registrado com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Solicitante</label>
          <input 
            type="text" 
            className="form-control" 
            name="requester"
            value={formData.requester}
            onChange={handleChange}
            placeholder="Ex: Claudia da Silva"
            required 
          />
        </div>

        <div className="form-group">
          <label>Descrição do Problema</label>
          <textarea 
            className="form-control" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Ex: Cabo de internet quebrado azul"
            rows={3}
            required 
          />
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label>Departamento / Área</label>
            <input 
              type="text" 
              className="form-control" 
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ex: Injeção Gap 1"
              required 
            />
          </div>
          <div className="form-group">
            <label>Localização (Máquina)</label>
            <input 
              type="text" 
              className="form-control" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: Máquina 600/2"
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label>Tipo de Chamado</label>
            <select 
              className="form-control" 
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Incident">Incidente (Problema/Falha)</option>
              <option value="Request">Requisição (Novo acesso/Equipamento)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Data de Abertura</label>
            <input 
              type="date" 
              className="form-control" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">
            Salvar Chamado
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualEntry;
