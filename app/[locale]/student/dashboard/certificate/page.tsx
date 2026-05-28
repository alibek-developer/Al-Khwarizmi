"use client";

import {
  Award,
  CheckCircle2,
  Download,
  Eye,
  Facebook,
  GraduationCap,
  Linkedin,
  Share2,
  Star,
  Twitter,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { certificateApi, type Certificate } from "@/lib/api";

export default function StudentCertificatePage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Talaba");

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    if (name) setStudentName(name);

    const fetchCertificates = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) return;
        
        const data = await certificateApi.getByStudentId(Number(studentId));
        setCertificates(data || []);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const validCerts = certificates.filter(c => {
    if (!c.expiry_date) return true;
    return new Date(c.expiry_date) > new Date();
  });
  const expiredCerts = certificates.filter(c => {
    if (!c.expiry_date) return false;
    return new Date(c.expiry_date) <= new Date();
  });

  const shareCertificate = (platform: string) => {
    if (!selectedCert) return;
    const text = `Men ${selectedCert.course?.title_uz || "kursni"} muvaffaqiyatli yakunladim! Sertifikat: ${selectedCert.certificate_url}`;
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(selectedCert.certificate_url)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const getCertColor = (cert: Certificate) => {
    const colors = ["from-violet-500 to-purple-600", "from-blue-500 to-cyan-600", "from-blue-500 to-indigo-600"];
    const idx = certificates.indexOf(cert) % colors.length;
    return colors[idx];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">
          Sertifikatlarim
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          Kursni muvaffaqiyatli yakunlaganlik haqidagi hujjatlar
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-white/80" />
            <span className="text-sm font-semibold text-white/80">Faol sertifikatlar</span>
          </div>
          <p className="text-3xl font-black">{validCerts.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-semibold text-slate-500">Muddati o'tgan</span>
          </div>
          <p className="text-3xl font-black text-slate-700 dark:text-slate-300">{expiredCerts.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-500">O'rtacha baho</span>
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-amber-400">0%</p>
        </div>
      </div>

      {validCerts.length > 0 && (
        <div>
          <h2 className="font-black text-slate-900 dark:text-white text-sm mb-3">Faol sertifikatlar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {validCerts.map((cert) => {
              const colors = courseColors.wd;
              return (
                <div
                  key={cert.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className={`h-24 bg-gradient-to-br ${getCertColor(cert)} p-4 flex items-center justify-center relative`}>
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur rounded-lg px-2 py-1">
                      <span className="text-white text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Tasdiqlangan
                      </span>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                      {cert.course?.title_uz || "Kurs"}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      <span>Berilgan: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString("uz-UZ") : "N/A"}</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">0%</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Ko&apos;rish
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedCert(cert); setShowShare(true); }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {expiredCerts.length > 0 && (
        <div>
          <h2 className="font-black text-slate-900 dark:text-white text-sm mb-3">Muddati o&apos;tgan sertifikatlar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden opacity-60"
              >
                <div className={`h-24 bg-gradient-to-br ${getCertColor(cert)} p-4 flex items-center justify-center relative opacity-50`}>
                  <div className="absolute top-3 right-3 bg-red-500/80 backdrop-blur rounded-lg px-2 py-1">
                    <span className="text-white text-[10px] font-bold">Muddati o&apos;ttgan</span>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                    {cert.course?.title_uz || "Kurs"}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    <span>Tugallangan: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString("uz-UZ") : "N/A"}</span>
                    <span className="font-bold">0%</span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <Download className="w-3.5 h-3.5" /> Qayta yuklab olish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Hali sertifikatingiz yo&apos;q
          </p>
        </div>
      )}

      {selectedCert && !showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedCert(null)}>
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`h-32 bg-gradient-to-br ${getCertColor(selectedCert)} flex items-center justify-center relative`}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setShowShare(true)} className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Al-Khwarizmi Ta&apos;lim Markazi</p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Sertifikat</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Kursni muvaffaqiyatli yakunlagani uchun</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Talaba</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{studentName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kurs</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedCert.course?.title_uz || "Kurs"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Baho</p>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-400">0%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Berilgan sana</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedCert.issue_date ? new Date(selectedCert.issue_date).toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Certificate URL</p>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedCert.certificate_url}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> PDF yuklab olish
                </button>
                <button onClick={() => setShowShare(true)} className="h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" /> Ulashish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCert && showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowShare(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-black text-slate-900 dark:text-white">Ulashish</h3>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCertColor(selectedCert)} flex items-center justify-center shrink-0`}>
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedCert.course?.title_uz || "Kurs"} Sertifikati</p>
                  <p className="text-xs text-slate-400">{selectedCert.certificate_url}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => shareCertificate("facebook")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Facebook</span>
                </button>
                <button
                  onClick={() => shareCertificate("twitter")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/20 transition-colors"
                >
                  <Twitter className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Twitter</span>
                </button>
                <button
                  onClick={() => shareCertificate("linkedin")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">LinkedIn</span>
                </button>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Havola</label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={selectedCert.certificate_url}
                    className="flex-1 h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedCert.certificate_url)}
                    className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                  >
                    Nusxalash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
