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
 ["team_nav","Μενού: όνομα της ενότητας «Η ομάδα μας»","Η ομάδα"],
 ["footer_l","Υποσέλιδο: αριστερά","PAPEI SC · We Are Piraeus"],["footer_r","Υποσέλιδο: δεξιά","Στοιχεία: Προπάθλημα και καταγραφές της ομάδας"]];
var DESIGN_IMAGES=[["header_logo","Λογότυπο στη μπάρα πάνω","hdlogo",true],["hero_logo","Λογότυπο στην κεφαλίδα","herologo",true],["hero_bg","Φωτογραφία φόντου κεφαλίδας",null,false]];
var DESIGN_DEFAULT={
 colors:{light:{navy:"#0b2d5e",acc:"#0b2d5e",bg:"#ffffff",ink:"#0b1b36"},dark:{navy:"#0b2d5e",acc:"#8fb0ea",bg:"#060f20",ink:"#eef2fb"}},
 font:"geom",
 look:{radius:6,wrap:960,dark_invert:true,hero_overlay:70,anim:true,anim_style:"up",anim_speed:600,hero_align:"left",hero_size:"normal",density:"normal",card:"line",roster:"medium",photo:"rounded",progress:true},
 stats:{kpi:true,form:true,donut:true,goals:true,leaders:true,records:true},
 announce:{on:false,text:"",url:"",tone:"navy"},
 team:{blocks:[]},
 texts:{},links:[],images:{header_logo:"",hero_logo:"",hero_bg:""},
 sections:[{id:"nextsec",on:true},{id:"mc",on:true},{id:"matches",on:true},{id:"table",on:true},{id:"roster",on:true},{id:"team",on:true},{id:"stats",on:true},{id:"links",on:true}]
};
var DESIGN_FONTS={
 geom:{n:"Geom (προεπιλογή)",css:"Geom,Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif"},
 inter:{n:"Inter",css:"Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif",g:"Inter:wght@400;500;700"},
 poppins:{n:"Poppins",css:"Poppins,system-ui,sans-serif",g:"Poppins:wght@400;500;700"},
 montserrat:{n:"Montserrat",css:"Montserrat,system-ui,sans-serif",g:"Montserrat:wght@400;500;700"},
 system:{n:"Γραμματοσειρά συσκευής",css:"system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif"},
 serif:{n:"Georgia (με πατούρες)",css:"Georgia,\"Times New Roman\",serif"}
};
var DESIGN_PRESETS=[
 {n:"PAPEI μπλε",c:{light:{navy:"#0b2d5e",acc:"#0b2d5e"},dark:{navy:"#0b2d5e",acc:"#8fb0ea"}}},
 {n:"Κόκκινο",c:{light:{navy:"#8a1020",acc:"#8a1020"},dark:{navy:"#8a1020",acc:"#ff8a95"}}},
 {n:"Πράσινο",c:{light:{navy:"#0b5d3b",acc:"#0b5d3b"},dark:{navy:"#0b5d3b",acc:"#6fd1a0"}}},
 {n:"Μαύρο & χρυσό",c:{light:{navy:"#141414",acc:"#8a6d00"},dark:{navy:"#1c1c1c",acc:"#e6c35c"}}},
 {n:"Μωβ",c:{light:{navy:"#4a1d96",acc:"#4a1d96"},dark:{navy:"#4a1d96",acc:"#b79cf2"}}},
 {n:"Πορτοκαλί",c:{light:{navy:"#b34a00",acc:"#b34a00"},dark:{navy:"#b34a00",acc:"#ffb27a"}}}];
