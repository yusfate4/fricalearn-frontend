import React, { useMemo } from "react";

// ── Colour tokens ────────────────────────────────────────────
const P  = "#3F2171"; // purple
const Y  = "#FFFF00"; // yellow
const G  = "#1A7A4A"; // green
const R  = "#C0392B"; // red
const BL = "#2980B9"; // blue
const OR = "#D35400"; // orange

// ═══════════════════════════════════════════════════════════
// DIAGRAM COMPONENTS
// ═══════════════════════════════════════════════════════════

/** Analogue clock face — e.g. "tell the time to the half hour" */
const ClockFace = ({ hour=3, minute=0 }: { hour?: number; minute?: number }) => {
  const hAngle  = ((hour % 12) + minute / 60) * 30 - 90;
  const mAngle  = minute * 6 - 90;
  const hx = 100 + 45 * Math.cos(hAngle * Math.PI / 180);
  const hy = 100 + 45 * Math.sin(hAngle * Math.PI / 180);
  const mx = 100 + 65 * Math.cos(mAngle * Math.PI / 180);
  const my = 100 + 65 * Math.sin(mAngle * Math.PI / 180);
  const nums = [12,1,2,3,4,5,6,7,8,9,10,11];
  return (
    <svg viewBox="0 0 200 200" width="160" height="160">
      <circle cx="100" cy="100" r="90" fill="white" stroke={P} strokeWidth="4"/>
      <circle cx="100" cy="100" r="85" fill="none" stroke={P} strokeWidth="1" strokeDasharray="2 8"/>
      {nums.map((n,i) => {
        const a = (i * 30 - 60) * Math.PI / 180;
        return <text key={n} x={100+72*Math.cos(a)} y={100+72*Math.sin(a)+5} textAnchor="middle" fontSize="12" fontWeight="bold" fill={P}>{n}</text>;
      })}
      {/* Hour ticks */}
      {Array.from({length:60},(_,i)=>{
        const a=i*6*Math.PI/180, big=i%5===0;
        return <line key={i} x1={100+78*Math.cos(a)} y1={100+78*Math.sin(a)} x2={100+(big?88:84)*Math.cos(a)} y2={100+(big?88:84)*Math.sin(a)} stroke={P} strokeWidth={big?2:1}/>;
      })}
      <line x1="100" y1="100" x2={hx} y2={hy} stroke={P} strokeWidth="5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2={mx} y2={my} stroke={BL} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="100" cy="100" r="5" fill={P}/>
    </svg>
  );
};

