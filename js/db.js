/* Δεδομένα από το Supabase, με ζωντανή ενημέρωση:
   - Realtime: κάθε αλλαγή σε αγώνες, γκολ, βαθμολογία, παίκτες, ομάδες ή εμφάνιση ξαναφορτώνει τα δεδομένα χωρίς refresh σελίδας
   - Εφεδρικά: έλεγχος κάθε 45" όσο η σελίδα είναι ανοιχτή, και αμέσως όταν ο χρήστης γυρίσει στην καρτέλα
   Αν το Supabase δεν είναι διαθέσιμο μένουν τα τοπικά δεδομένα (data/data.js). */
var sb=null,DBLOGO={},LASTSYNC=0,_busy=false,_deb=null,_poll=null,_live=false;
function mediaUrl(p){if(!p)return"";if(/^(assets\/|https?:)/.test(p))return p;var i=p.indexOf("/");return sb.storage.from(p.slice(0,i)).getPublicUrl(p.slice(i+1)).data.publicUrl}
function athParts(iso){var o={};new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Athens",hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).formatToParts(new Date(iso)).forEach(function(x){o[x.type]=x.value});return{d:o.year+"-"+o.month+"-"+o.day,t:o.hour+":"+o.minute}}
function applyDB(r){
 var teams=r[0].data,pl=r[1].data,ms=r[2].data,ev=r[3].data,ap=r[4].data,st=r[5].data;
 if(!ms.length&&!pl.length)return;
 var tn={},pn={},by={},S={},nx=null,now=Date.now();
 DBLOGO={};
 teams.forEach(function(t){tn[t.id]=t;if(t.logo_path){if(t.is_us)window.US_LOGO=mediaUrl(t.logo_path);else DBLOGO[t.name]=mediaUrl(t.logo_path)}});
 pl.forEach(function(p){pn[p.id]=p});
 ev.forEach(function(e){(by[e.match_id]=by[e.match_id]||[]).push(e)});
 ms.forEach(function(m){
  var th=tn[m.home_team],ta=tn[m.away_team];if(!th||!ta)return;
  var h=th.name,a=ta.name,pa=m.kickoff?athParts(m.kickoff):{};
  if(m.status==="scheduled"){if(m.kickoff&&new Date(m.kickoff).getTime()>now-72e5&&(!nx||m.kickoff<nx.k))nx={k:m.kickoff,date:pa.d,time:pa.t,home:h,away:a,venue:m.venue,map:m.venue_map_url};return}
  if(m.status!=="finished"&&m.status!=="live")return;
  var es=(by[m.id]||[]).sort(function(x,y){return x.seq-y.seq}),x={};
  if(pa.t&&pa.t!=="00:00")x.t=pa.t;if(m.venue)x.venue=m.venue;if(m.venue_map_url)x.map=m.venue_map_url;
  if(m.status==="live")x.live=1;
  if(m.source==="propathlima"&&m.external_id)x.url="https://propathlima.gr/sport-event/"+m.external_id+"/";
  var detail=es.map(function(e){return{scorer:e.scorer_id&&pn[e.scorer_id]?pn[e.scorer_id].full_name:(e.kind==="own_goal"?"Αυτογκόλ":""),assist:e.assist_id&&pn[e.assist_id]?pn[e.assist_id].full_name:"",minute:e.minute,kind:e.kind}}).filter(function(e){return e.scorer||e.assist});
  if(detail.length){x.events=detail;x.sc=detail.filter(function(e){return e.scorer}).map(function(e){return e.scorer});x.as=detail.filter(function(e){return e.assist}).map(function(e){return e.assist})}
  (S[m.season]=S[m.season]||[]).push([pa.d||null,h,m.home_score,m.away_score,a,m.competition==="Off-Season Tournament"?OST:PR,m.round_label||undefined,x]);
 });
 /* Ενοποίηση τοπικών και DB αγώνων με μοναδικό κλειδί ημερομηνία + ζευγάρι.
    Δεν χρησιμοποιούμε competition: στα παλιά τοπικά δεδομένα λείπει το πεδίο
    και αυτό δημιουργούσε δεύτερη εγγραφή για κάθε αγώνα. */
 var fallback=window.SEASONS||{},o={},keys={};
 Object.keys(fallback).forEach(function(k){keys[k]=1});
 Object.keys(S).forEach(function(k){keys[k]=1});
 function normTeam(n){return String(n||"").trim().replace(/\s+/g," ").toLocaleLowerCase("el")}
 function matchKey(m){
  var teams=[normTeam(m[1]),normTeam(m[4])].sort();
  var round=normTeam(m[6]),comp=m[5]===OST?OST:PR;
  /* Αν λείπει ημερομηνία από τοπική εγγραφή, η αγωνιστική + διοργάνωση
     ταυτοποιούν τον ίδιο αγώνα με την πλήρη εγγραφή της βάσης. */
  var identity=round?"round:"+round:"date:"+String(m[0]||"");
  return comp+"|"+identity+"|"+teams[0]+"|"+teams[1];
 }
 Object.keys(keys).forEach(function(k){
  var merged=[],positions={};
  function put(m,prefer){
   var id=matchKey(m);
   if(positions[id]===undefined){positions[id]=merged.length;merged.push(m)}
   else if(prefer)merged[positions[id]]=m;
  }
  (fallback[k]||[]).forEach(function(m){put(m,false)});
  (S[k]||[]).forEach(function(m){put(m,true)});
  o[k]=merged;
 });
 var ks=Object.keys(o).sort().reverse();if(ks.length)SEASONS=o;
 NEXT=nx?{date:nx.date,time:nx.time,home:nx.home,away:nx.away,venue:nx.venue||undefined,map:nx.map||undefined}:null;
 if(pl.length){var g={},as2={},c={};ev.forEach(function(e){if(e.kind==="goal"&&e.scorer_id)g[e.scorer_id]=(g[e.scorer_id]||0)+1;if(e.assist_id)as2[e.assist_id]=(as2[e.assist_id]||0)+1});
  ap.forEach(function(x){c[x.player_id]=(c[x.player_id]||0)+1});PHOTOS={};
  PINFO={};P=pl.map(function(p){if(p.photo_path)PHOTOS[p.full_name]=mediaUrl(p.photo_path);PINFO[p.full_name]={pos:p.position,num:p.shirt_number,bio:p.bio,det:p.details||[]};return[p.full_name,p.base_apps+(c[p.id]||0),p.base_goals+(g[p.id]||0),p.base_assists+(as2[p.id]||0)]});
  HIDE=pl.filter(function(p){return!p.show_on_roster}).map(function(p){return p.full_name})}
 /* Η βαθμολογία προέρχεται από τον πίνακα του Προπαθλήματος στο data/data.js. */
 LASTSYNC=Date.now();
}
function fetchAll(){
 var T=function(t){return sb.from(t).select("*")};
 return Promise.all([T("teams"),T("players"),T("matches"),T("match_events"),T("appearances"),T("standings")]).then(function(r){for(var i=0;i<r.length;i++)if(r[i].error)throw r[i].error;applyDB(r)});
}
function refreshData(){
 if(!sb||_busy)return Promise.resolve();_busy=true;
 return fetchAll().then(function(){if(window.onData)window.onData()}).catch(function(e){console.warn("Η ανανέωση απέτυχε",e)}).then(function(){_busy=false});
}
function scheduleRefresh(){clearTimeout(_deb);_deb=setTimeout(function(){refreshData();if(window.refreshDesign)window.refreshDesign()},500)}
function startLive(){
 if(_live||!sb)return;_live=true;
 try{
  var ch=sb.channel("papei-live");
  ["teams","players","matches","match_events","appearances","standings","site_settings"].forEach(function(t){ch.on("postgres_changes",{event:"*",schema:"public",table:t},scheduleRefresh)});
  ch.subscribe();
 }catch(e){console.warn("Realtime μη διαθέσιμο",e)}
 _poll=setInterval(function(){if(!document.hidden){refreshData();if(window.refreshDesign)window.refreshDesign()}},45000);
 document.addEventListener("visibilitychange",function(){if(!document.hidden&&Date.now()-LASTSYNC>15000)scheduleRefresh()});
 window.addEventListener("online",scheduleRefresh);
}
function loadDB(){
 if(!window.supabase||!SUPABASE_URL)return Promise.resolve();
 /* cache:"no-store" ώστε ο browser να μην κρατά παλιές απαντήσεις */
 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{global:{fetch:function(u,o){o=o||{};o.cache="no-store";return fetch(u,o)}}});
 var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},5000)});
 return Promise.race([fetchAll(),to]).then(function(){startLive()},function(e){console.warn("Supabase μη διαθέσιμο ή αργό, προσωρινά τοπικά δεδομένα",e);startLive();setTimeout(scheduleRefresh,2500)});
}
