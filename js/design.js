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
 team:{blocks:[]},sx:{},
 texts:{},links:[],images:{header_logo:"",hero_logo:"",hero_bg:""},
 sections:[{id:"nextsec",on:true},{id:"mc",on:true},{id:"matches",on:true},{id:"table",on:true},{id:"roster",on:true},{id:"team",on:true},{id:"stats",on:true},{id:"links",on:true}]
};
var DESIGN_FONTS={
 geom:{n:"Geom (προεπιλογή)",css:"Geom,Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif"},
 inter:{n:"Inter",css:"Inter,system-ui,-apple-system,\"Segoe UI\",sans-serif",g:"Inter:wght@400;500;700"},
 poppins:{n:"Poppins",css:"Poppins,system-ui,sans-serif",g:"Poppins:wght@400;500;700"},
 montserrat:{n:"Montserrat",css:"Montserrat,system-ui,sans-serif",g:"Montserrat:wght@400;500;700"},
 oswald:{n:"Oswald (στενή, έντονη)",css:"Oswald,Impact,sans-serif",g:"Oswald:wght@400;500;700"},
 barlow:{n:"Barlow Condensed (αθλητική)",css:"\"Barlow Condensed\",Impact,sans-serif",g:"Barlow+Condensed:wght@400;500;700"},
 bebas:{n:"Bebas Neue (κεφαλαία)",css:"\"Bebas Neue\",Impact,sans-serif",g:"Bebas+Neue"},
 robotocond:{n:"Roboto Condensed",css:"\"Roboto Condensed\",sans-serif",g:"Roboto+Condensed:wght@400;500;700"},
 dmsans:{n:"DM Sans",css:"\"DM Sans\",system-ui,sans-serif",g:"DM+Sans:wght@400;500;700"},
 manrope:{n:"Manrope",css:"Manrope,system-ui,sans-serif",g:"Manrope:wght@400;500;700"},
 spacegrotesk:{n:"Space Grotesk",css:"\"Space Grotesk\",system-ui,sans-serif",g:"Space+Grotesk:wght@400;500;700"},
 playfair:{n:"Playfair Display (κομψή)",css:"\"Playfair Display\",Georgia,serif",g:"Playfair+Display:wght@400;700"},
 system:{n:"Γραμματοσειρά συσκευής",css:"system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif"},
 serif:{n:"Georgia (με πατούρες)",css:"Georgia,\"Times New Roman\",serif"}
};
var SZ=[["s","Μικρό"],["m","Κανονικό"],["l","Μεγάλο"],["xl","Πολύ μεγάλο"]];
var DESIGN_GROUPS={hdr:["Μπάρα πάνω και μενού","στυλ, ύψος, λογότυπο"],hero:["Κεφαλίδα σελίδας (hero)","φόντο, σχέδιο, τίτλος, κουμπιά"],type:["Γραμματοσειρές και μεγέθη","τίτλοι, κείμενο, κεφαλαία"],cards:["Ενότητες, κάρτες και κουμπιά","φόντο ενοτήτων, περίγραμμα, κινήσεις"],tbl:["Πίνακας βαθμολογίας","ρίγες, κεφαλίδα, μέγεθος logos"],mob:["Κινητό","μενού, ρόστερ, κεφαλίδα"],adv:["Προχωρημένο: δικό σου CSS","για όσους ξέρουν"]};
var DESIGN_FIELDS=[
 {k:"h_style",g:"hdr",t:"select",l:"Στυλ μπάρας πάνω",d:"solid",o:[["solid","Συμπαγής"],["glass","Θολό γυαλί"],["clear","Χωρίς γραμμή από κάτω"]]},
 {k:"h_height",g:"hdr",t:"range",l:"Ύψος μπάρας",d:56,min:44,max:84,step:2,u:"px",v:"--hh"},
 {k:"h_logo",g:"hdr",t:"range",l:"Μέγεθος λογοτύπου",d:28,min:18,max:60,step:2,u:"px",v:"--hl"},
 {k:"h_sticky",g:"hdr",t:"check",l:"Η μπάρα μένει πάνω όταν κάνεις scroll",d:true},
 {k:"nav",g:"hdr",t:"select",l:"Στυλ μενού",d:"underline",o:[["underline","Υπογράμμιση"],["pills","Κουμπιά"],["text","Απλό κείμενο"]]},
 {k:"hero_mode",g:"hero",t:"select",l:"Φόντο κεφαλίδας",d:"solid",o:[["solid","Συμπαγές χρώμα"],["gradient","Διαβάθμιση (gradient)"]]},
 {k:"hero_ang",g:"hero",t:"range",l:"Γωνία διαβάθμισης",d:135,min:0,max:360,step:15,u:"°",v:"--hang",x:"deg"},
 {k:"hero_pat",g:"hero",t:"select",l:"Σχέδιο πάνω στο φόντο",d:"none",o:[["none","Κανένα"],["dots","Τελείες"],["grid","Πλέγμα"],["diag","Διαγώνιες γραμμές"]]},
 {k:"hero_t",g:"hero",t:"select",l:"Μέγεθος τίτλου",d:"m",o:[["m","Κανονικό"],["l","Μεγάλο"],["xl","Τεράστιο"]]},
 {k:"hero_logo",g:"hero",t:"select",l:"Λογότυπο στην κεφαλίδα",d:"show",o:[["show","Εμφάνιση"],["hide","Απόκρυψη"]]},
 {k:"cta1_t",g:"hero",t:"text",l:"Κουμπί 1: κείμενο (π.χ. Δες το πρόγραμμα)",d:""},
 {k:"cta1_u",g:"hero",t:"url",l:"Κουμπί 1: σύνδεσμος (https://… ή #table για ενότητα)",d:""},
 {k:"cta2_t",g:"hero",t:"text",l:"Κουμπί 2: κείμενο",d:""},
 {k:"cta2_u",g:"hero",t:"url",l:"Κουμπί 2: σύνδεσμος",d:""},
 {k:"font_head",g:"type",t:"fontsel",l:"Γραμματοσειρά τίτλων",d:"same"},
 {k:"fs",g:"type",t:"select",l:"Μέγεθος κειμένου",d:"m",o:SZ},
 {k:"h2s",g:"type",t:"select",l:"Μέγεθος τίτλων ενοτήτων",d:"m",o:SZ},
 {k:"h_case",g:"type",t:"select",l:"Τίτλοι",d:"normal",o:[["normal","Όπως γράφονται"],["upper","ΚΕΦΑΛΑΙΑ"]]},
 {k:"eb",g:"type",t:"select",l:"Μικροί τίτλοι πάνω από τους τίτλους",d:"normal",o:[["normal","Κανονικοί"],["wide","Με πλατιά διαστήματα"],["hide","Να κρύβονται"]]},
 {k:"sec_bg",g:"cards",t:"select",l:"Φόντο ενοτήτων",d:"none",o:[["none","Ίδιο παντού"],["alt","Εναλλάξ απαλό φόντο"]]},
 {k:"sec_head",g:"cards",t:"select",l:"Διακόσμηση τίτλων ενοτήτων",d:"plain",o:[["plain","Καμία"],["bar","Μπάρα χρώματος μπροστά"],["under","Γραμμή από κάτω"]]},
 {k:"card_b",g:"cards",t:"range",l:"Πάχος περιγράμματος καρτών",d:1,min:0,max:3,step:0.5,u:"px",v:"--cb"},
 {k:"card_hover",g:"cards",t:"select",l:"Κάρτες όταν περνάς το ποντίκι",d:"none",o:[["none","Τίποτα"],["lift","Ανασηκώνονται"]]},
 {k:"btn",g:"cards",t:"select",l:"Στυλ κουμπιών",d:"outline",o:[["outline","Περίγραμμα"],["solid","Γεμάτα"],["pill","Στρογγυλά (pill)"]]},
 {k:"tbl_stripe",g:"tbl",t:"check",l:"Εναλλάξ ρίγες στις γραμμές",d:false},
 {k:"tbl_head",g:"tbl",t:"select",l:"Κεφαλίδα πίνακα",d:"soft",o:[["soft","Απαλή"],["navy","Στο χρώμα της ομάδας"]]},
 {k:"tbl_logo",g:"tbl",t:"range",l:"Μέγεθος logos ομάδων",d:26,min:20,max:44,step:2,u:"px",v:"--tl"},
 {k:"m_nav",g:"mob",t:"select",l:"Μενού στο κινητό",d:"menu",o:[["menu","Κουμπί μενού (☰)"],["chips","Οριζόντια μπάρα κάτω από τον τίτλο"],["bottom","Κάτω μπάρα, σαν εφαρμογή"]]},
 {k:"m_roster",g:"mob",t:"select",l:"Ρόστερ: στήλες",d:"2",o:[["2","2 στήλες"],["3","3 στήλες"]]},
 {k:"m_hero",g:"mob",t:"select",l:"Κεφαλίδα σελίδας",d:"normal",o:[["normal","Κανονική"],["compact","Συμπαγής"]]},
 {k:"m_kpi",g:"mob",t:"select",l:"Στατιστικά: αριθμοί ανά γραμμή",d:"2",o:[["2","2 ανά γραμμή"],["1","1 ανά γραμμή"]]},
 {k:"css",g:"adv",t:"area",l:"Δικό σου CSS (προχωρημένο)",d:""}
];
var DESIGN_FIELD={};DESIGN_FIELDS.forEach(function(f){DESIGN_FIELD[f.k]=f});
DESIGN_DEFAULT.s={};DESIGN_FIELDS.forEach(function(f){DESIGN_DEFAULT.s[f.k]=f.d});
["light","dark"].forEach(function(t){["hdr","hero1","hero2","card","line"].forEach(function(k){DESIGN_DEFAULT.colors[t][k]=""})});
var DESIGN_COLORS_OPT=[["hdr","Φόντο μπάρας πάνω"],["hero1","Κεφαλίδα σελίδας: χρώμα 1"],["hero2","Κεφαλίδα σελίδας: χρώμα 2 (για διαβάθμιση)"],["card","Φόντο καρτών"],["line","Χρώμα περιγραμμάτων"]];
/* Έτοιμα στυλ όλου του site: αλλάζουν χρώματα, γραμματοσειρές και διάταξη μαζί. Δεν πειράζουν κείμενα, εικόνες, ομάδα και ανακοίνωση. */
var DESIGN_LOOKS=[
 {n:"Κλασικό PAPEI",d:"Όπως ξεκίνησε το site",v:{}},
 {n:"Αθλητικό",d:"Έντονοι τίτλοι, διαβάθμιση, θολή μπάρα",v:{font:"inter",look:{radius:10,card:"soft"},s:{font_head:"barlow",h_case:"upper",h_style:"glass",hero_mode:"gradient",hero_ang:160,hero_pat:"diag",hero_t:"xl",sec_head:"bar",btn:"pill",card_hover:"lift",nav:"pills",tbl_head:"navy"},colors:{light:{acc:"#1d4ed8",hero2:"#1e3a8a"},dark:{acc:"#7aa2ff",hero2:"#0b1b3a"}}}},
 {n:"Μινιμαλ",d:"Καθαρό, με πολύ αέρα",v:{font:"dmsans",look:{radius:2,density:"airy",wrap:840,hero_size:"compact"},s:{h_style:"clear",nav:"text",sec_head:"plain",eb:"wide",card_b:0.5,tbl_stripe:false},colors:{light:{navy:"#111827",acc:"#111827"},dark:{navy:"#1f2937",acc:"#e5e7eb"}}}},
 {n:"Έντονο κόκκινο",d:"Δυνατή κεφαλίδα και κεφαλαία",v:{font:"montserrat",look:{radius:4},s:{font_head:"oswald",h_case:"upper",hero_mode:"gradient",hero_ang:120,hero_t:"xl",sec_head:"under",btn:"solid",card_hover:"lift",nav:"pills",tbl_head:"navy"},colors:{light:{navy:"#8a1020",acc:"#b3122a",hero2:"#3d0710"},dark:{navy:"#8a1020",acc:"#ff8a95",hero2:"#2a050b"}}}},
 {n:"Γυαλί και σκιές",d:"Στρογγυλεμένο, με σκιές και γυαλί",v:{font:"manrope",look:{radius:18,card:"shadow"},s:{h_style:"glass",hero_mode:"gradient",hero_ang:120,hero_pat:"dots",btn:"pill",card_hover:"lift",sec_bg:"alt",nav:"pills"},colors:{light:{hero2:"#2b6cb0"},dark:{hero2:"#10244a"}}}},
 {n:"Σαν εφαρμογή (κινητό)",d:"Κάτω μπάρα πλοήγησης στο κινητό",v:{font:"inter",look:{radius:16,card:"shadow"},s:{h_style:"glass",btn:"pill",nav:"text",m_nav:"bottom",m_hero:"compact",card_hover:"lift"}}}
];
function cssClean(v){return String(v).slice(0,4000).replace(/[<>]/g,"").replace(/@import[^;]*;?/gi,"").replace(/javascript:|expression\s*\(|-moz-binding|behavior\s*:/gi,"").replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi,function(m,q,u){return/^(https:\/\/|data:image\/)/i.test(u)?m:"none"})}
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
 tlayout:[["splitl","Κάρτα: φωτογραφία αριστερά σε πλήρες ύψος"],["splitr","Κάρτα: φωτογραφία δεξιά σε πλήρες ύψος"],["right","Φωτογραφία δεξιά (απλή)"],["left","Φωτογραφία αριστερά (απλή)"],["top","Φωτογραφία πάνω"]],
 tpad:[["s","Μικρά περιθώρια"],["m","Κανονικά"],["l","Μεγάλα"],["xl","Πολύ μεγάλα"]],
 tts:[["m","Τίτλος κανονικός"],["l","Μεγάλος"],["xl","Πολύ μεγάλος"],["xxl","Τεράστιος"]],
 tal:[["left","Στοίχιση αριστερά"],["center","Στοίχιση στο κέντρο"]],
 tebs:[["m","Μικρός τίτλος: κανονικός"],["l","Μικρός τίτλος: μεγάλος"]],
 tratio:[["35","Φωτογραφία 35% του πλάτους"],["40","40%"],["45","45%"],["50","50%"],["60","60%"]],
 tfit:[["center","Εστίαση φωτογραφίας: κέντρο"],["top","Πάνω"],["bottom","Κάτω"],["left","Αριστερά"],["right","Δεξιά"]],
 tminh:[["0","Ύψος: αυτόματο"],["360","360 px"],["480","480 px"],["600","600 px"],["760","760 px"]],
 tshape:[["rect","Ορθογώνιες φωτογραφίες"],["circle","Στρογγυλές φωτογραφίες"]],
 tsize:[["small","Μικρά λογότυπα"],["medium","Μεσαία"],["large","Μεγάλα"]],
 tone:[["navy","Μπλε"],["red","Κόκκινο"],["green","Πράσινο"],["gold","Χρυσό"]]};
