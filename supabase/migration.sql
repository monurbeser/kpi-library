-- =============================================
-- KPI Kütüphanesi - Supabase Migration
-- Supabase Dashboard > SQL Editor'e yapıştır ve çalıştır
-- =============================================

-- 1. KPI tablosu
CREATE TABLE IF NOT EXISTS indicators (
  indicator_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_name TEXT NOT NULL,
  indicator_definition TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('Artması İyi', 'Azalması İyi')),
  measurement TEXT NOT NULL CHECK (measurement IN ('Zaman', 'Yüzde', 'Sayı', 'Ton', 'Para', 'Ses', 'Puan')),
  related_process TEXT NOT NULL,
  related_other_process TEXT DEFAULT '',
  indicator_tag TEXT DEFAULT '',
  indicator_related_management_system TEXT DEFAULT '',
  constituent_name TEXT DEFAULT '',
  organization_name TEXT DEFAULT '',
  is_default BOOLEAN DEFAULT false,
  is_accepted BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  is_confirm_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Beğeniler tablosu
CREATE TABLE IF NOT EXISTS indicator_likes (
  like_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_id UUID NOT NULL REFERENCES indicators(indicator_id) ON DELETE CASCADE,
  liker_account_id TEXT NOT NULL,
  liker_account_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(indicator_id, liker_account_id)
);

-- 3. Admin profilleri tablosu
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Row Level Security aktif et
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicator_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Politikaları

-- Herkes kabul edilmiş, silinmemiş KPI'ları okuyabilir
CREATE POLICY "Public read accepted indicators"
  ON indicators FOR SELECT
  USING (is_accepted = true AND is_deleted = false AND is_confirm_deleted = false);

-- Admin tüm KPI'lara tam erişim
CREATE POLICY "Admin full access indicators"
  ON indicators FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Giriş yapmış kullanıcılar yeni KPI önerebilir
CREATE POLICY "Auth users can propose indicators"
  ON indicators FOR INSERT
  TO authenticated
  WITH CHECK (is_accepted = false AND is_default = false);

-- Herkes beğenileri okuyabilir
CREATE POLICY "Public read likes"
  ON indicator_likes FOR SELECT
  USING (true);

-- Giriş yapmış kullanıcılar kendi beğenilerini yönetebilir
CREATE POLICY "Auth users manage own likes"
  ON indicator_likes FOR ALL
  TO authenticated
  USING (liker_account_id = auth.uid()::text)
  WITH CHECK (liker_account_id = auth.uid()::text);

-- Kullanıcılar kendi profillerini okuyabilir
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admin profilleri okuyabilir
CREATE POLICY "Admins read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 6. Yeni kullanıcı kaydında otomatik profil oluştur (trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 7. İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_indicators_related_process ON indicators(related_process);
CREATE INDEX IF NOT EXISTS idx_indicators_is_accepted ON indicators(is_accepted, is_deleted);
CREATE INDEX IF NOT EXISTS idx_indicator_likes_indicator_id ON indicator_likes(indicator_id);
CREATE INDEX IF NOT EXISTS idx_indicator_likes_account_id ON indicator_likes(liker_account_id);
