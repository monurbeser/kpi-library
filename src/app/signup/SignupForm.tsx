"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Bu e-posta adresi zaten kayıtlı.");
      } else {
        setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all";

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={28} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Kayıt tamamlandı!</p>
          <p className="text-xs text-gray-500 mt-1">
            E-posta adresinize bir doğrulama linki gönderdik. Linke tıklayarak hesabınızı aktif edin.
          </p>
        </div>
        <a
          href="/login"
          className="text-sm font-semibold text-brand-primary hover:text-brand-hover transition-colors"
        >
          Giriş sayfasına git →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">Ad Soyad</label>
        <input
          type="text"
          className={inputCls}
          placeholder="Adınız Soyadınız"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">E-posta</label>
        <input
          type="email"
          className={inputCls}
          placeholder="ornek@sirket.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600">Şifre</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={inputCls + " pr-10"}
            placeholder="En az 6 karakter"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
          bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors
          disabled:opacity-60 mt-1"
      >
        <UserPlus size={15} />
        {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
      </button>
    </form>
  );
}