var DESIGN_STATS={kpi:"Βασικοί αριθμοί",form:"Φόρμα, νίκες/ισοπαλίες/ήττες, γκολ",goals:"Γράφημα γκολ ανά αγώνα",leaders:"Σκόρερ και ασίστ",records:"Ρεκόρ και σερί"};
var DESIGN_SECTIONS={nextsec:"Επόμενος αγώνας",mc:"Match Center",matches:"Αγώνες",table:"Βαθμολογία",roster:"Ρόστερ",team:"Η ομάδα μας",stats:"Στατιστικά",links:"Σύνδεσμοι"};
var DESIGN_NAV_SHORT={nextsec:"Επόμενος",mc:"Αποτ.",matches:"Αγώνες",table:"Βαθμ.",roster:"Ρόστερ",team:"Ομάδα",stats:"Στατ."};
var DESIGN_NAV=["nextsec","mc","matches","table","roster","team","stats"]; /* οι «Σύνδεσμοι» δεν μπαίνουν στο μενού */
var TEAM_TYPES={text:"Κείμενο με φωτογραφία",people:"Πρόσωπα (π.χ. τεχνικό επιτελείο, διοίκηση)",logos:"Λογότυπα (π.χ. χορηγοί)"};
function tImg(v){return typeof v==="string"&&/^[\w-]+\/[\w.\-\/]+$/.test(v)?v:""}
function tUrl(v){return typeof v==="string"&&/^(https?:\/\/|mailto:)/i.test(v.trim())?v.trim().slice(0,400):""}
function tOpt(k,v,def){return typeof v==="string"&&DESIGN_OPTS[k].some(function(o){return o[0]===v})?v:def}
function tStr(v,n){return typeof v==="string"?v.trim().slice(0,n):""}
function tHex(v){return typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v)?v.toLowerCase():""}
function tNum(v,a,b,d){return typeof v==="number"&&isFinite(v)&&v>=a&&v<=b?v:d}
function tStyle(b,o){o.bg=tHex(b.bg);o.fg=tHex(b.fg);o.ac=tHex(b.ac);o.wide=b.wide===true;o.up=b.up===true;o.r=tNum(b.r,0,40,8);
 o.pad=tOpt("tpad",b.pad,"m");o.ts=tOpt("tts",b.ts,"m");o.al=tOpt("tal",b.al,"left");o.ebs=tOpt("tebs",b.ebs,"m");o.tf=(b.tf==="same"||DESIGN_FONTS[b.tf])?b.tf:"same"}
