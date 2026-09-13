from pathlib import Path
import json,shutil,re
p=Path('outputs/App_02/dist');src=Path('/Users/victoriasell/.codex/.chatgpt-projects/g-p-6a9d361a3c148191b16106f34c5ec5ba/output')
shutil.copy2(src/'pdf/KI_HORIZONTE_Beschilderung_Final_03.pdf',p/'assets/material/beschilderung-final-03.pdf')
# Single content file per area; loaded as ordinary scripts so local opening needs no fetch/module server.
data=json.loads((p/'inhalte/bereiche.js').read_text().removeprefix('const MODULES = ').strip().removesuffix(';'))
(p/'inhalte/basis.js').write_text('const MODULES = Object.create(null);\n')
for name,ids in {'pruefen':['pruefen-a','pruefen-b','pruefen-c'],'lernen':['lernen-verstehen','lernen-verbessern','lernen-ueben'],'schulentwicklung':['momentaufnahme','zukunftsatelier','logbuch','coach-reflexion','rueckmeldung'],'selbstlernen':['selbstlernen']}.items():
 (p/f'inhalte/{name}.js').write_text('Object.assign(MODULES, '+json.dumps({i:data[i] for i in ids},ensure_ascii=False,indent=2)+');\n')
(p/'inhalte/bereiche.js').unlink()
# Extract supported original prompt content from core into own source.
core=(p/'js/speicher.js').read_text();prompt=core[core.index('const prompts='):];core=core[:core.index('const prompts=')]
(p/'inhalte/unterricht.js').write_text(prompt)
# Separate utilities / UI field renderer from storage.
a=core.index('function area(');area=core[a:];core=core[:a]
(p/'js/felder.js').write_text(area)
core=core.replace("key='ki-horizonte-muster-v1'","key='ki-horizonte-app-v2'")
core=core.replace('const fields={','const baseFields={',1)
pos=core.index('let state=')
core=core[:pos]+"const fields={...baseFields};\nfor(const mod of Object.values(MODULES))for(const step of mod.steps)fields[mod.id+'__'+step.id]=mod.title+' · '+step.title;\n"+core[pos:]
core=core.replace("version:1,updatedAt:null,fields:","version:2,updatedAt:null,materials:[],materialNotes:{},fields:",1)
a=core.index('function validate(');b=core.index('try{const saved=',a)
core=core[:a]+'''function validateMaterial(o){
 if(!o||o.format!=='ki-horizonte-material'||o.version!==1||!/^C0[234]_0[2-6]$/.test(o.id)||!Object.hasOwn(MODULES,o.module)||!o.module.startsWith('lernen-')||typeof o.title!=='string'||o.title.length>150||typeof o.body!=='string'||o.body.length>50000)throw Error('Keine passende Materialdatei.');
 const map={C02:'lernen-verstehen',C03:'lernen-verbessern',C04:'lernen-ueben'};if(map[o.id.slice(0,3)]!==o.module)throw Error('Material und Arbeitsweg passen nicht zusammen.');
 return {format:o.format,version:1,id:o.id,module:o.module,title:o.title,body:o.body};
}
function validate(o){
 if(!o||o.format!=='ki-horizonte'||![1,2].includes(o.version)||!o.fields||typeof o.fields!=='object')throw Error('Keine passende KI-HORIZONTE-Arbeitsdatei.');
 const required=o.version===1?baseFields:fields;
 if(Object.keys(required).some(k=>typeof o.fields[k]!=='string'||o.fields[k].length>20000))throw Error('Die Notizen in dieser Datei sind unvollständig oder ungültig.');
 const materials=(o.materials??[]);if(!Array.isArray(materials)||materials.length>30)throw Error('Ungültiger Materialbestand.');
 const checked=materials.map(validateMaterial);if(new Set(checked.map(m=>m.id)).size!==checked.length)throw Error('Doppeltes Material in der Datei.');
 const materialNotes=Object.create(null);for(const m of checked){const val=o.materialNotes?.[m.id]??'';if(typeof val!=='string'||val.length>20000)throw Error('Ungültige Materialnotiz.');materialNotes[m.id]=val;}
 return {format:'ki-horizonte',version:2,updatedAt:typeof o.updatedAt==='string'?o.updatedAt:null,fields:Object.fromEntries(Object.keys(fields).map(k=>[k,o.fields[k]??''])),materials:checked,materialNotes};
}
''' + core[b:]
core=core.replace("localStorage.getItem(key)","(localStorage.getItem(key)||localStorage.getItem('ki-horizonte-muster-v1'))")
core=core.replace("Object.values(state.fields).some(v=>v.trim())","[...Object.values(state.fields),...Object.values(state.materialNotes)].some(v=>v.trim())")
a=core.index('function exportText(')
core=core[:a]+'''function notesEntries(){return [...Object.entries(fields).filter(([k])=>state.fields[k].trim()).map(([k,label])=>({label,value:state.fields[k]})),...state.materials.filter(m=>state.materialNotes[m.id]?.trim()).map(m=>({label:MODULES[m.module].title+' · '+m.title,value:state.materialNotes[m.id]}))];}
function exportText(){download('KI_HORIZONTE_Meine_Notizen.txt','KI HORIZONTE · Meine Notizen\\n\\n'+notesEntries().map(n=>n.label+'\\n'+n.value).join('\\n\\n'),'text/plain;charset=utf-8')}
'''
(p/'js/speicher.js').write_text(core)
# Apply central shell source dependencies.
f=p/'index.html';s=f.read_text().replace('App-Muster · UNTERRICHT ist zum Erproben geöffnet. Weitere Arbeitswege folgen nach der Musterprüfung.','Arbeitsfassung · Papier oder App: Du entscheidest. Persönliche Notizen sind freiwillig.')
scripts=['inhalte/basis.js','inhalte/unterricht.js','inhalte/pruefen.js','inhalte/lernen.js','inhalte/schulentwicklung.js','inhalte/selbstlernen.js','inhalte/organisation.js','js/speicher.js','js/felder.js','js/start.js','js/unterricht.js','js/storage.js','js/orientation.js','js/coaches.js','js/learning.js','js/examining.js','js/school.js','js/arbeitswege.js','js/navigation.js']
s=s.replace('<script src="app.js"></script>',''.join('<script src="'+v+'"></script>\n' for v in scripts));f.write_text(s)
(p/'inhalte/organisation.js').write_text('const ORGANISATION = '+json.dumps({'rooms':[['A1','Entdeckerraum','LERNEN · gemeinsamer Einstieg',''],['A3','Denkexpedition','LERNEN',''],['A2','Ideenwerft','UNTERRICHT',''],['B1','Weitblick','PRÜFEN',''],['B2','Perspektivwechsel','PRÜFEN',''],['C','Zukunftsatelier','SCHULENTWICKLUNG',''],['','Selbstlernen','Funktionsraum',''],['','Organisationsteam','Funktionsraum','']],'phases':[{'title':t,'time':''} for t in ['Ankommen & gemeinsames Frühstück','Gemeinsamer Auftakt','Offene Horizontzeit','Gemeinsames Mittagessen','Weiterarbeiten & Fertigstellen · parallel Schulentwicklung','KI-HORIZONTE-Marktplatz','Gemeinsamer Abschluss']],'coaches':[]},ensure_ascii=False,indent=2)+';\n')
s=(p/'js/start.js').read_text().replace('Einstieg und Begleitung ansehen','Lernen erkunden').replace('Orientierung ansehen','Arbeitsweg wählen').replace('Der Selbstlernkurs wird in der vollständigen App hier ergänzt.','Das Begleitheft steht dir in jedem Horizont zur Verfügung.').replace('<a href="#coaches">Unterstützung finden</a>','<a href="#selbstlernen">Zum Selbstlernen</a>');(p/'js/start.js').write_text(s)
