var MY=window.US_LOGO||"assets/logo-256.png";
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fd(d){if(!d)return"";var p=d.split("-");return p[2]+"/"+p[1]}
function fdl(d){if(!d)return"Δεν έχει καταχωρηθεί";return new Date(d+"T12:00:00").toLocaleDateString("el-GR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
function res(m){var us=m[1]===US,f=us?m[2]:m[3],a=us?m[3]:m[2];return f>a?"W":f<a?"L":"D"}
function rec(ms){var r={W:0,D:0,L:0,f:0,a:0};ms.forEach(function(m){var us=m[1]===US;r[res(m)]++;r.f+=us?m[2]:m[3];r.a+=us?m[3]:m[2]});return r}
function ini(n){var w=n.replace(/[^A-Za-zΑ-Ωα-ωά-ώ0-9 ]/g,"").split(" ").filter(Boolean);return(w.length>1?w[0][0]+w[1][0]:(w[0]||"?").slice(0,2)).toUpperCase()}
/* Logos: πρώτα από το Προπάθλημα (js/logos.js), μετά το LOGO του data.js/βάσης, μετά αρχικά */
function lsrc(n){if(n===US)return[MY,""];var p=window.plLogo?plLogo(n):"",l=LOGO[n]||"";return p?[p,l]:[l,""]}
function limg(n){var s=lsrc(n),u=s[0];if(!u)return"";return"<img class=\"lg"+(n===US?" us":u.indexOf("propathlima.gr")>=0?" pl":"")+"\" alt=\"\" loading=\"lazy\" decoding=\"async\" referrerpolicy=\"no-referrer\" data-n=\""+esc(n)+"\""+(s[1]?" data-fb=\""+esc(s[1])+"\"":"")+" src=\""+esc(u)+"\">"}
function tb(n){var i=limg(n);return i?"<span class=\"tb\">"+i+"</span>":""}
function big(n){var i=limg(n);return"<span class=\"ic"+(i?"":" fb")+"\">"+(i||esc(ini(n)))+"</span>"}
function sl(n){var i=limg(n);return"<span class=\"sl"+(i?"":" fb")+"\">"+(i||esc(ini(n)))+"</span>"}
document.addEventListener("error",function(e){var t=e.target;if(!t||t.tagName!=="IMG"||!t.classList.contains("lg"))return;var f=t.dataset.fb;if(f){t.dataset.fb="";t.classList.remove("pl");t.src=f;return}var p=t.parentNode;if(!p)return;if(p.classList.contains("ic")||p.classList.contains("sl")){p.classList.add("fb");p.textContent=ini(t.dataset.n||"?")}else t.remove()},true);

function lb(id,rows){var mx=rows[0][1];$(id).innerHTML=rows.map(function(r,i){return"<div class=\"lb\"><span class=\"n\">"+(i+1)+"</span><span>"+esc(r[0])+"</span><span class=\"v\">"+r[1]+"</span><span class=\"bw\"><i style=\"width:"+(r[1]/mx*100)+"%\"></i></span></div>"}).join("")}

/* Επόμενος αγώνας */
function mapUrl(){return NEXT.map||(NEXT.venue?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(NEXT.venue):"")}
function nextRender(){
 var c=$("nextcard");if(NEXT&&athens(NEXT.date,NEXT.time).getTime()+72e5<Date.now())NEXT=null;
 if(!NEXT){c.innerHTML="<div class=\"vs\">"+big(US)+"<span class=\"sm\">VS</span><span class=\"ic\">?</span></div><div class=\"tm\">Ο επόμενος αγώνας θα ανακοινωθεί σύντομα</div><p class=\"sm\" style=\"margin:6px 0 0\">Το πρόγραμμα ανεβαίνει στο <a href=\"https://propathlima.gr/team/papei-sc/\" rel=\"noopener\">Προπάθλημα</a>.</p>";return}
 var opp=NEXT.home===US?NEXT.away:NEXT.home,u=mapUrl();
 c.innerHTML="<div class=\"sm\" style=\"letter-spacing:.12em;font-size:12px;margin-bottom:14px\">ΠΡΟΠΑΘΛΗΜΑ · ΣΤ ΟΜΙΛΟΣ</div><div class=\"vs\">"+big(NEXT.home)+"<span class=\"sm\">VS</span>"+big(NEXT.away)+"</div><div class=\"tm\">"+esc(NEXT.home)+" – "+esc(NEXT.away)+"</div><div class=\"sm\">"+fdl(NEXT.date)+" · "+esc(NEXT.time)+(NEXT.venue?" · "+esc(NEXT.venue):"")+"</div><div class=\"cd\" id=\"cd\"></div>"+(u?"<a class=\"btn\" rel=\"noopener\" href=\""+esc(u)+"\">Τοποθεσία γηπέδου</a>":"");
 var t=athens(NEXT.date,NEXT.time);
 function tick(){var s=Math.max(0,Math.floor((t-new Date())/1000)),v=[[Math.floor(s/86400),"ημέρες"],[Math.floor(s%86400/3600),"ώρες"],[Math.floor(s%3600/60),"λεπτά"],[s%60,"δευτ."]];
  $("cd").innerHTML=v.map(function(x){return"<div><b>"+x[0]+"</b><span>"+x[1]+"</span></div>"}).join("")}
 tick();setInterval(tick,1000);
}
nextRender();

/* Βαθμολογία */
$("tbody").innerHTML=TABLE.length?TABLE.map(function(r){var g=r[6].split("-");return"<tr"+(r[1]===US?" class=\"me\"":"")+"><td>"+r[0]+"</td><td><div class=\"stn\">"+sl(r[1])+"<span>"+esc(r[1])+"</span></div></td><td><b>"+r[8]+"</b></td><td>"+r[2]+"</td><td>"+r[3]+"/"+r[4]+"/"+r[5]+"</td><td>"+g[0]+"</td><td>"+g[1]+"</td></tr>"}).join(""):"<tr class=\"empty\"><td colspan=\"7\">Η βαθμολογία ανεβαίνει σύντομα. <a href=\""+SOFA+"\" rel=\"noopener\">Δες την στο SofaScore</a></td></tr>";

/* Ρόστερ */
$("ros").innerHTML=P.filter(function(p){return HIDE.indexOf(p[0])<0}).sort(function(a,b){return b[1]-a[1]||b[2]+b[3]-a[2]-a[3]}).map(function(p){
 var ph=PHOTOS[p[0]];
 return"<button class=\"pl\" data-n=\""+esc(p[0])+"\"><div class=\"ph\">"+(ph?"<img loading=\"lazy\" alt=\""+esc(p[0])+"\" src=\""+esc(ph)+"\">":esc(p[0][0]))+"</div><div class=\"nm\">"+esc(p[0])+"</div>"+"<div class=\"ps\">"+p[2]+" γκολ · "+p[3]+" ασίστ · "+p[1]+" αγ.</div></button>"}).join("");


/* Κάρτα παίκτη: πατάς πάνω του και ανοίγουν τα στοιχεία από το admin */
(function(){var d=$("pm"),M={};P.forEach(function(p){M[p[0]]=p});
 $("ros").addEventListener("click",function(e){var b=e.target.closest(".pl");if(!b||!d)return;var n=b.dataset.n,p=M[n],I=PINFO[n]||{},ph=PHOTOS[n],ps=[I.num?"#"+I.num:"",I.pos||""].filter(Boolean).join(" · ");
  d.innerHTML="<div class=\"pmb\"><button class=\"pmx\" aria-label=\"Κλείσιμο\">×</button><div class=\"pmw\"><div class=\"ph\">"+(ph?"<img alt=\""+esc(n)+"\" src=\""+esc(ph)+"\">":esc(n[0]))+"</div><div><h3 id=\"pmn\">"+esc(n)+"</h3><p class=\"pmm\">"+esc(ps||"Παίκτης")+"</p><div class=\"pmst\"><div><b>"+p[1]+"</b><span>αγώνες</span></div><div><b>"+p[2]+"</b><span>γκολ</span></div><div><b>"+p[3]+"</b><span>ασίστ</span></div></div></div></div>"+(I.bio?"<p class=\"pmbio\">"+esc(I.bio)+"</p>":"")+((I.det&&I.det.length)?"<dl class=\"pmd\">"+I.det.map(function(x){return"<dt>"+esc(x.l)+"</dt><dd>"+esc(x.v)+"</dd>"}).join("")+"</dl>":"")+"</div>";
  if(d.showModal)d.showModal();else d.setAttribute("open","")});
 if(d){d.addEventListener("click",function(e){if(e.target===d||e.target.closest(".pmx")){if(d.close)d.close();else d.removeAttribute("open")}})}})();

/* Στατιστικά */
(function(){var ms=SEASONS["2026/27"],r=rec(ms),G=0,A=0,sc=0;P.forEach(function(p){G+=p[2];A+=p[3];if(p[2]>0)sc++});var d=r.f-r.a;
 $("sum").innerHTML=[[ms.length,"αγώνες"],[r.f,"γκολ υπέρ"],[r.a,"γκολ κατά"],[(d>0?"+":"")+d,"διαφορά τερμάτων"],[A,"ασίστ (εκτίμηση)"],[G+A,"γκολ και ασίστ"],[(r.f/ms.length).toFixed(2).replace(".",","),"γκολ ανά αγώνα"],[sc,"διαφορετικοί σκόρερ"],[P.length,"παίκτες σε αποστολές"]].map(function(x){return"<div><b>"+x[0]+"</b><span>"+x[1]+"</span></div>"}).join("")})();
lb("lbg",P.filter(function(p){return p[2]>0}).sort(function(a,b){return b[2]-a[2]}).map(function(p){return[p[0],p[2]]}));
lb("lba",P.filter(function(p){return p[3]>0}).sort(function(a,b){return b[3]-a[3]}).map(function(p){return[p[0],p[3]]}));
lb("lbt",P.filter(function(p){return p[2]+p[3]>0}).sort(function(a,b){return b[2]+b[3]-a[2]-a[3]}).map(function(p){return[p[0],p[2]+p[3]]}));

/* Αγώνες: χρονολογική σειρά, χωρισμός Off-Season, άνοιγμα λεπτομερειών */
var cur="2026/27",asc=true,uid=0;
function key(m,i){return(m[0]||"9999-99-99")+"|"+("00"+i).slice(-3)}
function dlHtml(m,k){var x=m[7]||{},r=res(m),rt={W:"Νίκη",D:"Ισοπαλία",L:"Ήττα"}[r];
 var comp=m[5]===OST?OSTN:"Πρωτάθλημα";
 var dl=[["Ημερομηνία",fdl(m[0])+(x.t?" · "+x.t:"")],["Διοργάνωση",comp+" · "+k],["Αποτέλεσμα",rt+" "+m[2]+" - "+m[3]]];
 if(m[6])dl.splice(2,0,["Αγωνιστική",esc(m[6])]);
 if(x.venue)dl.push(["Γήπεδο",esc(x.venue)+(x.map?" · <a rel=\"noopener\" href=\""+esc(x.map)+"\">Χάρτης</a>":"")]);
 if(x.sc&&x.sc.length)dl.push(["Σκόρερ",x.sc.map(esc).join(", ")]);
 if(x.as&&x.as.length)dl.push(["Ασίστ",x.as.map(esc).join(", ")]);
 if(x.url)dl.push(["Σελίδα αγώνα","<a rel=\"noopener\" href=\""+esc(x.url)+"\">Προπάθλημα</a>"]);
 return"<dl>"+dl.map(function(d){return"<dt>"+d[0]+"</dt><dd>"+d[1]+"</dd>"}).join("")+"</dl>"}
function row(m,k){
 var us=m[1]===US,x=m[7]||{},id="p"+(++uid),r=res(m),rt={W:"Νίκη",D:"Ισοπαλία",L:"Ήττα"}[r];
 var dh=dlHtml(m,k);
 return"<li class=\"mr\"><button class=\"mb\" aria-expanded=\"false\" aria-controls=\""+id+"\"><span class=\"d\">"+(fd(m[0])||"–")+"</span><span class=\"t h"+(us?" us":"")+"\"><b>"+esc(m[1])+"</b>"+tb(m[1])+"</span><span class=\"s "+r+"\">"+m[2]+" - "+m[3]+"</span><span class=\"t"+(us?"":" us")+"\">"+tb(m[4])+"<b>"+esc(m[4])+"</b></span><span class=\"ch\"></span></button><div class=\"pn\" id=\""+id+"\" hidden>"+dh+"</div></li>"}
function group(title,ms,k){
 if(!ms.length)return"";
 var r=rec(ms);
 return"<h3>"+title+"<span>"+ms.length+" αγώνες · "+r.W+"Ν "+r.D+"Ι "+r.L+"Η · "+r.f+"-"+r.a+"</span></h3><ul class=\"ml\">"+ms.map(function(m){return row(m,k)}).join("")+"</ul>"}
function show(k){
 cur=k;
 [].forEach.call($("tabs").querySelectorAll("button[data-k]"),function(b){b.setAttribute("aria-pressed",b.dataset.k===k)});
 var all=SEASONS[k].map(function(m,i){return[key(m,i),m]}).sort(function(a,b){return asc?(a[0]<b[0]?-1:1):(a[0]<b[0]?1:-1)}).map(function(x){return x[1]});
 $("list").innerHTML=group("Πρωτάθλημα",all.filter(function(m){return m[5]!==OST}),k)+group(OSTN,all.filter(function(m){return m[5]===OST}),k);
}
$("list").addEventListener("click",function(e){var b=e.target.closest(".mb");if(!b)return;var o=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!o);$(b.getAttribute("aria-controls")).hidden=o});
Object.keys(SEASONS).forEach(function(k){var b=document.createElement("button");b.textContent=k;b.dataset.k=k;b.onclick=function(){show(k)};$("tabs").appendChild(b)});
var tg=document.createElement("button");tg.className="tg";tg.textContent="Παλαιότερα πρώτα";tg.onclick=function(){asc=!asc;tg.textContent=asc?"Παλαιότερα πρώτα":"Νεότερα πρώτα";show(cur)};$("tabs").appendChild(tg);
show(cur);

/* Match Center */
var MCM=[];
(function(){
 var k="2026/27";
 MCM=SEASONS[k].map(function(m,i){return[key(m,i),m]}).sort(function(a,b){return a[0]<b[0]?1:-1}).map(function(x){return x[1]}).slice(0,8);
 $("mcs").innerHTML=MCM.map(function(m,i){var r=res(m);
  return"<button class=\"mc\" data-i=\""+i+"\" aria-expanded=\"false\" aria-controls=\"mcd\"><span class=\"cp\">"+(m[5]===OST?"OFF-SEASON":"ΠΡΟΠΑΘΛΗΜΑ")+"</span><span class=\"vs\">"+big(m[1])+"<span class=\"s "+r+"\">"+m[2]+" - "+m[3]+"</span>"+big(m[4])+"</span><span class=\"dt\">"+(fd(m[0])||esc(m[6]||""))+"</span></button>"}).join("");
 $("mcs").addEventListener("click",function(e){
  var b=e.target.closest(".mc");if(!b)return;
  var open=b.getAttribute("aria-expanded")==="true";
  [].forEach.call($("mcs").children,function(c){c.setAttribute("aria-expanded","false")});
  var d=$("mcd");
  if(open){d.hidden=true;return}
  var m=MCM[+b.dataset.i];b.setAttribute("aria-expanded","true");
  d.innerHTML="<h4>"+esc(m[1])+" "+m[2]+" - "+m[3]+" "+esc(m[4])+"</h4>"+dlHtml(m,k);d.hidden=false;
 });
})();

/* Ώρα Ελλάδας (Europe/Athens) με σωστό θερινό/χειμερινό */
function athens(d,t){var p=d.split("-"),q=t.split(":"),u=Date.UTC(+p[0],p[1]-1,+p[2],+q[0],+q[1]);
 function off(ts){var o={};new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Athens",hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric"}).formatToParts(new Date(ts)).forEach(function(x){o[x.type]=+x.value});return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute)-ts}
 return new Date(u-off(u-off(u)))}
/* Θέμα και μενού */
(function(){var r=document.documentElement,b=$("theme"),m=document.querySelector("meta[name=theme-color]");
 function set(t,save){r.dataset.theme=t;if(m)m.content=t==="dark"?"#060f20":"#ffffff";b.setAttribute("aria-label",t==="dark"?"Αλλαγή σε φωτεινό θέμα":"Αλλαγή σε σκούρο θέμα");if(save)try{localStorage.setItem("theme",t)}catch(e){}}
 b.onclick=function(){r.classList.add("tt");set(r.dataset.theme==="dark"?"light":"dark",true);setTimeout(function(){r.classList.remove("tt")},350)};
 set(r.dataset.theme==="dark"?"dark":"light",false);
 var mb=$("menu"),nv=document.querySelector(".top nav");mb.onclick=function(){mb.setAttribute("aria-expanded",nv.classList.toggle("open"))};
 nv.addEventListener("click",function(e){if(e.target.tagName==="A"){nv.classList.remove("open");mb.setAttribute("aria-expanded","false")}})})();
