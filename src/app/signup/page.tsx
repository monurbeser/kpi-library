import { Suspense } from "react";
import SignupForm from "./SignupForm";
import { LogoIcon } from "@/components/Logo";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef1ff] via-white to-[#f5f7ff] flex items-center justify-center p-4">

      {/* Subtle background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-brand-primary/6 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-brand-primary/4 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo block */}
        <a href="/" className="flex flex-col items-center gap-3 mb-8 hover:opacity-90 transition-opacity">
          <LogoIcon size={56} />
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900 tracking-tight leading-none">
              KPI <span className="text-brand-primary">ARCHIVE</span>
            </p>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">Performance Intelligence Platform</p>
          </div>
        </a>

        {/* Auth card */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/80 p-8">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-gray-900">Hesap Oluştur</h1>
            <p className="text-sm text-gray-400 mt-1">KPI önerin, favorilerinizi kaydedin.</p>
          </div>

          <Suspense fallback={<div className="h-56 animate-pulse bg-gray-50 rounded-xl" />}>
            <SignupForm />
          </Suspense>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Zaten hesabınız var mı?{" "}
              <a href="/login" className="text-brand-primary font-semibold hover:text-brand-hover transition-colors">
                Giriş Yap
              </a>
            </p>
          </div>
        </div>

        <a href="/" className="block text-center text-xs text-gray-400 hover:text-brand-primary transition-colors mt-6">
          ← KPI Archive&apos;e Dön
        </a>

      </div>
    </div>
  );
}
