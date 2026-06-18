// BrainLevel - COMPLETE FINAL VERSION v2.0
// 100+ Levels, All Bugs Fixed, Background Music, Professional

// ========================
// BACKGROUND MUSIC
// ========================
let bgMusicCtx = null;
let bgMusicPlaying = false;
let bgNoteTimer = null;

function initBgMusic() {
  try {
    bgMusicCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (GameState.settings.music) startBgMusic();
  } catch(e) {}
}

function startBgMusic() {
  if (!bgMusicCtx || !GameState.settings.music) return;
  bgMusicPlaying = true;
  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66];
  let i = 0;
  function playNote() {
    if (!bgMusicPlaying) return;
    try {
      if (bgMusicCtx.state === 'suspended') bgMusicCtx.resume();
      const osc = bgMusicCtx.createOscillator();
      const gain = bgMusicCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[i % notes.length];
      gain.gain.setValueAtTime(0, bgMusicCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, bgMusicCtx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0, bgMusicCtx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(bgMusicCtx.destination);
      osc.start();
      osc.stop(bgMusicCtx.currentTime + 0.8);
      i++;
    } catch(e) {}
    bgNoteTimer = setTimeout(playNote, 500);
  }
  playNote();
}

function stopBgMusic() {
  bgMusicPlaying = false;
  if (bgNoteTimer) clearTimeout(bgNoteTimer);
}

// ========================
// SOUND FX
// ========================
let sfxCtx = null;
function playSound(freq, type, dur) {
  if (!GameState.settings.sound) return;
  freq = freq || 440; type = type || 'sine'; dur = dur || 0.1;
  try {
    if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    const o = sfxCtx.createOscillator();
    const g = sfxCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, sfxCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + dur);
    o.connect(g); g.connect(sfxCtx.destination);
    o.start(); o.stop(sfxCtx.currentTime + dur);
  } catch(e) {}
}

// ========================
// 110 LEVELS GENERATOR
// ========================
function makeLevels() {
  const L = [];

  // Types: color, lock, bomb, rainbow, mixed
  // Easy 1-30
  for (let i = 0; i < 30; i++) {
    const n = i + 1;
    const colors = [1,2,3,4,5];
    const c1 = colors[i%5], c2 = colors[(i+1)%5];
    let grid;
    if (i < 10) {
      grid = [[c1,c2,c1,c2],[c2,c1,c2,c1],[c1,c2,c1,c2],[c2,c1,c2,c1]];
    } else if (i < 20) {
      const c3 = colors[(i+2)%5];
      grid = [[c1,c1,c2,c2],[c2,c2,c1,c1],[c1,c3,c3,c1],[c3,c1,c1,c3]];
    } else {
      const c3 = colors[(i+2)%5], c4 = colors[(i+3)%5];
      grid = [[c1,c2,c3,c4],[c4,c3,c2,c1],[c2,c1,c4,c3],[c3,c4,c1,c2]];
    }
    L.push({id:n, difficulty:'easy', moves:15+Math.floor(i/5), time:70+(i*3), target:10+(i*1), grid:grid.map(r=>[...r])});
  }

  // Medium 31-70
  for (let i = 0; i < 40; i++) {
    const n = i + 31;
    const colors = [1,2,3,4,5];
    const c1=colors[i%5], c2=colors[(i+1)%5], c3=colors[(i+2)%5];
    let grid;
    if (i % 4 === 0) {
      // Lock tiles
      grid = [[c1,'L',c2,c1],[c2,c1,'L',c2],['L',c2,c1,'L'],[c1,c2,c2,c1]];
    } else if (i % 4 === 1) {
      grid = [[c1,c2,c1,c3],[c3,c1,c2,c1],[c2,c3,c1,c2],[c1,c2,c3,c1]];
    } else if (i % 4 === 2) {
      grid = [[c1,c2,c3,c1],[c2,'L',c1,c2],[c3,c1,'L',c3],[c1,c3,c2,c1]];
    } else {
      grid = [[c2,c1,c2,c3],[c1,c3,c1,c2],[c3,c2,c3,c1],[c2,c1,c2,c3]];
    }
    L.push({id:n, difficulty:'medium', moves:18+Math.floor(i/4), time:90+(i*3), target:20+(i), grid:grid.map(r=>[...r])});
  }

  // Hard 71-110
  for (let i = 0; i < 40; i++) {
    const n = i + 71;
    const colors = [1,2,3,4,5];
    const c1=colors[i%5], c2=colors[(i+1)%5], c3=colors[(i+2)%5], c4=colors[(i+3)%5];
    let grid;
    if (i % 5 === 0) {
      grid = [['B',c1,c2,'B'],[c3,c4,c1,c2],[c2,c1,c4,c3],['B',c2,c1,'B']];
    } else if (i % 5 === 1) {
      grid = [['R','L','L','R'],['L',c1,c2,'L'],['L',c3,c4,'L'],['R','L','L','R']];
    } else if (i % 5 === 2) {
      grid = [['B',c1,'L',c2],[c3,'L',c4,'B'],['L',c2,'B',c1],['B',c3,'L',c4]];
    } else if (i % 5 === 3) {
      grid = [[c1,'R',c2,c3],['L',c4,c1,'L'],[c2,c3,'R',c4],['L',c1,c2,'L']];
    } else {
      grid = [['B','L',c1,'B'],[c2,c3,c4,c1],['L',c1,c3,'L'],['B',c2,'B',c3]];
    }
    L.push({id:n, difficulty:'hard', moves:22+Math.floor(i/3), time:120+(i*4), target:30+(i), grid:grid.map(r=>[...r])});
  }

  return L;
}

