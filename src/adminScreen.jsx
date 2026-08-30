import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { Clock, LogOut, AlertCircle, Trophy, User, Hash, Award, Timer, TrendingUp, Users, Activity, Plus, Eye, EyeOff, Lock, BarChart3, Target, Edit2, Save, X, Filter, ShieldCheck, Search, Mail } from 'lucide-react';
import logoImg from './assets/logo.png';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgRjWAKzU7dUcS6Jvn7-ED40r8Dku-9ck",
    authDomain: "screenshot-4e308.firebaseapp.com",
    projectId: "screenshot-4e308",
    storageBucket: "screenshot-4e308.firebasestorage.app",
    messagingSenderId: "175001208352",
    appId: "1:175001208352:web:cdf7cc55915019a3065e45",
    measurementId: "G-HYKNC26986"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Login Component with Hardcoded Credentials (Email: admin@admin.com / Password: helix@rvs@9234@aman)
const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = password.trim();

        if (cleanEmail === 'admin@admin.com' && cleanPass === 'helix@rvs@9234@aman') {
            const adminData = {
                email: 'admin@admin.com',
                displayName: 'Helix Super Admin',
                role: 'administrator',
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('helix_admin_user', JSON.stringify(adminData));
            onLogin(adminData);
        } else {
            setError('Invalid Admin Email or Password! Access Denied.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
            {/* Ambient Background Gradient Blurs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-sky-200/50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Left Organic Fluid Blob */}
            <div className="absolute -left-16 sm:-left-8 top-1/4 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none select-none z-0 opacity-85">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-sky-300 fill-current">
                    <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,42.2C64.8,55.3,53.8,66.9,40.4,74.1C27.1,81.3,13.5,84.1,-0.5,85C-14.6,85.8,-29.1,84.7,-42.2,78.2C-55.3,71.8,-66.9,60,-74.8,46.1C-82.7,32.2,-86.8,16.1,-86.3,0.3C-85.8,-15.6,-80.6,-31.1,-71.9,-43.8C-63.1,-56.4,-50.7,-66.1,-37.2,-73.6C-23.7,-81,-11.8,-86.1,1.7,-89C15.3,-92,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* Right Organic Fluid Blob */}
            <div className="absolute -right-16 sm:-right-8 top-1/3 w-80 sm:w-112 h-80 sm:h-112 pointer-events-none select-none z-0 opacity-85">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-300/80 fill-current">
                    <path d="M47.7,-79.8C61.4,-73.4,71.9,-59.9,78.4,-44.8C84.8,-29.7,87.2,-14.8,85.4,0.1C83.5,14.9,77.4,29.8,69.5,43.2C61.7,56.5,52.1,68.3,39.6,75.7C27.1,83.1,11.7,86.1,-3.8,92.7C-19.3,99.3,-34.9,109.5,-47.9,104.9C-60.9,100.3,-71.4,80.9,-78.9,64.2C-86.4,47.5,-90.9,33.5,-91.9,19.2C-92.9,4.9,-90.4,-9.7,-84.9,-23.4C-79.3,-37.1,-70.7,-49.9,-59,-57.2C-47.3,-64.5,-32.5,-66.3,-18.4,-72.1C-4.3,-77.9,9,-87.7,24,-89.8C38.9,-91.9,55.5,-86.3,47.7,-79.8Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* Floating Geometric Elements */}
            <div className="absolute top-12 left-1/2 -translate-x-12 w-20 h-20 rounded-full border-2 border-sky-300/40 pointer-events-none"></div>
            <div className="absolute top-20 right-1/4 w-3.5 h-3.5 rounded-full bg-purple-500/70 pointer-events-none"></div>
            <div className="absolute top-24 left-12 sm:left-28 w-8 h-8 bg-sky-300/50 rotate-12 rounded-lg pointer-events-none"></div>
            <div className="absolute bottom-28 right-16 sm:right-36 w-6 h-6 bg-purple-400/40 rotate-45 rounded-sm pointer-events-none"></div>

            <div className="w-full h-2"></div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.08)] border border-slate-100 p-8 sm:p-10 relative z-10 my-auto text-center">
                {/* Helix Logo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={logoImg}
                        alt="Helix Logo"
                        className="w-18 h-18 sm:w-20 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Title */}
                <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1 mb-1">
                    Helix Club Quiz
                </h1>
                <p className="text-xs font-semibold tracking-widest text-purple-600 uppercase mb-6">
                    Admin Management Portal
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Admin Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@admin.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4169e2] focus:bg-white shadow-2xs transition-all"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4169e2] focus:bg-white shadow-2xs transition-all"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#4169e2] hover:bg-[#3557c5] active:scale-[0.99] text-white rounded-2xl px-6 py-3.5 font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Authenticating...' : 'Sign In as Administrator →'}
                    </button>
                </form>

                <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-600 text-center font-medium flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#4169e2] shrink-0" />
                        Restricted Access • Administrator Only
                    </p>
                </div>
            </div>

            {/* Bottom Footer - Made by ZECTRAL */}
            <div className="relative z-10 py-4 text-center">
                <p className="text-sm font-medium text-slate-500">
                    made by{' '}
                    <a
                        href="https://zectral.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#4169e2] hover:text-[#3557c5] underline decoration-blue-300 underline-offset-4 hover:decoration-blue-500 transition-colors"
                    >
                        ZECTRAL
                    </a>
                </p>
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

