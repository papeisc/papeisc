/* Φορτώνει δεδομένα από το Supabase και αντικαθιστά τα τοπικά (data/data.js). Αν αποτύχει, μένουν τα τοπικά. */
var sb=null;
function mediaUrl(p){if(!p)return"";if(/^(assets\/|https?:)/.test(p))return p;var i=p.indexOf("/");return sb.storage.from(p.slice(0,i)).getPublicUrl(p.slice(i+1)).data.publicUrl}
function athParts(iso){var o={};new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Athens",hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}).formatToParts(new Date(iso)).forEach(function(x){o[x.type]=x.value});return{d:o.year+"-"+o.month+"-"+o.day,t:o.hour+":"+o.minute}}
function applyDB(r){
 var teams=r[0].data,pl=r[1].data,ms=r[2].data,ev=r[3].data,ap=r[4].data,st=r[5].data;
 if(!ms.length&&!pl.length)return;
 var tn={},pn={},by={},S={},nx=null,now=Date.now();
 teams.forEach(function(t){tn[t.id]=t;if(t.logo_path&&!t.is_us)LOGO[t.name]=mediaUrl(t.logo_path)});
 pl.forEach(function(p){pn[p.id]=p});
 ev.forEach(function(e){(by[e.match_id]=by[e.match_id]||[]).push(e)});
 ms.forEach(function(m){
  var h=tn[m.home_team].name,a=tn[m.away_team].name,pa=m.kickoff?athParts(m.kickoff):{};
  if(m.status==="scheduled"){if(m.kickoff&&new Date(m.kickoff).getTime()>now-72e5&&(!nx||m.kickoff<nx.k))nx={k:m.kickoff,date:pa.d,time:pa.t,home:h,away:a,venue:m.venue,map:m.venue_map_url};return}
  if(m.status!=="finished"&&m.status!=="live")return;
  var es=(by[m.id]||[]).sort(function(x,y){return x.seq-y.seq}),x={};
  if(pa.t&&pa.t!=="00:00")x.t=pa.t;if(m.venue)x.venue=m.venue;if(m.venue_map_url)x.map=m.venue_map_url;
  if(m.source==="propathlima"&&m.external_id)x.url="https://propathlima.gr/sport-event/"+m.external_id+"/";
  var sc=es.filter(function(e){return e.scorer_id}).map(function(e){return pn[e.scorer_id].full_name}),as=es.filter(function(e){return e.assist_id}).map(function(e){return pn[e.assist_id].full_name});
  if(sc.length)x.sc=sc;if(as.length)x.as=as;
  (S[m.season]=S[m.season]||[]).push([pa.d||null,h,m.home_score,m.away_score,a,m.competition==="Off-Season Tournament"?OST:PR,m.round_label||undefined,x]);
 });
 var ks=Object.keys(S).sort().reverse();if(ks.length){var o={};ks.forEach(function(k){o[k]=S[k]});SEASONS=o}
 NEXT=nx?{date:nx.date,time:nx.time,home:nx.home,away:nx.away,venue:nx.venue||undefined,map:nx.map||undefined}:null;
 if(pl.length){var g={},as2={},c={};ev.forEach(function(e){if(e.kind==="goal"&&e.scorer_id)g[e.scorer_id]=(g[e.scorer_id]||0)+1;if(e.assist_id)as2[e.assist_id]=(as2[e.assist_id]||0)+1});
  ap.forEach(function(x){c[x.player_id]=(c[x.player_id]||0)+1});PHOTOS={};
  P=pl.map(function(p){if(p.photo_path)PHOTOS[p.full_name]=mediaUrl(p.photo_path);return[p.full_name,p.base_apps+(c[p.id]||0),p.base_goals+(g[p.id]||0),p.base_assists+(as2[p.id]||0)]});
  HIDE=pl.filter(function(p){return!p.show_on_roster}).map(function(p){return p.full_name})}
 var s=st.filter(function(r){return r.season==="2026/27"}).sort(function(a,b){return a.rank-b.rank});
 if(s.length)TABLE=s.map(function(r){return[r.rank,tn[r.team_id].name,r.played,r.won,r.drawn,r.lost,r.gf+"-"+r.ga,r.gf-r.ga,r.points]});
}
function loadDB(){
 if(!window.supabase||!SUPABASE_URL)return Promise.resolve();
 sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
 var T=function(t){return sb.from(t).select("*")};
 var job=Promise.all([T("teams"),T("players"),T("matches"),T("match_events"),T("appearances"),T("standings")]).then(function(r){for(var i=0;i<r.length;i++)if(r[i].error)throw r[i].error;applyDB(r)});
 var to=new Promise(function(_,rej){setTimeout(function(){rej(new Error("timeout"))},5000)});
 return Promise.race([job,to]).catch(function(e){console.warn("Supabase μη διαθέσιμο, χρήση τοπικών δεδομένων",e)});
}