/** Number line ─ e.g. "counting, addition, subtraction" */
const NumberLine = ({ start=0, end=10, highlight=[] }: { start?: number; end?: number; highlight?: number[] }) => {
  const range = end - start; const step = 240 / range;
  return (
    <svg viewBox="0 0 280 80" width="280" height="80">
      <line x1="20" y1="40" x2="260" y2="40" stroke={P} strokeWidth="3"/>
      <polygon points="256,34 270,40 256,46" fill={P}/>
      {Array.from({length: range+1}, (_,i) => {
        const x = 20 + i * step; const n = start + i;
        return (
          <g key={n}>
            <line x1={x} y1="34" x2={x} y2="46" stroke={P} strokeWidth="2"/>
            <circle cx={x} cy="40" r={highlight.includes(n)?8:4} fill={highlight.includes(n)?Y:P} stroke={P} strokeWidth="2"/>
            <text x={x} y="62" textAnchor="middle" fontSize="11" fontWeight={highlight.includes(n)?"bold":"normal"} fill={P}>{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Fraction bar ─ e.g. "fractions of a shape" */
const FractionBar = ({ numerator=1, denominator=4 }: { numerator?: number; denominator?: number }) => {
  const w = 240; const h = 48; const segW = w / denominator;
  return (
    <svg viewBox={`0 0 ${w+20} ${h+40}`} width="260" height="90">
      {Array.from({length:denominator},(_,i)=>(
        <rect key={i} x={10+i*segW} y="10" width={segW-2} height={h}
          fill={i<numerator?Y:"white"} stroke={P} strokeWidth="2" rx="3"/>
      ))}
      <text x={(10+w/2)} y={h+34} textAnchor="middle" fontSize="13" fontWeight="bold" fill={P}>
        {numerator}/{denominator}
      </text>
    </svg>
  );
};

/** 2D Shapes grid ─ circle, square, triangle, rectangle */
const ShapesGrid = () => (
  <svg viewBox="0 0 280 130" width="280" height="130">
    <circle cx="40" cy="45" r="30" fill={`${Y}88`} stroke={P} strokeWidth="3"/>
    <text x="40" y="88" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Circle</text>
    <rect x="85" y="15" width="60" height="60" fill={`${BL}55`} stroke={P} strokeWidth="3" rx="2"/>
    <text x="115" y="88" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Square</text>
    <polygon points="200,15 240,75 160,75" fill={`${G}55`} stroke={P} strokeWidth="3"/>
    <text x="200" y="88" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Triangle</text>
    {/* Rectangle row 2 */}
    <rect x="10" y="100" width="80" height="28" fill={`${OR}55`} stroke={P} strokeWidth="2" rx="2"/>
    <text x="50" y="118" textAnchor="middle" fontSize="9" fill={P} fontWeight="bold">Rectangle</text>
    <polygon points="115,100 140,100 145,128 110,128" fill={`${R}44`} stroke={P} strokeWidth="2"/>
    <text x="127" y="120" textAnchor="middle" fontSize="9" fill={P} fontWeight="bold">Trapezium</text>
    <polygon points="185,100 215,100 225,128 175,128" fill={`${BL}44`} stroke={P} strokeWidth="2"/>
    <text x="200" y="120" textAnchor="middle" fontSize="9" fill={P} fontWeight="bold">Pentagon</text>
  </svg>
);

/** Angles diagram — acute, right, obtuse */
const AnglesDiagram = () => (
  <svg viewBox="0 0 300 120" width="300" height="120">
    {/* Acute */}
    <line x1="10" y1="100" x2="90" y2="100" stroke={P} strokeWidth="3"/>
    <line x1="10" y1="100" x2="60" y2="20" stroke={P} strokeWidth="3"/>
    <path d="M30,100 A20,20 0 0,1 21,77" fill="none" stroke={Y} strokeWidth="2.5"/>
    <text x="50" y="115" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Acute &lt;90°</text>
    {/* Right */}
    <line x1="110" y1="100" x2="190" y2="100" stroke={P} strokeWidth="3"/>
    <line x1="110" y1="100" x2="110" y2="20" stroke={P} strokeWidth="3"/>
    <rect x="110" y="80" width="20" height="20" fill="none" stroke={Y} strokeWidth="2.5"/>
    <text x="150" y="115" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Right = 90°</text>
    {/* Obtuse */}
    <line x1="210" y1="100" x2="290" y2="100" stroke={P} strokeWidth="3"/>
    <line x1="290" y1="100" x2="215" y2="30" stroke={P} strokeWidth="3"/>
    <path d="M270,100 A20,20 0 0,0 280,78" fill="none" stroke={Y} strokeWidth="2.5"/>
    <text x="250" y="115" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">Obtuse &gt;90°</text>
  </svg>
);

/** Coordinate grid */
const CoordinateGrid = () => {
  const points = [{x:2,y:3,l:"A"},{x:4,y:1,l:"B"},{x:1,y:4,l:"C"}];
  const toSvg = (n:number) => 20 + n*30;
  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      {Array.from({length:7},(_,i)=>(
        <g key={i}>
          <line x1={toSvg(i)} y1="20" x2={toSvg(i)} y2="180" stroke="#DDD" strokeWidth="1"/>
          <line x1="20" y1={toSvg(i)} x2="180" y2={toSvg(i)} stroke="#DDD" strokeWidth="1"/>
          {i>0&&<text x={toSvg(i)} y="195" textAnchor="middle" fontSize="9" fill="#666">{i}</text>}
          {i>0&&<text x="12" y={toSvg(6-i)+4} textAnchor="middle" fontSize="9" fill="#666">{i}</text>}
        </g>
      ))}
      <line x1="20" y1="180" x2="185" y2="180" stroke={P} strokeWidth="2"/>
      <polygon points="181,174 190,180 181,186" fill={P}/>
      <line x1="20" y1="180" x2="20" y2="15" stroke={P} strokeWidth="2"/>
      <polygon points="14,19 20,10 26,19" fill={P}/>
      <text x="192" y="184" fontSize="10" fill={P} fontWeight="bold">x</text>
      <text x="14" y="10" fontSize="10" fill={P} fontWeight="bold">y</text>
      {points.map(pt=>(
        <g key={pt.l}>
          <circle cx={toSvg(pt.x)} cy={toSvg(6-pt.y)} r="6" fill={Y} stroke={P} strokeWidth="2"/>
          <text x={toSvg(pt.x)+8} y={toSvg(6-pt.y)-6} fontSize="11" fontWeight="bold" fill={P}>{pt.l}({pt.x},{pt.y})</text>
        </g>
      ))}
    </svg>
  );
};

/** Place value columns */
const PlaceValue = ({ number=345 }: { number?: number }) => {
  const digits = String(number).padStart(3,'0').split('').map(Number);
  const labels = ["Hundreds","Tens","Ones"];
  const cols = ["#F3EFFA","#E8F5E9","#FFF8E1"];
  return (
    <svg viewBox="0 0 240 120" width="240" height="120">
      {digits.map((d,i)=>(
        <g key={i}>
          <rect x={10+i*76} y="10" width="70" height="90" fill={cols[i]} stroke={P} strokeWidth="2" rx="6"/>
          <text x={45+i*76} y="38" textAnchor="middle" fontSize="10" fill="#666">{labels[i]}</text>
          <text x={45+i*76} y="75" textAnchor="middle" fontSize="32" fontWeight="bold" fill={P}>{d}</text>
        </g>
      ))}
    </svg>
  );
};

/** Bar chart */
const SimpleBarChart = ({ data=[4,7,3,6,5] }: { data?: number[] }) => {
  const max = Math.max(...data); const labels = ["A","B","C","D","E"];
  const colors = [P, BL, G, OR, R];
  return (
    <svg viewBox="0 0 220 160" width="220" height="160">
      <line x1="30" y1="10" x2="30" y2="130" stroke={P} strokeWidth="2"/>
      <line x1="30" y1="130" x2="210" y2="130" stroke={P} strokeWidth="2"/>
      {[0,2,4,6,8,10].map(v=>(
        <g key={v}>
          <line x1="26" y1={130-v*12} x2="30" y2={130-v*12} stroke={P} strokeWidth="1.5"/>
          <text x="22" y={134-v*12} textAnchor="end" fontSize="8" fill="#666">{v}</text>
        </g>
      ))}
      {data.map((v,i)=>(
        <g key={i}>
          <rect x={40+i*34} y={130-(v/max)*110} width="26" height={(v/max)*110}
            fill={colors[i%colors.length]} stroke={P} strokeWidth="1.5" rx="3"/>
          <text x={53+i*34} y="142" textAnchor="middle" fontSize="10" fill={P} fontWeight="bold">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
};

/** Pythagoras triangle */
const PythagorasTriangle = ({ a=3,b=4,c=5 }:{a?:number;b?:number;c?:number}) => (
  <svg viewBox="0 0 220 180" width="220" height="180">
    <polygon points="20,160 160,160 20,40" fill={`${Y}33`} stroke={P} strokeWidth="3"/>
    <rect x="20" y="140" width="20" height="20" fill="none" stroke={P} strokeWidth="2"/>
    <text x="90" y="178" textAnchor="middle" fontSize="13" fontWeight="bold" fill={P}>a = {a}</text>
    <text x="6" y="105" fontSize="13" fontWeight="bold" fill={BL}>b = {b}</text>
    <text x="100" y="95" fontSize="13" fontWeight="bold" fill={G}>c = {c}</text>
    <text x="185" y="135" fontSize="11" fill={P} fontWeight="bold">a² + b²</text>
    <text x="185" y="150" fontSize="11" fill={P} fontWeight="bold">= c²</text>
    <text x="185" y="165" fontSize="10" fill="#666">{a}²+{b}²={c}²</text>
  </svg>
);

/** Probability scale */
const ProbabilityScale = () => (
  <svg viewBox="0 0 300 90" width="300" height="90">
    <line x1="20" y1="40" x2="280" y2="40" stroke={P} strokeWidth="4" strokeLinecap="round"/>
    {[{x:20,l:"Impossible",p:"0"},{x:90,l:"Unlikely",p:"0.25"},{x:150,l:"Even Chance",p:"0.5"},{x:210,l:"Likely",p:"0.75"},{x:280,l:"Certain",p:"1"}].map(pt=>(
      <g key={pt.l}>
        <circle cx={pt.x} cy="40" r="6" fill={Y} stroke={P} strokeWidth="2"/>
        <text x={pt.x} y="28" textAnchor="middle" fontSize="8" fill={P}>{pt.p}</text>
        <text x={pt.x} y="60" textAnchor="middle" fontSize="7.5" fill="#555" fontWeight="bold">{pt.l}</text>
      </g>
    ))}
  </svg>
);

/** Ratio bar */
const RatioBar = ({ ratio=[2,3] }: { ratio?: number[] }) => {
  const total = ratio.reduce((a,b)=>a+b,0);
  const cols = [P, BL, G, OR];
  let x = 10;
  return (
    <svg viewBox="0 0 280 70" width="280" height="70">
      {ratio.map((v,i)=>{
        const w = (v/total)*260;
        const rect = <g key={i}>
          <rect x={x} y="10" width={w-2} height="36" fill={cols[i%cols.length]} rx="4"/>
          <text x={x+w/2-1} y="33" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">{v}</text>
          <text x={x+w/2-1} y="60" textAnchor="middle" fontSize="9" fill={P}>Part {i+1}</text>
        </g>;
        x += w;
        return rect;
      })}
      <text x="150" y="70" textAnchor="middle" fontSize="9" fill="#666">Ratio {ratio.join(" : ")}</text>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════
// TOPIC DETECTION — maps lesson title/outcome to a diagram
// ═══════════════════════════════════════════════════════════

type DiagramType =
  | "clock" | "number_line" | "fraction" | "shapes" | "angles"
  | "coordinates" | "place_value" | "bar_chart" | "pythagoras"
  | "probability" | "ratio" | null;

function detectDiagram(title: string, outcome: string): DiagramType {
  const text = (title + " " + outcome).toLowerCase();
  if (/clock|time|hour|half.hour|quarter|o'clock|analogue/.test(text)) return "clock";
  if (/fraction|numerator|denominator|half|quarter|third|eighth/.test(text)) return "fraction";
  if (/number line|count|addition|subtraction|subtract|add|negative number/.test(text)) return "number_line";
  if (/shape|polygon|triangle|square|circle|rectangle|pentagon|hexagon|2d|side/.test(text)) return "shapes";
  if (/angle|acute|obtuse|right angle|reflex|protractor|degree/.test(text)) return "angles";
  if (/coordinate|grid|plot|axis|x.axis|y.axis|quadrant/.test(text)) return "coordinates";
  if (/place.value|hundred|tens|ones|digit|partition/.test(text)) return "place_value";
  if (/bar.chart|tally|pictogram|frequency|data|interpret/.test(text)) return "bar_chart";
  if (/pythagoras|hypotenuse|right.angled.triangle/.test(text)) return "pythagoras";
  if (/probability|chance|likely|unlikely|certain|impossible|event/.test(text)) return "probability";
  if (/ratio|proportion|parts/.test(text)) return "ratio";
  return null;
}

function renderDiagram(type: DiagramType): React.ReactNode {
  switch (type) {
    case "clock":       return <ClockFace hour={3} minute={30}/>;
    case "number_line": return <NumberLine start={0} end={10} highlight={[3,7]}/>;
    case "fraction":    return <FractionBar numerator={1} denominator={4}/>;
    case "shapes":      return <ShapesGrid/>;
    case "angles":      return <AnglesDiagram/>;
    case "coordinates": return <CoordinateGrid/>;
    case "place_value": return <PlaceValue number={345}/>;
    case "bar_chart":   return <SimpleBarChart data={[4,7,3,6,5]}/>;
    case "pythagoras":  return <PythagorasTriangle a={3} b={4} c={5}/>;
    case "probability": return <ProbabilityScale/>;
    case "ratio":       return <RatioBar ratio={[2,3]}/>;
    default:            return null;
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

interface LessonDiagramProps {
  lessonTitle: string;
  outcome?: string;
}

export default function LessonDiagram({ lessonTitle, outcome = "" }: LessonDiagramProps) {
  const type    = useMemo(() => detectDiagram(lessonTitle, outcome), [lessonTitle, outcome]);
  const diagram = useMemo(() => renderDiagram(type), [type]);

  if (!diagram) return null;

  return (
    <div className="bg-white rounded-[2rem] border-2 border-[#3F2171]/10 p-6 mb-6 flex flex-col items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#3F2171]/50">
        Visual Aid
      </p>
      <div className="flex items-center justify-center">
        {diagram}
      </div>
      <p className="text-[9px] font-bold text-gray-400 text-center max-w-xs">
        Study this diagram as you read the lesson below
      </p>
    </div>
  );
}
