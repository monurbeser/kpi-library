"use client";

import { useState } from "react";
import { Heart, TrendingUp, TrendingDown, Tag, Layers, Award } from "lucide-react";
import type { Indicator } from "@/lib/types";
import type { Language } from "@/lib/i18n";
import { MEASUREMENT_TRANSLATIONS, CATEGORY_TRANSLATIONS } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const MEASUREMENT_COLORS: Record<string, string> = {
  Zaman: "bg-blue-100 text-blue-700",
  Yüzde: "bg-purple-100 text-purple-700",
  Sayı: "bg-gray-100 text-gray-700",
  Ton: "bg-orange-100 text-orange-700",
  Para: "bg-green-100 text-green-700",
  Ses: "bg-pink-100 text-pink-700",
  Puan: "bg-yellow-100 text-yellow-700",
  Adet: "bg-gray-100 text-gray-700",
  Enerji: "bg-amber-100 text-amber-700",
};

interface Props {
  indicator: Indicator;
  userId?: string;
  userName?: string;
  onLikeToggle?: (indicatorId: string) => void;
  isLiked?: boolean;
  lang?: Language;
}

export default function KPICard({ indicator, userId, userName, onLikeToggle, isLiked, lang = "tr" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [liking, setLiking] = useState(false);

  const likeCount = indicator.indicator_likes?.length ?? 0;
  const liked = isLiked ?? indicator.indicator_likes?.some(l => l.liker_account_id === userId) ?? false;

  const name = lang === "en" && indicator.indicator_name_en
    ? indicator.indicator_name_en
    : indicator.indicator_name;

  const definition = lang === "en" && indicator.indicator_definition_en
    ? indicator.indicator_definition_en
    : indicator.indicator_definition;

  const categoryLabel = CATEGORY_TRANSLATIONS[indicator.related_process]?.[lang] ?? indicator.related_process;
  const measurementLabel = MEASUREMENT_TRANSLATIONS[indicator.measurement]?.[lang] ?? indicator.measurement;
  const directionLabel = lang === "en"
    ? (indicator.direction === "Artması İyi" ? "Higher is Better" : "Lower is Better")
    : indicator.direction;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId || liking) return;
    setLiking(true);
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indicator_id: indicator.indicator_id,
          liker_account_id: userId,
          liker_account_name: userName ?? userId,
        }),
      });
      onLikeToggle?.(indicator.indicator_id);
    } finally {
      setLiking(false);
    }
  };

  const tags = indicator.indicator_tag
    ? indicator.indicator_tag.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const isoParts = indicator.indicator_related_management_system
    ? indicator.indicator_related_management_system.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-md hover:border-brand-light transition-all cursor-pointer"
      onClick={() => setExpanded(v => !v)}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <span className={cn(
                "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                MEASUREMENT_COLORS[indicator.measurement] ?? "bg-gray-100 text-gray-700"
              )}>
                {measurementLabel}
              </span>

              <span className={cn(
                "flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full",
                indicator.direction === "Artması İyi"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              )}>
                {indicator.direction === "Artması İyi"
                  ? <TrendingUp size={11} />
                  : <TrendingDown size={11} />}
                {directionLabel}
              </span>

              {isoParts.map(iso => (
                <span key={iso} className="flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  <Award size={10} />
                  {iso}
                </span>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-gray-800 leading-snug">{name}</h3>

            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Layers size={11} />
              {categoryLabel}
              {indicator.related_other_process && ` · ${indicator.related_other_process}`}
            </p>
          </div>

          {/* Beğeni butonu */}
          <button
            onClick={handleLike}
            disabled={!userId || liking}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors shrink-0",
              liked
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-red-400 hover:bg-red-50",
              (!userId) && "opacity-40 cursor-not-allowed"
            )}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            <span className="text-[11px] font-semibold leading-none">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3" onClick={e => e.stopPropagation()}>
          <p className="text-xs text-gray-600 leading-relaxed mb-3">{definition}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <Tag size={11} className="text-gray-400 mt-0.5 shrink-0" />
              {tags.map(tag => (
                <span key={tag} className="text-[11px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {!expanded && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-gray-300 truncate">{definition}</p>
        </div>
      )}
    </div>
  );
}
