"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Settings2, X, LogIn, Globe } from "lucide-react";
import CategorySidebar from "./CategorySidebar";
import SearchBar from "./SearchBar";
import KPICard from "./KPICard";
import ExcelExport from "./ExcelExport";
import AddIndicatorDialog from "@/components/Dialogs/AddIndicatorDialog";
import type { Indicator } from "@/lib/types";
import { CATEGORIES } from "@/data/categories";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { LogoIcon } from "@/components/Logo";

// Basit anonim user ID (beğeniler için)
function getAnonId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("kpi_anon_id");
  if (!id) {
    id = "anon_" + Math.random().toString(36).slice(2);
    localStorage.setItem("kpi_anon_id", id);
  }
  return id;
}

function AuthRequiredModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center">
            <LogIn size={22} className="text-brand-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">{t.auth.modalTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.auth.modalDesc}</p>
          </div>
          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary
              text-white text-sm font-semibold rounded-lg hover:bg-brand-hover transition-colors"
          >
            <LogIn size={15} />
            {t.auth.loginBtn}
          </a>
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            {t.auth.notNow}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KPILibraryClient() {
  const { lang, t, toggle } = useLanguage();
  const [allIndicators, setAllIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<"all" | "favorites" | "top10">("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId] = useState(getAnonId);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Auth durumunu kontrol et
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Her zaman tüm listeyi çek — filtreleme tamamen client-side
  const fetchIndicators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/indicators");
      const data: Indicator[] = await res.json();
      setAllIndicators(data);
      const liked = new Set(
        data
          .filter(ind => ind.indicator_likes?.some(l => l.liker_account_id === userId))
          .map(ind => ind.indicator_id)
      );
      setLikedIds(liked);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchIndicators();
  }, [fetchIndicators]);

  const handleLikeToggle = useCallback((indicatorId: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(indicatorId)) next.delete(indicatorId);
      else next.add(indicatorId);
      return next;
    });
    setAllIndicators(prev =>
      prev.map(ind => {
        if (ind.indicator_id !== indicatorId) return ind;
        const liked = ind.indicator_likes?.some(l => l.liker_account_id === userId);
        const likes = ind.indicator_likes ?? [];
        return {
          ...ind,
          indicator_likes: liked
            ? likes.filter(l => l.liker_account_id !== userId)
            : [...likes, { like_id: "temp", indicator_id: indicatorId, liker_account_id: userId, liker_account_name: userId }],
        };
      })
    );
  }, [userId]);

  async function requireAuth(action: () => void) {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    // Server-side doğrulama
    try {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        setShowAuthModal(true);
        return;
      }
    } catch {
      setShowAuthModal(true);
      return;
    }
    action();
  }

  // Client-side filtreleme
  const visibleIndicators = useMemo(() => {
    let list = [...allIndicators];
    if (selectedCategory) {
      list = list.filter(ind => ind.related_process === selectedCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(ind =>
        ind.indicator_name.toLowerCase().includes(q) ||
        ind.indicator_definition.toLowerCase().includes(q) ||
        (ind.indicator_tag ?? "").toLowerCase().includes(q)
      );
    }
    if (view === "favorites") {
      list = list.filter(ind => likedIds.has(ind.indicator_id));
    } else if (view === "top10") {
      list = list
        .sort((a, b) => (b.indicator_likes?.length ?? 0) - (a.indicator_likes?.length ?? 0))
        .slice(0, 10);
    }
    return list;
  }, [allIndicators, selectedCategory, search, view, likedIds]);

  // Kategori sayaçları — her zaman TÜM listeden
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat] = allIndicators.filter(ind => ind.related_process === cat).length;
    }
    return counts;
  }, [allIndicators]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 hover:opacity-90 transition-opacity">
            <LogoIcon size={30} />
            <div className="flex items-center gap-2">
              <span className="font-black text-gray-900 tracking-tight leading-none" style={{ fontSize: 13 }}>
                KPI <span className="text-brand-primary">ARCHIVE</span>
              </span>
              <span className="hidden sm:inline text-[11px] bg-brand-light text-brand-primary font-semibold px-2 py-0.5 rounded-full">
                {allIndicators.length} KPI
              </span>
            </div>
          </a>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dil Toggler */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-semibold
                text-gray-500 border border-gray-200 rounded-lg hover:bg-brand-light hover:text-brand-primary hover:border-brand-primary/30 transition-colors"
              title={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}
            >
              <Globe size={14} />
              <span className="text-xs font-bold">{lang === "tr" ? "EN" : "TR"}</span>
            </button>
            <ExcelExport
              indicators={visibleIndicators}
              onAuthRequired={() => setShowAuthModal(true)}
              isLoggedIn={isLoggedIn}
              label={t.header.excel}
              lang={lang}
            />
            <button
              onClick={() => requireAuth(() => setShowAddDialog(true))}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold
                bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">{t.header.proposeKpi}</span>
            </button>
            <a
              href="/admin"
              className="p-2 text-gray-400 hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
              title="Admin Paneli"
            >
              <Settings2 size={17} />
            </a>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6">

        {/* Sidebar */}
        <CategorySidebar
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          counts={categoryCounts}
          view={view}
          onViewChange={setView}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <SearchBar value={search} onChange={setSearch} placeholder={t.search.placeholder} />
            <span className="text-xs text-gray-400 shrink-0">
              {loading ? t.search.loading : t.search.results(visibleIndicators.length)}
            </span>
          </div>

          {view === "top10" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">{t.views.top10Title}</span>
            </div>
          )}
          {view === "favorites" && (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">{t.views.favoritesTitle}</span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 h-32 animate-pulse" />
              ))}
            </div>
          ) : visibleIndicators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-sm font-medium">
                {view === "favorites" ? t.views.noFavorites : t.views.noResults}
              </p>
              {view === "favorites" && (
                <p className="text-xs mt-1">{t.views.noFavoritesHint}</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleIndicators.map(ind => (
                <KPICard
                  key={ind.indicator_id}
                  indicator={ind}
                  userId={userId}
                  userName={userId}
                  onLikeToggle={handleLikeToggle}
                  isLiked={likedIds.has(ind.indicator_id)}
                  lang={lang}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {showAddDialog && (
        <AddIndicatorDialog
          onClose={() => setShowAddDialog(false)}
          onSuccess={fetchIndicators}
        />
      )}

      {showAuthModal && <AuthRequiredModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
