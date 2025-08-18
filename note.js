const editor = document.getElementById('editor');
const titleEl = document.getElementById('noteTitle');
const backBtn = document.getElementById('backBtn');
const deleteBtn = document.getElementById('deleteBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const overlay = document.getElementById('confirmOverlay');
const yesBtn = document.getElementById('confirmYes');
const noBtn = document.getElementById('confirmNo');

function getNotes(){ return JSON.parse(localStorage.getItem('notes')||'[]'); }
function setNotes(n){ localStorage.setItem('notes', JSON.stringify(n)); }

let notes = getNotes();
let idx = localStorage.getItem('currentNote');

if(idx !== null){
  const n = notes[idx];
  titleEl.value = n?.title || '';
  editor.value = n?.content || '';
}else{
  // Nuova nota senza data precompilata nel testo
  const now = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateStr = now.toLocaleDateString('it-IT', options);
  notes.push({ title:'', content:'', date: dateStr });
  idx = String(notes.length-1);
  localStorage.setItem('currentNote', idx);
  setNotes(notes);
}

// Autosave
function autosave(){
  const content = editor.value;
  const title = titleEl.value || content.split('\n')[0] || 'Senza titolo';
  if(idx !== null){
    if(!notes[idx].date){
      const now = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      notes[idx].date = now.toLocaleDateString('it-IT', options);
    }
    notes[idx].title = title;
    notes[idx].content = content;
  }
  setNotes(notes);
}
editor.addEventListener('input', autosave);
titleEl.addEventListener('input', autosave);

// Back
backBtn.addEventListener('click', ()=> location.href='index.html');

// Delete (with banner confirmation)
deleteBtn.addEventListener('click', ()=> overlay.classList.remove('hidden'));
noBtn.addEventListener('click', ()=> overlay.classList.add('hidden'));
yesBtn.addEventListener('click', ()=> {
  if(idx === null) { overlay.classList.add('hidden'); return; }
  const i = Number(idx);
  const arr = getNotes();
  if(i >=0 && i < arr.length){
    arr.splice(i,1);
    setNotes(arr);
  }
  localStorage.removeItem('currentNote');
  overlay.classList.add('hidden');
  location.href = 'index.html';
});

// Theme
function setTheme(theme){
  if(theme==='dark'){ document.body.classList.add('dark'); themeIcon.firstElementChild.setAttribute('href', '#i-sun'); }
  else { document.body.classList.remove('dark'); themeIcon.firstElementChild.setAttribute('href', '#i-moon'); }
  localStorage.setItem('theme', theme);
}
const saved = localStorage.getItem('theme') || 'light';
setTheme(saved);
themeToggle.addEventListener('click', ()=>{
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});
