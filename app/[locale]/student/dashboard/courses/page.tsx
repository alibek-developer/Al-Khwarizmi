"use client";

import {
  BookOpen,
  ChevronRight,
  FileText,
  FolderOpen,
  Play,
  Users,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { courseApi, type Material } from "@/lib/api";

const courseGradients: Record<number, string> = {
  1: "from-violet-500 to-purple-600",
  2: "from-blue-500 to-cyan-600",
  3: "from-blue-500 to-indigo-600",
};

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"lessons" | "materials">("lessons");
  const [loading, setLoading] = useState(true);
  const [courseMaterials, setCourseMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) return;
        
        const data = await courseApi.getByStudentId(Number(studentId));
        setCourses(data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!selectedCourse) return;
      
      try {
        const data = await courseApi.getByGroupId(selectedCourse.groups.id);
        setCourseMaterials(data.materials || []);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };

    fetchCourseDetails();
  }, [selectedCourse]);

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
          Mening Kurslarim
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
          O&apos;zlashtirayotgan kurslaringiz ro&apos;yxati
        </p>
      </div>

      {!selectedCourse ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((enrollment, idx) => {
              const course = enrollment.groups;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(enrollment)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className={`h-20 bg-gradient-to-br ${courseGradients[(idx % 3) + 1] || courseGradients[1]} p-4 flex items-end justify-between`}>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/80 text-xs font-semibold bg-white/10 px-2 py-1 rounded-lg">
                      0% yakunlangan
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                      {course.course?.title_uz || course.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                      {course.mentor?.full_name || "Mentor"}
                    </p>

                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full bg-gradient-to-r ${courseGradients[(idx % 3) + 1] || courseGradients[1]} rounded-full transition-all duration-500`}
                        style={{ width: "0%" }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                          <span className="text-white text-[8px] font-black">
                            {course.mentor?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "M"}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {course.mentor?.full_name || "Mentor"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        0/{course.course?.lessons_count || 0} dars
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Hali kursga yozilmagansiz
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Barcha kurslar
          </button>

          <div className={`h-24 rounded-2xl bg-gradient-to-br ${courseGradients[1]} p-5 flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-white">
                {selectedCourse.groups.course?.title_uz || selectedCourse.groups.name}
              </h2>
              <p className="text-white/70 text-xs">{selectedCourse.groups.mentor?.full_name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">0%</div>
              <div className="text-white/60 text-xs">Tugallangan</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab("lessons")}
                  className={`flex-1 px-4 py-3 text-xs font-bold transition-colors ${
                    activeTab === "lessons"
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Darslar (0)
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("materials")}
                  className={`flex-1 px-4 py-3 text-xs font-bold transition-colors ${
                    activeTab === "materials"
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Materiallar ({courseMaterials.length})
                  </div>
                </button>
              </div>

              <div className="p-4">
                {activeTab === "lessons" ? (
                  <div className="space-y-2">
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400 dark:text-slate-500 text-sm">
                        Darslar tez kunda qo&apos;shiladi
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {courseMaterials.length === 0 ? (
                      <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400 dark:text-slate-500 text-sm">
                          Materiallar mavjud emas
                        </p>
                      </div>
                    ) : (
                      courseMaterials.map((material) => (
                        <div
                          key={material.id}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {material.title}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              {material.file_url ? "Fayl" : "Havola"}
                            </p>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors">
                            Yuklab olish
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">
                  Kurs ma&apos;lumotlari
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Mentor</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                        <span className="text-white text-[8px] font-black">
                          {selectedCourse.groups.mentor?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "M"}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {selectedCourse.groups.mentor?.full_name || "Mentor"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Jami darslar</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {selectedCourse.groups.course?.lessons_count || 0} ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Tugallangan</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      0 ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Qolgan</span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {selectedCourse.groups.course?.lessons_count || 0} ta
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">
                  Guruh a&apos;zolari
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>0 ta talaba</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
