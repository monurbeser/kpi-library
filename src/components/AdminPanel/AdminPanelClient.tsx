"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, ArrowLeft, ClipboardList, CheckCircle2, Trash2 } from "lucide-react";
import type { Indicator } from "@/lib/types";
import IndicatorTable from "./IndicatorTable";
import EditIndicatorRequestDialog from "@/components/Dialogs/EditIndicatorRequestDialog";
import EditAcceptedIndicatorDialog from "@/components/Dialogs/EditAcceptedIndicatorDialog";
import EditDeletedIndicatorDialog from "@/components/Dialogs/EditDeletedIndicatorDialog";

type Tab = "pending" | "accepted" | "deleted";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "pending",  label: "Öneri Talepleri",     icon: <ClipboardList size={15} /> },
  { key: "accepted", label: "Kabul Edilen Talepler", icon: <CheckCircle2 size={15} /> },
  { key: "deleted",  label: "Silinen Öneriler",     icon: <Trash2 size={15} /> },
];

export default function AdminPanelClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pending");
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<Indicator | null>(null);

  const fetchIndicators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/indicators?mode=${tab}`);
      setIndicators(await res.json());
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchIndicators(); }, [fetchIndicators]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async (id: string, permanent = false) => {
    await fetch(`/api/indicators/${id}?permanent=${permanent}`, { method: "DELETE" });
    fetchIndicators();
  };

  const handleRestore = async (id: string) => {
    await fetch(`/api/indicators/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_deleted: false, is_confirm_deleted: false }),
    });
    fetchIndicators();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-primary transition-colors"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">KPI Archive</span>
            </a>
            <span className="text-gray-200">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-primary flex items-center justify-center">
                <span className="text-white text-[10px] font-black">KA</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">Admin Paneli</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={14} />
            Çıkış
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex gap-1">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {icon}
                {label}
                {!loading && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                    tab === key
                      ? "bg-brand-light text-brand-primary"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {indicators.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        <IndicatorTable
          tab={tab}
          indicators={indicators}
          loading={loading}
          onEdit={setEditTarget}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      </div>

      {/* Dialogs */}
      {editTarget && tab === "pending" && (
        <EditIndicatorRequestDialog
          indicator={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchIndicators}
        />
      )}
      {editTarget && tab === "accepted" && (
        <EditAcceptedIndicatorDialog
          indicator={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchIndicators}
        />
      )}
      {editTarget && tab === "deleted" && (
        <EditDeletedIndicatorDialog
          indicator={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={fetchIndicators}
          onRestore={handleRestore}
          onPermanentDelete={handleDelete}
        />
      )}
    </div>
  );
}
