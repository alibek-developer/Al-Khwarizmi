"use client";

import {
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Gamepad2,
  HelpCircle,
  Lightbulb,
  Lock,
  Star,
  Trophy,
  Zap,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { gameApi } from "@/lib/api";

const mockDailyQuiz = {
  id: 1,
  title: "JavaScript Basics",
  questions: 5,
  xpReward: 100,
  duration: "5 daq",
  completed: false,
  streakBonus: true,
};

const mockGames = [
  {
    id: 1,
    name: "Logic Puzzles",
    description: "Mantiqiy masalalarni yeching",
    icon: Brain,
    color: "violet",
    bg: "bg-violet-500",
    lightBg: "bg-violet-50 dark:bg-violet-500/10",
    xp: 50,
    plays: 245,
    unlocked: true,
  },
  {
    id: 2,
    name: "Quick Math",
    description: "Tez hisoblash o'yini",
    icon: Lightbulb,
    color: "amber",
    bg: "bg-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-500/10",
    xp: 40,
    plays: 189,
    unlocked: true,
  },
  {
    id: 3,
    name: "Word Match",
    description: "So'zlarni moslashtiring",
    icon: HelpCircle,
    color: "blue",
    bg: "bg-blue-500",
    lightBg: "bg-blue-50 dark:bg-blue-500/10",
    xp: 35,
    plays: 156,
    unlocked: true,
  },
  {
    id: 4,
    name: "Memory Game",
    description: "Xotira o'yini",
    icon: Gamepad2,
    color: "blue",
    bg: "bg-blue-500",
    lightBg: "bg-blue-50 dark:bg-blue-500/10",
    xp: 45,
    plays: 0,
    unlocked: false,
    unlockReq: "10 kun streak",
  },
  {
    id: 5,
    name: "Code Challenge",
    description: "Dasturlash muammolari",
    icon: Zap,
    color: "red",
    bg: "bg-red-500",
    lightBg: "bg-red-50 dark:bg-red-500/10",
    xp: 80,
    plays: 0,
    unlocked: false,
    unlockReq: "50 XP kerak",
  },
];

const colorMap: Record<string, { text: string; border: string }> = {
  violet: { text: "text-violet-600 dark:text-violet-400", border: "border-violet-200 dark:border-violet-500/20" },
  amber: { text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/20" },
  blue: { text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20" },
  emerald: { text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20" },
  red: { text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-500/20" },
};

export default function StudentGamesPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [gameStats, setGameStats] = useState<Record<string, { count: number; totalPoints: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) return;
        
        const [stats, results] = await Promise.all([
          gameApi.getStats(Number(studentId)),
          gameApi.getByStudentId(Number(studentId)),
        ]);
        
        setGameStats(stats);
        
        const totalPoints = results.reduce((sum, r) => sum + r.points_earned, 0);
        setTotalXP(totalPoints);
      } catch (error) {
        console.error("Failed to fetch game stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameStats();
  }, []);

  const questions = [
    {
      question: "JavaScript-da 'let' va 'const' o'zgaruvchilari qachon e'lon qilinadi?",
      options: ["Funksiya ichida", "Blok ichida", "Global miqyosda", "Class ichida"],
      correct: 1,
    },
    {
      question: "Qaysi metod massiv oxiriga element qo'shadi?",
      options: ["unshift()", "push()", "pop()", "shift()"],
      correct: 1,
    },
    {
      question: "console.log(typeof null) nima qaytaradi?",
      options: ["'null'", "'undefined'", "'object'", "'number'"],
      correct: 2,
    },
    {
      question: "Promise nechta holatga ega?",
      options: ["1", "2", "3", "4"],
      correct: 2,
    },
    {
      question: "Spread operatori qanday yoziladi?",
      options: ["..arr", "*arr", "...arr", "&arr"],
      correct: 2,
    },
  ];

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === questions[currentQuestion].correct) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const finalScore = Math.round((score / questions.length) * 100);

  const totalGamesPlayed = Object.values(gameStats).reduce((sum, s) => sum + s.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            O&apos;yinlar va Testlar
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
            XP ballar yig&apos;ing va reytingda ko&apos;tariling
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3.5 py-2">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              0 kun streak
            </span>
          </div>
          <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl px-3.5 py-2">
            <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
              {totalXP} XP
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white/80" />
                <span className="text-sm font-semibold text-white/80">Bugungi Test</span>
              </div>
              {mockDailyQuiz.streakBonus && (
                <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                  <Flame className="w-3 h-3" /> +20 streak bonus
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black">{mockDailyQuiz.title}</h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {mockDailyQuiz.questions} ta savol • {mockDailyQuiz.duration}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-bold text-amber-200">
                    +{mockDailyQuiz.xpReward} XP
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowQuiz(true)}
                className="px-5 py-2.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                Boshlash
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                XP O&apos;yinlari
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {mockGames.map((game) => {
                const Icon = game.icon;
                const colors = colorMap[game.color];
                const gameStat = gameStats[game.name];
                return (
                  <div
                    key={game.id}
                    className={`relative rounded-xl p-4 border transition-all ${
                      game.unlocked
                        ? `${colors.border} hover:shadow-md cursor-pointer`
                        : "border-slate-200 dark:border-slate-800 opacity-60"
                    }`}
                  >
                    {!game.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 rounded-xl">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${game.lightBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {game.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {game.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          +{game.xp} XP
                        </span>
                      </div>
                      {game.unlocked ? (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {gameStat?.count || 0} marta o&apos;ynalgan
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-500 font-semibold">
                          {game.unlockReq}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">
              Haftalik Maqsad
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">XP yig&apos;ish</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {totalXP}/2500
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" style={{ width: `${Math.min((totalXP / 2500) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Testlar</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {totalGamesPlayed}/7
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${Math.min((totalGamesPlayed / 7) * 100, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">O&apos;yinlar</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {Object.keys(gameStats).length}/5
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${Math.min((Object.keys(gameStats).length / 5) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Haftalik mukofot: 500 XP bonus!
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-black text-slate-900 dark:text-white text-sm mb-4">
              Statistika
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-violet-600 dark:text-violet-400">{totalGamesPlayed}</p>
                <p className="text-[10px] text-slate-400">Jami o&apos;yinlar</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                  {totalGamesPlayed > 0 ? Math.round(totalXP / totalGamesPlayed) : 0}%
                </p>
                <p className="text-[10px] text-slate-400">O&apos;rtacha natija</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-amber-600 dark:text-amber-400">{totalXP}</p>
                <p className="text-[10px] text-slate-400">Jami XP</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">0</p>
                <p className="text-[10px] text-slate-400">Eng uzun streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {!quizStarted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  {mockDailyQuiz.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {mockDailyQuiz.questions} ta savol • {mockDailyQuiz.duration} • +{mockDailyQuiz.xpReward} XP
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors"
                  >
                    Boshlash
                  </button>
                </div>
              </div>
            ) : finalScore !== null ? (
              <div className="p-8 text-center">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  finalScore >= 80 ? "bg-blue-100 dark:bg-blue-500/20" : "bg-amber-100 dark:bg-amber-500/20"
                }`}>
                  {finalScore >= 80 ? (
                    <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Star className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  {finalScore >= 80 ? "Ajoyib natija!" : finalScore >= 60 ? "Yaxshi!" : "Keyingi safar yaxshiroq!"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Siz {score}/{questions.length} savolga to&apos;g&apos;ri javob berdingiz
                </p>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                  {finalScore}%
                </div>
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-6">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">+{Math.round(mockDailyQuiz.xpReward * (finalScore / 100))} XP</span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors"
                >
                  Yopish
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      Savol {currentQuestion + 1}/{questions.length}
                    </span>
                    <div className="flex gap-1">
                      {questions.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            idx === currentQuestion
                              ? "bg-blue-500"
                              : idx < currentQuestion
                              ? "bg-blue-300 dark:bg-blue-600"
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span>05:00</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                    {questions[currentQuestion].question}
                  </h3>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => {
                      const isCorrect = idx === questions[currentQuestion].correct;
                      const isSelected = idx === selectedAnswer;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(idx)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                            !selectedAnswer
                              ? "border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                              : isCorrect
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                              : isSelected
                              ? "border-red-500 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                              : "border-slate-200 dark:border-slate-700 opacity-50 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              !selectedAnswer
                                ? "bg-slate-100 dark:bg-slate-800"
                                : isCorrect
                                ? "bg-blue-500 text-white"
                                : isSelected
                                ? "bg-red-500 text-white"
                                : "bg-slate-100 dark:bg-slate-800"
                            }`}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            {option}
                            {showResult && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswer !== null && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors"
                      >
                        {currentQuestion < questions.length - 1 ? "Keyingi savol" : "Yakunlash"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
