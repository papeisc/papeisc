function MY(){return window.US_LOGO||"assets/logo-256.png"}
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fd(d){if(!d)return"";var p=d.split("-");return p[2]+"/"+p[1]}
function fdl(d){if(!d)return"Δεν έχει καταχωρηθεί";return new Date(d+"T12:00:00").toLocaleDateString("el-GR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
function res(m){var us=m[1]===US,f=us?m[2]:m[3],a=us?m[3]:m[2];return f>a?"W":f<a?"L":"D"}
function rec(ms){var r={W:0,D:0,L:0,f:0,a:0};ms.forEach(function(m){var us=m[1]===US;r[res(m)]++;r.f+=us?m[2]:m[3];r.a+=us?m[3]:m[2]});return r}
function ini(n){var w=n.replace(/[^A-Za-zΑ-Ωα-ωά-ώ0-9 ]/g,"").split(" ").filter(Boolean);return(w.length>1?w[0][0]+w[1][0]:(w[0]||"?").slice(0,2)).toUpperCase()}
/* Logos: admin > τοπικά βελτιστοποιημένα > Προπάθλημα > αρχικά (βλ. js/logos.js) */
function lsrc(n){var a=[];if(n===US){a.push(MY());return a}
 if(DBLOGO[n])a.push(DBLOGO[n]);var l=window.localLogo?localLogo(n):"";if(l)a.push(l);var p=window.plLogo?plLogo(n):"";if(p)a.push(p);return a}
function limg(n){var s=lsrc(n);if(!s.length)return"";var u=s[0];var tn=(n!==US&&window.localTone)?localTone(n):"";return"<img class=\"lg"+(n===US?" us":u.indexOf("propathlima.gr")>=0?" pl":"")+(tn?" t"+tn:"")+"\" alt=\"\" width=\"64\" height=\"64\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" data-n=\""+esc(n)+"\""+(s.length>1?" data-fb=\""+esc(s.slice(1).join("|"))+"\"":"")+" src=\""+esc(u)+"\">"}
function tb(n){var i=limg(n);return i?"<span class=\"tb\">"+i+"</span>":""}
function big(n){var i=limg(n);return"<span class=\"ic"+(i?"":" fb")+"\">"+(i||esc(ini(n)))+"</span>"}
function sl(n){var i=limg(n);return"<span class=\"sl"+(i?"":" fb")+"\">"+(i||esc(ini(n)))+"</span>"}
document.addEventListener("error",function(e){var t=e.target;if(!t||t.tagName!=="IMG"||!t.classList.contains("lg"))return;var f=(t.dataset.fb||"").split("|").filter(Boolean);
 if(f.length){var nx=f.shift();t.dataset.fb=f.join("|");t.classList.toggle("pl",nx.indexOf("propathlima.gr")>=0);t.src=nx;return}
 var p=t.parentNode;if(!p)return;if(p.classList.contains("ic")||p.classList.contains("sl")){p.classList.add("fb");p.textContent=ini(t.dataset.n||"?")}else t.remove()},true);


/* ---------- Βοηθητικά ---------- */
function curSeason(){return window.CUR&&SEASONS[window.CUR]?window.CUR:(Object.keys(SEASONS).sort().reverse()[0]||"")}
function key(m,i){return(m[0]||"9999-99-99")+"|"+("00"+i).slice(-3)}
function chron(ms){return ms.map(function(m,i){return[key(m,i),m]}).sort(function(a,b){return a[0]<b[0]?-1:1}).map(function(x){return x[1]})}
function ours(m){return m[1]===US||m[4]===US}
function myGF(m){return m[1]===US?m[2]:m[3]}
function myGA(m){return m[1]===US?m[3]:m[2]}
function oppOf(m){return m[1]===US?m[4]:m[1]}

/* ---------- Επόμενος αγώνας ---------- */
var _cd=null;
function mapUrl(){return NEXT.map||(NEXT.venue?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(NEXT.venue):"")}
function renderNext(){
 var c=$("nextcard");clearInterval(_cd);if(NEXT&&athens(NEXT.date,NEXT.time).getTime()+72e5<Date.now())NEXT=null;
 if(!NEXT){c.innerHTML="<div class=\"vs\">"+big(US)+"<span class=\"sm\">VS</span><span class=\"ic\">?</span></div><div class=\"tm\">Ο επόμενος αγώνας θα ανακοινωθεί σύντομα</div><p class=\"sm\" style=\"margin:6px 0 0\">Το πρόγραμμα ανεβαίνει στο <a href=\"https://propathlima.gr/team/papei-sc/\" rel=\"noopener\">Προπάθλημα</a>.</p>";return}
 var u=mapUrl();
 c.innerHTML="<div class=\"sm\" style=\"letter-spacing:.12em;font-size:12px;margin-bottom:14px\">ΠΡΟΠΑΘΛΗΜΑ · ΣΤ ΟΜΙΛΟΣ</div><div class=\"vs\">"+big(NEXT.home)+"<span class=\"sm\">VS</span>"+big(NEXT.away)+"</div><div class=\"tm\">"+esc(NEXT.home)+" – "+esc(NEXT.away)+"</div><div class=\"sm\">"+fdl(NEXT.date)+" · "+esc(NEXT.time)+(NEXT.venue?" · "+esc(NEXT.venue):"")+"</div><div class=\"cd\" id=\"cd\"></div>"+(u?"<a class=\"btn\" rel=\"noopener\" href=\""+esc(u)+"\">Τοποθεσία γηπέδου</a>":"");
 var t=athens(NEXT.date,NEXT.time);
 function tick(){var s=Math.max(0,Math.floor((t-new Date())/1000)),v=[[Math.floor(s/86400),"ημέρες"],[Math.floor(s%86400/3600),"ώρες"],[Math.floor(s%3600/60),"λεπτά"],[s%60,"δευτ."]];
  $("cd").innerHTML=v.map(function(x){return"<div><b>"+x[0]+"</b><span>"+x[1]+"</span></div>"}).join("")}
 tick();_cd=setInterval(tick,1000);
}

/* ---------- Βαθμολογία ---------- */
function renderTable(){
 $("tbody").innerHTML=TABLE.length?TABLE.map(function(r){var g=r[6].split("-");return"<tr"+(r[1]===US?" class=\"me\"":"")+"><td>"+r[0]+"</td><td><div class=\"stn\">"+sl(r[1])+"<span>"+esc(r[1])+"</span></div></td><td><b>"+r[8]+"</b></td><td>"+r[2]+"</td><td>"+r[3]+"/"+r[4]+"/"+r[5]+"</td><td>"+g[0]+"</td><td>"+g[1]+"</td></tr>"}).join(""):"<tr class=\"empty\"><td colspan=\"7\">Η βαθμολογία ανεβαίνει σύντομα. <a href=\""+SOFA+"\" rel=\"noopener\">Δες την στο SofaScore</a></td></tr>";
}

/* ---------- Ρόστερ ---------- */
var IG_SVG="<svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1\" fill=\"currentColor\" stroke=\"none\"/></svg>";
function igOf(det){var x=(det||[]).filter(function(d){return d&&d.l==="Instagram"})[0];if(!x||!x.v)return null;var v=String(x.v).trim(),h;
 var m=v.match(/^https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9._]{1,30})\/?(?:\?.*)?$/i);if(m)h=m[1];else{h=v.replace(/^@/,"");if(!/^[A-Za-z0-9._]{1,30}$/.test(h))return null}
 return{h:h,url:"https://www.instagram.com/"+h+"/"}}
