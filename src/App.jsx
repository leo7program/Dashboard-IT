import { useState } from 'react';
import { LayoutDashboard, FileSpreadsheet, MailPlus, Database } from 'lucide-react';
import './index.css';

import Dashboard from './components/Dashboard';
import UploadExcel from './components/UploadExcel';
import ManualEntry from './components/ManualEntry';
import DataTable from './components/DataTable';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          FORVIA <span style={{fontWeight: 300}}>FAURECIA</span>
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            Visão Geral
          </div>
          <div 
            className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <FileSpreadsheet size={20} />
            Importar FITS
          </div>
          <div 
            className={`nav-item ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            <MailPlus size={20} />
            Registrar E-mail
          </div>
          <div 
            className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <Database size={20} />
            Base de Dados
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2 style={{margin: 0, color: 'var(--forvia-text)'}}>
            {activeTab === 'dashboard' && 'Dashboard de T.I'}
            {activeTab === 'upload' && 'Importar Planilha do FITS'}
            {activeTab === 'manual' && 'Registro Manual (E-mails)'}
            {activeTab === 'data' && 'Base de Dados (Chamados)'}
          </h2>
          <div>
            <span style={{fontSize: 14, color: 'var(--forvia-text-light)'}}>
              Olá, <strong>Leonardo</strong>
            </span>
          </div>
        </header>

        <div className="content-area">
          {/* Tab Content */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'upload' && <UploadExcel />}
          {activeTab === 'manual' && <ManualEntry />}
          {activeTab === 'data' && <DataTable />}
        </div>
      </main>
    </div>
  );
}

export default App;