const allLevels = makeLevels();

const levelsData = {
  worlds: [
    { id:1, name:'The Beginning', locked:false, levels:allLevels },
    { id:2, name:'Mind Bender', locked:true, levels:[] },
    { id:3, name:'Brain Master', locked:true, levels:[] }
  ]
};

// ========================
// GAME STATE
// ========================
const GameState = {
  currentLevel:1, currentWorld:0, score:0, moves:15, time:60,
  target:20, tilesCleared:0, combo:0, totalScore:0,
  coins:0, completedLevels:{}, levelStars:{},
  inventory:{ hints:3, undos:3, bombs:0, rainbows:0 },
  settings:{ music:true, sound:true, vibration:true, notifications:false, animations:true },
  grid:[], selectedTile:null, previousGrid:null,
  timer:null, isAnimating:false, isPaused:false
};

// ========================
// SAVE/LOAD
// ========================
function saveProgress() {
  try {
    localStorage.setItem('bl2_coins', GameState.coins);
    localStorage.setItem('bl2_completed', JSON.stringify(GameState.completedLevels));
    localStorage.setItem('bl2_stars', JSON.stringify(GameState.levelStars));
    localStorage.setItem('bl2_settings', JSON.stringify(GameState.settings));
    localStorage.setItem('bl2_inventory', JSON.stringify(GameState.inventory));
    localStorage.setItem('bl2_totalScore', GameState.totalScore);
  } catch(e) {}
}

function loadProgress() {
  try {
    GameState.coins = parseInt(localStorage.getItem('bl2_coins')||'0');
    const c = localStorage.getItem('bl2_completed'); if(c) GameState.completedLevels=JSON.parse(c);
    const s = localStorage.getItem('bl2_stars'); if(s) GameState.levelStars=JSON.parse(s);
    const st = localStorage.getItem('bl2_settings'); if(st) Object.assign(GameState.settings,JSON.parse(st));
    const inv = localStorage.getItem('bl2_inventory'); if(inv) Object.assign(GameState.inventory,JSON.parse(inv));
    GameState.totalScore = parseInt(localStorage.getItem('bl2_totalScore')||'0');
  } catch(e) {}
}

// ========================
// SCREENS
// ========================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>{ s.style.display='none'; s.classList.remove('active'); });
  const t = document.getElementById(id);
  if(t){ t.style.display='flex'; t.classList.add('active'); }
  updateCoinDisplay();
}

function updateCoinDisplay() {
  document.querySelectorAll('.coin-display,.shop-coins').forEach(el=>{ el.textContent='🪙 '+GameState.coins; });
}

// ========================
// GAMEPLAY
// ========================
function startLevel(wi, li) {
  clearInterval(GameState.timer);
  playSound(600,'square',0.1);
  const level = levelsData.worlds[wi].levels[li];
  GameState.currentLevel=level.id; GameState.currentWorld=wi;
  GameState.score=0; GameState.moves=level.moves; GameState.time=level.time;
  GameState.target=level.target; GameState.tilesCleared=0; GameState.combo=0;
  GameState.grid=JSON.parse(JSON.stringify(level.grid));
  GameState.selectedTile=null; GameState.previousGrid=null;
  GameState.isPaused=false; GameState.isAnimating=false;
  const po=document.getElementById('pause-overlay'); if(po) po.style.display='none';
  showScreen('gameplay');
  const ne=document.getElementById('gp-level-name'); if(ne) ne.textContent='Level '+level.id;
  const de=document.getElementById('gp-difficulty');
  if(de){ de.textContent=level.difficulty.toUpperCase(); de.className='diff-pill diff-'+level.difficulty; }
  updateHUD(); renderGrid(); startTimer();
}