function renderRoster(){
 $("ros").innerHTML=P.filter(function(p){return HIDE.indexOf(p[0])<0}).sort(function(a,b){return b[1]-a[1]||b[2]+b[3]-a[2]-a[3]}).map(function(p){
  var ph=PHOTOS[p[0]];
  var ig=igOf((PINFO[p[0]]||{}).det);return"<div class=\"pl\" role=\"button\" tabindex=\"0\" data-n=\""+esc(p[0])+"\"><div class=\"ph\">"+(ph?"<img loading=\"lazy\" alt=\""+esc(p[0])+"\" src=\""+esc(ph)+"\">":esc(p[0][0]))+(ig?"<a class=\"ig\" target=\"_blank\" rel=\"noopener\" href=\""+esc(ig.url)+"\" aria-label=\"Instagram του "+esc(p[0])+"\">"+IG_SVG+"</a>":"")+"</div><div class=\"nm\">"+esc(p[0])+"</div><div class=\"ps\">"+p[2]+" γκολ · "+p[3]+" ασίστ · "+p[1]+" αγ.</div></div>"}).join("");
}
function bindPlayerCard(){
 var d=$("pm");
 $("ros").addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&e.target.classList&&e.target.classList.contains("pl")){e.preventDefault();e.target.click()}});
 $("ros").addEventListener("click",function(e){if(e.target.closest("a.ig"))return;var b=e.target.closest(".pl");if(!b||!d)return;var M={};P.forEach(function(p){M[p[0]]=p});
  var n=b.dataset.n,p=M[n],ig=igOf((PINFO[n]||{}).det);if(!p)return;d.classList.remove("match-modal");var I=PINFO[n]||{},ph=PHOTOS[n],ps=[I.num?"#"+I.num:"",I.pos||""].filter(Boolean).join(" · ");
  d.innerHTML="<div class=\"pmb\"><button class=\"pmx\" aria-label=\"Κλείσιμο\">×</button><div class=\"pmw\"><div class=\"ph\">"+(ph?"<img alt=\""+esc(n)+"\" src=\""+esc(ph)+"\">":esc(n[0]))+"</div><div><h3 id=\"pmn\">"+esc(n)+"</h3><p class=\"pmm\">"+esc(ps||"Παίκτης")+"</p><div class=\"pmst\"><div><b>"+p[1]+"</b><span>αγώνες</span></div><div><b>"+p[2]+"</b><span>γκολ</span></div><div><b>"+p[3]+"</b><span>ασίστ</span></div></div></div></div>"+(I.bio?"<p class=\"pmbio\">"+esc(I.bio)+"</p>":"")+(ig?"<p><a class=\"pmig\" target=\"_blank\" rel=\"noopener\" href=\""+esc(ig.url)+"\">"+IG_SVG+" @"+esc(ig.h)+"</a></p>":"")+((I.det&&I.det.filter(function(x){return x.l!=="Instagram"}).length)?"<dl class=\"pmd\">"+I.det.filter(function(x){return x.l!=="Instagram"}).map(function(x){return"<dt>"+esc(x.l)+"</dt><dd>"+esc(x.v)+"</dd>"}).join("")+"</dl>":"")+"</div>";
  if(d.showModal)d.showModal();else d.setAttribute("open","")});
 if(d)d.addEventListener("click",function(e){if(e.target===d||e.target.closest(".pmx")){if(d.close)d.close();else d.removeAttribute("open")}});
}

