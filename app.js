// GG 007 Gaming - landing site effects
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Starfield ---- */
  var canvas = document.getElementById('starfield');
  var ctx = canvas.getContext('2d');
  var stars = [], meteors = [], W, H;
  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    var n = Math.min(220, Math.floor(W*H/9000));
    for(var i=0;i<n;i++){
      stars.push({x:Math.random()*W, y:Math.random()*H,
        r:Math.random()*1.6+.3, p:Math.random()*Math.PI*2, s:.008+Math.random()*.02});
    }
  }
  function spawnMeteor(){
    meteors.push({x:Math.random()*W*.8+W*.1, y:-20, vx:-(2+Math.random()*3), vy:3+Math.random()*3, life:1});
  }
  var lastMeteor = 0;
  function frame(t){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<stars.length;i++){
      var st = stars[i]; st.p += st.s;
      var a = .35 + Math.abs(Math.sin(st.p))*.65;
      ctx.globalAlpha = a;
      ctx.fillStyle = st.r > 1.4 ? '#b9f6ff' : '#8fa3c8';
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if(!reduced && t - lastMeteor > 5200 + Math.random()*4000){ spawnMeteor(); lastMeteor = t; }
    for(var m=meteors.length-1;m>=0;m--){
      var mt = meteors[m];
      mt.x += mt.vx; mt.y += mt.vy; mt.life -= .012;
      if(mt.life <= 0 || mt.y > H+40){ meteors.splice(m,1); continue; }
      var g = ctx.createLinearGradient(mt.x, mt.y, mt.x - mt.vx*12, mt.y - mt.vy*12);
      g.addColorStop(0, 'rgba(25,232,255,' + (mt.life*.9) + ')');
      g.addColorStop(1, 'rgba(25,232,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mt.x, mt.y);
      ctx.lineTo(mt.x - mt.vx*12, mt.y - mt.vy*12); ctx.stroke();
    }
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);

  /* ---- Scroll reveal ---- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- Typewriter legend ---- */
  var tw = document.getElementById('legend-text');
  var full = tw.getAttribute('data-text');
  var started = false;
  function type(){
    if(started) return; started = true;
    if(reduced){ tw.textContent = full; return; }
    var i = 0;
    (function tick(){
      tw.textContent = full.slice(0, i);
      i++;
      if(i <= full.length) setTimeout(tick, 26);
    })();
  }
  new IntersectionObserver(function(entries, obs){
    if(entries[0].isIntersecting){ type(); obs.disconnect(); }
  }, {threshold:.4}).observe(tw);

  /* ---- Card tilt ---- */
  if(!reduced && window.matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(function(card){
      card.addEventListener('pointermove', function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left)/r.width - .5;
        var y = (e.clientY - r.top)/r.height - .5;
        card.style.transform = 'perspective(700px) rotateY(' + (x*10) + 'deg) rotateX(' + (-y*10) + 'deg) translateY(-4px)';
      });
      card.addEventListener('pointerleave', function(){ card.style.transform = ''; });
    });
  }
})();
