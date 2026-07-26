import React from 'react';
import { AlertCircle, Target, ArrowRight, ShieldAlert, Sparkles, MapPin, TrendingDown, DollarSign } from 'lucide-react';

export default function InsightsPanel() {
  const findings = [
    {
      title: 'Falla Crítica en el Sistema de Scoring / Historial',
      icon: ShieldAlert,
      badge: 'Grave',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
      points: [
        'Los clientes calificados con historial "Bueno" tienen una tasa de mora real del 54.2%, mientras que aquellos con historial "Malo" registran una mora menor (40.4%). El sistema actual está invertido o mal clasificado.',
        'La diferencia de Score promedio entre clientes al día (593.1) y clientes en mora (574.4) es de apenas 19 puntos, lo que denota una nula capacidad predictiva del score actual.'
      ],
      color: 'border-red-500/30 bg-red-950/10'
    },
    {
      title: 'Atrasos Previos como Indicador Clave de Riesgo',
      icon: TrendingDown,
      badge: 'Clave',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      points: [
        'Los clientes que cayeron en mora promedian 3.1 atrasos previos, frente a 1.9 atrasos de los clientes que se mantienen al día.',
        'Esta variable cuantitativa presenta la correlación más sólida y confiable con el comportamiento de pago futuro del postulante.'
      ],
      color: 'border-orange-500/30 bg-orange-950/10'
    },
    {
      title: 'Presión Financiera por Monto y Tasa de Interés',
      icon: DollarSign,
      badge: 'Medio',
      badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      points: [
        'Los clientes en mora recibieron créditos de mayor monto promedio ($308.7k ARS vs. $273.3k ARS de los que están al día).',
        'Asimismo, la tasa de interés promedio aplicada a los morosos es más alta (51.0% vs. 47.5%), incrementando el costo financiero y asfixiando la capacidad de pago.'
      ],
      color: 'border-yellow-500/30 bg-yellow-950/10'
    },
    {
      title: 'Segmentación Geográfica de Riesgo',
      icon: MapPin,
      badge: 'Alerta',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      points: [
        'La Zona Urbana presenta el peor comportamiento con un 56.2% de mora real.',
        'La Zona Rural sigue con un 50.0% y la Zona Periurbana resulta ser la más estable, aunque con un índice aún elevado del 44.2%.'
      ],
      color: 'border-blue-500/30 bg-blue-950/10'
    }
  ];

  const proposals = [
    {
      action: 'Auditar y Recalibrar el Motor de Scoring',
      details: 'Es urgente reconstruir las reglas de asignación del historial crediticio. Se debe auditar el algoritmo o la base de datos externa para corregir la inversión de la tasa de mora respecto a la calificación.',
      impact: 'Alto',
      impactColor: 'text-emerald-400'
    },
    {
      action: 'Restricción de Montos en Función del Ingreso',
      details: 'Establecer topes de relación cuota-ingreso estricta para montos superiores a $300,000 ARS, evitando sobreendeudar a perfiles con ingresos volátiles o menores a la media de $447k ARS.',
      impact: 'Alto',
      impactColor: 'text-emerald-400'
    },
    {
      action: 'Ponderación de Atrasos Recientes',
      details: 'Modificar el motor de aprobación automática para penalizar fuertemente a postulantes con más de 2 atrasos previos, usando esta variable como filtro duro primario de rechazo.',
      impact: 'Crítico',
      impactColor: 'text-rose-400'
    },
    {
      action: 'Ajuste de Políticas por Zona Geográfica',
      details: 'Reforzar las acciones preventivas de cobro y reducir el monto de la primera oferta de crédito a clientes ubicados en la Zona Urbana (la de mayor índice de mora).',
      impact: 'Medio',
      impactColor: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* FINDINGS PANEL */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-700 pb-4">
          <AlertCircle className="text-red-400" size={22} />
          <span>Hallazgos Clave (Diagnósticos)</span>
        </div>

        <div className="space-y-4">
          {findings.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className={`p-4 rounded-xl border ${f.color} space-y-3`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5">
                      <Icon size={16} className="text-slate-300" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{f.title}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 pl-2 space-y-1.5 leading-relaxed">
                  {f.points.map((pt, pIdx) => (
                    <li key={pIdx} className="marker:text-slate-500">
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROPOSALS PANEL */}
      <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6 flex flex-col">
        <div className="flex items-center gap-2 text-white font-bold text-lg border-b border-slate-700 pb-4">
          <Target className="text-emerald-400" size={22} />
          <span>Propuestas Estratégicas de Mitigación</span>
        </div>

        <div className="flex-1 grid grid-cols-1 gap-4">
          {proposals.map((p, idx) => (
            <div key={idx} className="p-4 bg-slate-900/30 border border-slate-700/30 rounded-xl flex flex-col justify-between hover:border-slate-600/50 transition-all">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/20">
                      {idx + 1}
                    </span>
                    {p.action}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    Impacto: <span className={p.impactColor}>{p.impact}</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-7">
                  {p.details}
                </p>
              </div>
              <div className="flex justify-end mt-2 pt-2 border-t border-slate-800/60 pl-7 text-[10px] text-slate-400 font-semibold items-center gap-1">
                <span>Acción Directiva</span>
                <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex gap-3 items-center">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">Próximo Paso Recomendado</h5>
            <p className="text-[10px] text-slate-400">Auditar las reglas de scoring junto a TI para identificar la inconsistencia del historial crediticio Bueno/Malo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
