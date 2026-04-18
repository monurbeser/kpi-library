"use client";

import { useState } from "react";
import { X, CheckCheck } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { Indicator, Measurement, Direction } from "@/lib/types";

const MEASUREMENTS: Measurement[] = ["Zaman", "Yüzde", "Sayı", "Ton", "Para", "Ses", "Puan", "Adet", "Enerji"];
const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-white transition-all";

interface Props {
  indicator: Indicator;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditIndicatorRequestDialog({ indicator, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ ...indicator });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSave = async (accept: boolean) => {
    if (!form.indicator_name.trim() || !form.indicator_definition.trim() || !form.related_process) {
      setError("KPI Adı, Tanım ve Ana Süreç zorunludur.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/indicators/${indicator.indicator_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indicator_name: form.indicator_name,
          indicator_definition: form.indicator_definition,
          direction: form.direction,
          measurement: form.measurement,
          related_process: form.related_process,
          related_other_process: form.related_other_process,
          indicator_tag: form.indicator_tag,
          indicator_related_management_system: form.indicator_related_management_system,
          ...(accept && { is_accepted: true }),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogWrapper title="Öneri Düzenle & Kabul Et" subtitle={indicator.indicator_name} onClose={onClose}>
      <FormBody form={form} set={set} error={error} />
      <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          İptal
        </button>
        <button onClick={() => handleSave(false)} disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-brand-light disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button onClick={() => handleSave(true)} disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60">
          <CheckCheck size={14} />
          {loading ? "..." : "Kabul Et"}
        </button>
      </div>
    </DialogWrapper>
  );
}

// ─── Shared ─────────────────────────────────────────────────────────────────

export function EditAcceptedIndicatorDialog({ indicator, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ ...indicator });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (field: string, value: string | boolean) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/indicators/${indicator.indicator_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indicator_name: form.indicator_name,
          indicator_definition: form.indicator_definition,
          direction: form.direction,
          measurement: form.measurement,
          related_process: form.related_process,
          related_other_process: form.related_other_process,
          indicator_tag: form.indicator_tag,
          indicator_related_management_system: form.indicator_related_management_system,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      onSuccess(); onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Hata oluştu");
    } finally { setLoading(false); }
  };

  return (
    <DialogWrapper title="KPI Düzenle" subtitle={indicator.indicator_name} onClose={onClose}>
      <FormBody form={form} set={set} error={error} />
      <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
        <button onClick={onClose}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
          İptal
        </button>
        <button onClick={handleSave} disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-hover disabled:opacity-60">
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </DialogWrapper>
  );
}

// ─── FormBody ────────────────────────────────────────────────────────────────

function FormBody({ form, set, error }: {
  form: Indicator;
  set: (field: string, value: string | boolean) => void;
  error: string;
}) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
      <Field label="KPI Adı *">
        <input className={inputCls} value={form.indicator_name}
          onChange={e => set("indicator_name", e.target.value)} />
      </Field>
      <Field label="Tanım *">
        <textarea className={cn(inputCls, "resize-none")} rows={3}
          value={form.indicator_definition} onChange={e => set("indicator_definition", e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Yön *">
          <select className={inputCls} value={form.direction}
            onChange={e => set("direction", e.target.value as Direction)}>
            <option value="Azalması İyi">Azalması İyi</option>
            <option value="Artması İyi">Artması İyi</option>
          </select>
        </Field>
        <Field label="Ölçüm *">
          <select className={inputCls} value={form.measurement}
            onChange={e => set("measurement", e.target.value as Measurement)}>
            {MEASUREMENTS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Ana Süreç *">
        <select className={inputCls} value={form.related_process}
          onChange={e => set("related_process", e.target.value)}>
          <option value="">Seçiniz...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="İlgili Diğer Süreçler">
        <input className={inputCls} value={form.related_other_process ?? ""}
          onChange={e => set("related_other_process", e.target.value)} />
      </Field>
      <Field label="Etiketler">
        <input className={inputCls} value={form.indicator_tag ?? ""}
          onChange={e => set("indicator_tag", e.target.value)} />
      </Field>
      <Field label="Yönetim Sistemi">
        <input className={inputCls} value={form.indicator_related_management_system ?? ""}
          onChange={e => set("indicator_related_management_system", e.target.value)} />
      </Field>
      {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
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

function DialogWrapper({ title, subtitle, onClose, children }: {
  title: string; subtitle: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 shrink-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