var DESIGN_OPTS={
 anim_style:[["up","Από κάτω"],["fade","Διάλυση"],["zoom","Μεγέθυνση"],["slide","Από αριστερά"]],
 hero_align:[["left","Αριστερά"],["center","Κέντρο"]],
 hero_size:[["compact","Μικρή"],["normal","Κανονική"],["tall","Ψηλή"]],
 density:[["compact","Συμπαγής"],["normal","Κανονική"],["airy","Αέρινη"]],
 card:[["line","Με περίγραμμα"],["soft","Γεμισμένη"],["shadow","Με σκιά"]],
 roster:[["small","Μικρές κάρτες"],["medium","Μεσαίες"],["large","Μεγάλες"]],
 photo:[["rounded","Ορθογώνιες"],["circle","Στρογγυλές"]],
 tlayout:[["right","Φωτογραφία δεξιά"],["left","Φωτογραφία αριστερά"],["top","Φωτογραφία πάνω"]],
 tshape:[["rect","Ορθογώνιες φωτογραφίες"],["circle","Στρογγυλές φωτογραφίες"]],
 tsize:[["small","Μικρά λογότυπα"],["medium","Μεσαία"],["large","Μεγάλα"]],
 tone:[["navy","Μπλε"],["red","Κόκκινο"],["green","Πράσινο"],["gold","Χρυσό"]]};
