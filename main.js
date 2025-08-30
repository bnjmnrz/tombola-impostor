// Lista interna de jugadores famosos (se elige 1 al azar por ronda)
const JUGADORES = [
  "Messi","Cristiano Ronaldo","Neymar","Mbappé","Haaland","Vinícius Jr.","Jude Bellingham","De Bruyne","Modrić","Griezmann",
  "Lewandowski","Salah","Kane","Suárez","Di María","Lautaro Martínez","Pedri","Gavi","Alexis Sánchez","Arturo Vidal",
  "Ronaldo Nazário","Zlatan Ibrahimović","Sergio Ramos","Lamine Yamal","Dibu Martínez","Riquelme","Maradona","Tevez",
  "Benzema","Iniesta","Kun Agüero","Thierry Henry","Ronaldinho","Kaká","Julián Álvarez","Enzo Fernández","Buffon","Iker Casillas",
  "Neuer","Kahn","Gerard Piqué","Roberto Carlos","Zidane","Maldini","Xavi","Busquets","David Beckham","Andrea Pirlo","Del Piero",
  "Francesco Totti","Raúl","Fernando Torres","Didier Drogba","Samuel Eto'o","Clarence Seedorf","Patrick Vieira","Frank Lampard",
  "Steven Gerrard","Pavel Nedvěd","George Weah","Rivaldo","Cafú","Marcelo","Dani Alves","Philipp Lahm","Arjen Robben","Franck Ribéry",
  "Thomas Müller","Wayne Rooney","Michael Owen","Ruud van Nistelrooy","Edinson Cavani",
  "Diego Forlán","Juan Sebastián Verón","Pablo Aimar","Chilavert","Iván Zamorano","Carlos Valderrama","James Rodríguez","Radamel Falcao",
  "Robin van Persie","Rodri","Phil Foden","Bukayo Saka","Declan Rice","Kai Havertz","Jamal Musiala","Florian Wirtz","Joško Gvardiol",
  "Alejandro Garnacho","Lisandro Martínez","Cristian Romero","Giovani Lo Celso","Nicolás Otamendi","Federico Valverde","Darwin Núñez",
  "Luis Díaz","Khvicha Kvaratskhelia","Victor Osimhen","Aurélien Tchouaméni","Eduardo Camavinga","Marcus Rashford",
  "João Félix","Bruno Fernandes","Bernardo Silva","Achraf Hakimi","Álvaro Morata","Aymeric Laporte","Raphaël Varane","Theo Hernández",
  "Lucas Hernández","Kingsley Coman","Serge Gnabry","Ilkay Gündoğan","Ángel Correa","Rodrigo De Paul","Leandro Paredes","Jan Oblak",
  "Wojciech Szczęsny"


];

const playersDiv = document.getElementById('players');
const generarBtn = document.getElementById('btn-generar');
const infoRonda = document.getElementById('info-ronda');

const overlay = document.getElementById('overlay');
const roleTag = document.getElementById('roleTag');
const btnOcultar = document.getElementById('btn-ocultar');
const modalHint = document.getElementById('modalHint');

let roles = []; // roles barajados para la ronda
let visto = []; // quién ya vio su papel
let timeoutId = null;

function nombreJugadorAzar(){
  return JUGADORES[Math.floor(Math.random() * JUGADORES.length)];
}

function fisherYatesShuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generarTombola(){
  const n = parseInt(document.getElementById('jugadores').value, 10);
  if(isNaN(n) || n < 3 || n > 30){
    alert('Ingresa un número entre 3 y 30');
    return;
  }

  const jugadorElegido = nombreJugadorAzar(); // PRIVADO: no se muestra en la página

  roles = new Array(n - 1).fill(jugadorElegido).concat(['IMPOSTOR']);
  fisherYatesShuffle(roles); // baraja justa (evita sesgos y posiciones fijas)

  visto = new Array(n).fill(false);

  // Render de botones de jugadores
  playersDiv.innerHTML = '';
  for(let i=0;i<n;i++){
    const b = document.createElement('button');
    b.className = 'player-btn';
    b.textContent = `Jugador ${i+1}`;
    b.setAttribute('aria-label', `Ver papel del Jugador ${i+1}`);
    b.addEventListener('click', () => mostrarPapel(i, b));
    playersDiv.appendChild(b);
  }

  infoRonda.classList.remove('hidden');
}

function mostrarOverlay(texto, esImpostor){
  roleTag.textContent = texto;
  roleTag.className = 'tag ' + (esImpostor ? 'tag-red' : 'tag-green');
  overlay.style.display = 'flex';

  // Auto-ocultar en 4 segundos por privacidad
  clearTimeout(timeoutId);
  timeoutId = setTimeout(ocultarOverlay, 4000);
}

function ocultarOverlay(){
  overlay.style.display = 'none';
}

function mostrarPapel(idx, btn){
  if(visto[idx]){ return; }
  const miRol = roles[idx];
  const esImpostor = miRol === 'IMPOSTOR';
  // Mostrar SOLO en modal (no se escribe en la página)
  mostrarOverlay(esImpostor ? 'IMPOSTOR' : miRol, esImpostor);
  visto[idx] = true;
  btn.textContent = `Jugador ${idx+1} ✓`;
  btn.disabled = true;

  // Si todos ya vieron, ofrecer reiniciar
  if(visto.every(Boolean)){
    const end = document.createElement('div');
    end.style.marginTop = '12px';
    const again = document.createElement('button');
    again.textContent = 'Nueva ronda';
    again.className = 'btn';
    again.addEventListener('click', generarTombola);
    end.appendChild(again);
    playersDiv.appendChild(end);
  }
}

generarBtn.addEventListener('click', generarTombola);
btnOcultar.addEventListener('click', ocultarOverlay);

// Atajos de accesibilidad/privacidad
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && overlay.style.display === 'flex') ocultarOverlay();
});