/* ---------- Στατιστικά ---------- */
function avatar(n){var ph=PHOTOS[n];return"<span class=\"av\">"+(ph?"<img loading=\"lazy\" alt=\"\" src=\""+esc(ph)+"\">":esc(ini(n)))+"</span>"}
function lb(id,title,rows){
 var el=$(id);if(!rows.length){el.innerHTML="";el.hidden=true;return}el.hidden=false;var mx=rows[0][1];
 el.innerHTML="<h4>"+title+"</h4>"+rows.slice(0,6).map(function(r,i){return"<div class=\"lb\"><span class=\"n\">"+(i+1)+"</span>"+avatar(r[0])+"<span class=\"nm\">"+esc(r[0])+"</span><span class=\"v\">"+r[1]+"</span><span class=\"bw\"><i style=\"width:"+(r[1]/mx*100)+"%\"></i></span></div>"}).join("");
}
function kpi(v,l,o){o=o||{};var d=o.d||0,p=o.p||"",txt=(p&&v>0?p:"")+(+v).toFixed(d).replace(".",",");
 return"<div class=\"kpi"+(o.hl?" hl":"")+"\"><b data-v=\""+v+"\" data-d=\""+d+"\""+(p?" data-p=\""+p+"\"":"")+">"+txt+"</b><span>"+l+"</span></div>"}