function updateHUD() {
  const set = (id,v) => { const e=document.getElementById(id); if(e) e.textContent=v; };
  set('score-val', GameState.score);
  set('moves-val', GameState.moves);
  set('time-val', GameState.time);
  set('target-text', GameState.tilesCleared+'/'+GameState.target+' tiles');
  set('hint-btn', '💡 Hint ('+GameState.inventory.hints+')');
  set('undo-btn', '↩ Undo ('+GameState.inventory.undos+')');
  const fill=document.getElementById('target-fill');
  if(fill) fill.style.width=Math.min((GameState.tilesCleared/GameState.target)*100,100)+'%';
  const tv=document.getElementById('time-val');
  if(tv) tv.style.color=GameState.time<=10?'#ef4444':'#f59e0b';
}

function renderGrid() {
  const grid=document.getElementById('game-grid'); if(!grid) return;
  grid.innerHTML='';
  for(let r=0;r<4;r++){
    for(let c=0;c<4;c++){
      const v=GameState.grid[r][c];
      const tile=document.createElement('div');
      tile.className='tile';
      if(v==='L'){ tile.classList.add('tile-locked'); tile.innerHTML='<span class="te">🔒</span>'; }
      else if(v==='B'){ tile.classList.add('tile-bomb'); tile.innerHTML='<span class="te">💣</span>'; }
      else if(v==='R'){ tile.classList.add('tile-rainbow'); tile.innerHTML='<span class="te">🌈</span>'; }
      else if(v!==0){ tile.classList.add('tile-'+v); tile.innerHTML='<span class="tile-shine"></span>'; }
      else { tile.classList.add('tile-empty'); }
      if(GameState.selectedTile&&GameState.selectedTile.row===r&&GameState.selectedTile.col===c) tile.classList.add('selected');
      (function(row,col){ tile.addEventListener('click',()=>{ if(GameState.settings.vibration&&navigator.vibrate) navigator.vibrate(8); playSound(300,'sine',0.05); handleTileClick(row,col); }); })(r,c);
      grid.appendChild(tile);
    }
  }
}

function handleTileClick(r,c) {
  if(GameState.isAnimating||GameState.isPaused||GameState.moves<=0) return;
  if(GameState.grid[r][c]==='L') return;
  if(!GameState.selectedTile){ GameState.selectedTile={row:r,col:c}; renderGrid(); }
  else {
    const s=GameState.selectedTile;
    if(s.row===r&&s.col===c){ GameState.selectedTile=null; renderGrid(); return; }
    const adj=(Math.abs(s.row-r)===1&&s.col===c)||(Math.abs(s.col-c)===1&&s.row===r);
    if(adj){ GameState.previousGrid=JSON.parse(JSON.stringify(GameState.grid)); GameState.moves--; updateHUD(); swap(s.row,s.col,r,c); }
    else { GameState.selectedTile={row:r,col:c}; renderGrid(); return; }
    GameState.selectedTile=null;
  }
}

function swap(r1,c1,r2,c2) {
  GameState.isAnimating=true;
  const t=GameState.grid[r1][c1]; GameState.grid[r1][c1]=GameState.grid[r2][c2]; GameState.grid[r2][c2]=t;
  renderGrid(); setTimeout(checkMatches,300);
}

