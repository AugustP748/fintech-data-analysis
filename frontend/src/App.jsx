import React, { useState, useMemo } from 'react';
import clientsData from './data/clients.json';
import KPICards from './components/KPICards';
import Filters from './components/Filters';
import Charts from './components/Charts';
import InsightsPanel from './components/InsightsPanel';
import DataTable from './components/DataTable';
import { LayoutDashboard, TableProperties, Lightbulb, Landmark } from 'lucide-react';

export default function App() {
  // 1. Calculate boundaries from data to initialize filters correctly
  const boundaries = useMemo(() => {
    if (!clientsData || clientsData.length === 0) {
      return {
        minAge: 18, maxAge: 80,
        minIncome: 100000, maxIncome: 1000000,
        minCredit: 50000, maxCredit: 600000
      };
    }
    const ages = clientsData.map(d => d.edad);
    const incomes = clientsData.map(d => d.ingreso_mensual);
    const credits = clientsData.map(d => d.monto_credito);
    return {
      minAge: Math.min(...ages),
      maxAge: Math.max(...ages),
      minIncome: Math.min(...incomes),
      maxIncome: Math.max(...incomes),
      minCredit: Math.min(...credits),
      maxCredit: Math.max(...credits)
    };
  }, []);

  const defaultFilters = useMemo(() => ({
    zona: [],
    historial: [],
    mora: [],
    edad: { min: boundaries.minAge, max: boundaries.maxAge },
    ingreso: { min: boundaries.minIncome, max: boundaries.maxIncome },
    monto: { min: boundaries.minCredit, max: boundaries.maxCredit }
  }), [boundaries]);

  const [filters, setFilters] = useState(defaultFilters);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'table', 'insights'

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // 2. Filter data reactive to filters state
  const filteredData = useMemo(() => {
    return clientsData.filter(d => {
      // Zona filter
      if (filters.zona.length > 0 && !filters.zona.includes(d.zona)) return false;
      
      // Historial filter
      if (filters.historial.length > 0 && !filters.historial.includes(d.historial_crediticio)) return false;
      
      // Mora/Estado filter
      if (filters.mora.length > 0 && !filters.mora.includes(d.mora)) return false;
      
      // Sliders filter
      if (d.edad < filters.edad.min || d.edad > filters.edad.max) return false;
      if (d.ingreso_mensual < filters.ingreso.min || d.ingreso_mensual > filters.ingreso.max) return false;
      if (d.monto_credito < filters.monto.min || d.monto_credito > filters.monto.max) return false;
      
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500/30">
      {/* HEADER NAVBAR */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 text-white border border-blue-400/20">
              <Landmark size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">Fintech del Norte</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Gestión del Riesgo Crediticio</p>
            </div>
          </div>

          {/* VIEWS TOGGLE */}
          <nav className="flex gap-1.5 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'dashboard'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Vista General</span>
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'table'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableProperties size={14} />
              <span>Base de Clientes</span>
            </button>
            <button
              onClick={() => setActiveView('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeView === 'insights'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb size={14} />
              <span>Conclusiones EDA</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* KPI METRICS OVERVIEW */}
        <section>
          <KPICards filteredData={filteredData} totalCount={clientsData.length} />
        </section>

        {/* WORKSPACE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT COLUMN: FILTERS */}
          <aside className="lg:col-span-1">
            <Filters 
              filters={filters} 
              setFilters={setFilters} 
              resetFilters={resetFilters} 
              rawData={clientsData} 
            />
          </aside>

          {/* RIGHT COLUMN: ACTIVE VIEW PANEL */}
          <section className="lg:col-span-3">
            {activeView === 'dashboard' && <Charts filteredData={filteredData} />}
            {activeView === 'table' && <DataTable filteredData={filteredData} />}
            {activeView === 'insights' && <InsightsPanel />}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-[10px] text-slate-500 font-medium mt-auto">
        Fintech del Norte S.A. | Análisis de Mora Crediticia del Norte Argentino © 2026. Todos los derechos reservados.
      </footer>
    </div>
  );
}