function streaks(ms){var cur={u:0,w:0},best={u:0,w:0},u=0,w=0;ms.forEach(function(m){var r=res(m);u=r==="L"?0:u+1;w=r==="W"?w+1:0;if(u>best.u)best.u=u;if(w>best.w)best.w=w});cur.u=u;cur.w=w;return{cur:cur,best:best}}
function renderStats(){
 var k=curSeason(),all=SEASONS[k]||[],ms=chron(all.filter(ours)),n=ms.length,r=rec(ms),G=0,A=0,sc=0;
 P.forEach(function(p){G+=p[2];A+=p[3];if(p[2]>0)sc++});var d=r.f-r.a,pts=r.W*3+r.D;
 /* 1. Βασικοί αριθμοί */
 $("st_kpi").innerHTML="<div class=\"kpis\">"+[kpi(n,"αγώνες",{hl:1}),kpi(r.W,"νίκες"),kpi(r.f,"γκολ υπέρ"),kpi(r.a,"γκολ κατά"),kpi(d,"διαφορά τερμάτων",{p:"+"}),kpi(n?r.f/n:0,"γκολ ανά αγώνα",{d:2}),kpi(n?Math.round(r.W/n*100):0,"% νικών"),kpi(A,"ασίστ"),kpi(sc,"διαφορετικοί σκόρερ"),kpi(ms.filter(function(m){return myGA(m)===0}).length,"αγώνες χωρίς γκολ κατά")].join("")+"</div>";
 /* 2. Φόρμα + W/D/L + γκολ */
 var last=ms.slice(-5),L=last.map(function(m,i){var q=res(m);return"<span class=\"fchip "+q+"\" style=\"--i:"+i+"\" title=\""+esc(oppOf(m))+" "+m[2]+"-"+m[3]+"\">"+{W:"Ν",D:"Ι",L:"Η"}[q]+"</span>"}).join("");
 var lbl=last.map(function(m){return"<span>"+esc(fd(m[0])||"")+" "+myGF(m)+"-"+myGA(m)+"</span>"}).join("");
 var tot=Math.max(1,n),offs=0,segs=["W","D","L"].map(function(q){var l=r[q]/tot*100,s="<circle class=\"seg "+q+"\" cx=\"21\" cy=\"21\" r=\"15.9155\" pathLength=\"100\" style=\"--l:"+l.toFixed(2)+";stroke-dasharray:"+l.toFixed(2)+" 100;stroke-dashoffset:"+(-offs).toFixed(2)+"\"/>";offs+=l;return s}).join("");
 var mx=Math.max(1,r.f,r.a);
 $("st_form").innerHTML="<div class=\"sx\"><div><h4>Φόρμα (τελευταίοι 5)</h4>"+(L?"<div class=\"form\">"+L+"</div><div class=\"fl\">"+lbl+"</div>":"<span class=\"sm\">Δεν υπάρχουν αγώνες ακόμη.</span>")+"</div>"+
  "<div><h4>Νίκες · ισοπαλίες · ήττες</h4><div class=\"dw\"><svg class=\"dn\" viewBox=\"0 0 42 42\" role=\"img\" aria-label=\""+r.W+" νίκες, "+r.D+" ισοπαλίες, "+r.L+" ήττες\"><circle class=\"bg\" cx=\"21\" cy=\"21\" r=\"15.9155\"/>"+segs+"</svg><div class=\"dl2\"><div class=\"W\"><i></i>Νίκες<b>"+r.W+"</b></div><div class=\"D\"><i></i>Ισοπαλίες<b>"+r.D+"</b></div><div class=\"L\"><i></i>Ήττες<b>"+r.L+"</b></div><div><i style=\"background:var(--mute)\"></i>Βαθμοί<b>"+pts+"</b></div></div></div></div>"+
  "<div><h4>Γκολ</h4><div class=\"gfa\"><div class=\"r\">Υπέρ<span class=\"t\"><i style=\"width:"+(r.f/mx*100)+"%\"></i></span><b>"+r.f+"</b></div><div class=\"r a\">Κατά<span class=\"t\"><i style=\"width:"+(r.a/mx*100)+"%\"></i></span><b>"+r.a+"</b></div></div></div></div>";
 /* 3. Γκολ ανά αγώνα */
 var gm=Math.max(1,Math.max.apply(null,ms.map(function(m){return Math.max(myGF(m),myGA(m))}).concat([1])));
 $("st_goals").innerHTML=ms.length?"<div class=\"gw\"><h4>Γκολ ανά αγώνα</h4><div class=\"gch\">"+ms.map(function(m,i){var f=myGF(m),a=myGA(m);
  return"<div class=\"gcol\" style=\"--i:"+i+"\" title=\""+esc(oppOf(m))+" "+f+"-"+a+"\"><div class=\"gpair\"><span class=\"gb\"><i style=\"height:"+(f/gm*100)+"%\"></i></span><span class=\"gb a\"><i style=\"height:"+(a/gm*100)+"%\"></i></span></div><span class=\"gv\">"+f+"-"+a+"</span><span class=\"gd\">"+esc(fd(m[0])||"–")+"</span></div>"}).join("")+"</div><div class=\"gk\"><span><i></i>Υπέρ</span><span class=\"a\"><i></i>Κατά</span></div></div>":"";
 /* 4. Κορυφαίοι */
 lb("lbg","Σκόρερ",P.filter(function(p){return p[2]>0}).sort(function(a,b){return b[2]-a[2]}).map(function(p){return[p[0],p[2]]}));
 lb("lba","Ασίστ",P.filter(function(p){return p[3]>0}).sort(function(a,b){return b[3]-a[3]}).map(function(p){return[p[0],p[3]]}));
 lb("lbt","Γκολ + ασίστ",P.filter(function(p){return p[2]+p[3]>0}).sort(function(a,b){return b[2]+b[3]-a[2]-a[3]}).map(function(p){return[p[0],p[2]+p[3]]}));
 /* 5. Ρεκόρ και σερί (υπολογίζονται από τους αγώνες) */
 var rows=[],bw=null,mg=null,cs=0;ms.forEach(function(m){var f=myGF(m),a=myGA(m);if(a===0)cs++;if(f>a&&(!bw||f-a>myGF(bw)-myGA(bw)))bw=m;if(!mg||f>myGF(mg))mg=m});
 var st=streaks(ms);
 if(bw)rows.push(["Μεγαλύτερη νίκη",myGF(bw)+"-"+myGA(bw)+" vs "+esc(oppOf(bw))]);
 if(mg)rows.push(["Περισσότερα γκολ σε αγώνα",myGF(mg)+" vs "+esc(oppOf(mg))]);
 if(n)rows.push(["Αγώνες χωρίς γκολ κατά",cs]);
 if(n){rows.push(["Σερί αήττητου (τώρα / καλύτερο)",st.cur.u+" / "+st.best.u]);rows.push(["Σερί νικών (τώρα / καλύτερο)",st.cur.w+" / "+st.best.w])}
 var top=P.slice().sort(function(a,b){return b[2]-a[2]})[0];if(top&&top[2]>0)rows.push(["Πρώτος σκόρερ",esc(top[0])+" ("+top[2]+")"]);
 $("st_records").innerHTML=rows.length?"<div class=\"gw\"><h4>Ρεκόρ και σερί</h4><div class=\"rcs\">"+rows.map(function(x){return"<div class=\"rc\"><span>"+x[0]+"</span><b>"+x[1]+"</b></div>"}).join("")+"</div></div>":"";
}

