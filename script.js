(()=>{
 const c=window.REVEAL_CONFIG||{},ui=c.ui||{},uiEn=c.uiEnglish||{},q=new URLSearchParams(location.search);
 const family=q.get('family')==='parents'||(q.get('family')!=='inlaws'&&c.family==='parents')?'parents':'inlaws';
 const $=id=>document.getElementById(id),set=(id,value,html=false)=>{if($(id)){if(html)$(id).innerHTML=value;else $(id).textContent=value}};
 let language='ko';try{language=localStorage.getItem('family-reveal-language')==='en'?'en':'ko'}catch{}
 const words=()=>language==='en'?uiEn:ui;
 const value=key=>words()[key]??ui[key]??'';
 const dateDeadline=Date.parse(c.revealDate||'');
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
 function openDay(){if(released)return;released=true;const first=$('countdownPage');if(first)first.hidden=true;after.hidden=false;$('countdown').innerHTML='<strong class="today-label">'+value('todayLabel')+'</strong>';if(c.zoomUrl){$('zoomLink').href=c.zoomUrl;$('zoomLink').hidden=false;$('zoomMissing').hidden=true}else set('zoomMissing',value('zoomMissing'));$('revealPageLink').href='reveal.html?family='+family+'&lang='+language;$('revealPageLink').hidden=false;$('pageMissing').hidden=true;$('previewLink').href='preview.html?family='+family+'&lang='+language;window.scrollTo(0,0)}
 function tick(){if(!Number.isFinite(dateDeadline)||released)return;const left=dateDeadline-Date.now();if(left<=0){openDay();return}const s=Math.floor(left/1000);set('days',String(Math.floor(s/86400)).padStart(2,'0'));set('hours',String(Math.floor(s%86400/3600)).padStart(2,'0'));set('minutes',String(Math.floor(s%3600/60)).padStart(2,'0'));set('seconds',String(s%60).padStart(2,'0'))}
 if(q.get('preview')==='1')openDay();else{tick();setInterval(tick,1000)}
 const toggle=$('languageToggle');if(toggle)toggle.addEventListener('click',()=>applyLanguage(language==='ko'?'en':'ko'));
 applyLanguage(language);
 const bar=$('progressBar');addEventListener('scroll',()=>{if(bar)bar.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100||0)+'%'},{passive:true});
 const obs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.15});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();
