import os
import json
import pandas as pd

def export_data():
    excel_path = 'data/raw/fintech_base_150_registros.xlsx'
    
    if not os.path.exists(excel_path):
        print(f"Error: No se encontró el archivo {excel_path}")
        return
        
    print(f"Leyendo datos desde {excel_path}...")
    df = pd.read_excel(excel_path)
    
    # Limpieza e igualación con notebook
    df = df.drop_duplicates()
    
    for col in ['nivel_educativo', 'zona', 'historial_crediticio']:
        df[col] = df[col].astype(str).str.strip().str.capitalize()
        
    df['estado_cliente'] = df['mora'].map({0: 'Al día', 1: 'En Mora'})
    
    # Asegurar tipos correctos para JSON
    data_dict = df.to_dict(orient='records')
    
    # Crear carpeta processed si no existe
    os.makedirs('data/processed', exist_ok=True)
    
    processed_path = 'data/processed/clients.json'
    with open(processed_path, 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, ensure_ascii=False, indent=2)
        
    print(f"Datos exportados exitosamente a {processed_path} ({len(data_dict)} registros)")

    # También escribir en frontend/src/data/clients.json
    frontend_data_dir = 'frontend/src/data'
    os.makedirs(frontend_data_dir, exist_ok=True)
    frontend_processed_path = os.path.join(frontend_data_dir, 'clients.json')
    with open(frontend_processed_path, 'w', encoding='utf-8') as f:
        json.dump(data_dict, f, ensure_ascii=False, indent=2)
    print(f"Datos exportados exitosamente a {frontend_processed_path}")

if __name__ == "__main__":
    export_data()
