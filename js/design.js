/* Εμφάνιση του site από τον οπτικό επεξεργαστή (site_settings.key = "design").
   Δημόσιο site: διαβάζει το "published". Στο admin η προεπισκόπηση στέλνει το πρόχειρο με postMessage.
   Κάθε τιμή ελέγχεται (χρώματα hex, γραμματοσειρά και ενότητες από λίστα), ώστε να μη μπαίνει ανεπιθύμητος κώδικας. */
var DESIGN_DEFAULT={
 colors:{light:{navy:"#0b2d5e",acc:"#0b2d5e",bg:"#ffffff",ink:"#0b1b36"},dark:{navy:"#0b2d5e",acc:"#8fb0ea",bg:"#060f20",ink:"#eef2fb"}},
 font:"geom",
 sections:[{id:"nextsec",on:true},{id:"mc",on:true},{id:"matches",on:true},{id:"table",on:true},{id:"roster",on:true},{id:"stats",on:true},{id:"links",on:true}]
};
var DESIGN_FONTS={
 geom:{n:"Geom (προεπιλογή)",css:"Geom,Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif"},
 inter:{n:"Inter",css:"Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif",g:"Inter:wght@400;500;700"},
 poppins:{n:"Poppins",css:"Poppins,system-ui,sans-serif",g:"Poppins:wght@400;500;700"},
 montserrat:{n:"Montserrat",css:"Montserrat,system-ui,sans-serif",g:"Montserrat:wght@400;500;700"},
 system:{n:"Γραμματοσειρά συσκευής",css:"system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif"},
 serif:{n:"Georgia (με πατούρες)",css:"Georgia,\"Times New Roman\",serif"}
};
var DESIGN_SECTIONS={nextsec:"Επόμενος αγώνας",mc:"Match Center",matches:"Αγώνες",table:"Βαθμολογία",roster:"Ρόστερ",stats:"Στατιστικά",links:"Σύνδεσμοι"};
var DESIGN_NAV=["nextsec","mc","matches","table","roster","stats"]; /* οι «Σύνδεσμοι» δεν μπαίνουν στο μενού */
function designClean(s){
 var d=JSON.parse(JSON.stringify(DESIGN_DEFAULT));if(!s||typeof s!=="object")return d;
 ["light","dark"].forEach(function(t){["navy","acc","bg","ink"].forEach(function(k){var v=s.colors&&s.colors[t]&&s.colors[t][k];if(typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v))d.colors[t][k]=v.toLowerCase()})});
 if(typeof s.font==="string"&&DESIGN_FONTS[s.font])d.font=s.font;
 if(Array.isArray(s.sections)){var seen={},out=[];s.sections.forEach(function(x){if(x&&DESIGN_SECTIONS[x.id]&&!seen[x.id]){seen[x.id]=1;out.push({id:x.id,on:x.on!==false})}});
  d.sections.forEach(function(x){if(!seen[x.id])out.push({id:x.id,on:true})});d.sections=out}
 return d}
function designCss(d){
 var df=DESIGN_DEFAULT.colors,css="";
 ["light","dark"].forEach(function(t){var c=d.colors[t],o=df[t],r="--navy:"+c.navy+";--acc:"+c.acc+";--bg:"+c.bg+";--ink:"+c.ink+";";
  if(c.bg!==o.bg||c.ink!==o.ink)r+="--soft:color-mix(in srgb,"+c.ink+" 5%,"+c.bg+");--line:color-mix(in srgb,"+c.ink+" 13%,"+c.bg+");--mute:color-mix(in srgb,"+c.ink+" 58%,"+c.bg+");";
  if(c.navy!==o.navy)r+="--W:"+(t==="light"?c.navy:"color-mix(in srgb,"+c.navy+" 70%,#fff)")+";";
  css+=":root[data-theme=\""+t+"\"]{"+r+"}"});
 return css+":root{--f:"+DESIGN_FONTS[d.font].css+"}"}
function applyDesign(s){
 var d=designClean(s);if(!document.querySelector("main"))return d; /* το admin δεν έχει <main>: δεν αλλάζει την όψη του */
 var st=document.getElementById("design-style");
 if(!st){st=document.createElement("style");st.id="design-style";document.head.appendChild(st)}
 st.textContent=designCss(d);
 var g=DESIGN_FONTS[d.font].g,lk=document.getElementById("design-font");
 if(g){if(!lk){lk=document.createElement("link");lk.id="design-font";lk.rel="stylesheet";document.head.appendChild(lk)}lk.href="https://fonts.googleapis.com/css2?family="+g+"&display=swap"}else if(lk)lk.remove();
 var main=document.querySelector("main"),nav=document.getElementById("nav");
 d.sections.forEach(function(x){var el=document.getElementById(x.id);if(el){main.appendChild(el);el.hidden=!x.on}});
 if(nav)nav.innerHTML=d.sections.filter(function(x){return x.on&&DESIGN_NAV.indexOf(x.id)>=0}).map(function(x){return"<a href=\"#"+x.id+"\">"+DESIGN_SECTIONS[x.id]+"</a>"}).join("");
 return d}
/* Φόρτωση: άμεσα από τη μνήμη του browser (χωρίς αναβοσβήσιμο), μετά ό,τι δημοσιεύτηκε στη βάση */
(function(){
 var pv=/[?&]preview=1/.test(location.search);
 if(pv){window.addEventListener("message",function(e){if(e.origin===location.origin&&e.data&&e.data.type==="papei-design")applyDesign(e.data.settings)});
  try{parent.postMessage({type:"papei-design-ready"},location.origin)}catch(e){}return}
 try{var c=localStorage.getItem("design");if(c)applyDesign(JSON.parse(c))}catch(e){}
})();
function loadDesign(){
 if(/[?&]preview=1/.test(location.search)||typeof sb==="undefined"||!sb)return Promise.resolve();
 var job=sb.from("site_settings").select("published").eq("key","design").then(function(r){
  if(r.error)throw r.error;var p=r.data[0]&&r.data[0].published;applyDesign(p||null);
  try{if(p)localStorage.setItem("design",JSON.stringify(designClean(p)));else localStorage.removeItem("design")}catch(e){}});
 var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},4000)});
 return Promise.race([job,to]).catch(function(e){console.warn("Η εμφάνιση από τη βάση δεν φορτώθηκε",e)})}
