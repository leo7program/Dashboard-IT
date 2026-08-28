import React, { useState, useContext } from 'react';
import { TicketContext } from '../context/TicketContext';
import * as XLSX from 'xlsx';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

const UploadExcel = () => {
  const { addMultipleTickets } = useContext(TicketContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const processExcel = async () => {
    if (!file) return;
    
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      
      // Parse FITS columns to our standard format
      const newTickets = jsonData.map(row => {
        // Try to identify Incident vs Request based on Title or Number
        const number = row['Number'] || '';
        let type = 'Incident';
        if (number.startsWith('REQ') || number.startsWith('RITM') || (row['Title'] && row['Title'].toLowerCase().includes('request'))) {
          type = 'Request';
        }

        // Handle date formats from Excel (sometimes they come as numbers, sometimes strings)
        let dateStr = row['Opened'] || row['Data'] || new Date().toISOString();
        if (typeof dateStr === 'number') {
          // Excel date to JS Date
          const date = new Date((dateStr - (25567 + 2)) * 86400 * 1000);
          dateStr = date.toISOString().split('T')[0];
        } else if (typeof dateStr === 'string' && dateStr.includes(' ')) {
          // "DD/MM/YYYY HH:MM:SS" format common in FITS
          const parts = dateStr.split(' ')[0].split('/');
          if (parts.length === 3) {
            dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
          }
        }

        return {
          source: 'FITS',
          number: row['Number'] || '',
          title: row['Title'] || '',
          description: row['Description'] || '',
          department: row['Business service'] || row['Departamento'] || 'Não Informado',
          location: row['Location'] || row['Site'] || 'Não Informado',
          requester: row['Requested for'] || row['Opened by'] || 'Não Informado',
          date: dateStr,
          type: type,
          state: row['State'] || 'Closed'
        };
      });

      addMultipleTickets(newTickets);
      setResult({ success: true, count: newTickets.length });
      setFile(null);
    } catch (error) {
      console.error(error);
      setResult({ success: false, message: 'Erro ao processar o arquivo. Verifique se o formato está correto.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h3 style={{ marginBottom: 24 }}>Importar Relatório do FITS</h3>
      
      <p style={{ color: 'var(--forvia-text-light)', marginBottom: 24 }}>
        Selecione o arquivo Excel exportado do sistema FITS. O sistema irá ler e atualizar a base de dados automaticamente.
      </p>

      {result && result.success && (
        <div style={{ backgroundColor: 'var(--forvia-success)', color: 'white', padding: '12px 16px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <CheckCircle size={20} />
          {result.count} chamados importados com sucesso!
        </div>
      )}

      {result && !result.success && (
        <div style={{ backgroundColor: 'var(--forvia-danger)', color: 'white', padding: '12px 16px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <AlertTriangle size={20} />
          {result.message}
        </div>
      )}

      <div style={{ 
        border: '2px dashed var(--forvia-border)', 
        borderRadius: 12, 
        padding: 40,
        backgroundColor: '#f9fafb',
        marginBottom: 24,
        cursor: 'pointer'
      }}>
        <UploadCloud size={48} color="var(--forvia-blue)" style={{ margin: '0 auto 16px' }} />
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileChange}
          style={{ display: 'block', margin: '0 auto', maxWidth: 250 }}
        />
      </div>

      <button 
        className="btn-primary" 
        onClick={processExcel} 
        disabled={!file || loading}
        style={{ opacity: (!file || loading) ? 0.5 : 1 }}
      >
        {loading ? 'Processando...' : 'Processar Planilha'}
      </button>
    </div>
  );
};

export default UploadExcel;
