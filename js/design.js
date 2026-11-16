/* Εμφάνιση του site από τον οπτικό επεξεργαστή (site_settings.key = "design").
   Δημόσιο site: διαβάζει το "published". Στο admin η προεπισκόπηση στέλνει το πρόχειρο με postMessage.
   Κάθε τιμή ελέγχεται (χρώματα hex, γραμματοσειρά και ενότητες από λίστα, διαδρομές εικόνων, σύνδεσμοι http/https/mailto),
   ώστε να μη μπαίνει ανεπιθύμητος κώδικας. Τα κείμενα μπαίνουν πάντα ως απλό κείμενο. */
var DESIGN_TEXTS=[
 ["brand","Μπάρα πάνω: όνομα δίπλα στο λογότυπο","PAPEI SC"],
 ["hero_kick","Κεφαλίδα: μικρός τίτλος","ΠΡΟΠΑΘΛΗΜΑ 2026/27 · ΣΤ ΟΜΙΛΟΣ"],["hero_title","Κεφαλίδα: μεγάλος τίτλος","PAPEI SC"],["hero_tag","Κεφαλίδα: υπότιτλος","We Are Piraeus."],
 ["next_eb","Επόμενος αγώνας: μικρός τίτλος","Επόμενος αγώνας"],["next_h","Επόμενος αγώνας: τίτλος","Πρόγραμμα"],
 ["mc_eb","Match Center: μικρός τίτλος","Αποτελέσματα"],["mc_h","Match Center: τίτλος","Match Center"],
 ["matches_eb","Αγώνες: μικρός τίτλος","Αγώνες"],["matches_h","Αγώνες: τίτλος","Αποτελέσματα"],
 ["table_eb","Βαθμολογία: μικρός τίτλος","Προπάθλημα 2026/27"],["table_h","Βαθμολογία: τίτλος","Βαθμολογία ΣΤ Ομίλου"],
 ["roster_eb","Ρόστερ: μικρός τίτλος","Ομάδα"],["roster_h","Ρόστερ: τίτλος","Ρόστερ"],
 ["stats_eb","Στατιστικά: μικρός τίτλος","Σεζόν 2026/27"],["stats_h","Στατιστικά: τίτλος","Στατιστικά"],
 ["links_eb","Σύνδεσμοι: μικρός τίτλος","Ακολούθησε μας"],["links_h","Σύνδεσμοι: τίτλος","Σύνδεσμοι"],
 ["footer_l","Υποσέλιδο: αριστερά","PAPEI SC · We Are Piraeus"],["footer_r","Υποσέλιδο: δεξιά","Στοιχεία: Προπάθλημα και καταγραφές της ομάδας"]];
var DESIGN_IMAGES=[["header_logo","Λογότυπο στη μπάρα πάνω","hdlogo",true],["hero_logo","Λογότυπο στην κεφαλίδα","herologo",true],["hero_bg","Φωτογραφία φόντου κεφαλίδας",null,false]];
var DESIGN_DEFAULT={
 colors:{light:{navy:"#0b2d5e",acc:"#0b2d5e",bg:"#ffffff",ink:"#0b1b36"},dark:{navy:"#0b2d5e",acc:"#8fb0ea",bg:"#060f20",ink:"#eef2fb"}},
 font:"geom",
 look:{radius:6,wrap:960,dark_invert:true,hero_overlay:70},
 texts:{},links:[],images:{header_logo:"",hero_logo:"",hero_bg:""},
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
function dmedia(p){if(!p)return"";if(/^(assets\/|https?:)/.test(p))return p;return SUPABASE_URL+"/storage/v1/object/public/"+p}
function designClean(s){
 var d=JSON.parse(JSON.stringify(DESIGN_DEFAULT));if(!s||typeof s!=="object")return d;
 ["light","dark"].forEach(function(t){["navy","acc","bg","ink"].forEach(function(k){var v=s.colors&&s.colors[t]&&s.colors[t][k];if(typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v))d.colors[t][k]=v.toLowerCase()})});
 if(typeof s.font==="string"&&DESIGN_FONTS[s.font])d.font=s.font;
 var l=s.look||{};
 if(typeof l.radius==="number"&&l.radius>=0&&l.radius<=24)d.look.radius=Math.round(l.radius);
 if([840,960,1100].indexOf(l.wrap)>=0)d.look.wrap=l.wrap;
 if(typeof l.dark_invert==="boolean")d.look.dark_invert=l.dark_invert;
 if(typeof l.hero_overlay==="number"&&l.hero_overlay>=0&&l.hero_overlay<=90)d.look.hero_overlay=Math.round(l.hero_overlay);
 DESIGN_TEXTS.forEach(function(t){var v=s.texts&&s.texts[t[0]];if(typeof v==="string"&&v.trim())d.texts[t[0]]=v.trim().slice(0,300)});
 if(Array.isArray(s.links))s.links.slice(0,10).forEach(function(x){if(x&&typeof x.t==="string"&&typeof x.u==="string"&&x.t.trim()&&/^(https?:\/\/|mailto:)/i.test(x.u.trim()))d.links.push({t:x.t.trim().slice(0,60),u:x.u.trim().slice(0,400)})});
 DESIGN_IMAGES.forEach(function(m){var v=s.images&&s.images[m[0]];if(typeof v==="string"&&/^[\w-]+\/[\w.\-\/]+$/.test(v))d.images[m[0]]=v});
 if(Array.isArray(s.sections)){var seen={},out=[];s.sections.forEach(function(x){if(x&&DESIGN_SECTIONS[x.id]&&!seen[x.id]){seen[x.id]=1;out.push({id:x.id,on:x.on!==false})}});
  d.sections.forEach(function(x){if(!seen[x.id])out.push({id:x.id,on:true})});d.sections=out}
 return d}