function checkMatches() {
  const matched=findMatches();
  if(!matched.length){ GameState.isAnimating=false; GameState.combo=0;
    if(GameState.tilesCleared>=GameState.target) winLevel();
    else if(GameState.moves<=0) loseLevel('OUT OF MOVES!'); return; }
  GameState.combo++;
  const bonus=GameState.combo>1?GameState.combo*5:0;
  playSound(600+(GameState.combo*80),'triangle',0.2);
  if(GameState.combo>1){ const ce=document.getElementById('combo-text');
    if(ce){ ce.textContent=GameState.combo+'x COMBO! 🔥'; ce.style.opacity='1'; ce.style.transform='scale(1.4)';
      setTimeout(()=>{ ce.style.opacity='0'; ce.style.transform='scale(1)'; },1200); } }
  const toRemove=new Set();
  matched.forEach(g=>{ g.forEach(([r,c])=>toRemove.add(r+','+c)); GameState.score+=(g.length*10)+bonus; });
  toRemove.forEach(key=>{
    const [r,c]=key.split(',').map(Number); const v=GameState.grid[r][c];
    if(v==='L'){ GameState.grid[r][c]=((r+c)%5)+1; }
    else if(v==='B'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<4&&nc>=0&&nc<4&&GameState.grid[nr][nc]!=='L'&&GameState.grid[nr][nc]!==0){ GameState.grid[nr][nc]=0; GameState.tilesCleared++; } } }
    else if(v!==0){ GameState.grid[r][c]=0; GameState.tilesCleared++; }
  });
  updateHUD(); renderGrid(); setTimeout(dropAndFill,300);
}

function findMatches() {
  const m=[], g=GameState.grid;
  for(let r=0;r<4;r++) for(let c=0;c<=1;c++){ const v=g[r][c]; if(v&&v!=='L'&&v!=='B'&&v!=='R'&&v!==0&&v===g[r][c+1]&&v===g[r][c+2]) m.push([[r,c],[r,c+1],[r,c+2]]); }
  for(let c=0;c<4;c++) for(let r=0;r<=1;r++){ const v=g[r][c]; if(v&&v!=='L'&&v!=='B'&&v!=='R'&&v!==0&&v===g[r+1][c]&&v===g[r+2][c]) m.push([[r,c],[r+1,c],[r+2,c]]); }
  for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(g[r][c]==='R'){
    const nb=[]; const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
    dirs.forEach(([dr,dc])=>{ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<4&&nc>=0&&nc<4&&typeof g[nr][nc]==='number'&&g[nr][nc]>0) nb.push([nr,nc,g[nr][nc]]); });
    const cm={}; nb.forEach(([nr,nc,v])=>{ cm[v]=(cm[v]||[]).concat([[nr,nc]]); });
    Object.entries(cm).forEach(([,cells])=>{ if(cells.length>=2) m.push([[r,c],...cells.slice(0,2)]); }); }
  return m;
}

function dropAndFill() {
  for(let c=0;c<4;c++){
    let er=3;
    for(let r=3;r>=0;r--) if(GameState.grid[r][c]!==0){ const v=GameState.grid[r][c]; GameState.grid[r][c]=0; GameState.grid[er][c]=v; er--; }
    for(let r=er;r>=0;r--) GameState.grid[r][c]=Math.floor(Math.random()*5)+1;
  }
  renderGrid(); setTimeout(checkMatches,400);
}

function startTimer() {
  clearInterval(GameState.timer);
  GameState.timer=setInterval(()=>{
    if(GameState.isPaused) return;
    GameState.time--; updateHUD();
    if(GameState.time<=10) playSound(800,'square',0.05);
    if(GameState.time<=0){ clearInterval(GameState.timer); loseLevel('OUT OF TIME!'); }
  },1000);
}

function winLevel() {
  clearInterval(GameState.timer);
  playSound(1000,'sine',0.5);
  if(GameState.settings.vibration&&navigator.vibrate) navigator.vibrate([100,50,100,50,200]);
  const stars=GameState.moves>=10?3:GameState.moves>=5?2:1;
  const key='w'+(GameState.currentWorld+1)+'_l'+GameState.currentLevel;
  GameState.completedLevels[key]=true;
  GameState.levelStars[key]=Math.max(GameState.levelStars[key]||0,stars);
  const earned=stars*10+Math.floor(GameState.score/10);
  GameState.coins+=earned; GameState.totalScore+=GameState.score;
  saveProgress();
  const se=id=>document.getElementById(id);
  if(se('win-stars')) se('win-stars').textContent='⭐'.repeat(stars)+'☆'.repeat(3-stars);
  if(se('win-score')) se('win-score').textContent=GameState.score+' pts';
  if(se('win-coins')) se('win-coins').textContent='+'+earned+' 🪙';
  if(se('win-total')) se('win-total').textContent='Total: '+GameState.totalScore+' pts';
  startConfetti(); showScreen('win');
}

