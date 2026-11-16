/* Logos ομάδων απευθείας από το Προπάθλημα (hotlink, χωρίς αποθήκευση στο site).
   Κάθε γραμμή: όνομα ομάδας | διαδρομή μέσα στο propathlima.gr/wp-content/uploads/
   Ομάδες που δεν έχουν logo στο Προπάθλημα (ή αποτυγχάνει η φόρτωση) πέφτουν στο LOGO του data.js / της βάσης, και τελικά σε αρχικά. */
var PL_BASE="https://propathlima.gr/wp-content/uploads/";
var PL_RAW=[
"CSKA SYKOULAS|2026/09/cska-sykoulas-338x400.png","Ελίτ|2026/10/Gemini_Generated_Image_sv9mtsv9mtsv9mts-400x400.jpg","Rostario Central|2024/09/Messenger_creation_1308226313619834-1-273x400.jpeg","Fribernian|2026/09/fribernian-ath-383x400.png",
"Tsimitsourides|2023/10/tsimitsourides-400x385.png","Rusty FC|2026/09/inbound7071204366302747492_-_Nick_Louk-removebg-preview-351x400.png","HANGOVERS|2023/10/hangovers-1-400x400.png","Seleção|2026/09/Untitled-design-5-400x400.png",
"Club Three Bridges|2026/09/club-3-bridges-330x400.png","Σουλτάνοι|2024/09/soultanoi2-276x400.png","YONKA MALLORCA|2022/11/yonka_mallorca-226x400.png","Dragoes|2026/09/Dragoes-400x400.png",
"ΠΑΜΒΟΥΝΑΪΚΟΣ|2025/09/παμβουναικος-400x400.png","Μπαρτσελιοσια|2024/09/bartseliosia-386x400.png","OPA SENIORS|2023/10/opa-juniors-400x398.png","OPA JUNIORS|2023/10/opa-juniors-400x398.png",
"ΠΑΟ ΚΡΑΝΑΑΣ|2024/09/kranaa-400x398.png","Peirates SC|2025/08/4d45d22f-4912-40c9-abd4-7b6155f3431f-400x395.jpg","Peirates II SC|2025/08/4d45d22f-4912-40c9-abd4-7b6155f3431f-400x395.jpg","ΤΥΦΩΝΑΣ FC|2024/09/Untitled-design-400x400.png",
"Ατλετικο Κουκακιου|2024/09/Atletico-Koukakiou1-400x400.png","Βικτόρια Πρζεν|2024/09/viktoria-przen-284x400.png","LESIA 106 FC|2026/09/Untitled-design-400x398.png","Palta Praha|2023/10/ac-palta-praha-with-fill-390x400.png",
"ΑΔΕΡΦΟΥΛΑΜ|2026/10/adelfoulam-291x400.png","Κομπιναδόροι|2025/11/κομπιναδοροι-400x400.png","ΣουβΛατσιο|2025/09/souvlatsio-400x358.png","ΧΩΜΑ ΤΖΟΥΝΙΟΡΣ|2025/09/xoma-juniors-1-353x400.png",
"Lord Of The Strings|2025/09/lord-of-the-strings-366x400.png","KOPRITES FC|2025/09/Untitled-design-400x400.png","LESIA UNITED|2026/09/Untitled-design-4-400x400.png","ΧΑΠΙ END|2023/10/xapi-end-400x392.png",
"PAPEI SAINT-GERMAIN|2025/09/papei-saint-germain-394x400.png","Voltaren|2026/09/Voltaren-400x400.png","ΠΟΡΤΟ ΑΝΟΙΧΤΗ|2025/10/πορτο-ανοιχτη-343x400.png","Bekø/Glimt|2026/10/beko-2026-395x400.png",
"Βότκα Τζούνιορς|2025/09/votka-juniors-351x400.png","Π.Ο.Κ|2026/09/pok-400x400.png","Cu-Κουρέλια|2026/10/si-koureleia-348x400.png","REAL ΜΑΝΤΡΙ|2026/09/IMG_8819-filippos-pouliasis-400x400.png",
"Newhustle United|2023/10/NEWHUSTLE-1-400x400.png","Συνεταιρισμός Τυρνάβου|2026/10/924319E8-07E2-43CE-8958-7C8A07E8AFD5_-_Tassos_Tzanos-removebg-preview-400x223.png","ΜΗΧΑΝΑΜΠΑΛΟΙ|2024/09/ΜΗΧΑΝΑΜΠΑΛΟΙ-351x400.png","Π&Φ|2025/08/p-f-302x400.png",
"ΑΗΤΤΗΤΟΣ|2025/09/αηττητος-400x336.png","Ameangers FC|2026/10/IMG_3531_-_Nikos_Pitt-removebg-preview-400x223.png","Kopritario FC|2024/10/kopritario-fc-364x400.png","Παρτουζιακός|2023/10/partouziakos-400x400.png",
"XASTING UNIVERSITY SC|2026/09/Untitled-design-3-400x400.png","ROULIO F.C|2026/09/ROULIO-F.C-400x400.png","Simoun FC|2026/09/2DA7F96F-A509-4EE0-850C-4DC35FB942CD-Δημοσθενης-Τσιρης-225x400.jpeg","Vintzi FC|2023/10/vintzi-400x253.png",
"Bala Morena|2025/08/balamorena-347x400.png","Mantalona|2026/10/MANTALONA_LOGO-2026_TRANSPARENT_-_Leontios_Yannopapas-removebg-preview-379x400.png","Α-ΦΥΣΙΚΟΙ FC|2025/09/afysikoi-398x400.png","MARATHON FC|2023/10/marathon-1-400x377.png",
"Full-AM|2025/10/fullam-1-300x400.png","Orange Boys|2025/09/orange-boys-400x400.png","Gerakes FC|2023/10/gerakes-400x381.png","ΤΕΦΑΑΠΑ F.C|2026/10/tefaapa-312x400.png",
"Gentlemen FC|2022/11/gentlemens-1-400x373.png","Porto Calif|2025/11/porto-calif-400x400.png","ΑΣΤΕΙΑΤΟΡΕΣ|2023/10/asteiatores-400x400.png","ΠΑΡΑΟΥΡΟΙ|2026/09/Untitled-design-1-400x400.png",
"ΧΩΜΑ FC|2026/09/812903284_1622530596244525_83483976752439700_n_-_ParisEdgar-removebg-preview-308x400.png","ΗΡΑΚΛΕΙΑΚΟΣ|2026/09/inbound1527949405913249422-Konstantinos-Pantidos-400x368.jpg","NOSTA HAWKS FC|2026/09/Untitled-design-2-400x400.png","Deportivo La Gourounia|2024/09/deportivo-la-gourounia-293x400.png",
"VARατε τους|2026/09/Gemini_Generated_Image_m5z34rm5z34rm5z3-185x400.jpg","ALNASHAMA|2026/09/IMG_9723_-_Salman_Qudah-removebg-preview.png","BACARDIFF FC|2023/10/bacardiff-2.png","Kaulawlogoi f.c.|2023/10/kaulawlogoi-1-400x400.png",
"AUEB United|2022/11/aueb-united-364x400.png","Neverlusen FC|2025/09/neverlusen-368x400.png","Partouzeiro Fc|2026/10/partouzeiro-fc-393x400.png","ΨΩLEICESTER FC|2026/09/810730755_2354051688765137_3212410643063904326_n-400x286.jpg",
"Α.Ε.Φ|2023/10/aef-400x400.png","Kipseli FC|2025/09/kipseli-fc-318x400.png","AET FC|2026/10/IMG_8599-Giorgos-Ntakoulas-238x400.jpeg","Pasock United|2023/10/pasok-united-1.png",
"ΑΛΙΒΕΡΙ CITY|2022/11/inbound3474846630089735652_-_Γιωργος_Παναγιωτου-removebg-preview-400x400.png","Τσαμπικοένσε|2024/09/TSAMPIKOENSE-LOGO-Ιάκωβος-Κορκίδας-400x372.png","Goal Diggers|2025/09/goal-diggers-328x400.png","Γεραπετριντερ|2023/10/gerapetrinter-400x394.png",
"TEREAL F.C.|2026/09/inbound8908888212998913825_-_ΠΑΝΑΓΙΩΤΗΣ_ΑΛΕΞΑΝΔΡΟΥ-removebg-preview-400x310.png","Μοντγκόμερι FC|2025/08/μοντγκομερι-400x400.png","ΝΤΕ ΛΑΞΟ ΝΤΕ FC|2026/10/nte-laxo-nte-fc-384x400.png","No Vardy No Party|2023/10/No-Vardy-1-400x400.png",
"I Partouzopei F.C.|2026/09/LOGO.png","ΑΙΡΕΣΗ|2024/10/airesh-400x400.png","ΛΙΟΥΝΤΑΡ FC|2025/09/liountar.png","ASTON ΜΠΥΡΑ|2025/09/aston-mpyra-400x400.png",
"Πανεκπαϊκός|2023/10/panekpaikos-2-400x400.png","Α.Ο. ΑΝΕΡΓΑΛ|2025/10/anergal-400x400.png","HUA CALCIO|2026/10/IMG_2477_-_Fragkiskos_Melanitis-removebg-preview-400x400.png","Μαύροι τζόνιδες|2025/09/μαυροι-τζονηδες-324x400.png",
"Lord Of The Strings prodigies|2026/09/Untitled-design-7-243x400.png","West Attica Beer FSC|2026/10/inbound126844740163043091_-_Dimitrios_Kontokostas-removebg-preview-333x400.png","ΑΣΤΕΡΑΣ ΧΙΑΣΤΟΥ|2021/11/asteras-xiastou-400x400.png","107 fc|2026/10/107-fc-304x400.png",
"ΠΑΔΑΝΙΚΑΝΟΙ|2023/10/padanikanoi-1-358x400.png","Prezton|2026/10/prezton-west-side-fc.png","ΠΑΡΙ ΣΕΝ ΤΑΓΑΡ|2026/10/pari-sen-tagar-396x400.png","AURA FC|2026/09/AURA-FC-400x400.png",
"Chipotle Vegas FC|2026/09/b117ba7b-d99c-4950-997c-b4dc4214eb6c-removebg-preview-400x400.png","Τζόγος Μπονίτο|2024/10/tzogos-bonito-356x400.png","Αστέρας Εξαθλίων|2023/10/asteras-exathlion-400x400.png","ΜΠΥΡΑΚΛΗΣ ATHENS|2026/09/ea60b509-f7ae-46ce-9fe7-c89ae581e19f-400x400.jpg",
"St.Paroli fc|2026/10/Gemini_Generated_Image_p8ku38p8ku38p8ku-400x400.jpg","Hullia City|2026/10/5C2EB01C-9518-4815-BAA8-832B7900E0FF-Charalampos-Kontaxakis-400x400.jpeg","Πανφριμπαϊκος|2025/11/panfribaikos-393x400.png",
/* παλαιότερες σεζόν (πρωτότυπο αρχείο, αν λείπει πέφτει στο εφεδρικό) */
"Κλαμπ Μπαρμπριζ|2023/10/club-barbrugee-e1731923364731.png","Παρατηρητήριο|2021/10/παρατηρητηριο.png","Σπόρτινγκ Γιδών|2022/11/sporting-gidon.png","ΡΕΜΑΛ ΒΑΓΙΑΒΙΟΛΙΔ|2020/08/Ρεμαλ.png"];
/* Κλειδί ονόματος: αγνοεί τόνους, κεφαλαία, σημεία στίξης και παρενθέσεις τύπου «(ανενεργή)» */
function lkey(n){return String(n).replace(/\(.*?\)/g,"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ς/g,"σ").replace(/[^a-z0-9α-ω]/g,"")}
var PL_MAP={};PL_RAW.forEach(function(x){var i=x.indexOf("|");PL_MAP[lkey(x.slice(0,i))]=x.slice(i+1)});
function plLogo(n){var p=PL_MAP[lkey(n)];return p?PL_BASE+p:""}
