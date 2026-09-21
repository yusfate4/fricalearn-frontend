import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import { AdminShell } from "../../components/admin/AdminShell";
import {
  CircleHelp, Plus, Pencil, Trash2, Search,
  ChevronLeft, ChevronRight, Loader2, Check, X, Save,
} from "lucide-react";

type Question = {
  id: number; lesson_id: number; question_text: string;
  option_a: string; option_b: string; option_c: string;
  correct_answer: string; explanation_text?: string;
  lesson?: { title: string };
};

function EditModal({ q, onSave, onClose }: { q: Question; onSave: (updated: Question) => void; onClose: () => void }) {
  const [form, setForm] = useState<Question>({ ...q });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/admin/questions/${q.id}`, form);
      onSave(res.data.question);
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  };

  const F = ({ label, field, multiline }: { label: string; field: keyof Question; multiline?: boolean }) => (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</label>
      {multiline ? (
        <textarea value={form[field] as string || ""} rows={3}
          onChange={e => setForm({...form, [field]: e.target.value})}
          className="w-full px-3 py-2 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#3F2171] resize-none"/>
      ) : (
        <input value={form[field] as string || ""}
          onChange={e => setForm({...form, [field]: e.target.value})}
          className="w-full px-3 py-2 border-2 border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-[#3F2171]"/>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-gray-800 text-xl uppercase italic tracking-tight">Edit Question</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18}/></button>
        </div>
        <div className="space-y-4">
          <F label="Question" field="question_text" multiline/>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <F label="Option A" field="option_a"/>
            <F label="Option B" field="option_b"/>
            <F label="Option C" field="option_c"/>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Correct Answer</label>
            <div className="flex gap-3">
              {["a","b","c"].map(opt => (
                <button key={opt} onClick={() => setForm({...form, correct_answer: opt})}
                  className={`flex-1 py-2.5 rounded-xl font-black uppercase text-sm transition-all ${
                    form.correct_answer === opt ? "bg-[#3F2171] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <F label="Explanation (optional)" field="explanation_text" multiline/>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={save} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#3F2171] text-white py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Save Changes
          </button>
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-gray-100 text-gray-600 hover:bg-gray-200">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuiz() {
  const [data, setData]         = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [editing, setEditing]   = useState<Question | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/questions-list", { params: { search, page } });
      setData(res.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { fetch(); }, [fetch]);

  const deleteQ = async (id: number) => {
    if (!confirm("Delete this question permanently?")) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/questions/${id}`);
      setData((d: any) => ({ ...d, data: d.data.filter((q: any) => q.id !== id), total: d.total - 1 }));
    } catch(e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const onSaved = (updated: Question) => {
    setData((d: any) => ({ ...d, data: d.data.map((q: any) => q.id === updated.id ? updated : q) }));
    setEditing(null);
  };

  const qs: Question[] = data?.data || [];

  return (
    <AdminShell title="Quiz Builder">
      {editing && <EditModal q={editing} onSave={onSaved} onClose={() => setEditing(null)}/>}

      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Quiz Questions</h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{data?.total || 0} questions total</p>
          </div>
          <a href="/admin/add-quiz"
            className="flex items-center gap-2 bg-[#3F2171] text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all">
            <Plus size={14}/> Add Question
          </a>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm focus:outline-none focus:border-[#3F2171] transition-colors"/>
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-[#3F2171]" size={32}/></div>
          ) : qs.length === 0 ? (
            <div className="text-center py-20">
              <CircleHelp size={40} className="text-gray-200 mx-auto mb-4"/>
              <p className="font-black text-gray-500 uppercase italic">No questions yet</p>
              <p className="text-gray-400 font-bold text-sm mt-2">Questions you create will appear here for editing and deletion</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {qs.map((q) => (
                <div key={q.id} className="px-5 py-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {q.lesson?.title && (
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#3F2171] mb-1">{q.lesson.title}</p>
                      )}
                      <p className="font-black text-gray-700 mb-3 leading-snug">{q.question_text}</p>
                      <div className="flex flex-wrap gap-2">
                        {["a","b","c"].map(opt => (
                          <span key={opt} className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase ${
                            q.correct_answer === opt
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {q.correct_answer === opt && <Check size={10}/>}
                            {opt.toUpperCase()}: {q[`option_${opt}` as keyof Question] as string}
                          </span>
                        ))}
                      </div>
                      {q.explanation_text && (
                        <p className="text-[10px] text-gray-400 font-bold mt-2 italic">Explanation: {q.explanation_text}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditing(q)}
                        className="p-2.5 rounded-xl bg-[#3F2171]/10 text-[#3F2171] hover:bg-[#3F2171] hover:text-white transition-all">
                        <Pencil size={14}/>
                      </button>
                      <button onClick={() => deleteQ(q.id)} disabled={deleting === q.id}
                        className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-40">
                        {deleting === q.id ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400">{data.total} questions · Page {data.current_page} of {data.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40">
                <ChevronLeft size={16} className="text-gray-500"/>
              </button>
              <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page === data.last_page} className="p-2 rounded-xl bg-white border-2 border-gray-100 disabled:opacity-40">
                <ChevronRight size={16} className="text-gray-500"/>
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
