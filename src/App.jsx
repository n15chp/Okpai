import { useState } from “react”;

const COLORS = {
primary: “#06C755”,
primaryDark: “#049A41”,
bg: “#F0F2F5”,
card: “#FFFFFF”,
text: “#1A1A2E”,
sub: “#6B7280”,
accent: “#FF6B6B”,
yellow: “#FFD93D”,
blue: “#4ECDC4”,
purple: “#A29BFE”,
};

const members = [
{ id: 1, name: “นิชาภา”, avatar: “🧑‍💼”, color: “#06C755” },
{ id: 2, name: “แบม”, avatar: “👩‍🎤”, color: “#FF6B6B” },
{ id: 3, name: “เจน”, avatar: “🧑‍🍳”, color: “#4ECDC4” },
{ id: 4, name: “ต้น”, avatar: “🧑‍💻”, color: “#A29BFE” },
{ id: 5, name: “ปิ๊ก”, avatar: “👨‍🎨”, color: “#FFD93D” },
];

const availabilityData = {
“2026-05-01”: [1,2,3,4,5], “2026-05-02”: [1,2,4],
“2026-05-03”: [2,3,5], “2026-05-07”: [1,3,4,5],
“2026-05-08”: [1,2,3,4,5], “2026-05-09”: [1,4,5],
“2026-05-10”: [2,3,4], “2026-05-14”: [1,2,5],
“2026-05-15”: [1,2,3,5], “2026-05-16”: [1,2,3,4,5],
};

const daysOfWeek = [“อา”,“จ”,“อ”,“พ”,“พฤ”,“ศ”,“ส”];

const getDaysInMonth = () => {
const firstDay = new Date(2026,4,1).getDay();
const days = [];
for(let i=0;i<firstDay;i++) days.push(null);
for(let d=1;d<=31;d++) days.push({day:d,key:`2026-05-${String(d).padStart(2,"0")}`});
return days;
};

const calendarDays = getDaysInMonth();

export default function TripMate() {
const [screen, setScreen] = useState(“home”);
const [selectedDays, setSelectedDays] = useState(new Set([“2026-05-01”,“2026-05-08”,“2026-05-16”]));
const [myVotes, setMyVotes] = useState(new Set([1,3]));
const [tripType, setTripType] = useState(null);
const [hoveredDate, setHoveredDate] = useState(null);
const [confirmed, setConfirmed] = useState(false);
const [expenses, setExpenses] = useState([
{id:1,desc:“จองที่พัก The Forest”,amount:3000,paidBy:1,split:[1,2,3,4,5]},
{id:2,desc:“ค่าน้ำมัน (รถต้น)”,amount:600,paidBy:4,split:[1,2,3,4,5]},
{id:3,desc:“ค่าน้ำมัน (รถปิ๊ก)”,amount:580,paidBy:5,split:[1,2,3,4,5]},
{id:4,desc:“ของกินระหว่างทาง”,amount:850,paidBy:2,split:[1,2,3,4,5]},
{id:5,desc:“ค่าเข้าอุทยาน”,amount:500,paidBy:1,split:[1,2,3,4,5]},
]);
const [newExpense, setNewExpense] = useState({desc:””,amount:””});
const [showAddExpense, setShowAddExpense] = useState(false);
const [tripConfirmed, setTripConfirmed] = useState(false);

const places = [
{id:1,name:“เขาใหญ่”,emoji:“🏔️”,votes:[1,2,3],type:“long”,distance:“~200 กม.”,time:“2.5 ชม.”},
{id:2,name:“พัทยา”,emoji:“🏖️”,votes:[1,4,5],type:“long”,distance:“~140 กม.”,time:“1.5 ชม.”},
{id:3,name:“อยุธยา”,emoji:“🏛️”,votes:[2,3,4,5],type:“one-day”,distance:“~80 กม.”,time:“1 ชม.”},
{id:4,name:“ตลาดน้ำ”,emoji:“🛶”,votes:[1,2],type:“one-day”,distance:“~60 กม.”,time:“45 นาที”},
];

const getOverlapLevel = (dateKey) => {
const a = availabilityData[dateKey]||[];
if(a.length===5) return “full”;
if(a.length>=3) return “partial”;
if(a.length>0) return “low”;
return “none”;
};

const getOverlapColor = (level) => {
if(level===“full”) return COLORS.primary;
if(level===“partial”) return COLORS.yellow;
if(level===“low”) return “#FFAA5A”;
return “transparent”;
};

const totalExpense = expenses.reduce((s,e)=>s+e.amount,0);
const perPerson = Math.round(totalExpense/5);

const getBalance = (memberId) => {
let paid = 0, owe = 0;
expenses.forEach(e=>{
if(e.paidBy===memberId) paid+=e.amount;
if(e.split.includes(memberId)) owe+=e.amount/e.split.length;
});
return Math.round(paid-owe);
};

const navItems = [
{screen:“home”,icon:“🏠”,label:“หน้าแรก”},
{screen:“calendar”,icon:“📅”,label:“ปฏิทิน”},
{screen:“places”,icon:“🗳️”,label:“โหวต”},
{screen:“travel”,icon:“🚗”,label:“เดินทาง”},
{screen:“expense”,icon:“💰”,label:“ค่าใช้จ่าย”},
{screen:“summary”,icon:“✅”,label:“สรุปทริป”},
];

const Btn = ({label,onClick,color,light,style={}})=>(
<button onClick={onClick} style={{
background: light ? (color||COLORS.primary)+“18” : (color||COLORS.primary),
color: light ? (color||COLORS.primary) : “#fff”,
border:“none”,borderRadius:12,padding:“10px 16px”,
fontSize:13,fontWeight:700,cursor:“pointer”,…style
}}>{label}</button>
);

const Card = ({children,style={}})=>(
<div style={{background:”#fff”,borderRadius:14,padding:“14px”,
boxShadow:“0 2px 10px rgba(0,0,0,0.06)”,…style}}>{children}</div>
);

// ─── SCREENS ────────────────────────────────────────────────────────────────

const HomeScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
<div style={{background:`linear-gradient(135deg,#06C755 0%,#049A41 100%)`,
padding:“24px 20px 32px”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,top:-20,right:-20,width:120,height:120,
borderRadius:“50%”,background:“rgba(255,255,255,0.1)”}}/>
<div style={{fontSize:13,color:“rgba(255,255,255,0.8)”,marginBottom:4}}>สวัสดี 👋</div>
<div style={{fontSize:22,fontWeight:800,color:”#fff”,letterSpacing:-0.5}}>นิชาภา</div>
<div style={{fontSize:13,color:“rgba(255,255,255,0.8)”,marginTop:4}}>
{tripConfirmed?“✅ ทริปเขาใหญ่ ยืนยันแล้ว!”:“มีทริปรออยู่ 1 รายการ”}
</div>
</div>

```
  <div style={{padding:"0 16px",marginTop:-16}}>
    <Card style={{border:`2px solid ${tripConfirmed?"#06C755":"#06C755"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,color:COLORS.primary,fontWeight:700,letterSpacing:1}}>กลุ่มที่กำลังวางแผน</div>
          <div style={{fontSize:18,fontWeight:800,color:COLORS.text,marginTop:2}}>🌴 เพื่อนซี้ 5 คน</div>
          <div style={{fontSize:12,color:COLORS.sub,marginTop:4}}>
            {tripConfirmed?"📍 เขาใหญ่ · 1–3 พ.ค. 2026 ✅":"5 สมาชิก · กำลังวางแผน"}
          </div>
        </div>
        <Btn label="เปิด →" onClick={()=>setScreen(tripConfirmed?"summary":"calendar")}/>
      </div>
      <div style={{display:"flex",gap:6,marginTop:12}}>
        {members.map(m=>(
          <div key={m.id} style={{width:32,height:32,borderRadius:"50%",
            background:m.color+"22",border:`2px solid ${m.color}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
            {m.avatar}
          </div>
        ))}
      </div>
    </Card>
  </div>

  <div style={{padding:"20px 16px 0"}}>
    <div style={{fontSize:14,fontWeight:700,color:COLORS.text,marginBottom:12}}>เมนูหลัก</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[
        {icon:"📅",label:"ปฏิทินว่าง",sub:"อัปเดตวันของฉัน",s:"calendar"},
        {icon:"🗳️",label:"โหวตสถานที่",sub:"3 คนโหวตแล้ว",s:"places"},
        {icon:"🚗",label:"แผนเดินทาง",sub:"รถส่วนตัว 2 คัน",s:"travel"},
        {icon:"💰",label:"หารค่าใช้จ่าย",sub:`รวม ฿${totalExpense.toLocaleString()}`,s:"expense"},
        {icon:"✅",label:"สรุปทริป",sub:tripConfirmed?"ยืนยันแล้ว":"รอ confirm",s:"summary"},
        {icon:"🔔",label:"แจ้งเตือน",sub:"2 รายการใหม่",s:"notify"},
      ].map(item=>(
        <button key={item.label} onClick={()=>setScreen(item.s)} style={{
          background:"#fff",border:"none",borderRadius:14,
          padding:"14px",textAlign:"left",cursor:"pointer",
          boxShadow:"0 2px 10px rgba(0,0,0,0.06)",
        }}>
          <div style={{fontSize:24}}>{item.icon}</div>
          <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginTop:6}}>{item.label}</div>
          <div style={{fontSize:11,color:COLORS.sub,marginTop:2}}>{item.sub}</div>
        </button>
      ))}
    </div>
  </div>
</div>
```

);

const CalendarScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
<div style={{background:”#fff”,padding:“20px 16px 12px”}}>
<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>📅 ปฏิทินว่าง</div>
<div style={{fontSize:13,color:COLORS.sub,marginTop:4}}>เลือกวันที่เธอว่าง · พฤษภาคม 2026</div>
</div>
<div style={{padding:“10px 16px”,background:”#fff”,borderBottom:“1px solid #f0f0f0”}}>
<div style={{display:“flex”,gap:10,fontSize:11,flexWrap:“wrap”}}>
{[
{color:COLORS.primary,label:“ทุกคนว่าง (5/5)”},
{color:COLORS.yellow,label:“ส่วนใหญ่ว่าง (3-4)”},
{color:”#FFAA5A”,label:“บางคนว่าง (1-2)”},
].map(l=>(
<div key={l.label} style={{display:“flex”,alignItems:“center”,gap:4}}>
<div style={{width:10,height:10,borderRadius:3,background:l.color}}/>
<span style={{color:COLORS.sub}}>{l.label}</span>
</div>
))}
</div>
</div>
<div style={{padding:“12px 16px”,background:”#fff”,margin:“8px 0”}}>
<div style={{display:“grid”,gridTemplateColumns:“repeat(7,1fr)”,gap:4,marginBottom:8}}>
{daysOfWeek.map(d=>(
<div key={d} style={{textAlign:“center”,fontSize:11,color:COLORS.sub,fontWeight:700,padding:“4px 0”}}>{d}</div>
))}
</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(7,1fr)”,gap:4}}>
{calendarDays.map((d,i)=>{
if(!d) return <div key={i}/>;
const level=getOverlapLevel(d.key);
const oc=getOverlapColor(level);
const isSel=selectedDays.has(d.key);
const available=availabilityData[d.key]||[];
return(
<button key={d.key}
onClick={()=>{const s=new Set(selectedDays);s.has(d.key)?s.delete(d.key):s.add(d.key);setSelectedDays(s);}}
onMouseEnter={()=>setHoveredDate(d.key)}
onMouseLeave={()=>setHoveredDate(null)}
style={{aspectRatio:“1”,border:isSel?`2px solid ${COLORS.primary}`:“2px solid transparent”,
borderRadius:10,background:isSel?COLORS.primary+“22”:oc!==“transparent”?oc+“33”:”#f8f8f8”,
cursor:“pointer”,display:“flex”,flexDirection:“column”,alignItems:“center”,
justifyContent:“center”,padding:0}}>
<span style={{fontSize:13,fontWeight:isSel?800:600,color:isSel?COLORS.primary:COLORS.text}}>{d.day}</span>
{oc!==“transparent”&&<div style={{width:14,height:4,borderRadius:2,background:oc,marginTop:2}}/>}
{available.length>0&&<div style={{fontSize:8,color:COLORS.sub}}>{available.length}/5</div>}
</button>
);
})}
</div>
</div>
{hoveredDate&&availabilityData[hoveredDate]&&(
<div style={{margin:“0 16px 12px”}}>
<Card>
<div style={{fontSize:12,fontWeight:700,color:COLORS.text,marginBottom:8}}>
{hoveredDate} — {availabilityData[hoveredDate].length} คนว่าง
</div>
<div style={{display:“flex”,gap:8}}>
{members.map(m=>{
const free=availabilityData[hoveredDate]?.includes(m.id);
return(
<div key={m.id} style={{textAlign:“center”,opacity:free?1:0.3}}>
<div style={{fontSize:20}}>{m.avatar}</div>
<div style={{fontSize:9,color:free?COLORS.primary:COLORS.sub}}>{m.name}</div>
</div>
);
})}
</div>
</Card>
</div>
)}
<div style={{padding:“0 16px”}}>
<Btn label=“บันทึกวันว่างของฉัน ✓” onClick={()=>setScreen(“home”)} style={{width:“100%”,padding:“14px”,fontSize:15}}/>
</div>
</div>
);

const PlacesScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
<div style={{background:”#fff”,padding:“20px 16px 16px”}}>
<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>🗳️ โหวตสถานที่</div>
<div style={{fontSize:13,color:COLORS.sub,marginTop:4}}>เสนอหรือโหวตสถานที่ที่อยากไป</div>
<div style={{display:“flex”,gap:8,marginTop:12}}>
{[{v:“one-day”,label:“One Day 🌅”},{v:“long”,label:“Long Trip 🏕️”}].map(t=>(
<button key={t.v} onClick={()=>setTripType(tripType===t.v?null:t.v)} style={{
flex:1,padding:“8px”,border:`2px solid ${tripType===t.v?COLORS.primary:"#e0e0e0"}`,
borderRadius:10,background:tripType===t.v?COLORS.primary+“15”:”#fff”,
color:tripType===t.v?COLORS.primary:COLORS.sub,
fontSize:12,fontWeight:700,cursor:“pointer”}}>{t.label}</button>
))}
</div>
</div>
<div style={{padding:“12px 16px”,display:“flex”,flexDirection:“column”,gap:10}}>
{places.filter(p=>!tripType||p.type===tripType).map(place=>{
const voted=myVotes.has(place.id);
const totalVotes=place.votes.length+(voted&&!place.votes.includes(1)?1:0);
const pct=Math.round((totalVotes/5)*100);
return(
<Card key={place.id} style={{border:voted?`2px solid ${COLORS.primary}`:“2px solid transparent”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div style={{display:“flex”,alignItems:“center”,gap:10}}>
<div style={{fontSize:32}}>{place.emoji}</div>
<div>
<div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>{place.name}</div>
<div style={{fontSize:11,color:COLORS.sub}}>
{place.type===“long”?“🏕️ Long Trip”:“🌅 One Day”} · {totalVotes}/5 โหวต
</div>
<div style={{fontSize:11,color:COLORS.blue}}>📍 {place.distance} · ⏱ {place.time}</div>
</div>
</div>
<Btn label={voted?“✓ โหวตแล้ว”:“โหวต”} light={!voted}
onClick={()=>{const v=new Set(myVotes);v.has(place.id)?v.delete(place.id):v.add(place.id);setMyVotes(v);}}/>
</div>
<div style={{marginTop:10,height:6,background:”#f0f0f0”,borderRadius:3}}>
<div style={{height:“100%”,width:`${pct}%`,background:COLORS.primary,borderRadius:3,transition:“width 0.3s”}}/>
</div>
<div style={{display:“flex”,gap:4,marginTop:8}}>
{members.map(m=>{
const hasVoted=place.votes.includes(m.id)||(m.id===1&&voted);
return <div key={m.id} style={{fontSize:16,opacity:hasVoted?1:0.25}}>{m.avatar}</div>;
})}
</div>
</Card>
);
})}
</div>
</div>
);

const TravelScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
<div style={{background:”#fff”,padding:“20px 16px 16px”}}>
<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>🚗 แผนการเดินทาง</div>
<div style={{fontSize:13,color:COLORS.sub,marginTop:4}}>เขาใหญ่ · 1–3 พ.ค. 2026</div>
</div>
<div style={{padding:“12px 16px”,display:“flex”,flexDirection:“column”,gap:10}}>
{[
{icon:“🚗”,title:“รถส่วนตัว”,detail:“ต้องการ 2 คัน (5 คน)”,
sub:“ระยะทาง ~200 กม. · ~2.5 ชม.”,cost:“ค่าน้ำมัน ~฿600/คัน · ด่วน ~฿150”,color:”#4ECDC4”,selected:true},
{icon:“🚌”,title:“รถโดยสาร”,detail:“สาย กทม. → ปากช่อง”,
sub:“ออก 07:00 ถึง 09:30 · มีรถทุก 1 ชม.”,cost:“~฿180/คน · ต่อสองแถว ฿40”,color:”#A29BFE”},
{icon:“🚆”,title:“รถไฟ”,detail:“หัวลำโพง → ปากช่อง”,
sub:“ออก 06:40 ถึง 10:20”,cost:“~฿48–290/คน (ชั้น 2–3)”,color:”#FFD93D”},
].map(opt=>(
<div key={opt.title} style={{background:”#fff”,borderRadius:14,padding:“14px”,
boxShadow:“0 2px 10px rgba(0,0,0,0.06)”,
borderLeft:`4px solid ${opt.color}`,
outline:opt.selected?`2px solid ${COLORS.primary}`:“none”}}>
<div style={{display:“flex”,alignItems:“center”,gap:8,justifyContent:“space-between”}}>
<div style={{display:“flex”,alignItems:“center”,gap:8}}>
<span style={{fontSize:24}}>{opt.icon}</span>
<div>
<div style={{fontSize:15,fontWeight:800,color:COLORS.text}}>{opt.title}</div>
<div style={{fontSize:12,color:COLORS.sub}}>{opt.detail}</div>
</div>
</div>
{opt.selected&&<span style={{fontSize:11,background:COLORS.primary+“18”,color:COLORS.primary,
borderRadius:8,padding:“3px 8px”,fontWeight:700}}>เลือกแล้ว ✓</span>}
</div>
<div style={{marginTop:8,padding:“8px”,background:”#f8f8f8”,borderRadius:8}}>
<div style={{fontSize:12,color:COLORS.text}}>⏱ {opt.sub}</div>
<div style={{fontSize:12,color:COLORS.primary,marginTop:4}}>💰 {opt.cost}</div>
</div>
</div>
))}
<Card>
<div style={{fontSize:14,fontWeight:800,color:COLORS.text,marginBottom:10}}>🚗 จัดรถ</div>
{[
{car:“Honda CR-V (ต้น)”,passengers:[“นิชาภา”,“แบม”,“เจน”],fuel:600},
{car:“Toyota Yaris (ปิ๊ก)”,passengers:[“ต้น”,“ปิ๊ก”],fuel:580},
].map(c=>(
<div key={c.car} style={{padding:“10px”,background:”#f8f8f8”,borderRadius:10,marginBottom:8}}>
<div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>🚗 {c.car}</div>
<div style={{fontSize:12,color:COLORS.sub,marginTop:4}}>ผู้โดยสาร: {c.passengers.join(” · “)}</div>
<div style={{fontSize:12,color:COLORS.primary}}>ค่าน้ำมันประมาณ: ฿{c.fuel}</div>
</div>
))}
</Card>
<Card>
<div style={{fontSize:14,fontWeight:800,color:COLORS.text,marginBottom:10}}>📋 ของที่ต้องเตรียม</div>
{[
{item:“จองที่พัก The Forest”,owner:“นิชาภา”,done:true},
{item:“เช็คสภาพรถ”,owner:“ต้น”,done:true},
{item:“ซื้อน้ำและของกิน”,owner:“แบม”,done:false},
{item:“ยาและอุปกรณ์ปฐมพยาบาล”,owner:“เจน”,done:false},
{item:“กล้องถ่ายรูป”,owner:“ปิ๊ก”,done:false},
].map(c=>(
<div key={c.item} style={{display:“flex”,alignItems:“center”,gap:10,
padding:“8px 0”,borderBottom:“1px solid #f0f0f0”}}>
<div style={{width:20,height:20,borderRadius:6,
background:c.done?COLORS.primary:”#f0f0f0”,
display:“flex”,alignItems:“center”,justifyContent:“center”,
fontSize:11,color:”#fff”,flexShrink:0}}>{c.done?“✓”:””}</div>
<div style={{flex:1}}>
<div style={{fontSize:13,fontWeight:600,
color:c.done?COLORS.sub:COLORS.text,
textDecoration:c.done?“line-through”:“none”}}>{c.item}</div>
<div style={{fontSize:11,color:COLORS.sub}}>รับผิดชอบ: {c.owner}</div>
</div>
</div>
))}
</Card>
</div>
</div>
);

// ─── EXPENSE SCREEN ──────────────────────────────────────────────────────────
const ExpenseScreen = ()=>{
const addExpense = ()=>{
if(!newExpense.desc||!newExpense.amount) return;
setExpenses(prev=>[…prev,{
id:prev.length+1,desc:newExpense.desc,
amount:parseInt(newExpense.amount),paidBy:1,split:[1,2,3,4,5]
}]);
setNewExpense({desc:””,amount:””});
setShowAddExpense(false);
};
return(
<div style={{padding:“0 0 80px”}}>
<div style={{background:”#fff”,padding:“20px 16px 16px”}}>
<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>💰 หารค่าใช้จ่าย</div>
<div style={{fontSize:13,color:COLORS.sub,marginTop:4}}>ทริปเขาใหญ่ · 5 คน</div>
{/* Summary bar */}
<div style={{display:“flex”,gap:10,marginTop:12}}>
<div style={{flex:1,background:COLORS.primary+“12”,borderRadius:12,padding:“10px”,textAlign:“center”}}>
<div style={{fontSize:11,color:COLORS.sub}}>รวมทั้งหมด</div>
<div style={{fontSize:18,fontWeight:800,color:COLORS.primary}}>฿{totalExpense.toLocaleString()}</div>
</div>
<div style={{flex:1,background:”#4ECDC422”,borderRadius:12,padding:“10px”,textAlign:“center”}}>
<div style={{fontSize:11,color:COLORS.sub}}>เฉลี่ย/คน</div>
<div style={{fontSize:18,fontWeight:800,color:”#4ECDC4”}}>฿{perPerson.toLocaleString()}</div>
</div>
</div>
</div>

```
    <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
      {/* Balance */}
      <Card>
        <div style={{fontSize:14,fontWeight:800,color:COLORS.text,marginBottom:10}}>⚖️ ยอดเงินแต่ละคน</div>
        {members.map(m=>{
          const bal=getBalance(m.id);
          return(
            <div key={m.id} style={{display:"flex",alignItems:"center",
              justifyContent:"space-between",padding:"8px 0",
              borderBottom:"1px solid #f0f0f0"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:20}}>{m.avatar}</div>
                <div style={{fontSize:13,fontWeight:600,color:COLORS.text}}>{m.name}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:13,fontWeight:800,
                  color:bal>=0?COLORS.primary:COLORS.accent}}>
                  {bal>=0?`ได้รับ ฿${bal}`:`จ่ายเพิ่ม ฿${Math.abs(bal)}`}
                </div>
                <div style={{fontSize:10,color:COLORS.sub}}>{bal>=0?"เจ้าหนี้":"ลูกหนี้"}</div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* Expense list */}
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:14,fontWeight:800,color:COLORS.text}}>🧾 รายการค่าใช้จ่าย</div>
          <Btn label="+ เพิ่ม" light onClick={()=>setShowAddExpense(!showAddExpense)} style={{padding:"6px 12px",fontSize:12}}/>
        </div>

        {showAddExpense&&(
          <div style={{background:"#f8f8f8",borderRadius:10,padding:"12px",marginBottom:12}}>
            <input value={newExpense.desc} onChange={e=>setNewExpense(p=>({...p,desc:e.target.value}))}
              placeholder="รายการ เช่น ค่าอาหารเย็น"
              style={{width:"100%",border:"1px solid #e0e0e0",borderRadius:8,padding:"8px 10px",
                fontSize:13,marginBottom:8,boxSizing:"border-box",outline:"none"}}/>
            <div style={{display:"flex",gap:8}}>
              <input value={newExpense.amount} onChange={e=>setNewExpense(p=>({...p,amount:e.target.value}))}
                placeholder="จำนวนเงิน (฿)"
                type="number"
                style={{flex:1,border:"1px solid #e0e0e0",borderRadius:8,padding:"8px 10px",
                  fontSize:13,outline:"none"}}/>
              <Btn label="บันทึก" onClick={addExpense} style={{padding:"8px 14px",fontSize:13}}/>
            </div>
          </div>
        )}

        {expenses.map(e=>{
          const payer=members.find(m=>m.id===e.paidBy);
          return(
            <div key={e.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 0",borderBottom:"1px solid #f5f5f5"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>{e.desc}</div>
                <div style={{fontSize:11,color:COLORS.sub,marginTop:2}}>
                  จ่ายโดย {payer?.avatar} {payer?.name} · หาร {e.split.length} คน
                </div>
              </div>
              <div style={{fontSize:15,fontWeight:800,color:COLORS.text}}>฿{e.amount.toLocaleString()}</div>
            </div>
          );
        })}
      </Card>

      {/* Who owes whom */}
      <Card style={{background:COLORS.primary+"08",border:`1px solid ${COLORS.primary}33`}}>
        <div style={{fontSize:14,fontWeight:800,color:COLORS.text,marginBottom:10}}>💸 สรุปการโอนเงิน</div>
        {[
          {from:"ปิ๊ก",to:"นิชาภา",amount:80},
          {from:"แบม",to:"นิชาภา",amount:230},
          {from:"เจน",to:"ต้น",amount:106},
        ].map((t,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"8px",background:"#fff",borderRadius:10,marginBottom:6}}>
            <div style={{fontSize:13,color:COLORS.text}}>
              <span style={{fontWeight:700}}>{t.from}</span>
              <span style={{color:COLORS.sub}}> โอนให้ </span>
              <span style={{fontWeight:700}}>{t.to}</span>
            </div>
            <div style={{fontSize:14,fontWeight:800,color:COLORS.accent}}>฿{t.amount}</div>
          </div>
        ))}
      </Card>
    </div>
  </div>
);
```

};

// ─── SUMMARY SCREEN ──────────────────────────────────────────────────────────
const SummaryScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
{tripConfirmed&&(
<div style={{background:`linear-gradient(135deg,#06C755,#049A41)`,
padding:“20px 16px”,textAlign:“center”}}>
<div style={{fontSize:32}}>🎉</div>
<div style={{fontSize:20,fontWeight:800,color:”#fff”}}>ทริปยืนยันแล้ว!</div>
<div style={{fontSize:13,color:“rgba(255,255,255,0.8)”,marginTop:4}}>ส่งแจ้งเตือนถึงทุกคนแล้ว</div>
</div>
)}

```
  <div style={{background:"#fff",padding:"20px 16px 16px",
    borderBottom:tripConfirmed?"none":"0"}}>
    {!tripConfirmed&&<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>✅ สรุปทริป</div>}
    {!tripConfirmed&&<div style={{fontSize:13,color:COLORS.sub,marginTop:4}}>รีวิวและยืนยันแผนทั้งหมด</div>}
  </div>

  <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
    {/* Trip card */}
    <div style={{background:`linear-gradient(135deg,#1a1a2e,#0f3460)`,
      borderRadius:16,padding:"20px",color:"#fff",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.15}}>🏔️</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",letterSpacing:2}}>TRIP SUMMARY</div>
      <div style={{fontSize:24,fontWeight:800,marginTop:4}}>เขาใหญ่ 🏔️</div>
      <div style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginTop:6}}>1–3 พฤษภาคม 2026 · 3 วัน 2 คืน</div>
      <div style={{display:"flex",gap:16,marginTop:16}}>
        <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>สมาชิก</div><div style={{fontSize:18,fontWeight:800}}>5 คน</div></div>
        <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>ค่าใช้จ่าย/คน</div><div style={{fontSize:18,fontWeight:800}}>฿{perPerson.toLocaleString()}</div></div>
        <div><div style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>การเดินทาง</div><div style={{fontSize:18,fontWeight:800}}>🚗×2</div></div>
      </div>
      <div style={{display:"flex",gap:6,marginTop:16}}>
        {members.map(m=>(
          <div key={m.id} style={{width:36,height:36,borderRadius:"50%",
            background:m.color+"44",border:`2px solid ${m.color}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
            {m.avatar}
          </div>
        ))}
      </div>
    </div>

    {/* Details */}
    {[
      {icon:"📅",title:"วันที่เดินทาง",detail:"1–3 พฤษภาคม 2026",sub:"วันศุกร์ – วันอาทิตย์",status:"✅"},
      {icon:"📍",title:"สถานที่",detail:"อุทยานแห่งชาติเขาใหญ่",sub:"นครราชสีมา · 200 กม. จากกรุงเทพ",status:"✅"},
      {icon:"🏨",title:"ที่พัก",detail:"The Forest Khao Yai",sub:"ห้อง Deluxe 2 ห้อง · ฿3,000/คืน",status:"✅"},
      {icon:"🚗",title:"การเดินทาง",detail:"รถส่วนตัว 2 คัน",sub:"ออกเดินทาง 07:00 น. วันที่ 1 พ.ค.",status:"✅"},
      {icon:"💰",title:"ค่าใช้จ่ายรวม",detail:`฿${totalExpense.toLocaleString()} (฿${perPerson}/คน)`,sub:"แบ่งจ่ายเท่ากัน 5 คน",status:"✅"},
    ].map(d=>(
      <Card key={d.title}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:24}}>{d.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:COLORS.sub,fontWeight:600}}>{d.title}</div>
            <div style={{fontSize:14,fontWeight:800,color:COLORS.text}}>{d.detail}</div>
            <div style={{fontSize:11,color:COLORS.sub,marginTop:2}}>{d.sub}</div>
          </div>
          <div style={{fontSize:16}}>{d.status}</div>
        </div>
      </Card>
    ))}

    {/* Timeline */}
    <Card>
      <div style={{fontSize:14,fontWeight:800,color:COLORS.text,marginBottom:12}}>🗓️ Timeline</div>
      {[
        {date:"20 เม.ย.",event:"📢 แจ้งเตือนกลุ่ม: ทริปเขาใหญ่ใกล้แล้ว!",done:true},
        {date:"28 เม.ย.",event:"🔔 แจ้งเตือน 3 วันก่อนเดินทาง",done:false},
        {date:"30 เม.ย.",event:"⏰ แจ้งเตือน 1 วันก่อน: เตรียมของ!",done:false},
        {date:"1 พ.ค. 07:00",event:"🚗 ออกเดินทาง — นัดหมาย BTS สยาม",done:false},
        {date:"1 พ.ค. 09:30",event:"📍 ถึงเขาใหญ่",done:false},
        {date:"3 พ.ค. 18:00",event:"🏠 กลับถึงกรุงเทพ",done:false},
      ].map((t,i)=>(
        <div key={i} style={{display:"flex",gap:10,padding:"6px 0",alignItems:"flex-start"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:10,height:10,borderRadius:"50%",
              background:t.done?COLORS.primary:"#e0e0e0",flexShrink:0,marginTop:3}}/>
            {i<5&&<div style={{width:2,height:24,background:"#f0f0f0"}}/>}
          </div>
          <div>
            <div style={{fontSize:11,color:COLORS.sub,fontWeight:700}}>{t.date}</div>
            <div style={{fontSize:12,color:t.done?COLORS.sub:COLORS.text,
              textDecoration:t.done?"line-through":"none"}}>{t.event}</div>
          </div>
        </div>
      ))}
    </Card>

    {/* Confirm button */}
    {!tripConfirmed?(
      <button onClick={()=>setTripConfirmed(true)} style={{
        width:"100%",background:`linear-gradient(135deg,#06C755,#049A41)`,
        color:"#fff",border:"none",borderRadius:14,padding:"16px",
        fontSize:16,fontWeight:800,cursor:"pointer",
        boxShadow:"0 4px 20px rgba(6,199,85,0.4)"
      }}>🎉 ยืนยันทริป — แจ้งเตือนทุกคน!</button>
    ):(
      <div style={{background:COLORS.primary+"12",borderRadius:14,padding:"16px",textAlign:"center",
        border:`2px solid ${COLORS.primary}`}}>
        <div style={{fontSize:20}}>✅</div>
        <div style={{fontSize:14,fontWeight:800,color:COLORS.primary}}>ยืนยันและแจ้งเตือนทุกคนแล้ว</div>
        <div style={{fontSize:12,color:COLORS.sub,marginTop:4}}>LINE notification ส่งไปยัง 5 คน</div>
      </div>
    )}
  </div>
</div>
```

);

const NotifyScreen = ()=>(
<div style={{padding:“0 0 80px”}}>
<div style={{background:”#fff”,padding:“20px 16px 16px”}}>
<div style={{fontSize:18,fontWeight:800,color:COLORS.text}}>🔔 การแจ้งเตือน</div>
</div>
<div style={{padding:“12px 16px”,display:“flex”,flexDirection:“column”,gap:8}}>
{[
{icon:“🗳️”,msg:“ปิ๊ก โหวตสถานที่ "อยุธยา" แล้ว”,time:“5 นาทีที่แล้ว”,new:true},
{icon:“📅”,msg:“แบม อัปเดตวันว่างเพิ่ม 3 วัน”,time:“1 ชม.ที่แล้ว”,new:true},
{icon:“⏰”,msg:“เตือน: ทริปเขาใหญ่ อีก 10 วัน!”,time:“เมื่อวาน”,new:false},
{icon:“🌤️”,msg:“สภาพอากาศเขาใหญ่ 1 พ.ค.: ☀️ 28°C เหมาะเดินทาง”,time:“เมื่อวาน”,new:false},
{icon:“💰”,msg:“ต้น เพิ่มรายการ ค่าน้ำมัน ฿600”,time:“2 วันที่แล้ว”,new:false},
].map((n,i)=>(
<div key={i} style={{
background:n.new?COLORS.primary+“08”:”#fff”,borderRadius:12,padding:“12px”,
boxShadow:“0 2px 8px rgba(0,0,0,0.05)”,
border:n.new?`1px solid ${COLORS.primary}33`:“1px solid #f0f0f0”,
display:“flex”,gap:10,alignItems:“flex-start”}}>
<div style={{fontSize:24}}>{n.icon}</div>
<div style={{flex:1}}>
<div style={{fontSize:13,color:COLORS.text,fontWeight:n.new?700:400}}>{n.msg}</div>
<div style={{fontSize:11,color:COLORS.sub,marginTop:4}}>{n.time}</div>
</div>
{n.new&&<div style={{width:8,height:8,borderRadius:“50%”,background:COLORS.primary,flexShrink:0,marginTop:4}}/>}
</div>
))}
</div>
</div>
);

const screenMap = {home:<HomeScreen/>,calendar:<CalendarScreen/>,places:<PlacesScreen/>,
travel:<TravelScreen/>,expense:<ExpenseScreen/>,summary:<SummaryScreen/>,notify:<NotifyScreen/>};

return(
<div style={{display:“flex”,justifyContent:“center”,alignItems:“center”,minHeight:“100vh”,
background:“linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)”,
fontFamily:”‘Sarabun’,‘Noto Sans Thai’,sans-serif”,padding:“20px”}}>
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700;800&display=swap" rel="stylesheet"/>

```
  <div style={{width:375,height:720,background:COLORS.bg,borderRadius:40,overflow:"hidden",
    boxShadow:"0 40px 80px rgba(0,0,0,0.5),inset 0 0 0 8px #1a1a1a",
    position:"relative",display:"flex",flexDirection:"column"}}>

    {/* Status bar */}
    <div style={{background:COLORS.primary,padding:"10px 20px 6px",
      display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{fontSize:12,color:"#fff",fontWeight:700}}>9:41</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
        <span style={{background:"rgba(255,255,255,0.3)",borderRadius:6,padding:"2px 8px"}}>TripMate</span>
        <span>⚡ LINE</span>
      </div>
      <div style={{fontSize:12,color:"#fff"}}>📶 🔋</div>
    </div>

    {/* Content */}
    <div style={{flex:1,overflowY:"auto",background:COLORS.bg}}>
      {screenMap[screen]||screenMap.home}
    </div>

    {/* Bottom nav */}
    <div style={{background:"#fff",borderTop:"1px solid #f0f0f0",display:"flex",padding:"6px 0 10px"}}>
      {navItems.map(item=>(
        <button key={item.screen} onClick={()=>setScreen(item.screen)} style={{
          flex:1,background:"none",border:"none",cursor:"pointer",
          display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"3px 0"}}>
          <div style={{fontSize:18}}>{item.icon}</div>
          <div style={{fontSize:9,fontWeight:700,color:screen===item.screen?COLORS.primary:COLORS.sub}}>
            {item.label}
          </div>
          {screen===item.screen&&(
            <div style={{width:16,height:3,borderRadius:2,background:COLORS.primary}}/>
          )}
        </button>
      ))}
    </div>
  </div>
</div>
```

);
}