function loseLevel(reason) {
  clearInterval(GameState.timer); playSound(200,'sawtooth',0.5);
  if(GameState.settings.vibration&&navigator.vibrate) navigator.vibrate([300,100,300]);
  const se=id=>document.getElementById(id);
  if(se('lose-reason')) se('lose-reason').textContent=reason;
  if(se('lose-score')) se('lose-score').textContent='Score: '+GameState.score;
  showScreen('lose');
}

// Confetti
function startConfetti() {
  const c=document.getElementById('confetti-container'); if(!c) return; c.innerHTML='';
  const colors=['#7c3aed','#f59e0b','#10b981','#3b82f6','#ef4444','#ec4899'];
  for(let i=0;i<60;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.cssText=`left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*2}s;animation-duration:${2+Math.random()*2}s;width:${4+Math.random()*8}px;height:${4+Math.random()*8}px;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    c.appendChild(p);
  }
}

// Level grid
function renderLevelGrid(wi) {
  wi=wi||0;
  const grid=document.getElementById('level-grid'); if(!grid) return;
  grid.innerHTML='';
  const world=levelsData.worlds[wi];
  if(!world) return;
  world.levels.forEach((level,i)=>{
    const btn=document.createElement('button'); btn.className='level-btn';
    const key='w'+world.id+'_l'+level.id;
    const stars=GameState.levelStars[key]||0;
    const done=GameState.completedLevels[key];
    const prevKey='w'+world.id+'_l'+(level.id-1);
    const unlocked=i===0||GameState.completedLevels[prevKey]||done;
    if(done) btn.classList.add('completed');
    else if(unlocked) btn.classList.add('active-level');
    else btn.classList.add('locked-level');
    const badge=document.createElement('span'); badge.className='diff-badge diff-'+level.difficulty; badge.textContent=level.difficulty[0].toUpperCase(); btn.appendChild(badge);
    const num=document.createElement('div'); num.className='level-num'; num.textContent=level.id; btn.appendChild(num);
    if(stars>0){ const sd=document.createElement('div'); sd.className='level-stars'; sd.textContent='⭐'.repeat(stars); btn.appendChild(sd); }
    btn.addEventListener('click',()=>{ if(!unlocked){alert('🔒 Complete the previous level first!');return;} playSound(440,'sine',0.05); startLevel(wi,i); });
    grid.appendChild(btn);
  });
  const ts=Object.values(GameState.levelStars).reduce((a,b)=>a+b,0);
  const ms=world.levels.length*3;
  const pt=document.getElementById('ls-progress-text'); if(pt) pt.textContent='⭐ '+ts+'/'+ms+' Stars  |  '+world.levels.length+' Levels';
  const pf=document.getElementById('ls-progress-fill'); if(pf) pf.style.width=Math.min((ts/ms)*100,100)+'%';
}

// SHOP
window.buyItem=function(type,price,item){
  playSound(440,'sine',0.05);
  if(GameState.coins<price){ playSound(200,'sawtooth',0.2); alert('❌ Not enough coins!\n\nNeed: '+price+' 🪙\nYou have: '+GameState.coins+' 🪙\n\nPlay levels to earn more!'); return; }
  GameState.coins-=price;
  const msgs={hint:'💡 +5 Hints added!',undo:'↩ +5 Undos added!',time:'⏱ +30 seconds for current level!',bomb:'💣 +3 Bombs added!',rainbow:'🌈 +3 Rainbow tiles added!',coins100:'🪙 +100 Coins!',coins500:'🪙 +500 Coins!',coins1000:'🪙 +1000 Coins!',noads:'🚫 Ads removed forever!'};
  if(item==='hint'){ GameState.inventory.hints+=5; }
  if(item==='undo'){ GameState.inventory.undos+=5; }
  if(item==='time'){ GameState.time+=30; updateHUD(); }
  if(item==='bomb'){ GameState.inventory.bombs+=3; }
  if(item==='rainbow'){ GameState.inventory.rainbows+=3; }
  if(item==='coins100'){ GameState.coins+=100; }
  if(item==='coins500'){ GameState.coins+=500; }
  if(item==='coins1000'){ GameState.coins+=1000; }
  if(item==='noads'){ GameState.settings.noAds=true; }
  if(item==='starter'){ GameState.inventory.hints+=10; GameState.inventory.undos+=10; GameState.inventory.bombs+=5; GameState.coins+=200; }
  if(item==='vip'){ GameState.inventory.hints+=50; GameState.inventory.undos+=50; GameState.inventory.bombs+=20; GameState.inventory.rainbows+=20; GameState.coins+=2000; GameState.settings.noAds=true; }
  playSound(1200,'sine',0.3); saveProgress(); updateHUD(); updateCoinDisplay();
  alert('✅ Purchase Successful!\n\n'+(msgs[item]||'Enjoy your purchase!'));
};

// HINT
function findHint() {
  const g=GameState.grid;
  for(let r=0;r<4;r++) for(let c=0;c<4;c++){
    if(c<3){ const t=g[r][c]; g[r][c]=g[r][c+1]; g[r][c+1]=t; if(findMatches().length>0){ const res={r,c,r2:r,c2:c+1}; g[r][c+1]=g[r][c]; g[r][c]=t; return res; } g[r][c+1]=g[r][c]; g[r][c]=t; }
    if(r<3){ const t=g[r][c]; g[r][c]=g[r+1][c]; g[r+1][c]=t; if(findMatches().length>0){ const res={r,c,r2:r+1,c2:c}; g[r+1][c]=g[r][c]; g[r][c]=t; return res; } g[r+1][c]=g[r][c]; g[r][c]=t; }
  }
  return null;
}

// LEADERBOARD DATA
const lbData = {
  global: [
    {rank:1,name:'BrainMaster',score:125350,avatar:'🧠',country:'🇮🇳',level:89},
    {rank:2,name:'PuzzleKing',score:98420,avatar:'👑',country:'🇺🇸',level:76},
    {rank:3,name:'StarPlayer',score:87890,avatar:'⭐',country:'🇬🇧',level:71},
    {rank:4,name:'Arjun K',score:76540,avatar:'😎',country:'🇮🇳',level:65},
    {rank:5,name:'Priya S',score:65230,avatar:'🎯',country:'🇮🇳',level:58},
    {rank:6,name:'GamePro99',score:54120,avatar:'🎮',country:'🇧🇷',level:51},
    {rank:7,name:'MindBlast',score:43980,avatar:'💥',country:'🇩🇪',level:44},
    {rank:8,name:'TileWizard',score:38750,avatar:'🔮',country:'🇫🇷',level:38},
    {rank:9,name:'QuickMatch',score:27640,avatar:'⚡',country:'🇯🇵',level:29},
    {rank:10,name:'ColorPro',score:18920,avatar:'🎨',country:'🇰🇷',level:21},
  ],
  weekly: [
    {rank:1,name:'WeekChamp',score:45230,avatar:'🏆',country:'🇮🇳',level:42},
    {rank:2,name:'FastTiles',score:38120,avatar:'🚀',country:'🇺🇸',level:35},
    {rank:3,name:'PuzzlePro',score:29870,avatar:'🎯',country:'🇬🇧',level:28},
    {rank:4,name:'BrainPower',score:21540,avatar:'💡',country:'🇮🇳',level:21},
    {rank:5,name:'TileKing',score:15230,avatar:'👾',country:'🇧🇷',level:15},
    {rank:6,name:'Rahul M',score:12340,avatar:'😊',country:'🇮🇳',level:12},
  ],
  friends: [
    {rank:1,name:'Rahul M',score:34560,avatar:'😊',country:'🇮🇳',level:32},
  ]
};

function renderLeaderboard(type) {
  lbData.friends[1] = {rank:2,name:'You',score:GameState.totalScore,avatar:'👤',country:'🇮🇳',level:Math.max(1,Math.floor(GameState.totalScore/1000)+1),isYou:true};
  const data=lbData[type]||lbData.global;

  // Top 3 podium
  const top3=document.getElementById('lb-top3');
  if(top3&&data.length>=3){
    const order=[data[1],data[0],data[2]];
    const labels=['🥈','🥇','🥉'];
    top3.innerHTML=order.map((p,i)=>`
      <div class="podium-item ${i===1?'podium-gold':i===0?'podium-silver':'podium-bronze'}">
        <div class="podium-medal">${labels[i]}</div>
        <div class="podium-avatar">${p.avatar}</div>
        <div class="podium-name">${p.name}</div>
        <div class="podium-score">${p.score.toLocaleString()}</div>
        <div class="podium-country">${p.country}</div>
      </div>`).join('');
  }

  // List
  const container=document.getElementById('lb-list'); if(!container) return;
  container.innerHTML='';
  const youScore=GameState.totalScore;
  const youRank=data.filter(p=>p.score>youScore).length+1;

  data.slice(3).forEach(p=>{
    const item=document.createElement('div');
    item.className='lb-item'+(p.isYou?' lb-you':'');
    item.innerHTML=`<span class="lb-rank">#${p.rank}</span><span class="lb-avatar">${p.avatar}</span><div class="lb-info"><span class="lb-name">${p.name} ${p.country}</span><span class="lb-sublevel">Lvl ${p.level} • ${p.score.toLocaleString()} pts</span></div>`;
    container.appendChild(item);
  });

  if(type==='global'){
    const you=document.createElement('div');
    you.className='lb-item lb-you';
    you.innerHTML=`<span class="lb-rank">#${youRank}</span><span class="lb-avatar">👤</span><div class="lb-info"><span class="lb-name">You 🇮🇳</span><span class="lb-sublevel">Lvl ${Math.max(1,Math.floor(youScore/1000)+1)} • ${youScore.toLocaleString()} pts</span></div>`;
    container.appendChild(you);
  }

  const statsEl=document.getElementById('lb-stats');
  if(statsEl) statsEl.innerHTML=`<span>Your Rank: #${youRank}</span><span>Total Score: ${youScore.toLocaleString()}</span><span>Levels Done: ${Object.keys(GameState.completedLevels).length}</span>`;
}

