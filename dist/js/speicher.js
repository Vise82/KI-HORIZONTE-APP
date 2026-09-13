'use strict';
const $=s=>document.querySelector(s), key='ki-horizonte-app-v2';
const baseFields={titel:'Titel meines Vorhabens',ausgangspunkt:'Mein Ausgangspunkt',fokus:'Das möchte ich verbessern',entscheidung:'Dafür entscheide ich mich',pruefung:'Das hat die Prüfung gezeigt',fassung:'Diese Fassung nehme ich mit',einsatz:'Mein nächster Einsatz'};
const fields={...baseFields};
for(const mod of Object.values(MODULES))for(const step of mod.steps)fields[mod.id+'__'+step.id]=mod.title+' · '+step.title;
let state={format:'ki-horizonte',version:2,updatedAt:null,materials:[],materialNotes:{},fields:Object.fromEntries(Object.keys(fields).map(k=>[k,'']))},localOK=true,lastExport=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validateMaterial(o){
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
try{const saved=(localStorage.getItem(key)||localStorage.getItem('ki-horizonte-muster-v1'));if(saved)state=validate(JSON.parse(saved));}catch{localOK=false;}
function notify(s){$('#status').textContent=s;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#status').textContent='',7000)}
function hasNotes(){return [...Object.values(state.fields),...Object.values(state.materialNotes)].some(v=>v.trim())}
function storageText(){return localOK?'Auf diesem Gerät zwischengespeichert. Für eine unabhängige Sicherung bitte eine Arbeitsdatei herunterladen.':'Der Browser kann hier nicht zuverlässig zwischenspeichern. Bitte deine Arbeitsdatei vor dem Schließen herunterladen.'}
function save(){state.updatedAt=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(state));localOK=true}catch{localOK=false}document.querySelectorAll('.saved-note').forEach(e=>e.textContent=storageText())}
function download(name,text,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}
function exportFile(){download('KI_HORIZONTE_Arbeitsstand_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state,null,2),'application/json');lastExport=state.updatedAt;notify('Download angestoßen. Bitte prüfe, ob die Arbeitsdatei in deiner Dateien-App gespeichert wurde.');}
function notesEntries(){return [...Object.entries(fields).filter(([k])=>state.fields[k].trim()).map(([k,label])=>({label,value:state.fields[k]})),...state.materials.filter(m=>state.materialNotes[m.id]?.trim()).map(m=>({label:MODULES[m.module].title+' · '+m.title,value:state.materialNotes[m.id]}))];}
function exportText(){download('KI_HORIZONTE_Meine_Notizen.txt','KI HORIZONTE · Meine Notizen\n\n'+notesEntries().map(n=>n.label+'\n'+n.value).join('\n\n'),'text/plain;charset=utf-8')}
