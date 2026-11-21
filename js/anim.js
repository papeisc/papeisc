/* Animations στο scroll: εμφάνιση ενοτήτων, count-up αριθμών, μπάρες/γραφήματα που "γεμίζουν", μπάρα προόδου, ενεργό μενού.
   Ενεργοποιούνται/απενεργοποιούνται από το admin (κλάση .anim στο <html>) και σέβονται το "μείωση κίνησης" του συστήματος.
   Ό,τι είναι ήδη ορατό στο άνοιγμα της σελίδας, ή αλλάζει από live ενημέρωση, εμφανίζεται κατευθείαν χωρίς να ξαναπαίξει animation. */
(function(){
 var R=document.documentElement,io=null,spy=null,seenIO=null,firstScan=true;
 var SEL=["section>.eb","section>h2",".nx",".mcs .mc",".mr",".stbox",".ros .pl",".tm-b>.eb",".tm-b>.tm-h",".tm-intro",".tm-c",".tm-logo",".kpi",".sx>div",".gw",".lc",".rc",".links a",".note",".tabs"];
 function on(){return R.classList.contains("anim")}
 function fmt(v,d,p){var s=(+v).toFixed(d).replace(".",",");return(p&&v>0?p:"")+s}
 function count(el){var v=parseFloat(el.dataset.v),d=+el.dataset.d||0,p=el.dataset.p||"";if(isNaN(v)||!on())return;var t0=null,dur=1100;
  function f(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmt(v*e,d,p);if(k<1)requestAnimationFrame(f);else el.textContent=fmt(v,d,p)}
  requestAnimationFrame(f)}
 function reveal(el){if(el.classList.contains("in"))return;el.classList.add("in");
  if(el.dataset.v!=null)count(el);[].forEach.call(el.querySelectorAll("[data-v]"),count)}
 function mk(){
  io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){reveal(e.target);io.unobserve(e.target)}})},{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  seenIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.dataset.seen="1";seenIO.unobserve(e.target)}})},{threshold:.05});
  document.querySelectorAll("main>section").forEach(function(s){seenIO.observe(s)});
  /* ενεργό στοιχείο μενού */
  spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;[].forEach.call(document.querySelectorAll("#nav a"),function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+id)})}})},{rootMargin:"-40% 0px -55% 0px"});
  document.querySelectorAll("main>section").forEach(function(s){spy.observe(s)});
 }
 window.animScan=function(){
  if(!("IntersectionObserver" in window))return;
  if(!io)mk();
  /* νέες ενότητες (π.χ. αλλαγή σειράς από το admin) */
  if(!on()){firstScan=false;return}
  var vh=window.innerHeight||800;
  SEL.forEach(function(sel){[].forEach.call(document.querySelectorAll("main "+sel),function(el){
   if(el.dataset.rv)return;el.dataset.rv="1";
   var idx=[].indexOf.call(el.parentNode.children,el);el.style.setProperty("--i",Math.min(idx,10));
   var sec=el.closest("section"),seen=sec&&sec.dataset.seen==="1";
   var top=el.getBoundingClientRect().top;
   el.classList.add("rv");
   if(seen){el.classList.add("in")}else if(firstScan&&top<vh*.9){reveal(el)}else io.observe(el);
  })});
  /* στα .lb / μπάρες που ανήκουν σε "rv" γονέα δεν χρειάζεται κάτι άλλο: τα χειρίζεται το CSS */
  [].forEach.call(document.querySelectorAll(".rv:not(.in)"),function(el){io.observe(el)});
  firstScan=false;
 };
 /* ασφάλεια: αν για κάποιο λόγο δεν παίξει το IntersectionObserver, δείξε τα πάντα μετά από 6" */
 setTimeout(function(){if(!on())return;[].forEach.call(document.querySelectorAll(".rv:not(.in)"),function(el){var r=el.getBoundingClientRect();if(r.top<(window.innerHeight||800))reveal(el)})},6000);
 /* μπάρα προόδου + σκιά στη μπάρα πάνω */
 var tick=false,top=document.querySelector(".top");
 function sc(){tick=false;var y=window.scrollY||0,h=document.documentElement.scrollHeight-window.innerHeight,p=document.getElementById("prog");
  if(p)p.style.transform="scaleX("+(h>0?Math.min(1,y/h):0)+")";if(top)top.classList.toggle("sc",y>8)}
 window.addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(sc)}},{passive:true});sc();
})();
