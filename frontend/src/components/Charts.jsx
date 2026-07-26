import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  BarChart, 
  Bar, 
  CartesianGrid,
  Cell
} from 'recharts';
import { mean, getCorrelationMatrix } from '../utils/statistics';
import { TrendingUp, BarChart2, Compass, Grid } from 'lucide-react';

export default function Charts({ filteredData }) {
  const [activeTab, setActiveTab] = useState('distributions');

  // 1. Dual Histogram for Frequency Polygons
  const edadHistogram = useMemo(() => {
    if (filteredData.length === 0) return [];
    return getDualHistogramData(filteredData, 'edad', 10);
  }, [filteredData]);

  const ingresoHistogram = useMemo(() => {
    if (filteredData.length === 0) return [];
    // Convert to thousands for cleaner chart axis
    const mapped = filteredData.map(d => ({ ...d, ingreso_k: d.ingreso_mensual / 1000 }));
    return getDualHistogramData(mapped, 'ingreso_k', 10);
  }, [filteredData]);

  // Helper to generate matching bins for two categories (Mora vs Ok)
  function getDualHistogramData(data, field, numBins = 10) {
    const values = data.map(d => d[field]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / numBins;
    
    const bins = Array.from({ length: numBins }, (_, i) => {
      const start = min + i * binWidth;
      const center = start + binWidth / 2;
      return {
        center: Math.round(center),
        'Al día': 0,
        'En Mora': 0
      };
    });
    
    for (const item of data) {
      const val = item[field];
      for (let i = 0; i < numBins; i++) {
        const isLast = i === numBins - 1;
        const start = min + i * binWidth;
        const end = start + binWidth;
        if (val >= start && (isLast ? val <= end : val < end)) {
          if (item.mora === 0) {
            bins[i]['Al día']++;
          } else {
            bins[i]['En Mora']++;
          }
          break;
        }
      }
    }
    return bins;
  }

  // 2. Averages for Boxplot replacements
  const averagesData = useMemo(() => {
    const okGroup = filteredData.filter(d => d.mora === 0);
    const moraGroup = filteredData.filter(d => d.mora === 1);

    return {
      ingreso: [
        { name: 'Al día', valor: Math.round(mean(okGroup.map(d => d.ingreso_mensual))) },
        { name: 'En Mora', valor: Math.round(mean(moraGroup.map(d => d.ingreso_mensual))) }
      ],
      score: [
        { name: 'Al día', valor: Math.round(mean(okGroup.map(d => d.score_crediticio))) },
        { name: 'En Mora', valor: Math.round(mean(moraGroup.map(d => d.score_crediticio))) }
      ]
    };
  }, [filteredData]);

  // 3. Scatter Plot Data
  const scatterData = useMemo(() => {
    const okData = filteredData.filter(d => d.mora === 0).map(d => ({
      x: d.ingreso_mensual,
      y: d.monto_credito,
      id: d.id_cliente,
      edad: d.edad,
      score: d.score_crediticio
    }));
    const moraData = filteredData.filter(d => d.mora === 1).map(d => ({
      x: d.ingreso_mensual,
      y: d.monto_credito,
      id: d.id_cliente,
      edad: d.edad,
      score: d.score_crediticio
    }));
    return { okData, moraData };
  }, [filteredData]);

  // 4. Mora rates by categories (Zona and Historial)
  const categoryRates = useMemo(() => {
    // Zona
    const zonas = [...new Set(filteredData.map(d => d.zona))].filter(Boolean);
    const zonaRates = zonas.map(z => {
      const sub = filteredData.filter(d => d.zona === z);
      const moraRate = sub.length > 0 ? (sub.filter(d => d.mora === 1).length / sub.length) * 100 : 0;
      return { name: z, tasa: Math.round(moraRate * 10) / 10 };
    }).sort((a, b) => b.tasa - a.tasa);

    // Historial
    const historiales = [...new Set(filteredData.map(d => d.historial_crediticio))].filter(Boolean);
    const histRates = historiales.map(h => {
      const sub = filteredData.filter(d => d.historial_crediticio === h);
      const moraRate = sub.length > 0 ? (sub.filter(d => d.mora === 1).length / sub.length) * 100 : 0;
      return { name: h, tasa: Math.round(moraRate * 10) / 10 };
    }).sort((a, b) => b.tasa - a.tasa);

    return { zonaRates, histRates };
  }, [filteredData]);

  // 5. Correlation Matrix
  const corrCols = ['edad', 'ingreso_mensual', 'monto_credito', 'cuotas', 'tasa_interes', 'antiguedad_laboral', 'atrasos_previos', 'score_crediticio', 'mora'];
  const colLabels = {
    edad: 'Edad',
    ingreso_mensual: 'Ingreso',
    monto_credito: 'Monto Cred.',
    cuotas: 'Cuotas',
    tasa_interes: 'Tasa Interés',
    antiguedad_laboral: 'Antigüedad Lab.',
    atrasos_previos: 'Atrasos Prev.',
    score_crediticio: 'Score',
    mora: 'Mora'
  };

  const correlationMatrix = useMemo(() => {
    if (filteredData.length === 0) return {};
    return getCorrelationMatrix(filteredData, corrCols);
  }, [filteredData]);

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getHeatmapColor = (val) => {
    // Red for positive, Blue for negative
    if (val === 1) return 'bg-rose-500/90 text-white font-bold';
    if (val > 0.5) return 'bg-rose-500/60 text-white';
    if (val > 0.2) return 'bg-rose-500/30 text-rose-200';
    if (val > -0.2 && val < 0.2) return 'bg-slate-800 text-slate-400';
    if (val < -0.5) return 'bg-blue-600/60 text-white';
    if (val < -0.2) return 'bg-blue-600/30 text-blue-200';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* TABS HEADER */}
      <div className="flex flex-wrap border-b border-slate-700 pb-2 gap-2">
        <button
          onClick={() => setActiveTab('distributions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'distributions'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <TrendingUp size={16} />
          <span>Distribuciones (Polígonos)</span>
        </button>
        <button
          onClick={() => setActiveTab('scatter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'scatter'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <Compass size={16} />
          <span>Ingreso vs Monto</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'categories'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <BarChart2 size={16} />
          <span>Tasa de Mora</span>
        </button>
        <button
          onClick={() => setActiveTab('correlation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'correlation'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <Grid size={16} />
          <span>Matriz de Correlación</span>
        </button>
      </div>

      {/* TABS CONTENT */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <p className="text-lg font-semibold">No hay datos que coincidan con los filtros</p>
          <p className="text-sm">Prueba reiniciando los filtros en el panel izquierdo.</p>
        </div>
      ) : (
        <div className="min-h-[400px]">
          {/* TAB 1: DISTRIBUTIONS */}
          {activeTab === 'distributions' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* EDAD DISTRIBUTION */}
                <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">Polígono de Frecuencias: Edad</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={edadHistogram}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="center" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                          labelFormatter={(value) => `Edad Central: ${value} años`}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="Al día" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2.5} />
                        <Area type="monotone" dataKey="En Mora" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* INGRESO DISTRIBUTION */}
                <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">Polígono de Frecuencias: Ingreso Mensual (miles ARS)</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ingresoHistogram}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="center" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                          labelFormatter={(value) => `Ingreso Central: ${value}k ARS`}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="Al día" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2.5} />
                        <Area type="monotone" dataKey="En Mora" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* BOX PLOT REPLACEMENTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* INGRESO MEDIO */}
                <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">Comparativa de Ingreso Mensual Promedio</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={averagesData.ingreso} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis tickFormatter={(v) => `${v/1000}k`} stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                          formatter={(value) => [formatCurrency(value), 'Ingreso Medio']}
                        />
                        <Bar dataKey="valor">
                          {averagesData.ingreso.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Al día' ? '#10b981' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SCORE MEDIO */}
                <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">Comparativa de Score Crediticio Promedio</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={averagesData.score} barSize={60}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis domain={[300, 800]} stroke="#94a3b8" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                          formatter={(value) => [value, 'Score Medio']}
                        />
                        <Bar dataKey="valor">
                          {averagesData.score.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Al día' ? '#10b981' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCATTER PLOT */}
          {activeTab === 'scatter' && (
            <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
              <h4 className="text-sm font-bold text-slate-300 mb-2">Relación entre Ingresos y Monto Otorgado</h4>
              <p className="text-xs text-slate-400 mb-6">Permite identificar la zona de mayor densidad de clientes en mora (rojo) y al día (verde).</p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Ingreso Mensual" 
                      unit=" ARS" 
                      tickFormatter={(v) => `${v/1000}k`}
                      stroke="#94a3b8"
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Monto Crédito" 
                      unit=" ARS" 
                      tickFormatter={(v) => `${v/1000}k`}
                      stroke="#94a3b8"
                    />
                    <ZAxis range={[60, 60]} />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const name = payload[0].name;
                          return (
                            <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
                              <p className="font-bold text-white mb-1">Cliente ID: {data.id}</p>
                              <p className="text-slate-300"><span className="text-slate-400">Estado:</span> <span className={name === 'En Mora' ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>{name}</span></p>
                              <p className="text-slate-300"><span className="text-slate-400">Ingreso:</span> {formatCurrency(data.x)}</p>
                              <p className="text-slate-300"><span className="text-slate-400">Monto Crédito:</span> {formatCurrency(data.y)}</p>
                              <p className="text-slate-300"><span className="text-slate-400">Score Crediticio:</span> {data.score}</p>
                              <p className="text-slate-300"><span className="text-slate-400">Edad:</span> {data.edad} años</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Scatter name="Al día" data={scatterData.okData} fill="#10b981" />
                    <Scatter name="En Mora" data={scatterData.moraData} fill="#ef4444" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY RATES */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* MORA BY ZONA */}
              <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 mb-4">Tasa de Mora por Zona Geográfica</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryRates.zonaRates} barSize={50}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis unit="%" stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(value) => [`${value}%`, 'Tasa de Mora']}
                      />
                      <Bar dataKey="tasa">
                        {categoryRates.zonaRates.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            // Orange-Red palette gradient
                            fill={entry.tasa > 50 ? '#ef4444' : entry.tasa > 45 ? '#f97316' : '#eab308'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* MORA BY HISTORIAL */}
              <div className="bg-slate-900/40 border border-slate-700/30 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-slate-300 mb-4">Tasa de Mora por Historial Calificado</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryRates.histRates} barSize={50}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis unit="%" stroke="#94a3b8" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(value) => [`${value}%`, 'Tasa de Mora']}
                      />
                      <Bar dataKey="tasa">
                        {categoryRates.histRates.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            // Cool-Warm palette
                            fill={entry.name === 'Bueno' ? '#ef4444' : entry.name === 'Regular' ? '#f97316' : '#10b981'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CORRELATION MATRIX */}
          {activeTab === 'correlation' && (
            <div className="bg-slate-900/40 border border-slate-700/30 p-6 rounded-xl space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-1">Matriz de Correlación de Pearson (Calculada en tiempo real)</h4>
                <p className="text-xs text-slate-400">Coeficiente entre -1.00 (correlación negativa perfecta, azul) y +1.00 (correlación positiva perfecta, rojo).</p>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[650px]">
                  {/* Grid layout for correlation matrix */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-bold text-slate-400 bg-slate-800/50 w-24 border border-slate-700/30"></th>
                        {corrCols.map(col => (
                          <th key={col} className="p-2 text-center text-xs font-bold text-slate-300 bg-slate-800/50 border border-slate-700/30">
                            {colLabels[col]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {corrCols.map(rowCol => (
                        <tr key={rowCol}>
                          <td className="p-2 text-left text-xs font-bold text-slate-300 bg-slate-800/30 border border-slate-700/30">
                            {colLabels[rowCol]}
                          </td>
                          {corrCols.map(colCol => {
                            const val = correlationMatrix[rowCol] ? correlationMatrix[rowCol][colCol] : 0;
                            return (
                              <td 
                                key={colCol} 
                                className={`p-3 text-center text-xs font-medium border border-slate-700/30 transition-all ${getHeatmapColor(val)}`}
                              >
                                {val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
