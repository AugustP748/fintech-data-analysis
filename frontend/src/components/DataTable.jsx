import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ filteredData }) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('id_cliente');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Search Filter (by id_cliente)
  const searchedData = useMemo(() => {
    return filteredData.filter(d => {
      const idString = d.id_cliente.toString();
      return idString.includes(search.trim());
    });
  }, [filteredData, search]);

  // 2. Sort Data
  const sortedData = useMemo(() => {
    const sorted = [...searchedData];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [searchedData, sortField, sortOrder]);

  // 3. Paginate Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5; // Max page buttons to display
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const columns = [
    { field: 'id_cliente', label: 'ID Cliente' },
    { field: 'edad', label: 'Edad' },
    { field: 'ingreso_mensual', label: 'Ingreso' },
    { field: 'monto_credito', label: 'Monto Créd.' },
    { field: 'cuotas', label: 'Cuotas' },
    { field: 'tasa_interes', label: 'Tasa %' },
    { field: 'antiguedad_laboral', label: 'Antigüedad' },
    { field: 'zona', label: 'Zona' },
    { field: 'historial_crediticio', label: 'Historial' },
    { field: 'atrasos_previos', label: 'Atrasos' },
    { field: 'score_crediticio', label: 'Score' },
    { field: 'estado_cliente', label: 'Estado' }
  ];

  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* SEARCH AND COUNTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por ID Cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
        </div>
        
        <div className="text-xs text-slate-400 font-semibold bg-slate-900/40 border border-slate-700/30 px-3 py-1.5 rounded-lg">
          Mostrando {sortedData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} clientes encontrados
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-700/50">
              {columns.map(col => (
                <th
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  className="p-3 text-slate-300 font-semibold uppercase tracking-wider cursor-pointer hover:bg-slate-700/30 transition-all w-fit"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    {sortField === col.field ? (
                      sortOrder === 'asc' ? <ChevronUp size={12} className="text-blue-400" /> : <ChevronDown size={12} className="text-blue-400" />
                    ) : (
                      <ChevronDown size={12} className="text-slate-600 opacity-0 hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-500">
                  No se encontraron clientes con esos parámetros.
                </td>
              </tr>
            ) : (
              paginatedData.map((d, index) => (
                <tr 
                  key={d.id_cliente} 
                  className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-all ${
                    index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/50'
                  }`}
                >
                  <td className="p-3 font-semibold text-white">#{d.id_cliente}</td>
                  <td className="p-3 text-slate-300">{d.edad}</td>
                  <td className="p-3 text-slate-300">{formatCurrency(d.ingreso_mensual)}</td>
                  <td className="p-3 text-slate-300">{formatCurrency(d.monto_credito)}</td>
                  <td className="p-3 text-slate-300">{d.cuotas}</td>
                  <td className="p-3 text-slate-300">{d.tasa_interes.toFixed(1)}%</td>
                  <td className="p-3 text-slate-300">{d.antiguedad_laboral.toFixed(1)} años</td>
                  <td className="p-3 text-slate-300">{d.zona}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      d.historial_crediticio === 'Bueno' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : d.historial_crediticio === 'Regular'
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {d.historial_crediticio}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{d.atrasos_previos}</td>
                  <td className="p-3">
                    <span className={`font-semibold ${
                      d.score_crediticio >= 650 
                        ? 'text-emerald-400' 
                        : d.score_crediticio >= 500
                        ? 'text-yellow-400'
                        : 'text-rose-400'
                    }`}>
                      {d.score_crediticio}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      d.mora === 0 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {d.estado_cliente}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-slate-700/30">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-700/50 border border-slate-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span>Anterior</span>
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-1">
            {getVisiblePages().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2.5 py-1 text-xs font-semibold text-slate-500">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500/50 shadow-md shadow-blue-500/10 font-bold'
                      : 'text-slate-400 bg-slate-900/30 border-slate-700/50 hover:bg-slate-700 hover:text-white cursor-pointer'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-slate-700/50 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-700/50 border border-slate-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>Siguiente</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
