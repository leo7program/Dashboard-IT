import React, { useContext, useState, useMemo } from 'react';
import { TicketContext } from '../context/TicketContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const { tickets } = useContext(TicketContext);
  
  // States for filters
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');

  // Derived data based on filters
  const { filteredTickets, months, areas } = useMemo(() => {
    // Extract unique months (YYYY-MM) and areas
    const monthSet = new Set();
    const areaSet = new Set();
    
    tickets.forEach(t => {
      if (t.date) {
        const yyyymm = t.date.substring(0, 7);
        monthSet.add(yyyymm);
      }
      if (t.department) {
        areaSet.add(t.department);
      }
    });

    const months = Array.from(monthSet).sort().reverse();
    const areas = Array.from(areaSet).sort();

    // Filter tickets
    let filtered = tickets;
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(t => t.date && t.date.startsWith(selectedMonth));
    }
    if (selectedArea !== 'all') {
      filtered = filtered.filter(t => t.department === selectedArea);
    }

    return { filteredTickets: filtered, months, areas };
  }, [tickets, selectedMonth, selectedArea]);

  // --- Metrics Calculations ---
  
  // Total
  const totalTickets = filteredTickets.length;
  const totalIncidents = filteredTickets.filter(t => t.type === 'Incident').length;
  const totalRequests = filteredTickets.filter(t => t.type === 'Request').length;

  // Chart: Type breakdown
  const typeData = [
    { name: 'Incidentes', value: totalIncidents },
    { name: 'Requisições', value: totalRequests }
  ];
  const COLORS = ['#ef4444', '#3b82f6']; // Red for incident, Blue for request

  // Chart: Top 5 Problems (Description/Title keywords roughly)
  // For simplicity, we count by description/title
  const topProblems = useMemo(() => {
    const problems = {};
    filteredTickets.filter(t => t.type === 'Incident').forEach(t => {
      const title = t.title || t.description || 'Desconhecido';
      // simplify title
      const simpleTitle = title.substring(0, 30);
      problems[simpleTitle] = (problems[simpleTitle] || 0) + 1;
    });
    
    return Object.entries(problems)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [filteredTickets]);

  // Chart: Top Requesters
  const topRequesters = useMemo(() => {
    const requesters = {};
    filteredTickets.forEach(t => {
      const name = t.requester || 'Não Informado';
      if (name !== 'Não Informado') {
        requesters[name] = (requesters[name] || 0) + 1;
      }
    });
    
    return Object.entries(requesters)
      .map(([name, chamados]) => ({ name, chamados }))
      .sort((a, b) => b.chamados - a.chamados)
      .slice(0, 5);
  }, [filteredTickets]);

  // Chart: By Area (only if area is not filtered)
  const ticketsByArea = useMemo(() => {
    const areaCounts = {};
    filteredTickets.forEach(t => {
      const area = t.department || 'Não Informado';
      areaCounts[area] = (areaCounts[area] || 0) + 1;
    });
    return Object.entries(areaCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredTickets]);

  return (
    <div>
      {/* Filters */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Filtrar por Mês</label>
          <select 
            className="form-control" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Todos os Meses</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Filtrar por Área / Departamento</label>
          <select 
            className="form-control" 
            value={selectedArea} 
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="all">Todas as Áreas</option>
            {areas.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--forvia-blue)' }}>
          <h4 style={{ color: 'var(--forvia-text-light)', marginBottom: 8, fontSize: 14 }}>Total de Chamados</h4>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{totalTickets}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--forvia-danger)' }}>
          <h4 style={{ color: 'var(--forvia-text-light)', marginBottom: 8, fontSize: 14 }}>Incidentes (Problemas)</h4>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--forvia-danger)' }}>{totalIncidents}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--forvia-light-blue)' }}>
          <h4 style={{ color: 'var(--forvia-text-light)', marginBottom: 8, fontSize: 14 }}>Requisições</h4>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--forvia-light-blue)' }}>{totalRequests}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2" style={{ marginBottom: 24 }}>
        {/* Incident vs Request Pie Chart */}
        <div className="card">
          <h4 style={{ marginBottom: 16 }}>Volume por Tipo</h4>
          <div style={{ height: 300 }}>
            {totalTickets === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sem dados</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Requesters Bar Chart */}
        <div className="card">
          <h4 style={{ marginBottom: 16 }}>Top 5 Solicitantes (Que mais abrem chamados)</h4>
          <div style={{ height: 300 }}>
            {topRequesters.length === 0 ? (
               <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sem dados</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRequesters} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                  <RechartsTooltip />
                  <Bar dataKey="chamados" fill="var(--forvia-light-blue)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Top 5 Problems */}
        <div className="card">
          <h4 style={{ marginBottom: 16 }}>Top 5 Problemas Resolvidos (Incidentes)</h4>
          <div style={{ height: 300 }}>
            {topProblems.length === 0 ? (
               <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sem dados</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProblems} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 11}} tickFormatter={(val) => val.substring(0, 10) + '...'} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" name="Quantidade" fill="var(--forvia-danger)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* By Area */}
        <div className="card">
          <h4 style={{ marginBottom: 16 }}>Chamados por Área (Top 10)</h4>
          <div style={{ height: 300 }}>
            {ticketsByArea.length === 0 ? (
               <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sem dados</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByArea} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 11}} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" name="Chamados" fill="var(--forvia-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
