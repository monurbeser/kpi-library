"use client";

import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { CATEGORY_TRANSLATIONS } from "@/lib/i18n";

const CATEGORY_ICONS: Record<string, string> = {
  "Arge": "🔬",
  "Bakım": "🔧",
  "Bilgi Teknolojileri": "💻",
  "Çevre": "🌱",
  "Finans": "💰",
  "İnsan Kaynakları": "👥",
  "İş Sağlığı ve Güvenliği": "🦺",
  "Kalite": "✅",
  "Satış ve Pazarlama": "📈",
  "Tedarik Zinciri": "🚚",
  "Üretim": "🏭",
};

interface Props {
  selected: string | null;
  onSelect: (category: string | null) => void;
  counts?: Record<string, number>;
  view: "all" | "favorites" | "top10";
  onViewChange: (view: "all" | "favorites" | "top10") => void;
}

export default function CategorySidebar({ selected, onSelect, counts, view, onViewChange }: Props) {
  const { t, lang } = useLanguage();

  const viewItems = [
    { key: "all" as const, label: t.sidebar.allKpis },
    { key: "favorites" as const, label: t.sidebar.favorites },
    { key: "top10" as const, label: t.sidebar.top10 },
  ];

  return (
    <aside className="w-56 shrink-0 flex flex-col gap-1 select-none">
      <div className="mb-3">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
          {t.sidebar.view}
        </p>
        {viewItems.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { onViewChange(key); onSelect(null); }}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              view === key
                ? "bg-brand-primary text-white"
                : "text-gray-600 hover:bg-brand-light hover:text-brand-primary"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1">
          {t.sidebar.categories}
        </p>

        <button
          onClick={() => { onSelect(null); onViewChange("all"); }}
          className={cn(
            "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            !selected && view === "all"
              ? "bg-brand-primary text-white"
              : "text-gray-600 hover:bg-brand-light hover:text-brand-primary"
          )}
        >
          {t.sidebar.all}
        </button>

        {CATEGORIES.map((cat) => {
          const label = CATEGORY_TRANSLATIONS[cat]?.[lang] ?? cat;
          return (
            <button
              key={cat}
              onClick={() => { onSelect(cat); onViewChange("all"); }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between gap-2",
                selected === cat
                  ? "bg-brand-primary text-white font-semibold"
                  : "text-gray-600 hover:bg-brand-light hover:text-brand-primary"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <span className="text-base leading-none">{CATEGORY_ICONS[cat]}</span>
                <span className="truncate">{label}</span>
              </span>
              {counts?.[cat] !== undefined && (
                <span className={cn(
                  "text-[11px] rounded-full px-1.5 py-0.5 font-medium shrink-0",
                  selected === cat ? "bg-white/20 text-white" : "bg-brand-light text-brand-primary"
                )}>
                  {counts[cat]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
