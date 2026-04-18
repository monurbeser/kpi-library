"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { Indicator } from "@/lib/types";
import type { Language } from "@/lib/i18n";
import { CATEGORY_TRANSLATIONS, MEASUREMENT_TRANSLATIONS } from "@/lib/i18n";
import * as XLSX from "xlsx";

interface Props {
  indicators: Indicator[];
  isLoggedIn: boolean;
  onAuthRequired: () => void;
  label?: string;
  lang?: Language;
}

export default function ExcelExport({
  indicators,
  isLoggedIn,
  onAuthRequired,
  label = "Excel",
  lang = "tr",
}: Props) {
  const [checking, setChecking] = useState(false);

  const handleClick = async () => {
    // Önce client state'i kontrol et (hızlı yol)
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    // Server-side doğrulama — client state yanıltıcı olabilir
    setChecking(true);
    try {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        onAuthRequired();
        return;
      }
    } catch {
      onAuthRequired();
      return;
    } finally {
      setChecking(false);
    }

    const date = new Date().toISOString().slice(0, 10);

    if (lang === "en") {
      const translateCategories = (val?: string) =>
        (val ?? "")
          .split(",")
          .map(s => CATEGORY_TRANSLATIONS[s.trim()]?.en ?? s.trim())
          .filter(Boolean)
          .join(", ");

      const rows = indicators.map(ind => ({
        "KPI Name": ind.indicator_name_en || ind.indicator_name,
        "Definition": ind.indicator_definition_en || ind.indicator_definition,
        "Direction": ind.direction === "Artması İyi" ? "Higher is Better" : "Lower is Better",
        "Measurement": MEASUREMENT_TRANSLATIONS[ind.measurement]?.en ?? ind.measurement,
        "Category": CATEGORY_TRANSLATIONS[ind.related_process]?.en ?? ind.related_process,
        "Related Processes": translateCategories(ind.related_other_process),
        "Tags": ind.indicator_tag ?? "",
        "Management System": ind.indicator_related_management_system ?? "",
        "Likes": ind.indicator_likes?.length ?? 0,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "KPI Archive");
      ws["!cols"] = [
        { wch: 45 }, { wch: 60 }, { wch: 18 }, { wch: 14 },
        { wch: 26 }, { wch: 26 }, { wch: 30 }, { wch: 20 }, { wch: 8 },
      ];
      XLSX.writeFile(wb, `KPI-Archive-${date}.xlsx`);
    } else {
      const rows = indicators.map(ind => ({
        "KPI Adı": ind.indicator_name,
        "Tanım": ind.indicator_definition,
        "Yön": ind.direction,
        "Ölçüm": ind.measurement,
        "Ana Süreç": ind.related_process,
        "İlgili Süreçler": ind.related_other_process ?? "",
        "Etiketler": ind.indicator_tag ?? "",
        "Yönetim Sistemi": ind.indicator_related_management_system ?? "",
        "Beğeni Sayısı": ind.indicator_likes?.length ?? 0,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "KPI Archive");
      ws["!cols"] = [
        { wch: 45 }, { wch: 60 }, { wch: 14 }, { wch: 10 },
        { wch: 24 }, { wch: 24 }, { wch: 30 }, { wch: 20 }, { wch: 12 },
      ];
      XLSX.writeFile(wb, `KPI-Arsivi-${date}.xlsx`);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={checking}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-primary
        border border-brand-primary/30 rounded-lg hover:bg-brand-light transition-colors
        disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {checking
        ? <Loader2 size={15} className="animate-spin" />
        : <Download size={15} />
      }
      {label}
    </button>
  );
}
