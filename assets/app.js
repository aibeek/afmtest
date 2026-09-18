
(function(){
  var b=document.getElementById('burger'), n=document.getElementById('nav');
  b.addEventListener('click',function(){var o=n.classList.toggle('open');b.setAttribute('aria-expanded',o?'true':'false');});
  n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');b.setAttribute('aria-expanded','false');}});

  // ── вход и регистрация ──
  var ovl=document.getElementById('auth-ovl'), lastFocus=null;
  function openAuth(tab){
    ovl.classList.add('on'); document.body.style.overflow='hidden';
    if(tab) show(tab);
    document.getElementById(tab==='up'?'iin':'iin-in').focus();
  }
  function closeAuth(){ ovl.classList.remove('on'); document.body.style.overflow=''; if(lastFocus) lastFocus.focus(); }
  document.querySelectorAll('[data-auth]').forEach(function(el){
    el.addEventListener('click',function(e){ e.preventDefault(); lastFocus=el; openAuth(el.getAttribute('data-auth')); });
  });
  document.getElementById('auth-close').addEventListener('click',closeAuth);
  ovl.addEventListener('click',function(e){ if(e.target===ovl) closeAuth(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&ovl.classList.contains('on')) closeAuth(); });

  var tIn=document.getElementById('tab-in'), tUp=document.getElementById('tab-up'),
      pIn=document.getElementById('pane-in'), pUp=document.getElementById('pane-up');
  function show(which){ var up=which==='up';
    tUp.setAttribute('aria-selected',up); tIn.setAttribute('aria-selected',!up);
    pUp.hidden=!up; pIn.hidden=up; }
  tIn.addEventListener('click',function(){show('in')});
  tUp.addEventListener('click',function(){show('up')});

  function bad(id,is){ var w=document.getElementById(id); w.classList.toggle('bad',is);
    var i=w.querySelector('input'); if(i) i.setAttribute('aria-invalid',is?'true':'false'); return is; }
  function v(id){ return document.getElementById(id).value.trim(); }
  function dg(x){ return x.replace(/\D/g,''); }

  document.getElementById('f-in').addEventListener('submit',function(e){
    e.preventDefault();
    var a=bad('w-iin-in',dg(v('iin-in')).length!==12), b=bad('w-pw-in',v('pw-in').length===0);
    var m=document.getElementById('m-in');
    if(a||b){ m.classList.remove('on'); return; }
    m.textContent='Данные приняты. На стороне сервера выполняется проверка учётной записи и статуса заявки.';
    m.classList.add('on');
  });
  document.getElementById('forgot').addEventListener('click',function(e){
    e.preventDefault(); var m=document.getElementById('m-in');
    m.textContent='Ссылка для восстановления пароля будет отправлена на почту, указанную при регистрации.';
    m.classList.add('on');
  });

  document.getElementById('f-up').addEventListener('submit',function(e){
    e.preventDefault();
    var m=document.getElementById('m-up');
    var errs=[bad('w-last',v('last').length<2),bad('w-first',v('first').length<2),
      bad('w-iin',dg(v('iin')).length!==12),bad('w-phone',dg(v('phone')).length<11),
      bad('w-mail',!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v('mail'))),
      bad('w-pw',!(v('pw').length>=8&&/[A-Za-zА-Яа-я]/.test(v('pw'))&&/\d/.test(v('pw')))),
      bad('w-pw2',v('pw2')!==v('pw')||v('pw2').length===0)];
    if(!document.getElementById('pd').checked||!document.getElementById('rules').checked){
      m.style.borderColor='#9E362C'; m.style.color='#9E362C'; m.style.background='#FDF6F5';
      m.textContent='Для регистрации необходимо согласие на обработку персональных данных и ознакомление с Правилами.';
      m.classList.add('on'); return;
    }
    if(errs.some(Boolean)){ m.classList.remove('on'); return; }
    m.style.borderColor='#1F5C46'; m.style.color='#1F5C46'; m.style.background='#EEF3F0';
    m.textContent='Заявка на регистрацию сформирована. Следующий шаг — оплата и загрузка документа в личном кабинете.';
    m.classList.add('on');
  });

  ['iin','iin-in'].forEach(function(id){ var el=document.getElementById(id);
    el.addEventListener('input',function(){ el.value=el.value.replace(/\D/g,'').slice(0,12); }); });


  // ── форма входа на первом экране ──
  (function(){
    var f=document.getElementById('f-hero'); if(!f) return;
    var iin=document.getElementById('h-iin');
    iin.addEventListener('input',function(){ iin.value=iin.value.replace(/\D/g,'').slice(0,12); });
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var m=document.getElementById('m-hero');
      var e1=document.getElementById('w-h-iin'), e2=document.getElementById('w-h-pw');
      var b1=iin.value.replace(/\D/g,'').length!==12, b2=document.getElementById('h-pw').value.trim()==='';
      e1.classList.toggle('bad',b1); e2.classList.toggle('bad',b2);
      if(b1||b2){ m.classList.remove('on'); return; }
      m.textContent='Данные приняты. Выполняется проверка учётной записи и статуса заявки.';
      m.classList.add('on');
    });
  })();

  // ── бегущая строка: дублируем содержимое для бесшовного цикла ──
  (function(){
    var row=document.getElementById('tick-row'); if(!row) return;
    row.innerHTML=row.innerHTML+row.innerHTML;
  })();

  // ── лента новостей ──
  (function(){
    var tr=document.getElementById('fd-track'); if(!tr) return;
    var cards=tr.querySelectorAll('.fcard'), dots=document.getElementById('fd-dots'), timer=null, idx=0;
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    cards.forEach(function(_,i){
      var b=document.createElement('button');
      b.type='button'; b.setAttribute('aria-label','Карточка '+(i+1));
      b.addEventListener('click',function(){ go(i,true); });
      dots.appendChild(b);
    });
    function step(){ return cards[0].offsetWidth + 20; }
    function mark(){
      var i=Math.round(tr.scrollLeft/step());
      idx=Math.max(0,Math.min(cards.length-1,i));
      Array.prototype.forEach.call(dots.children,function(d,k){ d.setAttribute('aria-current',k===idx?'true':'false'); });
    }
    function go(i,stop){
      idx=(i+cards.length)%cards.length;
      tr.scrollTo({left:idx*step(),behavior:reduce?'auto':'smooth'});
      Array.prototype.forEach.call(dots.children,function(d,k){ d.setAttribute('aria-current',k===idx?'true':'false'); });
      if(stop) pause();
    }
    function visible(){ return Math.max(1,Math.round(tr.clientWidth/step())); }
    function next(){ go(idx+1 > cards.length-visible() ? 0 : idx+1); }
    function play(){ if(reduce) return; stopT(); timer=setInterval(next,5200); }
    function stopT(){ if(timer){ clearInterval(timer); timer=null; } }
    function pause(){ stopT(); setTimeout(play,12000); }

    document.getElementById('fd-next').addEventListener('click',function(){ go(idx+1>cards.length-1?0:idx+1,true); });
    document.getElementById('fd-prev').addEventListener('click',function(){ go(idx-1<0?cards.length-1:idx-1,true); });
    tr.addEventListener('scroll',function(){ clearTimeout(tr._t); tr._t=setTimeout(mark,120); });
    tr.addEventListener('mouseenter',stopT); tr.addEventListener('mouseleave',play);
    tr.addEventListener('focusin',stopT);
    mark(); play();
  })();


  // ── модуль обучения: видеоуроки ──
  (function(){
    var stage=document.getElementById('v-stage'); if(!stage) return;
    var poster=document.getElementById('v-poster'),
        items=Array.prototype.slice.call(document.querySelectorAll('#v-items button')),
        note=document.getElementById('v-note'),
        fill=document.getElementById('v-fill'), prog=document.getElementById('v-prog'),
        seen={}, cur=0, media=null;

    try{ seen=JSON.parse(localStorage.getItem('aml-course')||'{}'); }catch(e){ seen={}; }

    function save(){ try{ localStorage.setItem('aml-course',JSON.stringify(seen)); }catch(e){} }

    function drop(){ if(media){ media.remove(); media=null; } note.classList.remove('on'); poster.style.display=''; }

    function mark(){
      var n=0;
      items.forEach(function(b,i){
        var st=b.querySelector('.vst');
        if(seen[i]){ n++; st.className='vst done'; st.textContent='Просмотрено'; }
        else if(b.dataset.open){ st.className='vst open'; st.textContent='Открытый фрагмент'; }
      });
      fill.style.width=Math.round(n/items.length*100)+'%';
      prog.textContent='Просмотрено '+n+' из '+items.length+' — всего 1 ч 33 мин';
    }

    function select(i){
      cur=i; drop();
      var b=items[i];
      items.forEach(function(x){ x.setAttribute('aria-current',x===b?'true':'false'); });
      document.getElementById('v-ptag').textContent=b.dataset.tag;
      document.getElementById('v-ptitle').textContent=b.dataset.title;
      document.getElementById('v-pdur').textContent=b.dataset.dur;
      document.getElementById('v-pst').textContent=seen[i]?'Просмотрено':(b.dataset.open?'Открытый фрагмент':'Доступно после входа');
      document.getElementById('v-title').textContent=b.dataset.title;
      document.getElementById('v-desc').textContent=b.dataset.desc;
      document.getElementById('v-m1').textContent='Видео — '+b.dataset.dur;
    }

    function fail(){
      poster.style.display='';
      note.textContent='Видеофайл урока подключается из медиахранилища Академии. В демонстрационной версии страницы запись не размещена.';
      note.classList.add('on');
    }

    function play(){
      var b=items[cur];
      if(!b.dataset.open && !seen[cur]){
        var t=document.querySelector('header [data-auth="in"]'); if(t){ t.click(); }
        return;
      }
      drop();
      if(b.dataset.embed){
        media=document.createElement('iframe');
        media.src=b.dataset.embed;
        media.title=b.dataset.title;
        media.allow='accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen';
        media.setAttribute('allowfullscreen','');
      }else{
        media=document.createElement('video');
        media.src=b.dataset.src; media.controls=true; media.autoplay=true; media.playsInline=true;
        media.addEventListener('error',fail);
      }
      stage.insertBefore(media,note);
      poster.style.display='none';
      seen[cur]=1; save(); mark();
      document.getElementById('v-pst').textContent='Просмотрено';
    }

    items.forEach(function(b,i){ b.addEventListener('click',function(){ select(i); play(); }); });
    poster.addEventListener('click',play);
    mark(); select(0);
  })();
  var l=document.querySelectorAll('.lang button');
  l.forEach(function(x){x.addEventListener('click',function(){l.forEach(function(y){y.setAttribute('aria-pressed','false')});x.setAttribute('aria-pressed','true');});});
})();
