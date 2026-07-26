import React from 'react';
import { Users, AlertTriangle, Landmark, CreditCard, Award } from 'lucide-react';
import { mean } from '../utils/statistics';

export default function KPICards({ filteredData, totalCount }) {
  const count = filteredData.length;
  
  // Calculations
  const moraCount = filteredData.filter(d => d.mora === 1).length;
  const moraRate = count > 0 ? (moraCount / count) * 100 : 0;
  
  const avgIncome = mean(filteredData.map(d => d.ingreso_mensual));
  const avgCredit = mean(filteredData.map(d => d.monto_credito));
  const avgScore = mean(filteredData.map(d => d.score_crediticio));

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const cards = [
    {
      title: 'Clientes Filtrados',
      value: `${count} / ${totalCount}`,
      subtitle: 'Total de la muestra seleccionada',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Tasa de Mora',
      value: `${moraRate.toFixed(1)}%`,
      subtitle: `${moraCount} clientes en mora`,
      icon: AlertTriangle,
      color: moraRate > 50 
        ? 'from-red-500/20 to-orange-500/10 border-red-500/30 text-red-400' 
        : 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Ingreso Promedio',
      value: formatCurrency(avgIncome),
      subtitle: 'Ingreso mensual neto promedio',
      icon: Landmark,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    },
    {
      title: 'Crédito Promedio',
      value: formatCurrency(avgCredit),
      subtitle: 'Monto de microcrédito otorgado',
      icon: CreditCard,
      color: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-400',
    },
    {
      title: 'Score Promedio',
      value: Math.round(avgScore).toString(),
      subtitle: 'Rango de score: 300 - 850',
      icon: Award,
      color: avgScore > 600
        ? 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400'
        : 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div 
            key={idx} 
            className={`p-5 rounded-2xl border bg-gradient-to-br ${card.color} shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                  {card.value}
                </h3>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/40 border border-white/5">
                <Icon size={20} />
              </div>
            </div>
            <p className="text-xs opacity-60 font-medium">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}
