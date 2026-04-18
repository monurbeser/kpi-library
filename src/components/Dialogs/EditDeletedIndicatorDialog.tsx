"use client";

import { X, RotateCcw, Trash2 } from "lucide-react";
import type { Indicator } from "@/lib/types";

interface Props {
  indicator: Indicator;
  onClose: () => void;
  onSuccess: () => void;
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string, permanent: boolean) => void;
}

export default function EditDeletedIndicatorDialog({
  indicator, onClose, onRestore, onPermanentDelete,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Silinen KPI</h2>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{indicator.indicator_name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* KPI detayları */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <Row label="Kategori" value={indicator.related_process} />
            <Row label="Ölçüm" value={indicator.measurement} />
            <Row label="Yön" value={indicator.direction} />
            {indicator.constituent_name && <Row label="Öneren" value={`${indicator.constituent_name} · ${indicator.organization_name}`} />}
            <div>
              <span className="text-xs text-gray-400 font-medium">Tanım</span>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{indicator.indicator_definition}</p>
            </div>
          </div>

          {/* Uyarı */}
          <div className="flex items-start gap-2 bg-red-50 rounded-xl p-3">
            <Trash2 size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600">
              Kalıcı silme işlemi geri alınamaz. Bu KPI tüm beğenileriyle birlikte silinir.
            </p>
          </div>

          {/* Butonlar */}
          <div className="flex gap-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              İptal
            </button>
            <button
              onClick={() => { onRestore(indicator.indicator_id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-50"
            >
              <RotateCcw size={14} />
              Geri Al
            </button>
            <button
              onClick={() => { onPermanentDelete(indicator.indicator_id, true); onClose(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 size={14} />
              Kalıcı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-700">{value}</span>
    </div>
  );
}