/* ---------- Αγώνες ---------- */
var cur=null,asc=false,uid=0;
function dlHtml(m,k){var x=m[7]||{},r=res(m),rt={W:"Νίκη",D:"Ισοπαλία",L:"Ήττα"}[r];
 var comp=m[5]===OST?OSTN:"Πρωτάθλημα";
 var dl=[["Ημερομηνία",fdl(m[0])+(x.t?" · "+x.t:"")],["Διοργάνωση",comp+" · "+k],["Αποτέλεσμα",rt+" "+m[2]+" - "+m[3]]];
 if(m[6])dl.splice(2,0,["Αγωνιστική",esc(m[6])]);
 if(x.venue)dl.push(["Γήπεδο",esc(x.venue)+(x.map?" · <a rel=\"noopener\" href=\""+esc(x.map)+"\">Χάρτης</a>":"")]);
 if(x.events&&x.events.length){
  function eventPeople(field){var g={};x.events.forEach(function(e){var n=e[field];if(!n)return;(g[n]=g[n]||[]).push(e.minute!=null?e.minute+"′":"");});return Object.keys(g).map(function(n){var mins=g[n].filter(Boolean);return"<div class=\"evperson\"><b>"+esc(n)+"</b><span>"+(mins.length?mins.join(", "):"—")+"</span></div>"}).join("")}
  var scorers=eventPeople("scorer"),assisters=eventPeople("assist");
  if(scorers)dl.push(["Σκόρερ",scorers]);if(assisters)dl.push(["Ασίστ",assisters]);
 }else{if(x.sc&&x.sc.length)dl.push(["Σκόρερ",x.sc.map(esc).join(", ")]);if(x.as&&x.as.length)dl.push(["Ασίστ",x.as.map(esc).join(", ")]);}
 if(x.url)dl.push(["Σελίδα αγώνα","<a rel=\"noopener\" href=\""+esc(x.url)+"\">Προπάθλημα</a>"]);
 return"<dl>"+dl.map(function(d){var ev=d[0]==="Σκόρερ"||d[0]==="Ασίστ";return"<dt"+(ev?" class=\"event-title\"":"")+">"+d[0]+"</dt><dd"+(ev?" class=\"event-body\"":"")+">"+(ev?"<div class=\"match-event-list\">"+d[1]+"</div>":d[1])+"</dd>"}).join("")+"</dl>"}
