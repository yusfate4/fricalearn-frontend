import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  Video, Plus, Trash2, Loader2, Calendar, Clock,
  Zap, RefreshCw, CircleCheckBig, CircleAlert,
} from "lucide-react";

const SATURDAY_SLOTS = [
  { label: "7:00 AM",  hour: 7,  minute: 0,  tag: "Morning Class"  },
  { label: "1:00 PM",  hour: 13, minute: 0,  tag: "Afternoon Class" },
];

function nextSaturday(hour: number, minute: number): string {
  const now = new Date();
  const sat = new Date(now);
  sat.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  sat.setHours(hour, minute, 0, 0);
  // Convert WAT (UTC+1) to UTC for storage
  return new Date(sat.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
}

export default function ManageLiveClasses() {
  const [classes, setClasses]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [scheduling, setScheduling] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [success, setSuccess]   = useState<string | null>(null);

  // Manual form state
  const [form, setForm] = useState({
    title: "", description: "", scheduled_at: "", duration_minutes: 60, is_paid: false, price: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/live-classes");
      setClasses(Array.isArray(res.data) ? res.data : []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const scheduleAuto = async (slot: typeof SATURDAY_SLOTS[0]) => {
    setScheduling(slot.hour);
    try {
      const scheduled_at = nextSaturday(slot.hour, slot.minute);
      await api.post("/admin/live-classes", {
        title: `FricaLearn ${slot.tag}`,
        description: "Weekly group learning session — Yoruba, Maths and English practice with your tutor.",
        scheduled_at,
        duration_minutes: 90,
        is_paid: false,
      });
      setSuccess(`Scheduled: ${slot.tag} for next Saturday at ${slot.label} (Nigeria time)`);
      setTimeout(() => setSuccess(null), 4000);
      fetch();
    } catch(e: any) {
      console.error(e);
    } finally { setScheduling(null); }
  };

  const submitManual = async () => {
    if (!form.title || !form.scheduled_at) return;
    setSubmitting(true);
    try {
      await api.post("/admin/live-classes", {
        ...form,
        price: form.is_paid ? Number(form.price) : null,
      });
      setShowManual(false);
      setForm({ title: "", description: "", scheduled_at: "", duration_minutes: 60, is_paid: false, price: "" });
      setSuccess("Live class scheduled successfully!");
      setTimeout(() => setSuccess(null), 3000);
      fetch();
    } catch(e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  const deleteClass = async (id: number) => {
    if (!confirm("Delete this live class?")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/live-classes/${id}`);
      setClasses(prev => prev.filter(c => c.id !== id));
    } catch(e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const upcoming = classes.filter(c => new Date(c.scheduled_at) >= new Date()).sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  const past     = classes.filter(c => new Date(c.scheduled_at) < new Date()).sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime());

  return (
    <AdminShell title="Live Classes">
      <div className="space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Live Classes</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetch} className="p-2.5 rounded-xl bg-white border-2 border-gray-100 hover:border-[#3F2171]/30 transition-all">
              <RefreshCw size={16} className="text-gray-400"/>
            </button>
            <button onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-2 bg-[#3F2171] text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              <Plus size={14}/> Manual
            </button>
          </div>
        </div>

        {/* Success toast */}
        {success && (
          <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl px-5 py-4">
            <CircleCheckBig size={18} className="text-green-500 shrink-0"/>
            <p className="font-black text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Auto-schedule panel */}
        <div className="bg-[#2A1650] rounded-2xl p-6">
          <div className="flex items-start gap-3 mb-5">
            <Zap size={20} className="text-[#FFFF00] shrink-0 mt-0.5"/>
            <div>
              <h3 className="font-black text-white text-sm uppercase tracking-tight">Auto-Schedule Saturday Classes</h3>
              <p className="text-white/50 text-[10px] font-bold mt-1">
                Click to schedule a class for the next Saturday at each time slot (Nigeria Time, WAT UTC+1)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SATURDAY_SLOTS.map(slot => (
              <button key={slot.hour} onClick={() => scheduleAuto(slot)} disabled={scheduling !== null}
                className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-2xl text-left border border-white/10 disabled:opacity-50">
                <div className="w-12 h-12 bg-[#FFFF00] rounded-xl flex items-center justify-center shrink-0">
                  {scheduling === slot.hour
                    ? <Loader2 size={20} className="text-[#2A1650] animate-spin"/>
                    : <Clock size={20} className="text-[#2A1650]"/>}
                </div>
                <div>
                  <p className="font-black text-white text-sm">{slot.tag}</p>
                  <p className="text-white/60 text-[10px] font-bold">Every Saturday · {slot.label} Nigeria time</p>
                  <p className="text-[#FFFF00] text-[9px] font-black uppercase tracking-widest mt-0.5">Next: {new Date(nextSaturday(slot.hour, slot.minute)+"Z").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        {showManual && (
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight mb-4">Schedule Manual / Paid Class</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Premium Yoruba Intensive"
                  className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3F2171]"/>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Date & Time (Nigeria)</label>
                <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({...form, scheduled_at: e.target.value})}
                  className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3F2171]"/>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Duration (minutes)</label>
                <input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: Number(e.target.value)})}
                  className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3F2171]"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm({...form, is_paid: !form.is_paid})}
                    className={`w-10 h-5 rounded-full transition-all relative ${form.is_paid ? "bg-[#3F2171]" : "bg-gray-200"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_paid ? "left-5" : "left-0.5"}`}/>
                  </div>
                  <span className="font-black text-gray-700 text-sm">Paid class</span>
                </label>
                {form.is_paid && (
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="Price (₦)"
                    className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3F2171]"/>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2}
                  className="w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3F2171] resize-none"/>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={submitManual} disabled={!form.title || !form.scheduled_at || submitting}
                className="flex items-center gap-2 bg-[#3F2171] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black disabled:opacity-50 transition-all">
                {submitting ? <Loader2 size={14} className="animate-spin"/> : <Plus size={14}/>} Schedule Class
              </button>
              <button onClick={() => setShowManual(false)} className="px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200">Cancel</button>
            </div>
          </div>
        )}

        {/* Upcoming classes */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">Upcoming Classes ({upcoming.length})</h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-[#3F2171]" size={28}/></div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-16">
              <Calendar size={36} className="text-gray-200 mx-auto mb-4"/>
              <p className="font-black text-gray-400 uppercase italic text-sm">No upcoming classes</p>
              <p className="text-gray-300 font-bold text-[10px] mt-2">Use the auto-schedule buttons above to add Saturday classes</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcoming.map(c => {
                const dt = new Date(c.scheduled_at);
                return (
                  <div key={c.id} className="px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#3F2171]/10 rounded-2xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-[#3F2171] font-black text-xs">{dt.toLocaleDateString("en-GB",{day:"numeric"})}</span>
                        <span className="text-[#3F2171] font-bold text-[9px] uppercase">{dt.toLocaleDateString("en-GB",{month:"short"})}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-gray-700">{c.title}</p>
                          {c.is_paid && <span className="bg-[#FFFF00] text-[#2A1650] text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">Paid</span>}
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {dt.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})} · {c.duration_minutes || 60} mins
                        </p>
                      </div>
                    </div>
                    <button onClick={() => deleteClass(c.id)} disabled={deleting === c.id}
                      className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-40">
                      {deleting === c.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
