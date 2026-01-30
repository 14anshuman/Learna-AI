import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";
import PageTransition from "../../components/common/PageTransition";
import { motion } from "framer-motion";

/* Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        setDashboardData(data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={48} />
      </div>
    );
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-xl shadow-md">
          <div className="bg-indigo-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-700" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            No dashboard data available.
          </p>
        </div>
      </div>
    );
  }

  const { overview, recentActivity } = dashboardData;

  const stats = [
    {
      label: "Total Documents",
      value: overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
    },
    {
      label: "Total Flashcards",
      value: overview.totalFlashcards,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
    },
    {
      label: "Total Quizzes",
      value: overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Track your learning progress at a glance
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map(({ label, value, icon: Icon, gradient }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="relative bg-white rounded-xl p-6 shadow hover:shadow-lg"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-10`}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Study Streak */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-xl p-6 shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-indigo-600" />
              <h3 className="font-semibold text-gray-800">Study Streak</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              {overview.studyStreak} days
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Keep learning daily to grow your streak
            </p>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 bg-white rounded-xl p-6 shadow"
          >
            <h3 className="font-semibold text-gray-800 mb-4">
              Recent Activity
            </h3>

            <div className="space-y-3">
              {recentActivity.documents?.length === 0 &&
                recentActivity.quizzes?.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No recent activity yet.
                  </p>
                )}

              {recentActivity.documents?.map((doc) => (
                <motion.div
                  key={doc._id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-blue-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {doc.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last accessed:{" "}
                        {new Date(doc.lastAccessed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {recentActivity.quizzes?.map((quiz) => (
                <motion.div
                  key={quiz._id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="text-emerald-500" size={18} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {quiz.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Score: {quiz.score}/{quiz.totalQuestions}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
