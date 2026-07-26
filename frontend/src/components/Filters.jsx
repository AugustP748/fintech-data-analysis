import React, { useMemo } from 'react';
import { Filter, RefreshCw, MapPin, ShieldAlert, BadgePercent, Calendar, DollarSign, Wallet } from 'lucide-react';

export default function Filters({ 
  filters, 
  setFilters, 
  resetFilters, 
  rawData 
}) {
  // Compute boundaries dynamically from rawData
  const boundaries = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return {
        minAge: 18, maxAge: 80,
        minIncome: 100000, maxIncome: 1000000,
        minCredit: 50000, maxCredit: 600000
      };
    }
    const ages = rawData.map(d => d.edad);
    const incomes = rawData.map(d => d.ingreso_mensual);
    const credits = rawData.map(d => d.monto_credito);
    
    return {
      minAge: Math.min(...ages),
      maxAge: Math.max(...ages),
      minIncome: Math.min(...incomes),
      maxIncome: Math.max(...incomes),
      minCredit: Math.min(...credits),
      maxCredit: Math.max(...credits)
    };
  }, [rawData]);

  // Unique values for dropdowns
  const uniqueZonas = useMemo(() => {
    return [...new Set(rawData.map(d => d.zona))].filter(Boolean);
  }, [rawData]);

  const uniqueHistoriales = useMemo(() => {
    return [...new Set(rawData.map(d => d.historial_crediticio))].filter(Boolean);
  }, [rawData]);

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const handleSliderChange = (field, type, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: Number(value)
      }
    }));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <Filter className="text-blue-400" size={20} />
          <span>Filtros de Análisis</span>
        </div>
        <button 
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-700/50 hover:bg-slate-700 hover:text-white transition-all border border-slate-600/50 active:scale-95"
        >
          <RefreshCw size={12} />
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* ZONA GEOGRAFICA */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <MapPin size={14} className="text-blue-400" />
            <span>Zona Geográfica</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueZonas.map(zona => {
              const active = filters.zona.includes(zona);
              return (
                <button
                  key={zona}
                  onClick={() => handleCheckboxChange('zona', zona)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    active 
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold' 
                      : 'bg-slate-900/40 text-slate-400 border-slate-700/60 hover:bg-slate-700/40'
                  }`}
                >
                  {zona}
                </button>
              );
            })}
          </div>
        </div>

        {/* HISTORIAL CREDITICIO */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <ShieldAlert size={14} className="text-purple-400" />
            <span>Historial Crediticio</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueHistoriales.map(hist => {
              const active = filters.historial.includes(hist);
              return (
                <button
                  key={hist}
                  onClick={() => handleCheckboxChange('historial', hist)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    active 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold' 
                      : 'bg-slate-900/40 text-slate-400 border-slate-700/60 hover:bg-slate-700/40'
                  }`}
                >
                  {hist}
                </button>
              );
            })}
          </div>
        </div>

        {/* ESTADO CLIENTE */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <BadgePercent size={14} className="text-emerald-400" />
            <span>Estado del Cliente</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Al día', value: 0, activeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
              { label: 'En Mora', value: 1, activeColor: 'bg-red-500/20 text-red-300 border-red-500/40' }
            ].map(item => {
              const active = filters.mora.includes(item.value);
              return (
                <button
                  key={item.value}
                  onClick={() => handleCheckboxChange('mora', item.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    active 
                      ? `${item.activeColor} font-semibold`
                      : 'bg-slate-900/40 text-slate-400 border-slate-700/60 hover:bg-slate-700/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-5 space-y-5">
          {/* EDAD SLIDER */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Calendar size={13} className="text-sky-400" />
                Edad (Años)
              </span>
              <span className="text-xs text-white font-medium bg-slate-900/60 px-2 py-0.5 rounded border border-white/5">
                {filters.edad.min} - {filters.edad.max}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-500 w-4 text-right">{boundaries.minAge}</span>
                <input 
                  type="range"
                  min={boundaries.minAge}
                  max={filters.edad.max}
                  value={filters.edad.min}
                  onChange={(e) => handleSliderChange('edad', 'min', e.target.value)}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 w-4 text-left">{filters.edad.max}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[10px] text-slate-500 w-4 text-right">{filters.edad.min}</span>
                <input 
                  type="range"
                  min={filters.edad.min}
                  max={boundaries.maxAge}
                  value={filters.edad.max}
                  onChange={(e) => handleSliderChange('edad', 'max', e.target.value)}
                  className="w-full accent-blue-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 w-4 text-left">{boundaries.maxAge}</span>
              </div>
            </div>
          </div>

          {/* INGRESO MENSUAL SLIDER */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <DollarSign size={13} className="text-pink-400" />
                Ingreso Mensual
              </span>
            </div>
            <div className="text-xs text-white font-medium bg-slate-900/60 px-2 py-1 rounded border border-white/5 text-center mb-2">
              {formatCurrency(filters.ingreso.min)} - {formatCurrency(filters.ingreso.max)}
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] text-slate-500 w-10 text-right">Min</span>
                <input 
                  type="range"
                  min={boundaries.minIncome}
                  max={filters.ingreso.max}
                  value={filters.ingreso.min}
                  step={10000}
                  onChange={(e) => handleSliderChange('ingreso', 'min', e.target.value)}
                  className="w-full accent-pink-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 w-10 text-left">Max</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] text-slate-500 w-10 text-right">Min</span>
                <input 
                  type="range"
                  min={filters.ingreso.min}
                  max={boundaries.maxIncome}
                  value={filters.ingreso.max}
                  step={10000}
                  onChange={(e) => handleSliderChange('ingreso', 'max', e.target.value)}
                  className="w-full accent-pink-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 w-10 text-left">Max</span>
              </div>
            </div>
          </div>

          {/* MONTO CREDITO SLIDER */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <Wallet size={13} className="text-cyan-400" />
                Monto del Crédito
              </span>
            </div>
            <div className="text-xs text-white font-medium bg-slate-900/60 px-2 py-1 rounded border border-white/5 text-center mb-2">
              {formatCurrency(filters.monto.min)} - {formatCurrency(filters.monto.max)}
            </div>
            <div className="space-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] text-slate-500 w-10 text-right">Min</span>
                <input 
                  type="range"
                  min={boundaries.minCredit}
                  max={filters.monto.max}
                  value={filters.monto.min}
                  step={10000}
                  onChange={(e) => handleSliderChange('monto', 'min', e.target.value)}
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 w-10 text-left">Max</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] text-slate-500 w-10 text-right">Min</span>
                <input 
                  type="range"
                  min={filters.monto.min}
                  max={boundaries.maxCredit}
                  value={filters.monto.max}
                  step={10000}
                  onChange={(e) => handleSliderChange('monto', 'max', e.target.value)}
                  className="w-full accent-cyan-500 bg-slate-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[9px] text-slate-500 w-10 text-left">Max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
