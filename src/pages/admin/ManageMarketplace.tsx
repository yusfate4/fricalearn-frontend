import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import {
  Plus,
  Store,
  Trash2,
  Edit3,
  Loader2,
  X,
  Tag,
  AlertCircle,
  FileText,
  UploadCloud,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export default function ManageMarketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 300,
    type: "digital_asset",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/rewards");
      setItems(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch marketplace items:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item: any = null) => {
    setErrorMessage("");
    setSelectedImage(null);
    setSelectedFile(null);

    if (item) {
      setIsEditing(true);
      setCurrentId(item.id);
      setFormData({
        name: item.title || item.name,
        description: item.description || "",
        price: item.cost_coins || item.price || 300,
        type: item.type || "digital_asset",
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: "",
        description: "",
        price: 300,
        type: "digital_asset",
      });
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      await api.delete(`/admin/rewards/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      setErrorMessage("Failed to delete item.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.price < 300 || formData.price > 500) {
      setErrorMessage("Price must be between 300 and 500 XP.");
      return;
    }

    setSubmitting(true);
    const data = new FormData();

    data.append("title", formData.name);
    data.append("description", formData.description);
    data.append("cost_coins", formData.price.toString());
    data.append("type", formData.type);

    if (selectedImage instanceof File) {
      data.append("image", selectedImage);
    }
    if (selectedFile instanceof File) {
      data.append("product_file", selectedFile);
    }

    // 🚀 THE FIX: We no longer need data.append("_method", "PUT")
    // because we updated the backend to accept POST for updates.

    try {
      const url = isEditing ? `/admin/rewards/${currentId}` : `/admin/rewards`;

      // 🌍 Standard POST request
      await api.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowModal(false);
      fetchItems();
    } catch (err: any) {
      console.error("Submission Error:", err);
      // ... error handling logic
    } finally {
      setSubmitting(false);
    }
  };


  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="bg-[#F4B400] p-5 rounded-[2rem] text-white shadow-2xl">
              <Store size={36} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tighter italic uppercase">
                Marketplace
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                Inventory Control
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-xs tracking-widest"
          >
            <Plus size={20} /> Add New Item
          </button>
        </div>

        <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-100 rounded-[1.5rem] flex items-center gap-4">
          <ShieldAlert className="text-blue-500" />
          <p className="text-[10px] font-black uppercase text-blue-900 tracking-wider">
            Economy Rule: Price must be 300 - 500 XP.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-[#2D5A27]" size={48} />
            <p className="font-black text-gray-300 uppercase tracking-widest italic text-xs">
              Syncing Vault...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[3rem] border-2 border-gray-100 overflow-hidden flex flex-col group hover:border-[#F4B400] hover:shadow-2xl transition-all duration-500"
              >
                <div className="h-48 bg-gray-50 relative overflow-hidden">
                  <img
                    src={
                      item.image_url ||
                      "https://placehold.co/400x300?text=No+Image"
                    }
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt=""
                  />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(item)}
                      className="p-3 bg-white/90 text-blue-600 rounded-2xl shadow-lg"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-3 bg-white/90 text-red-500 rounded-2xl shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <span className="text-[8px] font-black uppercase px-3 py-1 bg-gray-100 rounded-full text-gray-400 w-fit mb-3 tracking-widest">
                    {item.type?.replace("_", " ")}
                  </span>
                  <h4 className="text-lg font-black text-gray-800 uppercase italic leading-tight mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-[10px] font-bold line-clamp-2 mb-6">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[#2D5A27] font-black italic">
                      <Tag size={14} />
                      <span>{item.cost_coins} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-red-500"
              >
                <X size={32} />
              </button>
              <h2 className="text-3xl font-black text-gray-800 mb-10 italic uppercase tracking-tighter">
                {isEditing ? "Modify Listing" : "New Entry"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3 border border-red-100 animate-shake">
                    <AlertCircle size={18} /> {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                        Item Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                          Cost (300-500 XP)
                        </label>
                        <input
                          required
                          type="number"
                          min="300"
                          max="500"
                          className={`w-full p-5 rounded-2xl bg-gray-50 outline-none font-black text-sm border-2 ${formData.price < 300 || formData.price > 500 ? "border-red-200" : "border-transparent"}`}
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                          Category
                        </label>
                        <select
                          className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none font-bold text-sm appearance-none"
                          value={formData.type}
                          onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                          }
                        >
                          <option value="digital_asset">Digital Asset</option>
                          <option value="physical">Physical Item</option>
                          <option value="service">Tutor Service</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                      Media Uploads
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${selectedImage ? "border-[#2D5A27] bg-green-50 text-[#2D5A27]" : "border-gray-100 text-gray-300"}`}
                      >
                        {selectedImage ? (
                          <CheckCircle2 size={24} />
                        ) : (
                          <UploadCloud size={24} />
                        )}
                        <span className="text-[8px] font-black uppercase mt-2">
                          Thumbnail
                        </span>
                      </button>
                      <input
                        type="file"
                        ref={imageInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedImage(e.target.files?.[0] || null)
                        }
                      />
                      {formData.type === "digital_asset" && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${selectedFile ? "border-blue-500 bg-blue-50 text-blue-500" : "border-gray-100 text-gray-300"}`}
                        >
                          <FileText size={24} />
                          <span className="text-[8px] font-black uppercase mt-2">
                            Attach PDF
                          </span>
                        </button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-2">
                    Item Bio
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full p-5 rounded-2xl bg-gray-50 border-none outline-none font-medium text-sm"
                    placeholder="Tell students why they need this..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#2D5A27] shadow-xl transition-all flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : isEditing ? (
                    "Update Listing"
                  ) : (
                    "Deploy Item"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
