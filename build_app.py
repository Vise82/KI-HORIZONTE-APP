from pathlib import Path
import shutil,json
root=Path('/Users/victoriasell/Documents/Codex/2026-09-13/ki-horizonte-app')
d=root/'outputs/App_Muster/dist'; src=Path('/Users/victoriasell/.codex/.chatgpt-projects/g-p-6a9d361a3c148191b16106f34c5ec5ba/output')
for name,target in [('assets/Begleitheft_Horizont.png','horizont.png'),('assets/Logo_Original.png','logo.png')]:shutil.copy2(src/name,d/'assets'/target)
for f in (src/'pdf/UNTERRICHT_Musterset_01').glob('*.pdf'):
 if not f.name.startswith('00'):shutil.copy2(f,d/'assets'/f.name)
shutil.copy2(root/'outputs/KI_HORIZONTE_Rueckmeldekarte_A6_4aufA4.pdf',d/'assets/rueckmeldekarten.pdf')
(root/'outputs/App_Muster/.openai/hosting.json').write_text(json.dumps({'static':{'directory':'dist'}}))