function teamClean(t){var out={blocks:[]};if(!t||!Array.isArray(t.blocks))return out;
 t.blocks.slice(0,12).forEach(function(b){if(!b||!TEAM_TYPES[b.type])return;var o={type:b.type,eyebrow:tStr(b.eyebrow,80),title:tStr(b.title,120)};
  if(b.type==="text"){o.paras=(Array.isArray(b.paras)?b.paras:[]).slice(0,14).map(function(x){return tStr(x,1500)}).filter(Boolean);o.image=tImg(b.image);o.layout=tOpt("tlayout",b.layout,"splitl")}
  else{o.items=(Array.isArray(b.items)?b.items:[]).slice(0,48).map(function(x){x=x||{};return{name:tStr(x.name,80),role:tStr(x.role,120),img:tImg(x.img),url:tUrl(x.url)}});
   if(b.type==="people")o.shape=tOpt("tshape",b.shape,"rect");else o.size=tOpt("tsize",b.size,"medium")}
  if(b.type==="text"){o.ratio=tOpt("tratio",String(b.ratio),"45");o.fit=tOpt("tfit",b.fit,"center");o.minh=tOpt("tminh",String(b.minh),"0")}
  tStyle(b,o);out.blocks.push(o)});return out}
function dmedia(p){if(!p)return"";if(/^(assets\/|https?:)/.test(p))return p;return SUPABASE_URL+"/storage/v1/object/public/"+p}
function designClean(s){
 var d=JSON.parse(JSON.stringify(DESIGN_DEFAULT));if(!s||typeof s!=="object")return d;
 ["light","dark"].forEach(function(t){["navy","acc","bg","ink"].forEach(function(k){var v=s.colors&&s.colors[t]&&s.colors[t][k];if(typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v))d.colors[t][k]=v.toLowerCase()})});
 ["light","dark"].forEach(function(t){DESIGN_COLORS_OPT.forEach(function(c){var v=s.colors&&s.colors[t]&&s.colors[t][c[0]];if(typeof v==="string"&&/^#[0-9a-fA-F]{6}$/.test(v))d.colors[t][c[0]]=v.toLowerCase()})});
 d.s={};DESIGN_FIELDS.forEach(function(f){var v=s.s&&s.s[f.k],ok=false;
  if(f.t==="select")ok=typeof v==="string"&&f.o.some(function(o){return o[0]===v});
  else if(f.t==="fontsel")ok=typeof v==="string"&&(v==="same"||!!DESIGN_FONTS[v]);
  else if(f.t==="range")ok=typeof v==="number"&&isFinite(v)&&v>=f.min&&v<=f.max;
  else if(f.t==="check")ok=typeof v==="boolean";
  else if(f.t==="text"){ok=typeof v==="string";if(ok)v=v.trim().slice(0,40)}
  else if(f.t==="url"){ok=typeof v==="string"&&(v.trim()===""||/^(https?:\/\/|mailto:|#)/i.test(v.trim()));if(ok)v=v.trim().slice(0,300)}
  else if(f.t==="area"){ok=typeof v==="string";if(ok)v=cssClean(v)}
  d.s[f.k]=ok?v:f.d});
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
 d.sx={};if(s.sx&&typeof s.sx==="object")Object.keys(DESIGN_SECTIONS).forEach(function(id){var x=s.sx[id];if(!x||typeof x!=="object")return;var o={bg:tHex(x.bg),fg:tHex(x.fg),ac:tHex(x.ac),wide:x.wide===true,pt:[0,16,32,48,72,96,128].indexOf(x.pt)>=0?x.pt:null,pb:[0,16,32,48,72,96,128].indexOf(x.pb)>=0?x.pb:null};
  if(o.bg||o.fg||o.ac||o.wide||o.pt!=null||o.pb!=null)d.sx[id]=o});
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
  if(c.hdr)r+="--hdr:"+c.hdr+";";if(c.hero1)r+="--hero1:"+c.hero1+";";if(c.hero2)r+="--hero2:"+c.hero2+";";if(c.card)r+="--card:"+c.card+";";if(c.line)r+="--line:"+c.line+";";
  css+=":root[data-theme=\""+t+"\"]{"+r+"}"});
 var vv="";DESIGN_FIELDS.forEach(function(f){if(f.v)vv+=f.v+":"+d.s[f.k]+(f.x||f.u||"")+";"});
 css+=":root{"+vv+"--fh:"+(d.s.font_head==="same"?"var(--f)":DESIGN_FONTS[d.s.font_head].css)+"}";
 css+=":root{--f:"+DESIGN_FONTS[d.font].css+";--r:"+d.look.radius+"px;--wrap:"+d.look.wrap+"px;--ad:"+(d.look.anim_speed/1000)+"s;--rw:"+({small:"118px",medium:"150px",large:"205px"}[d.look.roster])+"}";
 if(d.images.hero_bg){var g="color-mix(in srgb,var(--navy) "+d.look.hero_overlay+"%,transparent)";css+="html .hero,html[data-hero_mode] .hero{background:linear-gradient("+g+","+g+"),url(\""+dmedia(d.images.hero_bg)+"\") center/cover no-repeat}"}
 if(d.s.css)css+="\n/* δικό σου CSS */\n"+d.s.css+"\n";
 return css}
/* Ενότητα «Η ομάδα μας»: κείμενα, πρόσωπα, λογότυπα, όλα από το admin. Μόνο απλό κείμενο και ελεγμένοι σύνδεσμοι/εικόνες. */
function tEl(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function tPara(txt){var p=tEl("p","tm-p"),re=/\[([^\]]{1,120})\]\((https?:\/\/[^)\s]{1,300}|mailto:[^)\s]{1,200})\)/g,i=0,m;
 while((m=re.exec(txt))){if(m.index>i)p.appendChild(document.createTextNode(txt.slice(i,m.index)));var a=tEl("a",null,m[1]);a.href=m[2];a.rel="noopener";p.appendChild(a);i=m.index+m[0].length}
 if(i<txt.length)p.appendChild(document.createTextNode(txt.slice(i)));return p}
function tImgEl(path,alt){var im=document.createElement("img");im.src=dmedia(path);im.alt=alt||"";im.loading="lazy";im.decoding="async";return im}
function tLum(h){var n=parseInt(h.slice(1),16),r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;function f(c){return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)}return .2126*f(r)+.7152*f(g)+.0722*f(b)}
function tVars(o){var st="",bg=o.bg,fg=o.fg;if(bg&&!fg)fg=tLum(bg)<.4?"#ffffff":"#111111";
 if(bg)st+="background:"+bg+";--bg:"+bg+";--bgc:"+bg+";";
 if(fg){var b2=bg||"var(--bg)";st+="color:"+fg+";--ink:"+fg+";--mute:color-mix(in srgb,"+fg+" 64%,"+b2+");--line:color-mix(in srgb,"+fg+" 22%,"+b2+");--soft:color-mix(in srgb,"+fg+" 9%,"+b2+");"}
 if(o.ac)st+="--acc:"+o.ac+";";return st}
var T_PAD={s:"20px",m:"36px",l:"56px",xl:"84px"};
function renderTeam(t){
 var host=document.getElementById("teamx");if(!host)return false;var k=JSON.stringify(t);
 if(host.dataset.k===k)return t.blocks.length>0;host.dataset.k=k;host.textContent="";
 t.blocks.forEach(function(b,bi){
  var split=b.type==="text"&&(b.layout==="splitl"||b.layout==="splitr"),styled=!!(b.bg),
   w=tEl("div","tm-b tm-"+b.type+" tm-ts-"+b.ts+" tm-al-"+b.al+" tm-ebs-"+b.ebs+(b.up?" tm-up":"")+(split?" tm-split":"")+(styled?" tm-styled":"")+(b.wide?" tm-wide":""));
  w.setAttribute("data-tm","b"+bi);
  var st=tVars(b)+"--br:"+(b.wide?0:b.r)+"px;--tp:"+T_PAD[b.pad]+";";if(b.tf!=="same"&&DESIGN_FONTS[b.tf])st+="--tf:"+DESIGN_FONTS[b.tf].css+";";
  if(b.type==="text")st+="--ratio:"+b.ratio+"%;--fit:"+b.fit+";--minh:"+(b.minh==="0"?"0":b.minh+"px")+";";
  w.setAttribute("style",st);
  function head(into){if(b.eyebrow)into.appendChild(tEl("p","eb",b.eyebrow));if(b.title)into.appendChild(tEl("h2","tm-h",b.title))}
  if(b.type==="text"){var box=tEl("div","tm-intro tm-l-"+b.layout),tx=tEl("div","tm-txt");
   if(split)head(tx);else head(w);
   b.paras.forEach(function(x){tx.appendChild(tPara(x))});
   var im=null;if(b.image){im=tEl("div","tm-img");im.appendChild(tImgEl(b.image,b.title))}
   var imgFirst=b.layout==="left"||b.layout==="splitl"||b.layout==="top";
   if(imgFirst&&im)box.appendChild(im);
   if(b.paras.length||split)box.appendChild(tx);
   if(!imgFirst&&im)box.appendChild(im);
   w.appendChild(box)}
  else if(b.type==="people"){head(w);var g=tEl("div","tm-grid tm-"+(b.shape||"rect"));
   b.items.forEach(function(x,ii){if(!x.name&&!x.img)return;var c=tEl("div","tm-c");c.setAttribute("data-tm","b"+bi+"i"+ii);
    var ph=tEl("div","tm-ph");if(x.img)ph.appendChild(tImgEl(x.img,x.name));else ph.textContent=(x.name||"?").charAt(0);c.appendChild(ph);
    if(x.name)c.appendChild(tEl("div","tm-n",x.name));if(x.role)c.appendChild(tEl("div","tm-r",x.role));g.appendChild(c)});w.appendChild(g)}
  else{head(w);var g2=tEl("div","tm-grid tm-lg tm-s-"+(b.size||"medium"));
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
 DESIGN_FIELDS.forEach(function(f){if(f.t==="text"||f.t==="url"||f.t==="area")return;var v=d.s[f.k];R.setAttribute("data-"+f.k,v===true?"1":v===false?"0":String(v))});
 var hb=document.getElementById("hbtns");if(hb){hb.textContent="";[1,2].forEach(function(n){var tt=d.s["cta"+n+"_t"],uu=d.s["cta"+n+"_u"];if(tt&&uu){var ca=tEl("a","b"+n,tt);ca.href=uu;if(uu.charAt(0)!=="#")ca.rel="noopener";hb.appendChild(ca)}});hb.hidden=!hb.children.length}
 var pg=document.getElementById("prog");if(pg)pg.hidden=!d.look.progress;
 var an=document.getElementById("ann");if(an){an.hidden=!(d.announce.on&&d.announce.text);an.className="ann "+d.announce.tone;an.textContent=d.announce.text;
  if(d.announce.url){var aa=document.createElement("a");aa.href=d.announce.url;aa.textContent="Δες περισσότερα";aa.rel="noopener";an.appendChild(aa)}}
 Object.keys(d.stats).forEach(function(k){document.querySelectorAll("[data-st=\""+k+"\"]").forEach(function(el){el.hidden=!d.stats[k]})});
 var fam=[DESIGN_FONTS[d.font].g,d.s.font_head!=="same"?DESIGN_FONTS[d.s.font_head].g:null].concat(d.team.blocks.map(function(b){return b.tf&&b.tf!=="same"&&DESIGN_FONTS[b.tf]?DESIGN_FONTS[b.tf].g:null})).filter(function(x,i,a){return x&&a.indexOf(x)===i}),lk=document.getElementById("design-font");
 if(fam.length){if(!lk){lk=document.createElement("link");lk.id="design-font";lk.rel="stylesheet";document.head.appendChild(lk)}lk.href="https://fonts.googleapis.com/css2?"+fam.map(function(g){return"family="+g}).join("&")+"&display=swap"}else if(lk)lk.remove();
 DESIGN_TEXTS.forEach(function(t){var el=document.querySelector("[data-t=\""+t[0]+"\"]");if(el)el.textContent=d.texts[t[0]]||t[2]});
 DESIGN_IMAGES.forEach(function(m){if(!m[2])return;var el=document.getElementById(m[2]);if(!el)return;if(!el.dataset.d)el.dataset.d=el.getAttribute("src");el.src=d.images[m[0]]?dmedia(d.images[m[0]]):el.dataset.d});
 var lc=document.getElementById("lnk");
 if(lc){if(lc.dataset.d==null)lc.dataset.d=lc.innerHTML;
  if(d.links.length){lc.innerHTML="";d.links.forEach(function(x){var a=document.createElement("a");a.textContent=x.t;a.href=x.u;a.rel="noopener";lc.appendChild(a)})}else lc.innerHTML=lc.dataset.d}
 var main=document.querySelector("main"),nav=document.getElementById("nav");
 var hasTeam=renderTeam(d.team),pvm=document.documentElement.classList.contains("pv");
 d.sections.forEach(function(x){var el=document.getElementById(x.id);if(el){main.appendChild(el);el.hidden=!x.on||(x.id==="team"&&!hasTeam&&!pvm)}});
 d.sections.forEach(function(x){var el=document.getElementById(x.id),o=d.sx[x.id];if(!el)return;
  if(!o){el.removeAttribute("style");el.classList.remove("sxw","sxs");return}
  var st=tVars(o),pb=o.pb!=null?o.pb:(o.bg?44:null);if(o.pt!=null)st+="padding-top:"+o.pt+"px;";if(pb!=null)st+="padding-bottom:"+pb+"px;";
  if(o.bg)st+="margin-top:"+(o.pt!=null?0:0)+"px;";
  el.setAttribute("style",st);el.classList.add("sxs");el.classList.toggle("sxw",!!(o.wide&&o.bg))});
 var vi=0;d.sections.forEach(function(x){var el=document.getElementById(x.id);if(el){var show=!el.hidden;el.classList.toggle("alt",show&&vi%2===1);if(show)vi++}});
 if(nav)nav.innerHTML=d.sections.filter(function(x){return x.on&&DESIGN_NAV.indexOf(x.id)>=0&&(x.id!=="team"||hasTeam)}).map(function(x){var t=d.texts[{nextsec:"next_eb",mc:"mc_h",matches:"matches_eb",table:"table_eb",roster:"roster_h",stats:"stats_h"}[x.id]];var lg=x.id==="team"?(d.texts.team_nav||"Η ομάδα"):DESIGN_SECTIONS[x.id];return"<a href=\"#"+x.id+"\"><span class=\"nl\">"+lg+"</span><span class=\"ns\">"+(DESIGN_NAV_SHORT[x.id]||lg)+"</span></a>"}).join("");
 if(window.animScan)window.animScan();
 return d}
/* Φόρτωση: άμεσα από τη μνήμη του browser (χωρίς αναβοσβήσιμο), μετά ό,τι δημοσιεύτηκε στη βάση */
(function(){
 var pv=/[?&]preview=1/.test(location.search);
 if(pv){if(window.__pvInit)return;window.__pvInit=1;document.documentElement.classList.add("pv");
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
