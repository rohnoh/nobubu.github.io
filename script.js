(()=>{
 const c=window.REVEAL_CONFIG||{},ui=c.ui||{},uiEn=c.uiEnglish||{},q=new URLSearchParams(location.search);
 const family=q.get('family')==='parents'||(q.get('family')!=='inlaws'&&c.family==='parents')?'parents':'inlaws';
 const $=id=>document.getElementById(id),set=(id,value,html=false)=>{if($(id)){if(html)$(id).innerHTML=value;else $(id).textContent=value}};
 let language='ko';try{language=localStorage.getItem('family-reveal-language')==='en'?'en':'ko'}catch{}
 const words=()=>language==='en'?uiEn:ui;
 const value=key=>words()[key]??ui[key]??'';
 let dateDeadline=Date.parse(c.revealDate||'');
 const fallback={pageTitle:'우리의 약속',brand:'우리의 약속',eyebrow:'D-DAY',countdownHeading:'약속한 날까지',todayLabel:'오늘, 함께 만나요',dateNotSet:'공개 날짜가 설정되지 않았어요'};
 const fieldMap=[['brandName','brand'],['headerNote','headerNote'],['eyebrow','eyebrow'],['countdownHeading','countdownHeading'],['countdownHint','countdownHint'],['afterIndex','afterIndex'],['afterLabel','afterLabel'],['afterEyebrow','afterEyebrow'],['afterCopy','afterCopy'],['liveEyebrow','liveEyebrow'],['liveTitle','liveTitle'],['liveDescription','liveDescription'],['zoomMissing','zoomMissing'],['privateEyebrow','privateEyebrow'],['privateTitle','privateTitle'],['privateDescription','privateDescription'],['pageMissing','pageMissing']];
 const updateDate=()=>{
  if(!Number.isFinite(dateDeadline)){set('revealDate',value('dateNotSet')||fallback.dateNotSet);return}
  const date=new Date(dateDeadline);
  if(language==='en'){
   const kstDate=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'Asia/Seoul'}).format(date);
   const kstTime=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'Asia/Seoul'}).format(date);
   const etDate=new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric',timeZone:'America/New_York'}).format(date);
   const etTime=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'}).format(date);
   set('revealDate',`${kstDate} · ${kstTime} (Korea time)<br>${etDate} · ${etTime} (Philadelphia time)`,true);
  }else{
   const dateOptions={year:'numeric',month:'long',day:'numeric',weekday:'long'};
   const kstDate=new Intl.DateTimeFormat('ko-KR',{...dateOptions,timeZone:'Asia/Seoul'}).format(date);
   const kstTime=new Intl.DateTimeFormat('ko-KR',{hour:'numeric',minute:'2-digit',timeZone:'Asia/Seoul'}).format(date);
   const phillyDate=new Intl.DateTimeFormat('ko-KR',{...dateOptions,timeZone:'America/New_York'}).format(date);
   const phillyTime=new Intl.DateTimeFormat('ko-KR',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'}).format(date);
   set('revealDate',`${kstDate} · ${kstTime} (한국시간)<br>${phillyDate} · ${phillyTime} (필라델피아시간)`+(ui.dateSuffix??''),true);
  }
 };
 function applyLanguage(next){
  language=next==='en'?'en':'ko';try{localStorage.setItem('family-reveal-language',language)}catch{}
  const copy=words();document.documentElement.lang=language;document.title=copy.pageTitle||fallback.pageTitle;
  for(const [id,key] of fieldMap)if(Object.prototype.hasOwnProperty.call(copy,key))set(id,copy[key],key==='afterCopy');
  set('daysUnit',copy.countdownUnits?.days??'일');set('hoursUnit',copy.countdownUnits?.hours??'시간');set('minutesUnit',copy.countdownUnits?.minutes??'분');set('secondsUnit',copy.countdownUnits?.seconds??'초');
  const heading=$('afterHeading');if(heading)heading.innerHTML=copy.afterHeading??ui.afterHeading??'드디어 그날이<br><em>찾아왔어요.</em>';
  set('zoomLink',copy.zoomButton??ui.zoomButton??'줌 (Zoom)에서 함께하기 ↗');set('revealPageLink',copy.revealButton??ui.revealButton??'페이지 열기');
  if($('countdownHeading'))$('countdownHeading').style.fontSize=ui.countdownHeadingSize||'15px';if($('countdownHint'))$('countdownHint').style.fontSize=ui.countdownHintSize||'13px';
  updateDate();
  if(document.body.classList.contains('preview-page')){
   const banner=document.querySelector('.preview-banner');if(banner)banner.textContent=copy.previewBanner??'미리보기 전용 · 실제 공개일/Zoom 동작에는 영향이 없습니다';
   const previewDate=$('revealDate');if(previewDate)previewDate.textContent=copy.previewDateLabel??'공개일 화면 미리보기';
   set('previewRevealLink',copy.previewRevealLink??'← 공개 페이지 미리보기');
   const back=document.getElementById('previewCountdownLink');if(back)back.textContent=copy.previewCountdownLink??'← 실제 카운트다운으로 돌아가기';
  }
  const toggle=$('languageToggle');if(toggle){toggle.textContent=language==='ko'?'English':'한글';toggle.setAttribute('aria-label',language==='ko'?'Switch to English':'한국어로 전환')}
  if($('previewLink'))$('previewLink').href='preview.html?family='+family+'&lang='+language;
  if($('previewRevealLink'))$('previewRevealLink').href='reveal.html?family='+family+'&preview=1&lang='+language;
  if($('revealPageLink'))$('revealPageLink').href='reveal.html?family='+family+(document.body.classList.contains('preview-page')?'&preview=1':'')+'&lang='+language;
  if($('previewCountdownLink'))$('previewCountdownLink').href='index.html?lang='+language;
  if($('countdown')?.querySelector('.today-label'))$('countdown').innerHTML='<strong class="today-label">'+(copy.todayLabel??fallback.todayLabel)+'</strong>';
 }
 document.title=value('pageTitle')||fallback.pageTitle;
 for(const [id,key] of fieldMap)if(Object.prototype.hasOwnProperty.call(ui,key))set(id,ui[key],key==='afterCopy');
 for(const [key,id] of [['afterHeading','afterHeading']])if(ui[key])set(id,ui[key],true);
 if($('countdownHeading'))$('countdownHeading').style.fontSize=ui.countdownHeadingSize||'15px';if($('countdownHint'))$('countdownHint').style.fontSize=ui.countdownHintSize||'13px';if($('revealDate'))$('revealDate').style.color=ui.dateColor||'var(--muted)';
 let released=false;const after=$('afterDate');
 function showRefreshHelp(){let note=$('refreshHelp');if(!note){note=document.createElement('aside');note.id='refreshHelp';note.setAttribute('role','status');note.style.cssText='margin:0 auto 18px;padding:16px 18px;max-width:620px;background:#fffaf4;border:1px solid #dfbda8;border-radius:14px;color:#493a32;font:500 15px/1.6 sans-serif;text-align:center;box-shadow:0 8px 24px #493a3210';note.innerHTML='최신 공개 날짜를 이 로컬 페이지에서 확인할 수 없어요.<br>게시된 사이트를 열어 최신 카운트다운을 확인해 주세요.<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px"><a href="https://rohnoh.github.io/nobubu.github.io/" style="display:inline-block;padding:9px 15px;border-radius:24px;background:#c99577;color:white;text-decoration:none">게시된 사이트 열기</a><button id="refreshCurrentPage" type="button" style="padding:8px 14px;border:1px solid #c99577;border-radius:24px;background:white;color:#493a32;font:inherit">이 페이지 새로고침</button></div>';const host=$('countdownPage')?.querySelector('.countdown-copy');if(host)host.prepend(note);else document.body.prepend(note);note.querySelector('#refreshCurrentPage').addEventListener('click',()=>location.reload())}}
 function hideRefreshHelp(){const note=$('refreshHelp');if(note)note.remove()}
 function openDay(){if(released)return;released=true;const first=$('countdownPage');if(first)first.hidden=true;after.hidden=false;$('countdown').innerHTML='<strong class="today-label">'+value('todayLabel')+'</strong>';if(c.zoomUrl){$('zoomLink').href=c.zoomUrl;$('zoomLink').hidden=false;$('zoomMissing').hidden=true}else set('zoomMissing',value('zoomMissing'));$('revealPageLink').href='reveal.html?family='+family+'&lang='+language;$('revealPageLink').hidden=false;$('pageMissing').hidden=true;$('previewLink').href='preview.html?family='+family+'&lang='+language;window.scrollTo(0,0)}
 function resetToCountdown(){released=false;if(after)after.hidden=true;const first=$('countdownPage');if(first)first.hidden=false;const countdown=$('countdown');if(countdown)countdown.innerHTML='<div><strong id="days">--</strong><span id="daysUnit">일</span></div><i>:</i><div><strong id="hours">--</strong><span id="hoursUnit">시간</span></div><i>:</i><div><strong id="minutes">--</strong><span id="minutesUnit">분</span></div><i>:</i><div><strong id="seconds">--</strong><span id="secondsUnit">초</span></div>';applyLanguage(language);tick();window.scrollTo(0,0)}
 function tick(){if(q.get('preview')==='1')return;if(!Number.isFinite(dateDeadline)){returnCountdownIfNeeded();return}const left=dateDeadline-Date.now();if(left<=0){openDay();return}if(released)returnCountdownIfNeeded();const s=Math.floor(left/1000);set('days',String(Math.floor(s/86400)).padStart(2,'0'));set('hours',String(Math.floor(s%86400/3600)).padStart(2,'0'));set('minutes',String(Math.floor(s%3600/60)).padStart(2,'0'));set('seconds',String(s%60).padStart(2,'0'))}
 function returnCountdownIfNeeded(){if(released)resetToCountdown()}
 async function refreshConfiguredDate(){try{const response=await fetch('config.js?v='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('Unable to fetch latest config');const source=await response.text(),match=source.match(/revealDate\s*:\s*(['"])(.*?)\1/);if(!match)throw new Error('Reveal date not found');const latest=Date.parse(match[2]);if(Number.isFinite(latest)){hideRefreshHelp();if(latest!==dateDeadline){dateDeadline=latest;updateDate();resetToCountdown()}}}catch{showRefreshHelp()}}
 if(q.get('preview')==='1')openDay();else{tick();setInterval(tick,1000);setInterval(refreshConfiguredDate,1000)}
 const toggle=$('languageToggle');if(toggle)toggle.addEventListener('click',()=>applyLanguage(language==='ko'?'en':'ko'));
 applyLanguage(language);
 const bar=$('progressBar');addEventListener('scroll',()=>{if(bar)bar.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100||0)+'%'},{passive:true});
 const obs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.15});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();
