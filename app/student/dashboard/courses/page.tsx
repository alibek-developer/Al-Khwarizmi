"use client";

import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  FolderOpen,
  Play,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";

const mockCourses = [
  {
    id: 1,
    name: "Web Development",
    description: "HTML, CSS, JavaScript va React asoslari",
    progress: 72,
    totalLessons: 24,
    completedLessons: 17,
    mentor: "Islombek Aliyev",
    mentorAvatar: "IA",
    lessons: [
      { id: 1, title: "HTML asoslari", type: "video", duration: "45 daq", completed: true },
      { id: 2, title: "CSS stillari", type: "video", duration: "60 daq", completed: true },
      { id: 3, title: "JavaScript kirish", type: "video", duration: "55 daq", completed: true },
      { id: 4, title: "React komponentlari", type: "video", duration: "50 daq", completed: false },
      { id: 5, title: "Mashq: Layout yaratish", type: "homework", duration: "2 soat", completed: false },
    ],
    materials: [
      { name: "HTML cheat sheet.pdf", size: "1.2 MB" },
      { name: "CSS grid guide.pdf", size: "2.4 MB" },
    ],
  },
  {
    id: 2,
    name: "English Course",
    description: "Ingliz tili grammatika va speaking",
    progress: 45,
    totalLessons: 20,
    completedLessons: 9,
    mentor: "Farhod Rahimov",
    mentorAvatar: "FR",
    lessons: [
      { id: 1, title: "Present Simple", type: "video", duration: "30 daq", completed: true },
      { id: 2, title: "Present Continuous", type: "video", duration: "35 daq", completed: true },
      { id: 3, title: "Past Simple", type: "video", duration: "40 daq", completed: false },
      { id: 4, title: "Vocabulary: Business", type: "video", duration: "25 daq", completed: false },
    ],
    materials: [
      { name: "Grammar rules.pdf", size: "3.1 MB" },
      { name: "Vocabulary list.xlsx", size: "0.5 MB" },
    ],
  },
  {
    id: 3,
    name: "Data Science",
    description: "Python, Pandas va Machine Learning",
    progress: 20,
    totalLessons: 30,
    completedLessons: 6,
    mentor: "Dilshod Tashkentov",
    mentorAvatar: "DT",
    lessons: [
      { id: 1, title: "Python asoslari", type: "video", duration: "50 daq", completed: true },
      { id: 2, title: "Pandas kutubxonasi", type: "video", duration: "65 daq", completed: true },
      { id: 3, title: "Ma'lumotlarni tozalash", type: "video", duration: "55 daq", completed: false },
    ],
    materials: [
      { name: "Python basics.pdf", size: "4.2 MB" },
    ],
  },
];

export default function StudentCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<typeof mockCourses[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"lessons" | "materials">("lessons");

  const courseGradients: Record<number, string> = {
    1: "from-violet-500 to-purple-600",
    2: "from-blue-500 to-cyan-600",
    3: "from-emerald-500 to-teal-600",
  };

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
          {mockCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className={`h-20 bg-gradient-to-br ${courseGradients[course.id]} p-4 flex items-end justify-between`}>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-white/80 text-xs font-semibold bg-white/10 px-2 py-1 rounded-lg">
                  {course.progress}% yakunlangan
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-black text-slate-900 dark:text-white text-sm mb-1">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full bg-gradient-to-r ${courseGradients[course.id]} rounded-full transition-all duration-500`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <span className="text-white text-[8px] font-black">
                        {course.mentorAvatar}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {course.mentor}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {course.completedLessons}/{course.totalLessons} dars
                  </span>
                </div>
              </div>
            </div>
          ))}
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

          <div className={`h-24 rounded-2xl bg-gradient-to-br ${courseGradients[selectedCourse.id]} p-5 flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-black text-white">{selectedCourse.name}</h2>
              <p className="text-white/70 text-xs">{selectedCourse.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{selectedCourse.progress}%</div>
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
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Darslar ({selectedCourse.lessons.length})
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("materials")}
                  className={`flex-1 px-4 py-3 text-xs font-bold transition-colors ${
                    activeTab === "materials"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    Materiallar ({selectedCourse.materials.length})
                  </div>
                </button>
              </div>

              <div className="p-4">
                {activeTab === "lessons" ? (
                  <div className="space-y-2">
                    {selectedCourse.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          lesson.completed
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
                            : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          lesson.completed
                            ? "bg-emerald-500"
                            : lesson.type === "homework"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : lesson.type === "homework" ? (
                            <FileText className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${
                            lesson.completed
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-slate-800 dark:text-slate-200"
                          }`}>
                            {lesson.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </span>
                          {!lesson.completed && (
                            <span className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                              BOSHLASH
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCourse.materials.length === 0 ? (
                      <div className="text-center py-12">
                        <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400 dark:text-slate-500 text-sm">
                          Materiallar mavjud emas
                        </p>
                      </div>
                    ) : (
                      selectedCourse.materials.map((material, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {material.name}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              {material.size}
                            </p>
                          </div>
                          <button className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors">
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
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white text-[8px] font-black">
                          {selectedCourse.mentorAvatar}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {selectedCourse.mentor}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Jami darslar</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {selectedCourse.totalLessons} ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Tugallangan</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedCourse.completedLessons} ta
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Qolgan</span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {selectedCourse.totalLessons - selectedCourse.completedLessons} ta
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
                  <span>24 ta talaba</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