var DESIGN_STATS={kpi:"Βασικοί αριθμοί",form:"Φόρμα, νίκες/ισοπαλίες/ήττες, γκολ",goals:"Γράφημα γκολ ανά αγώνα",leaders:"Σκόρερ και ασίστ",records:"Ρεκόρ και σερί"};
var DESIGN_SECTIONS={nextsec:"Επόμενος αγώνας",mc:"Match Center",matches:"Αγώνες",table:"Βαθμολογία",roster:"Ρόστερ",team:"Η ομάδα μας",stats:"Στατιστικά",links:"Σύνδεσμοι"};
var DESIGN_NAV=["nextsec","mc","matches","table","roster","team","stats"]; /* οι «Σύνδεσμοι» δεν μπαίνουν στο μενού */
var TEAM_TYPES={text:"Κείμενο με φωτογραφία",people:"Πρόσωπα (π.χ. τεχνικό επιτελείο, διοίκηση)",logos:"Λογότυπα (π.χ. χορηγοί)"};
function tImg(v){return typeof v==="string"&&/^[\w-]+\/[\w.\-\/]+$/.test(v)?v:""}
function tUrl(v){return typeof v==="string"&&/^(https?:\/\/|mailto:)/i.test(v.trim())?v.trim().slice(0,400):""}
function tOpt(k,v,def){return typeof v==="string"&&DESIGN_OPTS[k].some(function(o){return o[0]===v})?v:def}
function tStr(v,n){return typeof v==="string"?v.trim().slice(0,n):""}
function teamClean(t){var out={blocks:[]};if(!t||!Array.isArray(t.blocks))return out;
 t.blocks.slice(0,12).forEach(function(b){if(!b||!TEAM_TYPES[b.type])return;var o={type:b.type,eyebrow:tStr(b.eyebrow,80),title:tStr(b.title,120)};
  if(b.type==="text"){o.paras=(Array.isArray(b.paras)?b.paras:[]).slice(0,14).map(function(x){return tStr(x,1500)}).filter(Boolean);o.image=tImg(b.image);o.layout=tOpt("tlayout",b.layout,"right")}
  else{o.items=(Array.isArray(b.items)?b.items:[]).slice(0,48).map(function(x){x=x||{};return{name:tStr(x.name,80),role:tStr(x.role,120),img:tImg(x.img),url:tUrl(x.url)}});
   if(b.type==="people")o.shape=tOpt("tshape",b.shape,"rect");else o.size=tOpt("tsize",b.size,"medium")}
  out.blocks.push(o)});return out}
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
 ["anim_style","hero_align","hero_size","density","card","roster","photo"].forEach(function(k){var v=l[k];if(typeof v==="string"&&DESIGN_OPTS[k].some(function(o){return o[0]===v}))d.look[k]=v});
 if(typeof l.anim==="boolean")d.look.anim=l.anim;if(typeof l.progress==="boolean")d.look.progress=l.progress;
 if(typeof l.anim_speed==="number"&&l.anim_speed>=250&&l.anim_speed<=1400)d.look.anim_speed=Math.round(l.anim_speed);
 if(s.stats&&typeof s.stats==="object")Object.keys(d.stats).forEach(function(k){if(typeof s.stats[k]==="boolean")d.stats[k]=s.stats[k]});
 var an=s.announce;if(an&&typeof an==="object"){if(typeof an.on==="boolean")d.announce.on=an.on;if(typeof an.text==="string")d.announce.text=an.text.trim().slice(0,200);
  if(typeof an.url==="string"&&/^(https?:\/\/|mailto:|#)/i.test(an.url.trim()))d.announce.url=an.url.trim().slice(0,400);
  if(typeof an.tone==="string"&&DESIGN_OPTS.tone.some(function(o){return o[0]===an.tone}))d.announce.tone=an.tone}
 d.team=teamClean(s.team);
 DESIGN_TEXTS.forEach(function(t){var v=s.texts&&s.texts[t[0]];if(typeof v==="string"&&v.trim())d.texts[t[0]]=v.trim().slice(0,300)});
 if(Array.isArray(s.links))s.links.slice(0,10).forEach(function(x){if(x&&typeof x.t==="string"&&typeof x.u==="string"&&x.t.trim()&&/^(https?:\/\/|mailto:)/i.test(x.u.trim()))d.links.push({t:x.t.trim().slice(0,60),u:x.u.trim().slice(0,400)})});
 DESIGN_IMAGES.forEach(function(m){var v=s.images&&s.images[m[0]];if(typeof v==="string"&&/^[\w-]+\/[\w.\-\/]+$/.test(v))d.images[m[0]]=v});
 if(Array.isArray(s.sections)){var seen={},out=[];s.sections.forEach(function(x){if(x&&DESIGN_SECTIONS[x.id]&&!seen[x.id]){seen[x.id]=1;out.push({id:x.id,on:x.on!==false})}});
  if(!seen.team){var ri=-1;out.forEach(function(x,i){if(x.id==="roster")ri=i});out.splice(ri>=0?ri+1:out.length,0,{id:"team",on:true});seen.team=1}
  d.sections.forEach(function(x){if(!seen[x.id])out.push({id:x.id,on:true})});d.sections=out}
 return d}
function designCss(d){
 var df=DESIGN_DEFAULT.colors,css="";
 ["light","dark"].forEach(function(t){var c=d.colors[t],o=df[t],r="--navy:"+c.navy+";--acc:"+c.acc+";--bg:"+c.bg+";--ink:"+c.ink+";";
  if(c.bg!==o.bg||c.ink!==o.ink)r+="--soft:color-mix(in srgb,"+c.ink+" 5%,"+c.bg+");--line:color-mix(in srgb,"+c.ink+" 13%,"+c.bg+");--mute:color-mix(in srgb,"+c.ink+" 58%,"+c.bg+");";
  if(c.navy!==o.navy)r+="--W:"+(t==="light"?c.navy:"color-mix(in srgb,"+c.navy+" 70%,#fff)")+";";
  css+=":root[data-theme=\""+t+"\"]{"+r+"}"});
 css+=":root{--f:"+DESIGN_FONTS[d.font].css+";--r:"+d.look.radius+"px;--wrap:"+d.look.wrap+"px;--ad:"+(d.look.anim_speed/1000)+"s;--rw:"+({small:"118px",medium:"150px",large:"205px"}[d.look.roster])+"}";
 if(d.images.hero_bg){var g="color-mix(in srgb,var(--navy) "+d.look.hero_overlay+"%,transparent)";css+=".hero{background:linear-gradient("+g+","+g+"),url(\""+dmedia(d.images.hero_bg)+"\") center/cover no-repeat}"}
 return css}
/* Ενότητα «Η ομάδα μας»: κείμενα, πρόσωπα, λογότυπα, όλα από το admin. Μόνο απλό κείμενο και ελεγμένοι σύνδεσμοι/εικόνες. */
function tEl(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function tPara(txt){var p=tEl("p","tm-p"),re=/\[([^\]]{1,120})\]\((https?:\/\/[^)\s]{1,300}|mailto:[^)\s]{1,200})\)/g,i=0,m;
 while((m=re.exec(txt))){if(m.index>i)p.appendChild(document.createTextNode(txt.slice(i,m.index)));var a=tEl("a",null,m[1]);a.href=m[2];a.rel="noopener";p.appendChild(a);i=m.index+m[0].length}
 if(i<txt.length)p.appendChild(document.createTextNode(txt.slice(i)));return p}
