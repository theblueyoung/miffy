/* 하위 페이지 공통 스크립트: 메뉴, D-day, 토스트, 탭, 모달, 복사 */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
window.$=$;window.$$=$$;
window.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let tT;window.toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),2600)};

/* D-day (한국 시간 기준) */
const kToday=()=>{const n=new Date(Date.now()+9*36e5);return Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate())};
window.dleft=s=>{const [y,m,d]=s.split('-').map(Number);return Math.round((Date.UTC(y,m-1,d)-kToday())/864e5)};
window.dtxt=n=>n>0?'D-'+n:n===0?'D-DAY':'종료';
window.fillDday=r=>$$('.dday[data-date]',r).forEach(el=>{const n=dleft(el.dataset.date);el.textContent=dtxt(n);el.classList.toggle('end',n<0)});
fillDday();

/* 모바일 메뉴 */
const drawer=$('#drawer'),menuBtn=$('#menuBtn');
if(drawer&&menuBtn){
 const setDrawer=on=>{drawer.classList.toggle('on',on);menuBtn.setAttribute('aria-expanded',on);document.documentElement.style.overflow=on?'hidden':'';if(on)$('#drawerClose').focus();else menuBtn.focus()};
 menuBtn.addEventListener('click',()=>setDrawer(true));
 $('#drawerClose').addEventListener('click',()=>setDrawer(false));
 drawer.addEventListener('click',e=>{if(e.target.closest('a'))setDrawer(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('on'))setDrawer(false)});
}
/* 시안에서 연결하지 않은 링크 */
document.addEventListener('click',e=>{const a=e.target.closest('[data-soon]');if(a){e.preventDefault();toast('시안에서는 연결하지 않은 메뉴예요')}});
/* 복사 */
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy]');if(!b)return;
 const v=b.dataset.copy;const done=()=>toast(v+' 복사했어요');
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(done,()=>toast(v));else toast(v)});

/* 탭: .tabs[role=tablist] > [role=tab][aria-controls]  /  패널 id 해시와 연동 */
window.initTabs=(root,opt={})=>{
 const tabs=$$('[role=tab]',root),panels=tabs.map(t=>$('#'+t.getAttribute('aria-controls')));
 const show=(id,push)=>{const i=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-controls')===id));
  tabs.forEach((t,j)=>{t.setAttribute('aria-selected',j===i);t.tabIndex=j===i?0:-1});panels.forEach((p,j)=>p.hidden=j!==i);
  if(push&&opt.hash)history.replaceState(null,'','#'+id);if(opt.onChange)opt.onChange(id)};
 tabs.forEach(t=>{t.addEventListener('click',()=>show(t.getAttribute('aria-controls'),true));
  t.addEventListener('keydown',e=>{const k={ArrowRight:1,ArrowLeft:-1}[e.key];if(!k)return;const i=(tabs.indexOf(t)+k+tabs.length)%tabs.length;tabs[i].focus();tabs[i].click()})});
 const fromHash=()=>{const h=location.hash.slice(1);const t=tabs.find(x=>x.getAttribute('aria-controls')===h);if(t)show(h,false);return !!t};
 window.addEventListener('hashchange',fromHash);
 if(!(opt.hash&&fromHash()))show(tabs[0].getAttribute('aria-controls'),false);
 return {show:id=>show(id,true)};
};

/* 모달 */
let lastFocus=null;
window.openModal=(html,cls='')=>{
 closeModal();lastFocus=document.activeElement;
 const m=document.createElement('div');m.className='modal '+cls;m.id='modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');
 m.innerHTML='<div class="m-bg" data-close></div><div class="m-box"><button class="m-x" data-close aria-label="닫기"><svg class="ic" aria-hidden="true"><use href="#i-x"/></svg></button>'+html+'</div>';
 document.body.appendChild(m);document.documentElement.style.overflow='hidden';
 requestAnimationFrame(()=>m.classList.add('on'));
 const f=$('.m-x',m);f&&f.focus();return m};
window.closeModal=()=>{const m=$('#modal');if(!m)return;m.remove();document.documentElement.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()};
document.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
})();