function designCss(d){
 var df=DESIGN_DEFAULT.colors,css="";
 ["light","dark"].forEach(function(t){var c=d.colors[t],o=df[t],r="--navy:"+c.navy+";--acc:"+c.acc+";--bg:"+c.bg+";--ink:"+c.ink+";";
  if(c.bg!==o.bg||c.ink!==o.ink)r+="--soft:color-mix(in srgb,"+c.ink+" 5%,"+c.bg+");--line:color-mix(in srgb,"+c.ink+" 13%,"+c.bg+");--mute:color-mix(in srgb,"+c.ink+" 58%,"+c.bg+");";
  if(c.navy!==o.navy)r+="--W:"+(t==="light"?c.navy:"color-mix(in srgb,"+c.navy+" 70%,#fff)")+";";
  css+=":root[data-theme=\""+t+"\"]{"+r+"}"});
 css+=":root{--f:"+DESIGN_FONTS[d.font].css+";--r:"+d.look.radius+"px;--wrap:"+d.look.wrap+"px}";
 if(d.images.hero_bg){var g="color-mix(in srgb,var(--navy) "+d.look.hero_overlay+"%,transparent)";css+=".hero{background:linear-gradient("+g+","+g+"),url(\""+dmedia(d.images.hero_bg)+"\") center/cover no-repeat}"}
 return css}
function applyDesign(s){
 var d=designClean(s);if(!document.querySelector("main"))return d; /* το admin δεν έχει <main>: δεν αλλάζει την όψη του */
 var st=document.getElementById("design-style");
 if(!st){st=document.createElement("style");st.id="design-style";document.head.appendChild(st)}
 st.textContent=designCss(d);document.documentElement.dataset.di=d.look.dark_invert?"1":"0";
 var g=DESIGN_FONTS[d.font].g,lk=document.getElementById("design-font");
 if(g){if(!lk){lk=document.createElement("link");lk.id="design-font";lk.rel="stylesheet";document.head.appendChild(lk)}lk.href="https://fonts.googleapis.com/css2?family="+g+"&display=swap"}else if(lk)lk.remove();
 DESIGN_TEXTS.forEach(function(t){var el=document.querySelector("[data-t=\""+t[0]+"\"]");if(el)el.textContent=d.texts[t[0]]||t[2]});
 DESIGN_IMAGES.forEach(function(m){if(!m[2])return;var el=document.getElementById(m[2]);if(!el)return;if(!el.dataset.d)el.dataset.d=el.getAttribute("src");el.src=d.images[m[0]]?dmedia(d.images[m[0]]):el.dataset.d});
 var lc=document.getElementById("lnk");
 if(lc){if(lc.dataset.d==null)lc.dataset.d=lc.innerHTML;
  if(d.links.length){lc.innerHTML="";d.links.forEach(function(x){var a=document.createElement("a");a.textContent=x.t;a.href=x.u;a.rel="noopener";lc.appendChild(a)})}else lc.innerHTML=lc.dataset.d}
 var main=document.querySelector("main"),nav=document.getElementById("nav");
 d.sections.forEach(function(x){var el=document.getElementById(x.id);if(el){main.appendChild(el);el.hidden=!x.on}});
 if(nav)nav.innerHTML=d.sections.filter(function(x){return x.on&&DESIGN_NAV.indexOf(x.id)>=0}).map(function(x){var t=d.texts[{nextsec:"next_eb",mc:"mc_h",matches:"matches_eb",table:"table_eb",roster:"roster_h",stats:"stats_h"}[x.id]];return"<a href=\"#"+x.id+"\">"+DESIGN_SECTIONS[x.id]+"</a>"}).join("");
 return d}
/* Φόρτωση: άμεσα από τη μνήμη του browser (χωρίς αναβοσβήσιμο), μετά ό,τι δημοσιεύτηκε στη βάση */
(function(){
 var pv=/[?&]preview=1/.test(location.search);
 if(pv){window.addEventListener("message",function(e){if(e.origin===location.origin&&e.data&&e.data.type==="papei-design")applyDesign(e.data.settings)});return}
 try{var c=localStorage.getItem("design");if(c)applyDesign(JSON.parse(c))}catch(e){}
})();
function loadDesign(){
 if(/[?&]preview=1/.test(location.search)||typeof sb==="undefined"||!sb)return Promise.resolve();
 var job=sb.from("site_settings").select("published").eq("key","design").then(function(r){
  if(r.error)throw r.error;var p=r.data[0]&&r.data[0].published;applyDesign(p||null);
  try{if(p)localStorage.setItem("design",JSON.stringify(designClean(p)));else localStorage.removeItem("design")}catch(e){}});
 var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},4000)});
 return Promise.race([job,to]).catch(function(e){console.warn("Η εμφάνιση από τη βάση δεν φορτώθηκε",e)})}
