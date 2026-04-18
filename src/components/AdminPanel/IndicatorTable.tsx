"use client";

import { useState } from "react";
import { CheckCheck, Pencil, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import type { Indicator } from "@/lib/types";
import type { Tab } from "./types";

interface Props {
  tab: Tab;
  indicators: Indicator[];
  loading: boolean;
  onEdit: (ind: Indicator) => void;
  onDelete: (id: string, permanent?: boolean) => void;
  onRestore: (id: string) => void;
}

export default function IndicatorTable({ tab, indicators, loading, onEdit, onDelete, onRestore }: Props) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-14 animate-pulse border border-gray-100" />
        ))}
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="text-4xl mb-3">
          {tab === "pending" ? "📋" : tab === "accepted" ? "✅" : "🗑️"}
        </span>
        <p className="text-sm font-medium">
          {tab === "pending" ? "Bekleyen öneri yok." : tab === "accepted" ? "Kabul edilen KPI yok." : "Silinen öneri yok."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-card">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_120px_90px_90px_160px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        <span>KPI Adı</span>
        <span>Kategori</span>
        <span>Ölçüm</span>
        <span>Yön</span>
        <span className="text-right">İşlemler</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {indicators.map(ind => (
          <div
            key={ind.indicator_id}
            className="grid grid-cols-[1fr_120px_90px_90px_160px] gap-3 px-4 py-3 items-center hover:bg-gray-50/50 transition-colors"
          >
            {/* Name + öneren */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{ind.indicator_name}</p>
              {ind.constituent_name && (
                <p className="text-[11px] text-gray-400 truncate">{ind.constituent_name} · {ind.organization_name}</p>
              )}
            </div>

            {/* Kategori */}
            <span className="text-xs text-gray-600 truncate">{ind.related_process}</span>

            {/* Ölçüm */}
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full w-fit">{ind.measurement}</span>

            {/* Yön */}
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full w-fit ${
              ind.direction === "Artması İyi"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}>
              {ind.direction === "Artması İyi" ? "↑ Artması" : "↓ Azalması"}
            </span>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5">
              {tab === "pending" && (
                <>
                  <ActionBtn
                    icon={<CheckCheck size={13} />}
                    label="Kabul Et"
                    color="emerald"
                    onClick={() => onEdit(ind)}
                  />
                  <ActionBtn
                    icon={<Pencil size={13} />}
                    label="Düzenle"
                    color="blue"
                    onClick={() => onEdit(ind)}
                  />
                  <ActionBtn
                    icon={<Trash2 size={13} />}
                    label="Sil"
                    color="red"
                    onClick={() => onDelete(ind.indicator_id)}
                  />
                </>
              )}

              {tab === "accepted" && (
                <>
                  <ActionBtn
                    icon={<Pencil size={13} />}
                    label="Düzenle"
                    color="blue"
                    onClick={() => onEdit(ind)}
                  />
                  <ActionBtn
                    icon={<Trash2 size={13} />}
                    label="Sil"
                    color="red"
                    onClick={() => onDelete(ind.indicator_id)}
                  />
                </>
              )}

              {tab === "deleted" && (
                <>
                  <ActionBtn
                    icon={<RotateCcw size={13} />}
                    label="Geri Al"
                    color="emerald"
                    onClick={() => onRestore(ind.indicator_id)}
                  />
                  {confirmDeleteId === ind.indicator_id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-red-600 font-medium">Emin misin?</span>
                      <ActionBtn
                        icon={<AlertTriangle size={13} />}
                        label="Kalıcı Sil"
                        color="red"
                        onClick={() => { onDelete(ind.indicator_id, true); setConfirmDeleteId(null); }}
                      />
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-[11px] text-gray-400 hover:text-gray-600 px-1.5"
                      >
                        İptal
                      </button>
                    </div>
                  ) : (
                    <ActionBtn
                      icon={<Trash2 size={13} />}
                      label="Kalıcı Sil"
                      color="red"
                      onClick={() => setConfirmDeleteId(ind.indicator_id)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBtn({
  icon, label, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: "blue" | "emerald" | "red";
  onClick: () => void;
}) {
  const colors = {
    blue:    "text-blue-600 hover:bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 hover:bg-emerald-50 border-emerald-100",
    red:     "text-red-500 hover:bg-red-50 border-red-100",
  };
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${colors[color]}`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
