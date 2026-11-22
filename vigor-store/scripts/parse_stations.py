import re
import json
from pypdf import PdfReader

reader = PdfReader('vigor-store/docs/anderson_bureaux.pdf')
full_text = ''
for page in reader.pages:
    full_text += page.extract_text() + '\n'

pattern = re.compile(r'(\b\d{1,2}\b)\s*\n(\d{2}\s*[-–]\s*[Ss]tation[^\n]+)\n([^\n]+)\n', re.MULTILINE)
matches = list(pattern.finditer(full_text))

stations_by_wilaya = {}

for m in matches:
    w_code = int(m.group(1))
    title = m.group(2).strip().rstrip(',')
    loc = m.group(3).strip()
    
    parts = [p.strip() for p in loc.split(',')]
    wilaya_name = parts[0] if len(parts) > 0 else ''
    commune_name = parts[1] if len(parts) > 1 else wilaya_name
    
    clean_name = re.sub(r'^\d{2}\s*[-–]\s*[Ss]tation\s*', '', title, flags=re.IGNORECASE).strip().rstrip(',')
    if not clean_name:
        clean_name = commune_name
        
    if w_code not in stations_by_wilaya:
        stations_by_wilaya[w_code] = []
        
    stations_by_wilaya[w_code].append({
        'name': clean_name,
        'commune': commune_name
    })

# Also handle wilaya 10 (Bouira) from page 1 which had Lakhdaria
if 10 in stations_by_wilaya:
    lakhdaria_exists = any('Lakhdaria' in s['name'] or 'Lakhdaria' in s['commune'] for s in stations_by_wilaya[10])
    if not lakhdaria_exists:
        stations_by_wilaya[10].append({'name': 'Lakhdaria', 'commune': 'Lakhdaria'})

output_path = 'vigor-store/anderson_stations.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(stations_by_wilaya, f, ensure_ascii=False, indent=2)

print(f'Successfully exported {len(matches)} stations across {len(stations_by_wilaya)} wilayas to {output_path}')
