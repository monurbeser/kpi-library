export const CATEGORIES = [
  "Arge",
  "Bakım",
  "Bilgi Teknolojileri",
  "Çevre",
  "Finans",
  "İnsan Kaynakları",
  "İş Sağlığı ve Güvenliği",
  "Kalite",
  "Satış ve Pazarlama",
  "Tedarik Zinciri",
  "Üretim",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];