function row(m,k,open){
 var us=m[1]===US,id="p"+(++uid),r=res(m),dh=dlHtml(m,k);
 return"<li class=\"mr\"><button class=\"mb\" aria-expanded=\""+(open?"true":"false")+"\" aria-controls=\""+id+"\" data-id=\""+esc(m[0]+m[1]+m[4])+"\"><span class=\"d\">"+(fd(m[0])||"–")+"</span><span class=\"t h"+(us?" us":"")+"\"><b>"+esc(m[1])+"</b>"+tb(m[1])+"</span><span class=\"s "+r+"\">"+m[2]+" - "+m[3]+"</span><span class=\"t"+(us?"":" us")+"\">"+tb(m[4])+"<b>"+esc(m[4])+"</b></span><span class=\"ch\"></span></button><div class=\"pn\" id=\""+id+"\""+(open?"":" hidden")+">"+dh+"</div></li>"}
function group(title,ms,k,openSet){
 if(!ms.length)return"";var r=rec(ms);
 return"<h3>"+title+"<span>"+ms.length+" αγώνες · "+r.W+"Ν "+r.D+"Ι "+r.L+"Η · "+r.f+"-"+r.a+"</span></h3><ul class=\"ml\">"+ms.map(function(m){return row(m,k,openSet[m[0]+m[1]+m[4]])}).join("")+"</ul>"}