// AD SIMULATION
function watchAd(cb) {
  const ov=document.getElementById('ad-overlay');
  if(ov){
    ov.style.display='flex';
    let t=5; const ce=document.getElementById('ad-countdown');
    const iv=setInterval(()=>{ t--; if(ce) ce.textContent=t; if(t<=0){ clearInterval(iv); ov.style.display='none'; if(cb) cb(); } },1000);
  } else { if(cb) cb(); }
}

// SETTINGS
function setupSettings() {
  const map=[['music-toggle','music'],['sound-toggle','sound'],['vibration-toggle','vibration'],['notif-toggle','notifications'],['anim-toggle','animations']];
  map.forEach(([id,key])=>{
    const el=document.getElementById(id); if(!el) return;
    el.checked=GameState.settings[key]!==false;
    el.addEventListener('change',()=>{
      GameState.settings[key]=el.checked; saveProgress();
      if(key==='music'){ el.checked?startBgMusic():stopBgMusic(); }
      playSound(500,'sine',0.1);
    });
  });
}

// ========================
// MAIN INIT
// ========================
window.addEventListener('load',()=>{
  loadProgress(); setupSettings();

  // Splash
  let p=0; const fill=document.getElementById('splash-loader-fill');
  const si=setInterval(()=>{ p+=5; if(fill) fill.style.width=p+'%'; if(p>=100){ clearInterval(si); showScreen('home'); } },40);

  // First touch = init audio
  document.body.addEventListener('click',()=>{ if(!bgMusicCtx) initBgMusic(); },{once:true});

  function bc(id,fn){ const el=document.getElementById(id); if(el) el.addEventListener('click',()=>{ playSound(440,'sine',0.05); fn(); }); }

  // HOME
  bc('play-btn',()=>{ showScreen('levelselect'); renderLevelGrid(0); });
  bc('leaderboard-btn',()=>{ showScreen('leaderboard'); renderLeaderboard('global'); });
  bc('shop-btn',()=>showScreen('shop'));
  bc('settings-btn',()=>showScreen('settings'));
  bc('daily-btn',()=>{ GameState.coins+=50; saveProgress(); updateCoinDisplay(); alert('🎁 Daily Reward!\n\n+50 🪙 Coins!\n\nCome back tomorrow!'); });

  // GAMEPLAY
  bc('pause-btn',()=>{ GameState.isPaused=true; document.getElementById('pause-overlay').style.display='flex'; stopBgMusic(); });
  bc('resume-btn',()=>{ GameState.isPaused=false; document.getElementById('pause-overlay').style.display='none'; if(GameState.settings.music) startBgMusic(); });

  bc('hint-btn',()=>{
    if(GameState.inventory.hints>0){
      GameState.inventory.hints--; updateHUD(); saveProgress();
      const h=findHint();
      if(h){
        const tiles=document.querySelectorAll('.tile');
        const i1=h.r*4+h.c, i2=h.r2*4+h.c2;
        if(tiles[i1]) tiles[i1].classList.add('hint-glow');
        if(tiles[i2]) tiles[i2].classList.add('hint-glow');
        playSound(900,'sine',0.3);
        setTimeout(()=>{ tiles[i1]&&tiles[i1].classList.remove('hint-glow'); tiles[i2]&&tiles[i2].classList.remove('hint-glow'); },3000);
      } else alert('💡 No immediate match!\nTry planning ahead!');
    } else alert('No hints left!\nBuy more in Shop 🛒');
  });

  bc('undo-btn',()=>{
    if(GameState.inventory.undos>0&&GameState.previousGrid){
      GameState.grid=JSON.parse(JSON.stringify(GameState.previousGrid));
      GameState.previousGrid=null; GameState.moves++;
      GameState.inventory.undos--; updateHUD(); renderGrid(); saveProgress(); playSound(350,'sine',0.1);
    } else if(!GameState.previousGrid) alert('Nothing to undo!');
    else alert('No undos left!\nBuy more in Shop 🛒');
  });

  // WIN
  bc('next-level-btn',()=>{
    const wl=levelsData.worlds[GameState.currentWorld].levels;
    const ci=wl.findIndex(l=>l.id===GameState.currentLevel);
    if(ci<wl.length-1) startLevel(GameState.currentWorld,ci+1);
    else { showScreen('levelselect'); renderLevelGrid(GameState.currentWorld); }
  });
  bc('replay-btn',()=>{ const wl=levelsData.worlds[GameState.currentWorld].levels; startLevel(GameState.currentWorld,wl.findIndex(l=>l.id===GameState.currentLevel)); });
  bc('win-home-btn',()=>showScreen('home'));

  // LOSE
  bc('retry-btn',()=>{ const wl=levelsData.worlds[GameState.currentWorld].levels; startLevel(GameState.currentWorld,wl.findIndex(l=>l.id===GameState.currentLevel)); });
  bc('lose-home-btn',()=>showScreen('home'));
  bc('watch-ad-btn',()=>watchAd(()=>{ GameState.moves+=5; GameState.time+=30; updateHUD(); showScreen('gameplay'); startTimer(); alert('🎉 Reward!\n+5 Moves & +30 Seconds!'); }));

  // LEADERBOARD TABS
  document.querySelectorAll('.lb-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.lb-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      renderLeaderboard(tab.dataset.tab);
      playSound(400,'sine',0.05);
    });
  });

  // SHOP TABS
  document.querySelectorAll('.shop-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.shop-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.shop-section').forEach(s=>s.style.display='none');
      const s=document.getElementById('shop-'+tab.dataset.tab);
      if(s) s.style.display='block';
      playSound(400,'sine',0.05);
    });
  });

  // WORLD TABS
  document.querySelectorAll('.world-tab').forEach((tab,i)=>{
    tab.addEventListener('click',()=>{
      if(levelsData.worlds[i].locked){ alert('🔒 World '+(i+1)+' Locked!\nComplete World '+i+' first!'); return; }
      document.querySelectorAll('.world-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active'); renderLevelGrid(i);
    });
  });

  // SETTINGS EXTRAS
  bc('rate-app-btn',()=>{ alert('⭐ Thank you!\n\nWe appreciate your support!\n\n+20 🪙 Bonus Coins added!'); GameState.coins+=20; saveProgress(); updateCoinDisplay(); });
  bc('share-btn',()=>{ if(navigator.share) navigator.share({title:'BrainLevel',text:'I scored '+GameState.totalScore+' in BrainLevel! 🧩',url:'https://play.google.com'}); else alert('BrainLevel 🧩\nMy Score: '+GameState.totalScore+'\nDownload and beat me!'); });
  bc('reset-btn',()=>{ if(confirm('⚠️ Reset ALL progress?\n\nThis cannot be undone!')){ localStorage.clear(); GameState.coins=0; GameState.completedLevels={}; GameState.levelStars={}; GameState.inventory={hints:3,undos:3,bombs:0,rainbows:0}; GameState.totalScore=0; updateCoinDisplay(); alert('✅ Progress reset!'); } });

  // AD SKIP
  bc('ad-skip',()=>{ const ov=document.getElementById('ad-overlay'); if(ov) ov.style.display='none'; });

  // BACK BUTTONS
  document.querySelectorAll('.back-btn').forEach(btn=>{ btn.addEventListener('click',()=>{ playSound(400,'sine',0.05); clearInterval(GameState.timer); stopBgMusic(); showScreen('home'); if(GameState.settings.music) setTimeout(startBgMusic,100); }); });

  updateCoinDisplay();
});
