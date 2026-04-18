export type Language = "tr" | "en";

export const TRANSLATIONS = {
  tr: {
    appName: "KPI Archive",
    header: {
      excel: "Excel",
      proposeKpi: "KPI Öner",
    },
    sidebar: {
      view: "Görünüm",
      allKpis: "Tüm KPI'lar",
      favorites: "Favorilerim",
      top10: "Top 10 Öneri",
      categories: "Kategoriler",
      all: "Tümü",
    },
    search: {
      placeholder: "KPI ara...",
      results: (n: number) => `${n} sonuç`,
      loading: "Yükleniyor...",
    },
    views: {
      top10Title: "🏆 En Çok Önerilen 10 KPI",
      favoritesTitle: "❤️ Favorilerim",
      noFavorites: "Henüz favori KPI'ınız yok.",
      noFavoritesHint: "KPI kartlarındaki ❤️ butonuna tıklayarak ekleyebilirsiniz.",
      noResults: "Sonuç bulunamadı.",
    },
    card: {
      likes: "beğeni",
      direction: {
        "Artması İyi": "Artması İyi",
        "Azalması İyi": "Azalması İyi",
      },
    },
    auth: {
      modalTitle: "Üyelik Gerekli",
      modalDesc: "Bu özelliği kullanmak için giriş yapmanız gerekmektedir.",
      loginBtn: "Giriş Yap",
      notNow: "Şimdi değil",
    },
  },
  en: {
    appName: "KPI Archive",
    header: {
      excel: "Excel",
      proposeKpi: "Suggest KPI",
    },
    sidebar: {
      view: "View",
      allKpis: "All KPIs",
      favorites: "My Favorites",
      top10: "Top 10 Picks",
      categories: "Categories",
      all: "All",
    },
    search: {
      placeholder: "Search KPIs...",
      results: (n: number) => `${n} results`,
      loading: "Loading...",
    },
    views: {
      top10Title: "🏆 Top 10 Most Recommended KPIs",
      favoritesTitle: "❤️ My Favorites",
      noFavorites: "You have no favorite KPIs yet.",
      noFavoritesHint: "Click the ❤️ button on KPI cards to add them.",
      noResults: "No results found.",
    },
    card: {
      likes: "likes",
      direction: {
        "Artması İyi": "Higher is Better",
        "Azalması İyi": "Lower is Better",
      },
    },
    auth: {
      modalTitle: "Login Required",
      modalDesc: "You need to log in to use this feature.",
      loginBtn: "Log In",
      notNow: "Not now",
    },
  },
} as const;

export const CATEGORY_TRANSLATIONS: Record<string, { tr: string; en: string }> = {
  "Arge": { tr: "Arge", en: "R&D" },
  "Bakım": { tr: "Bakım", en: "Maintenance" },
  "Bilgi Teknolojileri": { tr: "Bilgi Teknolojileri", en: "Information Technology" },
  "Çevre": { tr: "Çevre", en: "Environment" },
  "Finans": { tr: "Finans", en: "Finance" },
  "İnsan Kaynakları": { tr: "İnsan Kaynakları", en: "Human Resources" },
  "İş Sağlığı ve Güvenliği": { tr: "İş Sağlığı ve Güvenliği", en: "Occupational Health & Safety" },
  "Kalite": { tr: "Kalite", en: "Quality" },
  "Satış ve Pazarlama": { tr: "Satış ve Pazarlama", en: "Sales & Marketing" },
  "Tedarik Zinciri": { tr: "Tedarik Zinciri", en: "Supply Chain" },
  "Üretim": { tr: "Üretim", en: "Production" },
};

export const MEASUREMENT_TRANSLATIONS: Record<string, { tr: string; en: string }> = {
  "Zaman": { tr: "Zaman", en: "Time" },
  "Yüzde": { tr: "Yüzde", en: "Percentage" },
  "Sayı": { tr: "Sayı", en: "Number" },
  "Ton": { tr: "Ton", en: "Ton" },
  "Para": { tr: "Para", en: "Currency" },
  "Ses": { tr: "Ses", en: "Volume" },
  "Puan": { tr: "Puan", en: "Score" },
  "Adet": { tr: "Adet", en: "Units" },
  "Enerji": { tr: "Enerji", en: "Energy" },
};

export function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "tr";
  const lang = navigator.language?.toLowerCase() ?? "";
  return lang.startsWith("tr") ? "tr" : "en";
}

export function getSavedLanguage(): Language | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("kpi_lang");
  return saved === "tr" || saved === "en" ? saved : null;
}

export function saveLanguage(lang: Language) {
  if (typeof window !== "undefined") {
    localStorage.setItem("kpi_lang", lang);
  }
}
