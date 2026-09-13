const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const dir=path.resolve('outputs/App_Muster/dist');
let saved={},downloads=[],handlers={},registered;
const nodes={};const node=s=>nodes[s]??={innerHTML:'',textContent:'',focus(){},scrollIntoView(){},append(){},remove(){},click(){if(this.download)downloads.push(this.download)}};
const context={console,Date,Object,JSON,String,Number,Error,SyntaxError,Promise,Blob,setTimeout:()=>1,clearTimeout(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},navigator:{},location:{hash:''},localStorage:{getItem:k=>saved[k],setItem:(k,v)=>saved[k]=v},window:{addEventListener(){},scrollTo(){},print(){}},document:{querySelector:node,querySelectorAll:()=>[],addEventListener:(e,fn)=>handlers[e]=fn,createElement:()=>node('download'),body:{append(){}},modelContext:{registerTool:t=>registered=t}}};
vm.createContext(context);vm.runInContext(fs.readFileSync(dir+'/app.js','utf8'),context);
assert(node('#main').innerHTML.includes('Ideenwerft'));
vm.runInContext("state.fields.titel='Probe';state.fields.fokus='Prüfen & verbessern';save();exportFile();",context);
assert(downloads[0].endsWith('.json'));assert(Object.values(saved)[0].includes('Prüfen & verbessern'));
assert.equal(vm.runInContext("validate(JSON.parse(JSON.stringify(state))).fields.titel",context),'Probe');
for(const bad of ['null','{}',"{format:'ki-horizonte',version:99,fields:{}}"]){assert.throws(()=>vm.runInContext('validate('+bad+')',context))}
vm.runInContext("state.fields.titel='<img src=x onerror=alert(1)>';",context);assert(vm.runInContext('storage()',context).includes('&lt;img'));
for(const route of ['start','unterricht','speicher','orientierung','coaches','lernen','pruefen','schulentwicklung']){context.location.hash='#'+route;vm.runInContext('render()',context);assert(node('#main').innerHTML.length>150);for(const m of node('#main').innerHTML.matchAll(/(?:href|src)="(assets\/[^"]+)"/g))assert(fs.existsSync(path.join(dir,m[1])),m[1]);}
(async()=>{context.location.hash='#speicher';vm.runInContext('render()',context);const payload=vm.runInContext('JSON.stringify(state)',context);await handlers.change({target:{id:'import',files:[{size:payload.length,text:async()=>payload}],value:'x'}});assert(node('#import-preview').innerHTML.includes('Arbeitsstand übernehmen'));node('#apply-import').onclick();assert(node('#status').textContent.includes('übernommen'));registered.execute({view:'unterricht'});assert.equal(context.location.hash,'unterricht');assert.throws(()=>registered.execute({view:'bad'}));console.log('PASS: eight views; asset links; escaping; persistence serialization; export trigger; import confirmation; invalid file rejection; navigation tool logic. Browser/device validation remains open.');})();
