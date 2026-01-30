import { Link } from "react-router-dom";
import {
  BrainCircuit,
  FileText,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import Button from "../../components/common/Button";
import PageTransition from "../../components/common/PageTransition";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const LandingPage = () => {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to Sign Out?");
    if (!confirmLogout) return;
    logout();
  };

  return (
    <PageTransition>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 scroll-smooth">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur ">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <span className="font-bold text-lg">Learna AI</span>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#home" className="hover:text-indigo-600">
                Home
              </a>
              <a href="#about" className="hover:text-indigo-600">
                About
              </a>
              <a href="#features" className="hover:text-indigo-600">
                Features
              </a>
              <a href="#how" className="hover:text-indigo-600">
                How it works
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Sign Out
                </Button>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600 text-white "
                >
                  Sign In
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {open && (
            <div className="md:hidden bg-white dark:bg-slate-900 border-t px-4 py-4 space-y-4">
              <a href="#home" onClick={() => setOpen(false)} className="block">
                Home
              </a>
              <a href="#about" onClick={() => setOpen(false)} className="block">
                About
              </a>
              <a
                href="#features"
                onClick={() => setOpen(false)}
                className="block"
              >
                Features
              </a>
              <a href="#how" onClick={() => setOpen(false)} className="block">
                How it works
              </a>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="block w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </header>

        {/* HERO */}
        <section
          id="home"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-26 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
        >
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4">
              <Sparkles size={14} />
              AI-Powered Learning Platform
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Turn Documents into <br />
              <span className="text-indigo-600">Smart Learning</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300">
              Upload PDFs, generate AI quizzes and flashcards, track progress,
              and master concepts faster.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Dashboard <ArrowRight size={18} />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold"
                >
                  Get Started <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="relative">
            <div className="absolute -inset-6 bg-linear-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl rounded-3xl" />
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 space-y-4">
              <PreviewItem icon={<FileText />} title="Upload PDFs" />
              <PreviewItem
                icon={<BrainCircuit />}
                title="AI-Generated Quizzes"
              />
              <PreviewItem icon={<BookOpen />} title="Flashcards & Revisions" />
              <PreviewItem icon={<Trophy />} title="Progress Analytics" />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white dark:bg-slate-800 py-20">
          {" "}
          <div className="max-w-5xl mx-auto px-6 text-center">
            {" "}
            <h2 className="text-3xl font-bold mb-4">
              Why AI Learning Assistant?
            </h2>{" "}
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              {" "}
              Traditional studying is passive. Our platform uses AI and active
              recall techniques to help learners understand, remember, and apply
              concepts efficiently.{" "}
            </p>{" "}
          </div>{" "}
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BrainCircuit />}
              title="AI Intelligence"
              desc="Smart quiz generation"
            />
            <FeatureCard
              icon={<BookOpen />}
              title="Active Recall"
              desc="Flashcards & practice"
            />
            <FeatureCard
              icon={<Trophy />}
              title="Progress Tracking"
              desc="Streaks & analytics"
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-slate-100 dark:bg-slate-800 py-16 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            How it works
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <Step number="1" title="Upload" desc="Upload study material" />
            <Step number="2" title="Practice" desc="AI quizzes & flashcards" />
            <Step number="3" title="Improve" desc="Track mastery" />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to learn smarter?</h2>
          <p className="text-slate-300 mb-8">
            Join now and transform the way you study.
          </p>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold transition"
            >
              Dashboard
              <ArrowRight size={18} />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold transition"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} AI Learning Assistant. All rights
          reserved.
        </footer>
      </div>
    </PageTransition>
  );
};

/* Components */

const PreviewItem = ({ icon, title }) => (
  <div
    className="
    flex items-center gap-4 p-4
    rounded-xl
    bg-slate-50 dark:bg-slate-700
    border border-transparent
    hover:border-slate-200 dark:hover:border-slate-600
    hover:bg-slate-100 dark:hover:bg-slate-600
    transition-all duration-300 ease-out
  "
  >
    <div className="text-indigo-600">{icon}</div>
    <p className="font-semibold">{title}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 rounded-xl bg-white dark:bg-slate-700 shadow text-center">
    <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600">
      {icon}
    </div>
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div>
    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
      {number}
    </div>
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
  </div>
);

export default LandingPage;
