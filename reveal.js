(()=>{
 const c=window.REVEAL_CONFIG||{},u=c.revealUi||{},uEn=c.revealUiEnglish||{},q=new URLSearchParams(location.search);
 const family=q.get('family')==='parents'?'parents':'inlaws',form=document.getElementById('passwordForm'),error=document.getElementById('gateError');
 const $=id=>document.getElementById(id),put=(id,value)=>{if($(id))$(id).textContent=value};
 let language='ko',shown=false,activePhotos=[],currentPhoto=0;
 if(q.has('lang'))language=q.get('lang')==='en'?'en':'ko';else{try{language=localStorage.getItem('family-reveal-language')==='en'?'en':'ko'}catch{}}
 const words=()=>language==='en'?uEn:u;
 const resultCopy=()=>{
  const translations=language==='en'?(c.revealCopyEnglish||{}):(c.revealCopy||{});
  return{family:translations[family]||{},sex:translations[family+'BySex']?.[c.babySex]||{}};
 };
 function renderPhoto(){
  if(!activePhotos.length)return;
  const item=activePhotos[currentPhoto],translated=(c.photosEnglish||[])[currentPhoto]||{};
  const image=$('slideImage');image.src=item.src;image.alt=(language==='en'?translated.alt:item.alt)||item.alt||words().photoAlt||'우리 아기의 사진';
  $('slideCaption').textContent=(language==='en'?translated.caption:item.caption)||'';
  $('slideCount').textContent=(currentPhoto+1)+(words().photoCounterSeparator??' / ')+activePhotos.length;
  $('slidePrev').disabled=activePhotos.length<2;$('slideNext').disabled=activePhotos.length<2;
 }
 function renderResult(){
  const v=words(),copy=resultCopy(),sex=c.babySex==='girl'?(v.sexGirl??'딸이에요!'):c.babySex==='boy'?(v.sexBoy??'아들이에요!'):(v.sexUnknown??'아직 공개하지 않았어요');
  put('sex',sex);document.body.dataset.sex=c.babySex==='girl'?'girl':c.babySex==='boy'?'boy':'surprise';
  put('resultTitle',copy.sex.title??copy.family.title??v.defaultTitle??'우리 가족이 되어줘서 고마워요.');
  let message=copy.family.message??v.defaultMessage??'';
  if(c.babyName)message+=(v.nameSuffix??' ')+c.babyName+(v.nameEnd??'');
  const due=language==='en'?(c.dueDateEnglish||c.dueDate):c.dueDate;
  if(due)message+=(v.duePrefix??'예정일은 ')+due+(v.dueEnd??'');
  put('resultMessage',message);
  if(activePhotos.length)renderPhoto();
 }
 function applyLanguage(next){
  language=next==='en'?'en':'ko';try{localStorage.setItem('family-reveal-language',language)}catch{}
  const v=words();document.documentElement.lang=language;document.title=v.pageTitle||'아기 소식';
  const brand=document.querySelector('.reveal-tools .wordmark');if(brand)brand.textContent=v.brand||'우리의 약속';
  put('gateEyebrow',v.gateEyebrow??'');$('gateHeading').innerHTML=v.gateHeading??'함께 확인해볼 소식';$('gateCopy').innerHTML=v.gateCopy??'비밀번호를 입력하면 소식이 공개됩니다.';
  put('notYetMessage',v.notYetMessage??'아직 확인 시간이 되지 않았어요.');put('passwordLabel',v.passwordLabel??'비밀번호');put('passwordButton',v.passwordButton??'소식 열기');put('resultEyebrow',v.resultEyebrow??'저희 아이의 성별은...');put('gateBackLink',v.gateBack??v.backToCountdown??'카운트다운으로 돌아가기');put('resultBackLink',v.backToCountdown??'카운트다운 페이지로 돌아가기');
  $('slidePrev').setAttribute('aria-label',v.previousPhoto??'이전 사진');$('slideNext').setAttribute('aria-label',v.nextPhoto??'다음 사진');
  const toggle=$('languageToggle');if(toggle){toggle.textContent=language==='ko'?'English':'한글';toggle.setAttribute('aria-label',language==='ko'?'Switch to English':'한국어로 전환')}
  put('testOpenLink',language==='ko'?'테스트로 열기 ↗':'Open preview ↗');$('testOpenLink').href='test-reveal.html?family='+family+'&lang='+language+(q.get('preview')==='1'?'&returnPreview=1':'');
  $('gateBackLink').href=q.get('preview')==='1'?'preview.html?family='+family+'&lang='+language:'index.html?lang='+language;$('resultBackLink').href='index.html?lang='+language;
  if(q.get('preview')==='1'){
   let banner=document.querySelector('.preview-banner');if(!banner){banner=document.createElement('div');banner.className='preview-banner';$('result').prepend(banner)}
   banner.textContent=v.previewBanner??'미리보기 전용';
  }
  if(shown)renderResult();
 }
 const isPreview=q.get('preview')==='1';
 let releaseAt=Date.parse(c.revealDate||'');
 function releaseIsOpen(){return isPreview||(Number.isFinite(releaseAt)&&Date.now()>=releaseAt)}
 function syncReleaseState(){
  const releasedNow=releaseIsOpen();
  $('passwordForm').hidden=!releasedNow;$('gateCopy').hidden=!releasedNow;$('notYetMessage').hidden=releasedNow;
  if(!releasedNow&&shown){shown=false;$('result').hidden=true;$('gate').hidden=false;$('password').value='';error.textContent=''}
  if(releasedNow&&shown){$('gate').hidden=true;$('result').hidden=false}
 }
 syncReleaseState();
 async function refreshConfiguredDate(){try{const response=await fetch('config.js?v='+Date.now(),{cache:'no-store'});if(!response.ok)return;const source=await response.text(),match=source.match(/revealDate\s*:\s*(['"])(.*?)\1/);if(!match)return;const latest=Date.parse(match[2]);if(Number.isFinite(latest)&&latest!==releaseAt){releaseAt=latest;syncReleaseState();if(!releaseIsOpen())location.href='index.html?lang='+language}}catch{}}
 function show(){
  shown=true;$('gate').hidden=true;$('result').hidden=false;activePhotos=(c.photos||[]).filter(item=>item.src);currentPhoto=0;
  if(activePhotos.length){$('slideshow').hidden=false;$('slidePrev').addEventListener('click',()=>{currentPhoto=(currentPhoto-1+activePhotos.length)%activePhotos.length;renderPhoto()});$('slideNext').addEventListener('click',()=>{currentPhoto=(currentPhoto+1)%activePhotos.length;renderPhoto()})}
  renderResult();
  const conf=$('confetti');for(let i=0;i<72;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.animationDelay=Math.random()*1.4+'s';p.style.animationDuration=2.7+Math.random()*2+'s';p.style.setProperty('--drift',Math.random()*180-90+'px');conf.append(p)}
  const fireworks=$('fireworks'),palette=c.babySex==='girl'?['#f3a4c3','#ffe0a1','#fff4f7']:['#8bd4ef','#ffe0a1','#e8f7ff'];[{x:22,y:28,d:0},{x:76,y:24,d:.55},{x:52,y:40,d:1.05}].forEach((spot,index)=>{const burst=document.createElement('div');burst.className='firework';burst.style.left=spot.x+'%';burst.style.top=spot.y+'%';for(let i=0;i<20;i++){const spark=document.createElement('i'),angle=Math.PI*2*i/20,distance=75+Math.random()*75;spark.style.setProperty('--x',Math.cos(angle)*distance+'px');spark.style.setProperty('--y',Math.sin(angle)*distance+'px');spark.style.setProperty('--spark',palette[(i+index)%palette.length]);spark.style.animationDelay=(spot.d+Math.random()*.2)+'s';burst.append(spark)}fireworks.append(burst)});
 }
 form.addEventListener('submit',e=>{e.preventDefault();syncReleaseState();if(!releaseIsOpen()){error.textContent=words().notYetMessage||'아직 확인 시간이 되지 않았어요.';return}if($('password').value!==String(c.revealPassword||'America')){error.textContent=words().wrongPassword||'비밀번호가 맞지 않아요. 다시 확인해 주세요.';return}error.textContent='';show()});
 if(!isPreview){setInterval(syncReleaseState,1000);setInterval(refreshConfiguredDate,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncReleaseState();refreshConfiguredDate()}})}
 const toggle=$('languageToggle');if(toggle)toggle.addEventListener('click',()=>applyLanguage(language==='ko'?'en':'ko'));
 applyLanguage(language);
})();