function show(k){
 cur=k;window.CUR=k;
 [].forEach.call($("tabs").querySelectorAll("button[data-k]"),function(b){b.setAttribute("aria-pressed",b.dataset.k===k)});
 /* κράτα ανοιχτούς τους αγώνες που είχε ανοίξει ο χρήστης όταν έρχεται live ενημέρωση */
 var openSet={};[].forEach.call($("list").querySelectorAll(".mb[aria-expanded=\"true\"]"),function(b){openSet[b.dataset.id]=1});
 var all=(SEASONS[k]||[]).map(function(m,i){return[key(m,i),m]}).sort(function(a,b){return asc?(a[0]<b[0]?-1:1):(a[0]<b[0]?1:-1)}).map(function(x){return x[1]});
 $("list").innerHTML=group("Πρωτάθλημα",all.filter(function(m){return m[5]!==OST}),k,openSet)+group(OSTN,all.filter(function(m){return m[5]===OST}),k,openSet);
 if(window.animScan)animScan();
}
function renderMatches(){
 var ks=Object.keys(SEASONS);if(!cur||!SEASONS[cur])cur=curSeason();
 var t=$("tabs");t.innerHTML="";
 ks.forEach(function(k){var b=document.createElement("button");b.textContent=k;b.dataset.k=k;b.onclick=function(){show(k)};t.appendChild(b)});
 var tg=document.createElement("button");tg.className="tg";tg.textContent=asc?"Παλαιότερα πρώτα":"Νεότερα πρώτα";tg.onclick=function(){asc=!asc;tg.textContent=asc?"Παλαιότερα πρώτα":"Νεότερα πρώτα";show(cur)};t.appendChild(tg);
 show(cur);
}

/* ---------- Match Center ---------- */
var MCM=[],_mck="";
function renderMC(){
 var k=curSeason(),openKey=$("mcs").querySelector(".mc[aria-expanded=\"true\"]");openKey=openKey?openKey.dataset.id:"";
 MCM=(SEASONS[k]||[]).map(function(m,i){return[key(m,i),m]}).sort(function(a,b){return a[0]<b[0]?1:-1}).map(function(x){return x[1]}).slice(0,8);
 $("mcs").innerHTML=MCM.map(function(m,i){var r=res(m),id=m[0]+m[1]+m[4];
  return"<button class=\"mc\" data-i=\""+i+"\" data-id=\""+esc(id)+"\" aria-expanded=\""+(id===openKey?"true":"false")+"\" aria-controls=\"mcd\"><span class=\"cp\">"+(m[5]===OST?"OFF-SEASON":"ΠΡΟΠΑΘΛΗΜΑ")+(m[7]&&m[7].live?" · LIVE":"")+"</span><span class=\"vs\">"+big(m[1])+"<span class=\"s "+r+"\">"+m[2]+" - "+m[3]+"</span>"+big(m[4])+"</span><span class=\"dt\">"+(fd(m[0])||esc(m[6]||""))+"</span></button>"}).join("");
 var d=$("mcd"),o=$("mcs").querySelector(".mc[aria-expanded=\"true\"]");
 if(o){var m=MCM[+o.dataset.i];d.innerHTML="<h4>"+esc(m[1])+" "+m[2]+" - "+m[3]+" "+esc(m[4])+"</h4>"+dlHtml(m,k);d.hidden=false}else d.hidden=true;
}
function showMatchModal(m,k){
 var d=$("pm");if(!d||!m)return;
 var x=m[7]||{},comp=m[5]===OST?OSTN:"Πρωτάθλημα";
 d.classList.add("match-modal");
 d.innerHTML="<div class=\"pmb\"><button class=\"pmx\" aria-label=\"Κλείσιμο\">×</button><div class=\"match-modal-head\"><span class=\"match-modal-comp\">"+esc(comp)+" · "+esc(k)+"</span><div class=\"match-modal-score\"><div class=\"match-team home\">"+big(m[1])+"<b>"+esc(m[1])+"</b></div><div class=\"match-scoreline\"><strong>"+m[2]+" : "+m[3]+"</strong><small>"+esc(res(m)==="W"?"Νίκη":res(m)==="L"?"Ήττα":"Ισοπαλία")+"</small></div><div class=\"match-team away\">"+big(m[4])+"<b>"+esc(m[4])+"</b></div></div></div>"+dlHtml(m,k)+"</div>";
 if(d.showModal){if(!d.open)d.showModal()}else d.setAttribute("open","");
}
function bindMC(){
 $("mcs").addEventListener("click",function(e){
  var b=e.target.closest(".mc");if(!b)return;
  showMatchModal(MCM[+b.dataset.i],curSeason());
 });
 $("list").addEventListener("click",function(e){
  var b=e.target.closest(".mb");if(!b)return;
  var all=SEASONS[curSeason()]||[],m=all.filter(function(x){return x[0]+x[1]+x[4]===b.dataset.id})[0];
  if(m)showMatchModal(m,curSeason());
 });
}