// Create Quiz Tab
const CreateQuizTab = ({ onQuizCreated, adminUser }) => {
    const [quizName, setQuizName] = useState('');
    const [duration, setDuration] = useState('');
    const [marksPerQuestion, setMarksPerQuestion] = useState('4');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const addQuestion = () => {
        if (!currentQuestion.trim() || options.some(o => !o.trim())) {
            alert('Please fill all fields');
            return;
        }

        if (editingIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = {
                question: currentQuestion,
                options: [...options],
                correctAnswer
            };
            setQuestions(updatedQuestions);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, {
                question: currentQuestion,
                options: [...options],
                correctAnswer
            }]);
        }

        setCurrentQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
    };

    const editQuestion = (index) => {
        const question = questions[index];
        setCurrentQuestion(question.question);
        setOptions([...question.options]);
        setCorrectAnswer(question.correctAnswer);
        setEditingIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setCurrentQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setEditingIndex(null);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, idx) => idx !== index));
        if (editingIndex === index) {
            cancelEdit();
        }
    };

    const createQuiz = async () => {
        const marks = parseInt(marksPerQuestion) || 1;
        if (!quizName.trim() || !duration || !marksPerQuestion || questions.length === 0) {
            alert('Please complete all details (including marks per question) and add at least one question');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'quizzes'), {
                name: quizName,
                duration: parseInt(duration),
                marksPerQuestion: marks,
                questions,
                createdAt: serverTimestamp(),
                createdBy: adminUser.email
            });

            alert('✅ Quiz created successfully!');
            setQuizName('');
            setDuration('');
            setMarksPerQuestion('4');
            setQuestions([]);
            onQuizCreated();
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert('Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-purple-600" />
                    Create New Quiz
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quiz Name *
                        </label>
                        <input
                            type="text"
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g: Mathematics Chapter 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="30"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Marks per Question *
                        </label>
                        <input
                            type="number"
                            value={marksPerQuestion}
                            onChange={(e) => setMarksPerQuestion(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="4"
                            min="1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Marks for correct answer (No negative marking)</p>
                    </div>
                </div>

                <div className="border-t-2 border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-indigo-600" />
                            {editingIndex !== null ? 'Edit Question' : 'Add Questions'}
                        </h3>
                        {editingIndex !== null && (
                            <button
                                onClick={cancelEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {editingIndex !== null && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">
                                Editing Question #{editingIndex + 1}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Question *
                            </label>
                            <textarea
                                value={currentQuestion}
                                onChange={(e) => setCurrentQuestion(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter your question here..."
                                rows="3"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {options.map((option, idx) => (
                                <div key={idx} className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Option {idx + 1} *
                                        {idx === correctAnswer && (
                                            <span className="ml-2 text-green-600 text-xs">✓ Correct Answer</span>
                                        )}
                                    </label>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[idx] = e.target.value;
                                            setOptions(newOptions);
                                        }}
                                        className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${idx === correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-300'
                                            }`}
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setCorrectAnswer(idx)}
                                        className={`mt-2 text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${idx === correctAnswer
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {idx === correctAnswer ? '✓ Correct Answer' : 'Mark as Correct'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addQuestion}
                            className={`w-full ${editingIndex !== null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2`}
                        >
                            {editingIndex !== null ? (
                                <>
                                    <Save className="w-5 h-5" />
                                    Update Question
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Add Question
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {questions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Added Questions: {questions.length} • Total Marks: {questions.length * (parseInt(marksPerQuestion) || 1)} (+{parseInt(marksPerQuestion) || 1} each)
                    </h3>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {questions.map((q, idx) => (
                            <div
                                key={idx}
                                className={`border-2 rounded-lg p-4 transition-colors ${editingIndex === idx
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 mb-2">
                                            {idx + 1}. {q.question}
                                        </p>
                                        <div className="space-y-1">
                                            {q.options.map((opt, optIdx) => (
                                                <p key={optIdx} className={`text-sm ${optIdx === q.correctAnswer ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                                    {optIdx === q.correctAnswer && ' ✓'}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editQuestion(idx)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                            title="Edit Question"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => removeQuestion(idx)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remove Question"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={createQuiz}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg px-6 py-4 font-bold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    >
                        {loading ? '⏳ Creating...' : '✅ Create Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

// Activity Logs Tab (Full Search by Name, Email, Roll No, Quiz ID & Action)
const ActivityLogsTab = ({ logs }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    // Filter logs by student name, email, roll number, quiz id, or action
    const filteredLogs = logs.filter(log => {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = !query || (
            log.userName?.toLowerCase().includes(query) ||
            log.userEmail?.toLowerCase().includes(query) ||
            log.email?.toLowerCase().includes(query) ||
            log.rollNumber?.toLowerCase().includes(query) ||
            log.quizId?.toLowerCase().includes(query) ||
            log.action?.toLowerCase().includes(query)
        );

        const matchesAction = actionFilter === 'all' || log.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const uniqueActions = Array.from(new Set(logs.map(l => l.action).filter(Boolean)));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            {/* Header with Live Indicator & Counts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            Real-time Activity & Anti-Cheat Logs
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Showing {filteredLogs.length} of {logs.length} total logs (All records loaded)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl self-start sm:self-auto shadow-2xs">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Live Monitoring Active</span>
                </div>
            </div>

            {/* Search and Action Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by student name, roll number, email, or quiz ID..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4169e2] focus:bg-white shadow-2xs transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Action Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4169e2] focus:bg-white shadow-2xs cursor-pointer"
                    >
                        <option value="all">All Violations ({logs.length})</option>
                        {uniqueActions.map((action, i) => (
                            <option key={i} value={action}>{action}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Logs List Area */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {logs.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-base font-bold text-slate-700">No Activity Logs Found</p>
                        <p className="text-xs text-slate-400 mt-1">No suspicious activity or violation logs have been recorded yet.</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-14 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-bold text-slate-700">No matching logs found</p>
                        <p className="text-xs text-slate-400 mt-1">Try searching with a different student name, roll number, email, or reset filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActionFilter('all'); }}
                            className="mt-3 px-4 py-1.5 bg-[#4169e2] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            Reset Search
                        </button>
                    </div>
                ) : (
                    filteredLogs.map((log) => {
                        const dateObj = log.timestamp?.toDate ? log.timestamp.toDate() : (log.timestamp ? new Date(log.timestamp) : null);
                        const timeStr = dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now';
                        const dateStr = dateObj ? dateObj.toLocaleDateString() : '';

                        return (
                            <div
                                key={log.id}
                                className="border border-red-200/80 bg-red-50/50 hover:bg-red-50 p-4 rounded-2xl transition-all duration-200 shadow-2xs"
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5 shadow-2xs">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-extrabold text-sm text-slate-900">
                                                    {log.userName || 'Anonymous Student'}
                                                </span>
                                                <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 font-mono text-xs font-bold rounded-lg">
                                                    {log.rollNumber || 'No Roll'}
                                                </span>
                                                {(log.userEmail || log.email) && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        {log.userEmail || log.email}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                                                    {timeStr}
                                                </span>
                                                {dateStr && (
                                                    <span className="text-[10px] text-slate-400 block sm:inline sm:ml-2">
                                                        {dateStr}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold border border-red-200/80">
                                                ⚠️ {log.action}
                                            </span>
                                            {log.quizId && (
                                                <span className="px-2.5 py-1 bg-white text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                                                    Quiz ID: {log.quizId}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Results & Leaderboard Tab - UPDATED VERSION
const ResultsTab = ({ submissions, quizzes }) => {
    const [selectedQuiz, setSelectedQuiz] = useState('all');

    const filteredSubmissions = selectedQuiz === 'all'
        ? submissions
        : submissions.filter(sub => sub.quizId === selectedQuiz);

    const getLeaderboard = () => {
        const leaderboard = {};
        filteredSubmissions.forEach(sub => {
            const key = `${sub.userName}_${sub.rollNumber}`;
            if (!leaderboard[key] || leaderboard[key].score < sub.score) {
                leaderboard[key] = sub;
            }
        });
        return Object.values(leaderboard).sort((a, b) => b.score - a.score);
    };

    const leaderboard = getLeaderboard();
    const averageScore = filteredSubmissions.length > 0
        ? (filteredSubmissions.reduce((sum, sub) => sum + sub.score, 0) / filteredSubmissions.length).toFixed(1)
        : 0;

    const selectedQuizName = selectedQuiz === 'all'
        ? 'All Quizzes'
        : quizzes.find(q => q.id === selectedQuiz)?.name || 'Unknown Quiz';

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                        Leaderboard & Results
                    </h2>
                    <div className="flex items-center gap-3">
                        <Filter className="w-5 h-5 text-gray-600" />
                        <select
                            value={selectedQuiz}
                            onChange={(e) => setSelectedQuiz(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white font-medium"
                        >
                            <option value="all">📊 All Quizzes</option>
                            {quizzes.map(quiz => (
                                <option key={quiz.id} value={quiz.id}>📝 {quiz.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Selected Quiz Info Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">
                            Viewing Results for: <span className="text-purple-700">{selectedQuizName}</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <StatsCard
                        icon={Users}
                        title="Total Submissions"
                        value={filteredSubmissions.length}
                        color="bg-blue-600"
                    />
                    <StatsCard
                        icon={Target}
                        title="Average Score"
                        value={averageScore}
                        color="bg-green-600"
                    />
                    <StatsCard
                        icon={Trophy}
                        title="Top Score"
                        value={leaderboard[0]?.score || 0}
                        color="bg-yellow-600"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">Rank</th>
                                <th className="px-6 py-4 text-left font-semibold">Name</th>
                                <th className="px-6 py-4 text-left font-semibold">Roll Number</th>
                                {selectedQuiz === 'all' && (
                                    <th className="px-6 py-4 text-left font-semibold">Quiz</th>
                                )}
                                <th className="px-6 py-4 text-left font-semibold">Score</th>
                                <th className="px-6 py-4 text-left font-semibold">Percentage</th>
                                <th className="px-6 py-4 text-left font-semibold">Submitted At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={selectedQuiz === 'all' ? '7' : '6'} className="px-6 py-12 text-center text-gray-500">
                                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="font-semibold">No submissions yet for this quiz</p>
                                        <p className="text-sm mt-2">Results will appear here once students submit their answers</p>
                                    </td>
                                </tr>
                            ) : (
                                leaderboard.map((sub, idx) => {
                                    const maxMarks = sub.totalMarks || (sub.marksPerQuestion ? sub.totalQuestions * sub.marksPerQuestion : sub.totalQuestions * 4);
                                    const percentage = maxMarks > 0 ? ((sub.score / maxMarks) * 100).toFixed(1) : '0.0';
                                    return (
                                        <tr key={sub.id} className={`hover:bg-gray-50 ${idx < 3 ? 'bg-yellow-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {idx === 0 && <span className="text-2xl">🥇</span>}
                                                    {idx === 1 && <span className="text-2xl">🥈</span>}
                                                    {idx === 2 && <span className="text-2xl">🥉</span>}
                                                    <span className="font-bold text-gray-900">{idx + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">{sub.userName}</td>
                                            <td className="px-6 py-4 text-gray-700">{sub.rollNumber}</td>
                                            {selectedQuiz === 'all' && (
                                                <td className="px-6 py-4 text-gray-700">{sub.quizName}</td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold">
                                                    {sub.score} / {maxMarks}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${percentage >= 75 ? 'bg-green-600' : percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-semibold text-gray-900">{percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {sub.submittedAt?.toDate?.()?.toLocaleString() || 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* All Submissions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    All Submissions {selectedQuiz !== 'all' && `- ${selectedQuizName}`}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Student</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Roll No</th>
                                {selectedQuiz === 'all' && (
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Quiz</th>
                                )}
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={selectedQuiz === 'all' ? '6' : '5'} className="px-4 py-12 text-center text-gray-500">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>No submissions found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubmissions.map((sub, idx) => {
                                    const maxMarks = sub.totalMarks || (sub.marksPerQuestion ? sub.totalQuestions * sub.marksPerQuestion : sub.totalQuestions * 4);
                                    return (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-600">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{sub.userName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{sub.rollNumber}</td>
                                            {selectedQuiz === 'all' && (
                                                <td className="px-4 py-3 text-sm text-gray-700">{sub.quizName}</td>
                                            )}
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-semibold text-indigo-600">
                                                    {sub.score}/{maxMarks}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
                                                {sub.submittedAt?.toDate?.()?.toLocaleString() || 'N/A'}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Main Admin Dashboard
const AdminDashboard = ({ adminUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState('create');
    const [activityLogs, setActivityLogs] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const logsQuery = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'));
            const logsSnapshot = await getDocs(logsQuery);
            const logsData = logsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setActivityLogs(logsData);

            const subsQuery = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
            const subsSnapshot = await getDocs(subsQuery);
            const subsData = subsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSubmissions(subsData);

            const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
            const quizzesData = quizzesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuizzes(quizzesData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const tabs = [
        { id: 'create', label: 'Create Quiz', icon: Plus },
        { id: 'results', label: 'Results & Leaderboard', icon: Trophy },
        { id: 'logs', label: 'Activity Logs', icon: Activity }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
            <div>
                <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img
                                    src={logoImg}
                                    alt="Helix Logo"
                                    className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs hover:scale-105 transition-transform duration-200"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-lg text-slate-900 leading-tight">Helix Club Quiz</span>
                                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 font-bold rounded-full">Admin Portal</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{adminUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-semibold text-green-700">Live Feed</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors text-sm font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <StatsCard
                            icon={Award}
                            title="Total Quizzes"
                            value={quizzes.length}
                            color="bg-purple-600"
                        />
                        <StatsCard
                            icon={Users}
                            title="Total Submissions"
                            value={submissions.length}
                            color="bg-blue-600"
                        />
                        <StatsCard
                            icon={Activity}
                            title="Suspicious Activities"
                            value={activityLogs.length}
                            color="bg-red-600"
                        />
                        <StatsCard
                            icon={Trophy}
                            title="Active Students"
                            value={new Set(submissions.map(s => s.userId)).size}
                            color="bg-green-600"
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                                ? 'border-purple-600 text-purple-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    <div>
                        {activeTab === 'create' && (
                            <CreateQuizTab onQuizCreated={loadData} adminUser={adminUser} />
                        )}
                        {activeTab === 'results' && (
                            <ResultsTab submissions={submissions} quizzes={quizzes} />
                        )}
                        {activeTab === 'logs' && (
                            <ActivityLogsTab logs={activityLogs} />
                        )}
                    </div>
                </div>
            </div>

            <footer className="py-6 text-center text-sm font-medium text-slate-500 border-t border-slate-200 mt-12 bg-white">
                made by{' '}
                <a
                    href="https://zectral.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sky-600 hover:text-sky-700 underline decoration-sky-300 underline-offset-4 hover:decoration-sky-500 transition-colors"
                >
                    ZECTRAL
                </a>
            </footer>
        </div>
    );
};

// Main App Component
export default function AdminApp() {
    const [admin, setAdmin] = useState(() => {
        const saved = localStorage.getItem('helix_admin_user');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return null;
            }
        }
        return null;
    });

    const handleLogout = () => {
        localStorage.removeItem('helix_admin_user');
        setAdmin(null);
    };

    if (!admin) {
        return <AdminLogin onLogin={setAdmin} />;
    }

    return <AdminDashboard adminUser={admin} onLogout={handleLogout} />;
}