function tImgEl(path,alt){var im=document.createElement("img");im.src=dmedia(path);im.alt=alt||"";im.loading="lazy";im.decoding="async";return im}
function renderTeam(t){
 var host=document.getElementById("teamx");if(!host)return false;var k=JSON.stringify(t);
 if(host.dataset.k===k)return t.blocks.length>0;host.dataset.k=k;host.textContent="";
 t.blocks.forEach(function(b,bi){
  var w=tEl("div","tm-b tm-"+b.type);w.setAttribute("data-tm","b"+bi);
  if(b.eyebrow)w.appendChild(tEl("p","eb",b.eyebrow));if(b.title)w.appendChild(tEl("h2","tm-h",b.title));
  if(b.type==="text"){var box=tEl("div","tm-intro tm-l-"+b.layout),tx=tEl("div","tm-txt");b.paras.forEach(function(x){tx.appendChild(tPara(x))});
   var im=null;if(b.image){im=tEl("div","tm-img");im.appendChild(tImgEl(b.image,b.title))}
   if(b.layout==="left"&&im)box.appendChild(im);
   if(b.paras.length)box.appendChild(tx);
   if(b.layout!=="left"&&im)box.appendChild(im);
   w.appendChild(box)}
  else if(b.type==="people"){var g=tEl("div","tm-grid tm-"+b.shape);
   b.items.forEach(function(x,ii){if(!x.name&&!x.img)return;var c=tEl("div","tm-c");c.setAttribute("data-tm","b"+bi+"i"+ii);
    var ph=tEl("div","tm-ph");if(x.img)ph.appendChild(tImgEl(x.img,x.name));else ph.textContent=(x.name||"?").charAt(0);c.appendChild(ph);
    if(x.name)c.appendChild(tEl("div","tm-n",x.name));if(x.role)c.appendChild(tEl("div","tm-r",x.role));g.appendChild(c)});w.appendChild(g)}
  else{var g2=tEl("div","tm-grid tm-lg tm-s-"+b.size);
   b.items.forEach(function(x,ii){if(!x.img&&!x.name)return;var c=x.url?tEl("a","tm-logo"):tEl("div","tm-logo");if(x.url){c.href=x.url;c.rel="noopener"}c.setAttribute("data-tm","b"+bi+"i"+ii);
    if(x.img)c.appendChild(tImgEl(x.img,x.name));else c.appendChild(tEl("span",null,x.name));g2.appendChild(c)});w.appendChild(g2)}
  host.appendChild(w)});
 return t.blocks.length>0}
function applyDesign(s){
 var d=designClean(s);if(!document.querySelector("main"))return d; /* το admin δεν έχει <main>: δεν αλλάζει την όψη του */
 var st=document.getElementById("design-style");
 if(!st){st=document.createElement("style");st.id="design-style";document.head.appendChild(st)}
 st.textContent=designCss(d);var R=document.documentElement;R.dataset.di=d.look.dark_invert?"1":"0";
 R.dataset.hs=d.look.hero_size;R.dataset.ha=d.look.hero_align;R.dataset.dn=d.look.density;R.dataset.cd=d.look.card;R.dataset.ps=d.look.photo;R.dataset.an=d.look.anim_style;
 var canAn=d.look.anim&&"IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion:reduce)").matches;R.classList.toggle("anim",!!canAn);
 var pg=document.getElementById("prog");if(pg)pg.hidden=!d.look.progress;
 var an=document.getElementById("ann");if(an){an.hidden=!(d.announce.on&&d.announce.text);an.className="ann "+d.announce.tone;an.textContent=d.announce.text;
  if(d.announce.url){var aa=document.createElement("a");aa.href=d.announce.url;aa.textContent="Δες περισσότερα";aa.rel="noopener";an.appendChild(aa)}}
 Object.keys(d.stats).forEach(function(k){document.querySelectorAll("[data-st=\""+k+"\"]").forEach(function(el){el.hidden=!d.stats[k]})});
 var g=DESIGN_FONTS[d.font].g,lk=document.getElementById("design-font");
 if(g){if(!lk){lk=document.createElement("link");lk.id="design-font";lk.rel="stylesheet";document.head.appendChild(lk)}lk.href="https://fonts.googleapis.com/css2?family="+g+"&display=swap"}else if(lk)lk.remove();
 DESIGN_TEXTS.forEach(function(t){var el=document.querySelector("[data-t=\""+t[0]+"\"]");if(el)el.textContent=d.texts[t[0]]||t[2]});
 DESIGN_IMAGES.forEach(function(m){if(!m[2])return;var el=document.getElementById(m[2]);if(!el)return;if(!el.dataset.d)el.dataset.d=el.getAttribute("src");el.src=d.images[m[0]]?dmedia(d.images[m[0]]):el.dataset.d});
 var lc=document.getElementById("lnk");
 if(lc){if(lc.dataset.d==null)lc.dataset.d=lc.innerHTML;
  if(d.links.length){lc.innerHTML="";d.links.forEach(function(x){var a=document.createElement("a");a.textContent=x.t;a.href=x.u;a.rel="noopener";lc.appendChild(a)})}else lc.innerHTML=lc.dataset.d}
 var main=document.querySelector("main"),nav=document.getElementById("nav");
 var hasTeam=renderTeam(d.team),pvm=document.documentElement.classList.contains("pv");
 d.sections.forEach(function(x){var el=document.getElementById(x.id);if(el){main.appendChild(el);el.hidden=!x.on||(x.id==="team"&&!hasTeam&&!pvm)}});
 if(nav)nav.innerHTML=d.sections.filter(function(x){return x.on&&DESIGN_NAV.indexOf(x.id)>=0&&(x.id!=="team"||hasTeam)}).map(function(x){var t=d.texts[{nextsec:"next_eb",mc:"mc_h",matches:"matches_eb",table:"table_eb",roster:"roster_h",stats:"stats_h"}[x.id]];return"<a href=\"#"+x.id+"\">"+(x.id==="team"?(d.texts.team_nav||"Η ομάδα"):DESIGN_SECTIONS[x.id])+"</a>"}).join("");
 if(window.animScan)window.animScan();
 return d}
