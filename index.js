const list = document.getElementById('noteList');
const newBtn = document.getElementById('newNote');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function getNotes(){ return JSON.parse(localStorage.getItem('notes')||'[]'); }
function setNotes(n){ localStorage.setItem('notes', JSON.stringify(n)); }

function formatDate(dateStr){
  try{
    if(/[0-9]{1,2}\s+\D+\s+[0-9]{4}/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if(!isNaN(d)) return d.toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' });
  }catch(e){}
  const d2 = new Date();
  return d2.toLocaleDateString('it-IT', { day:'numeric', month:'long', year:'numeric' });
}

function render(){
  const notes = getNotes();
  list.innerHTML = '';
  notes.forEach((n,i)=>{
    const item = document.createElement('div');
    item.className = 'noteItem';

    const row = document.createElement('div');
    row.className = 'row';

    const t = document.createElement('div');
    t.className = 'title';
    t.textContent = n.title || 'Senza titolo';

    const d = document.createElement('div');
    d.className = 'date';
    d.textContent = formatDate(n.date || '');

    row.appendChild(t);
    row.appendChild(d);

    item.appendChild(row);
    item.addEventListener('click', ()=>{
      localStorage.setItem('currentNote', i);
      location.href = 'note.html';
    });
    list.appendChild(item);
  });
}
render();

// Nuova nota
newBtn.addEventListener('click', ()=>{
  localStorage.removeItem('currentNote');
  location.href = 'note.html';
});


// Importa archivio .json (sostituisce TUTTE le note, previa conferma)
importBtn.addEventListener('click', ()=> importFile.click());
importFile.addEventListener('change', async (e)=>{
  const file = e.target.files && e.target.files[0];
  if(!file) return;
  if(!/\.json$/i.test(file.name)) {
    alert('Seleziona un file .json esportato dal diario.');
    e.target.value = '';
    return;
  }
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if(!Array.isArray(data)) throw new Error('Formato non valido');
    // Validazione minima degli oggetti
    const cleaned = data.map(n => ({
      title: typeof n.title === 'string' ? n.title : '',
      content: typeof n.content === 'string' ? n.content : '',
      date: typeof n.date === 'string' ? n.date : ''
    }));
    const ok = confirm('Importare questo archivio e SOSTITUIRE tutte le note esistenti?');
    if(!ok){ e.target.value=''; return; }
    setNotes(cleaned);
    render();
    alert('Import completato!');
  } catch(err){
    console.error(err);
    alert('File .json non valido.');
  } finally {
    e.target.value = '';
  }
});


// Esporta tutte le note in JSON
exportBtn.addEventListener('click', ()=>{
  const notes = getNotes();
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'diario-notes.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

// Tema
function setTheme(theme){
  if(theme==='dark'){
    document.body.classList.add('dark');
    themeIcon.firstElementChild.setAttribute('href', '#i-sun');
  } else {
    document.body.classList.remove('dark');
    themeIcon.firstElementChild.setAttribute('href', '#i-moon');
  }
  localStorage.setItem('theme', theme);
}
const saved = localStorage.getItem('theme') || 'light';
setTheme(saved);
themeToggle.addEventListener('click', ()=>{
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});
