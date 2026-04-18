"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { Measurement, Direction } from "@/lib/types";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const MEASUREMENTS: Measurement[] = ["Zaman", "Yüzde", "Sayı", "Ton", "Para", "Ses", "Puan", "Adet", "Enerji"];

export default function AddIndicatorDialog({ onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    indicator_name: "",
    indicator_definition: "",
    direction: "Azalması İyi" as Direction,
    measurement: "Sayı" as Measurement,
    related_process: "",
    related_other_process: "",
    indicator_tag: "",
    indicator_related_management_system: "",
    constituent_name: "",
    organization_name: "",
  });

  const set = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.indicator_name.trim() || !form.indicator_definition.trim() || !form.related_process) {
      setError("KPI Adı, Tanım ve Ana Süreç zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Bir hata oluştu");
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900">Yeni KPI Öner</h2>
            <p className="text-xs text-gray-400 mt-0.5">İncelendikten sonra kütüphaneye eklenecektir</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* KPI Adı */}
          <Field label="KPI Adı *">
            <input
              className={inputCls}
              placeholder="örn. Müşteri şikayet yanıt süresi"
              value={form.indicator_name}
              onChange={e => set("indicator_name", e.target.value)}
            />
          </Field>

          {/* Tanım */}
          <Field label="Tanım *">
            <textarea
              className={cn(inputCls, "resize-none")}
              rows={3}
              placeholder="Bu KPI neyi ölçer ve nasıl hesaplanır?"
              value={form.indicator_definition}
              onChange={e => set("indicator_definition", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            {/* Yön */}
            <Field label="Yön *">
              <select className={inputCls} value={form.direction} onChange={e => set("direction", e.target.value)}>
                <option value="Azalması İyi">Azalması İyi</option>
                <option value="Artması İyi">Artması İyi</option>
              </select>
            </Field>

            {/* Ölçüm */}
            <Field label="Ölçüm Tipi *">
              <select className={inputCls} value={form.measurement} onChange={e => set("measurement", e.target.value)}>
                {MEASUREMENTS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </div>

          {/* Ana Süreç */}
          <Field label="Ana Süreç *">
            <select className={inputCls} value={form.related_process} onChange={e => set("related_process", e.target.value)}>
              <option value="">Seçiniz...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* İlgili Süreçler */}
          <Field label="İlgili Diğer Süreçler">
            <input
              className={inputCls}
              placeholder="örn. Kalite, Finans"
              value={form.related_other_process}
              onChange={e => set("related_other_process", e.target.value)}
            />
          </Field>

          {/* Etiketler */}
          <Field label="Etiketler">
            <input
              className={inputCls}
              placeholder="örn. Müşteri, Şikayet, Hizmet"
              value={form.indicator_tag}
              onChange={e => set("indicator_tag", e.target.value)}
            />
          </Field>

          {/* ISO */}
          <Field label="Yönetim Sistemi">
            <input
              className={inputCls}
              placeholder="örn. ISO 9001, ISO 14001"
              value={form.indicator_related_management_system}
              onChange={e => set("indicator_related_management_system", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Adınız">
              <input className={inputCls} placeholder="Adınız" value={form.constituent_name} onChange={e => set("constituent_name", e.target.value)} />
            </Field>
            <Field label="Organizasyon">
              <input className={inputCls} placeholder="Şirket adı" value={form.organization_name} onChange={e => set("organization_name", e.target.value)} />
            </Field>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              <Plus size={15} />
              {loading ? "Gönderiliyor..." : "Öneri Gönder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all";
