import json

with open('vigor-store/anderson_stations.json', encoding='utf-8') as f:
    stations = json.load(f)

for w, list_st in sorted(stations.items(), key=lambda x: int(x[0])):
    print(f"Wilaya {w}:")
    for s in list_st:
        print(f"   name='{s['name']}', commune='{s['commune']}'")
