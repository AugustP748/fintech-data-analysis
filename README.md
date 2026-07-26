# Gestión de Riesgo Crediticio - Fintech del Norte Argentino

Este proyecto consiste en un análisis de datos y una herramienta interactiva desarrollados para abordar e identificar las causas del incremento en la tasa de mora de una empresa fintech de microcréditos en el norte argentino durante el último semestre.

El proyecto se divide en dos componentes principales:
1. **Análisis Exploratorio de Datos (EDA)**: Un notebook en Python que realiza un diagnóstico estadístico y formula conclusiones estratégicas.
2. **Dashboard Interactivo**: Una aplicación web en React y Tailwind CSS para que el directorio de la fintech pueda explorar visualmente el comportamiento de los clientes y evaluar políticas de riesgo en tiempo real.

---

## Estructura del Repositorio

```text
├── data/
│   ├── raw/
│   │   └── fintech_base_150_registros.xlsx   # Base de datos original
│   └── processed/
│       └── clients.json                      # Datos procesados exportados para el dashboard
├── env/                                      # Entorno virtual de Python
├── frontend/                                 # Código fuente de la aplicación React (Vite)
│   ├── src/
│   │   ├── components/                       # Componentes del dashboard (Filtros, Gráficos, Tabla)
│   │   ├── data/
│   │   │   └── clients.json                  # Copia activa de datos para el frontend
│   │   ├── utils/
│   │   │   └── statistics.js                 # Funciones estadísticas (histogramas y correlación)
│   │   ├── App.jsx                           # Componente raíz y estado global
│   │   └── index.css                         # Estilos y configuración de Tailwind CSS v4
│   └── index.html                            # Punto de entrada HTML
├── scripts/
│   └── export_data.py                        # Script de extracción y limpieza de datos (Excel -> JSON)
├── notebook.ipynb                            # Análisis Exploratorio de Datos en Jupyter
└── requirements.txt                          # Dependencias de Python
```

---

## 🛠️ Cómo Iniciar y Ejecutar el Proyecto

### 1. Requisitos Previos
* **Python 3.10+**
* **Node.js 18+** e **npm**

---

### 2. Ejecutar el Procesamiento de Datos (Python)
Si realizas modificaciones en la base de datos Excel (`fintech_base_150_registros.xlsx`) o deseas volver a procesar los datos limpios:

1. **Activa el entorno virtual de Python**:
   ```bash
   source env/bin/activate
   ```
2. **Ejecuta el script de exportación**:
   ```bash
   python3 scripts/export_data.py
   ```
   *Esto actualizará automáticamente los archivos JSON en `data/processed/` y `frontend/src/data/`.*

---

### 3. Iniciar el Dashboard Interactivo (React)
Para ejecutar la interfaz del dashboard en tu entorno de desarrollo local:

1. **Navega a la carpeta del frontend**:
   ```bash
   cd frontend
   ```
2. **Instala las dependencias de Node** (si es la primera vez):
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo local**:
   ```bash
   npm run dev
   ```
4. **Prueba el dashboard**: Abre tu navegador y accede a la dirección indicada en la consola (usualmente [http://localhost:5173](http://localhost:5173)).

---

## 📊 Diagnóstico y Resumen de Hallazgos Clave (del EDA)

El análisis exploratorio en `notebook.ipynb` reveló los siguientes puntos críticos que requieren atención inmediata de la dirección:

1. **Inconsistencia de Calificación**: Los clientes etiquetados con historial crediticio **"Bueno"** tienen una tasa de mora real del **54.2%**, mientras que aquellos con historial **"Malo"** registran un **40.4%**. El motor de clasificación tradicional está fallando o invertido.
2. **Atrasos Previos**: Los clientes que terminaron en mora promedian **3.1 atrasos anteriores**, comparado con **1.9** de los clientes al día. Esta es la variable cuantitativa con mayor correlación directa hacia la mora futura.
3. **Monto y Tasa de Interés**: Los clientes morosos recibieron montos significativamente más altos en promedio ($308,653 ARS vs. $273,325 ARS) y con tasas de interés más altas (51.0% vs. 47.5%), incrementando la asfixia financiera de los perfiles.
4. **Zona Urbana**: Es la región de mayor incumplimiento con un **56.2%** de tasa de mora real.