/* Φόρτωση: άμεσα από τη μνήμη του browser (χωρίς αναβοσβήσιμο), μετά ό,τι δημοσιεύτηκε στη βάση */
(function(){
 var pv=/[?&]preview=1/.test(location.search);
 if(pv){document.documentElement.classList.add("pv");
  window.addEventListener("message",function(e){if(e.origin!==location.origin||!e.data)return;
   if(e.data.type==="papei-design")applyDesign(e.data.settings);
   if(e.data.type==="papei-scroll"){var el=document.getElementById(e.data.id)||document.querySelector("[data-t=\""+e.data.id+"\"]");if(el)el.scrollIntoView({behavior:"smooth",block:"center"})}});
  /* Κλικ πάνω στο site (προεπισκόπηση) -> το admin ανοίγει το αντίστοιχο πεδίο */
  document.addEventListener("click",function(e){var m=null,t=e.target;
   if(t.closest){var x;
    if(x=t.closest("[data-t]"))m={kind:"text",key:x.getAttribute("data-t")};
    else if(t.id==="hdlogo")m={kind:"image",key:"header_logo"};else if(t.id==="herologo")m={kind:"image",key:"hero_logo"};
    else if(x=t.closest("[data-tm]"))m={kind:"team",key:x.getAttribute("data-tm")};
     else if(x=t.closest("#ann"))m={kind:"announce"};
    else if(x=t.closest(".hero"))m={kind:"image",key:"hero_bg"};
    else if(x=t.closest("section[id]"))m={kind:"section",key:x.id}}
   e.preventDefault();e.stopPropagation();if(m){m.type="papei-pick";parent.postMessage(m,location.origin)}},true);
  return}
 try{var c=localStorage.getItem("design");if(c)applyDesign(JSON.parse(c))}catch(e){}
})();
window.refreshDesign=function(){return loadDesign()};
function loadDesign(){
 if(/[?&]preview=1/.test(location.search)||typeof sb==="undefined"||!sb)return Promise.resolve();
 var job=sb.from("site_settings").select("published").eq("key","design").then(function(r){
  if(r.error)throw r.error;var p=r.data[0]&&r.data[0].published;applyDesign(p||null);
  try{if(p)localStorage.setItem("design",JSON.stringify(designClean(p)));else localStorage.removeItem("design")}catch(e){}});
 var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},4000)});
 return Promise.race([job,to]).catch(function(e){console.warn("Η εμφάνιση από τη βάση δεν φορτώθηκε",e)})}