/* Ώρα Ελλάδας (Europe/Athens) με σωστό θερινό/χειμερινό */
function athens(d,t){var p=d.split("-"),q=t.split(":"),u=Date.UTC(+p[0],p[1]-1,+p[2],+q[0],+q[1]);
 function off(ts){var o={};new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Athens",hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric"}).formatToParts(new Date(ts)).forEach(function(x){o[x.type]=+x.value});return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute)-ts}
 return new Date(u-off(u-off(u)))}

/* ---------- Σύνολο + live ---------- */
function syncLabel(){var el=$("sync");if(!el)return;var s=Math.max(0,Math.round((Date.now()-LASTSYNC)/1000));
 el.hidden=!LASTSYNC;el.textContent=s<60?"Ενημερώθηκε μόλις τώρα":s<3600?"Ενημερώθηκε πριν "+Math.round(s/60)+"΄":"Ενημερώθηκε "+new Date(LASTSYNC).toLocaleTimeString("el-GR",{hour:"2-digit",minute:"2-digit"})}
function renderAll(){
 renderNext();renderTable();renderRoster();renderStats();renderMatches();renderMC();syncLabel();
 if(window.animScan)animScan();
}
window.onData=renderAll;
bindPlayerCard();bindMC();renderAll();setInterval(syncLabel,20000);

/* Θέμα και μενού */
(function(){var r=document.documentElement,b=$("theme"),m=document.querySelector("meta[name=theme-color]");
 function set(t,save){r.dataset.theme=t;if(m)m.content=t==="dark"?"#060f20":"#ffffff";b.setAttribute("aria-label",t==="dark"?"Αλλαγή σε φωτεινό θέμα":"Αλλαγή σε σκούρο θέμα");if(save)try{localStorage.setItem("theme",t)}catch(e){}}
 b.onclick=function(){r.classList.add("tt");set(r.dataset.theme==="dark"?"light":"dark",true);setTimeout(function(){r.classList.remove("tt")},350)};
 set(r.dataset.theme==="dark"?"dark":"light",false);
 var mb=$("menu"),nv=document.querySelector(".top nav");mb.onclick=function(){mb.setAttribute("aria-expanded",nv.classList.toggle("open"))};
 nv.addEventListener("click",function(e){if(e.target.tagName==="A"){nv.classList.remove("open");mb.setAttribute("aria-expanded","false")}})})();
