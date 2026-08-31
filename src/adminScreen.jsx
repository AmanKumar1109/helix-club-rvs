import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, setDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { Clock, LogOut, AlertCircle, Trophy, User, Hash, Award, Timer, TrendingUp, Users, Activity, Plus, Eye, EyeOff, Lock, BarChart3, Target, Edit2, Save, X, Filter, ShieldCheck, Search, Mail, FileText, Code, Copy, Check, Sparkles, HelpCircle, BookOpen, Trash2, PlayCircle, CheckCircle2, Edit3, Layers, RefreshCw, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
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

// Admin Login Component with Hardcoded Credentials (GSAP Animated)
const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const adminCardRef = useRef(null);

    useEffect(() => {
        if (adminCardRef.current) {
            gsap.fromTo(
                adminCardRef.current.children,
                { opacity: 0, y: 22, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
            );
        }
        gsap.to('.gsap-ambient-glow', {
            y: '-=15',
            scale: 1.05,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = password.trim();

        if (cleanEmail === 'admin@admin.com' && cleanPass === 'helix@rvs@9234@aman') {
            try {
                await signInWithEmailAndPassword(auth, cleanEmail, 'HelixAdminPassword123!');
            } catch (authErr) {
                if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
                    try {
                        await createUserWithEmailAndPassword(auth, cleanEmail, 'HelixAdminPassword123!');
                    } catch (createErr) {
                        console.error("Firebase auth creation error:", createErr);
                    }
                }
            }
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
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans select-none text-slate-100">
            {/* Ambient Background Gradient Blurs (Dark Glow) */}
            <div className="gsap-ambient-glow absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="gsap-ambient-glow absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Left Organic Fluid Blob */}
            <div className="absolute -left-16 sm:-left-8 top-1/4 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none select-none z-0 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500 fill-current">
                    <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,42.2C64.8,55.3,53.8,66.9,40.4,74.1C27.1,81.3,13.5,84.1,-0.5,85C-14.6,85.8,-29.1,84.7,-42.2,78.2C-55.3,71.8,-66.9,60,-74.8,46.1C-82.7,32.2,-86.8,16.1,-86.3,0.3C-85.8,-15.6,-80.6,-31.1,-71.9,-43.8C-63.1,-56.4,-50.7,-66.1,-37.2,-73.6C-23.7,-81,-11.8,-86.1,1.7,-89C15.3,-92,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* Right Organic Fluid Blob */}
            <div className="absolute -right-16 sm:-right-8 top-1/3 w-80 sm:w-112 h-80 sm:h-112 pointer-events-none select-none z-0 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-500 fill-current">
                    <path d="M47.7,-79.8C61.4,-73.4,71.9,-59.9,78.4,-44.8C84.8,-29.7,87.2,-14.8,85.4,0.1C83.5,14.9,77.4,29.8,69.5,43.2C61.7,56.5,52.1,68.3,39.6,75.7C27.1,83.1,11.7,86.1,-3.8,92.7C-19.3,99.3,-34.9,109.5,-47.9,104.9C-60.9,100.3,-71.4,80.9,-78.9,64.2C-86.4,47.5,-90.9,33.5,-91.9,19.2C-92.9,4.9,-90.4,-9.7,-84.9,-23.4C-79.3,-37.1,-70.7,-49.9,-59,-57.2C-47.3,-64.5,-32.5,-66.3,-18.4,-72.1C-4.3,-77.9,9,-87.7,24,-89.8C38.9,-91.9,55.5,-86.3,47.7,-79.8Z" transform="translate(100 100)" />
                </svg>
            </div>

            {/* Floating Geometric Elements */}
            <div className="absolute top-12 left-1/2 -translate-x-12 w-20 h-20 rounded-full border border-blue-500/20 pointer-events-none"></div>
            <div className="absolute top-20 right-1/4 w-3.5 h-3.5 rounded-full bg-indigo-500/50 pointer-events-none"></div>
            <div className="absolute top-24 left-12 sm:left-28 w-8 h-8 bg-blue-500/20 rotate-12 rounded-lg pointer-events-none"></div>
            <div className="absolute bottom-28 right-16 sm:right-36 w-6 h-6 bg-indigo-500/20 rotate-45 rounded-sm pointer-events-none"></div>

            <div className="w-full h-2"></div>

            <div ref={adminCardRef} className="w-full max-w-md bg-[#131b2e]/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 p-8 sm:p-10 relative z-10 my-auto text-center">
                {/* Helix Logo */}
                <div className="flex justify-center mb-4">
                    <img
                        src={logoImg}
                        alt="Helix Logo"
                        className="w-18 h-18 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_15px_rgba(65,105,226,0.3)] hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Title */}
                <h1 className="text-xl font-black text-white tracking-tight mt-1 mb-1">
                    Helix Club Quiz
                </h1>
                <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1.5">
                    Admin Management Portal
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mb-6">
                    <span>powered by</span>
                    <a
                        href="https://zectral.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#4169e2] hover:text-[#587ef0] underline decoration-blue-500/50 underline-offset-2 hover:decoration-blue-400 transition-colors"
                    >
                        ZECTRAL
                    </a>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs font-bold text-red-400 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                            Admin Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@admin.com"
                                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] shadow-2xs transition-all"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] shadow-2xs transition-all"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-[#4169e2] hover:bg-[#3557c5] active:scale-[0.99] text-white rounded-2xl px-6 py-3.5 font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Authenticating...' : 'Sign In as Administrator →'}
                    </button>
                </form>

                <div className="mt-6 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 text-center font-medium flex items-center justify-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                        Restricted Access • Administrator Only
                    </p>
                </div>
            </div>

            {/* Bottom spacer */}
            <div className="w-full h-2"></div>
        </div>
    );
};

// Stats Card Component (Dark Theme)
const StatsCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            {trend && (
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl sm:text-3xl font-black text-white">{value}</p>
    </div>
);

// Create Quiz Tab
// Markdown Quiz Parser Utility
export const parseMarkdownQuestions = (markdownText) => {
    if (!markdownText || typeof markdownText !== 'string') return [];

    const lines = markdownText.split(/\r?\n/);
    const parsedQuestions = [];

    let currentQ = null;
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines = [];

    const saveCurrentQuestion = () => {
        if (!currentQ) return;
        const title = currentQ.questionLines.join('\n').trim();
        if (title && currentQ.options.length >= 2) {
            let correctIndex = 0;
            if (currentQ.rawAnswer) {
                const ansRaw = currentQ.rawAnswer.trim();
                const ansUpper = ansRaw.toUpperCase();
                const letterMatch = ansUpper.match(/\b([A-Z])\b/);
                if (letterMatch) {
                    const charCode = letterMatch[1].charCodeAt(0) - 65;
                    if (charCode >= 0 && charCode < currentQ.options.length) {
                        correctIndex = charCode;
                    }
                } else if (/^\d+$/.test(ansRaw)) {
                    const numIdx = parseInt(ansRaw, 10) - 1;
                    if (numIdx >= 0 && numIdx < currentQ.options.length) {
                        correctIndex = numIdx;
                    }
                } else {
                    const textIdx = currentQ.options.findIndex(opt =>
                        opt.toLowerCase().trim() === ansRaw.toLowerCase()
                    );
                    if (textIdx !== -1) correctIndex = textIdx;
                }
            }

            parsedQuestions.push({
                question: title,
                codeSnippet: currentQ.codeSnippet ? currentQ.codeSnippet.trim() : '',
                codeLanguage: currentQ.codeLanguage || 'javascript',
                options: currentQ.options,
                correctAnswer: correctIndex
            });
        }
        currentQ = null;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Code block start / end fence ```
        if (line.trim().startsWith('```')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                const lang = line.trim().slice(3).trim();
                codeLanguage = lang || 'javascript';
                codeLines = [];
            } else {
                inCodeBlock = false;
                if (currentQ) {
                    currentQ.codeSnippet = codeLines.join('\n');
                    currentQ.codeLanguage = codeLanguage;
                }
                codeLines = [];
            }
            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        const trimmed = line.trim();
        if (!trimmed) continue;

        // Detect answer line
        const isAnswerLine = /^(Answer|Correct\s*Answer|Correct)[:\=]\s*/i.test(trimmed);
        if (isAnswerLine && currentQ) {
            currentQ.rawAnswer = trimmed.replace(/^(Answer|Correct\s*Answer|Correct)[:\=]\s*/i, '');
            continue;
        }

        // Detect option line
        const isOptionLine = /^([-*+]\s*)?([A-D1-4])[\.\)\:-]\s+/i.test(trimmed);
        if (isOptionLine) {
            if (!currentQ) {
                currentQ = { questionLines: [], options: [], rawAnswer: '', codeSnippet: '', codeLanguage: 'javascript' };
            }
            const optionText = trimmed.replace(/^([-*+]\s*)?([A-D1-4])[\.\)\:-]\s+/i, '').trim();
            if (optionText) {
                currentQ.options.push(optionText);
            }
            continue;
        }

        // Detect question header / number
        const isHeaderQuestion = /^#{1,6}\s*(Question\s*\d*|Q\d*|\d+[\.:])?/i.test(trimmed);
        const isNumberedQuestion = /^(Question\s*\d*[:\.]?|Q\d*[:\.]?|\d+[\.:])\s+/i.test(trimmed);

        if ((isHeaderQuestion || isNumberedQuestion) && currentQ && (currentQ.options.length > 0 || currentQ.questionLines.length > 0)) {
            saveCurrentQuestion();
        }

        if (!currentQ) {
            currentQ = { questionLines: [], options: [], rawAnswer: '', codeSnippet: '', codeLanguage: 'javascript' };
        }

        let cleanLine = trimmed;
        if (isHeaderQuestion) {
            cleanLine = cleanLine.replace(/^#{1,6}\s*/, '');
            cleanLine = cleanLine.replace(/^(Question\s*\d*[:\.]?|Q\d*[:\.]?|\d+[\.:])\s*/i, '');
        } else if (isNumberedQuestion) {
            cleanLine = cleanLine.replace(/^(Question\s*\d*[:\.]?|Q\d*[:\.]?|\d+[\.:])\s*/i, '');
        }

        if (cleanLine) {
            currentQ.questionLines.push(cleanLine);
        }
    }

    if (currentQ) {
        saveCurrentQuestion();
    }

    return parsedQuestions;
};

const SAMPLE_MARKDOWN_TEMPLATE = `### Question 1: What will be the output of the following JavaScript code snippet?
\`\`\`javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled);
\`\`\`
- A) [1, 2, 3, 4]
- B) [2, 4, 6, 8]
- C) 20
- D) undefined
Answer: B

### Question 2: Which keyword in JavaScript creates a block-scoped constant?
- A) var
- B) let
- C) const
- D) define
Answer: C

### Question 3: What is the output of this Python code snippet?
\`\`\`python
def check_even(num):
    return num % 2 == 0

print(check_even(7))
\`\`\`
- A) True
- B) False
- C) None
- D) Error
Answer: B`;

// Create Quiz Tab
const CreateQuizTab = ({ onQuizCreated, adminUser }) => {
    const [quizName, setQuizName] = useState('');
    const [duration, setDuration] = useState('');
    const [marksPerQuestion, setMarksPerQuestion] = useState('4');
    const [questions, setQuestions] = useState([]);
    
    // Creation mode: 'single' | 'markdown'
    const [creationMode, setCreationMode] = useState('single');
    
    // Single question state
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [showCodeBlock, setShowCodeBlock] = useState(false);
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [editingIndex, setEditingIndex] = useState(null);

    // Markdown import state
    const [markdownInput, setMarkdownInput] = useState('');
    const [parsedPreview, setParsedPreview] = useState([]);
    const [copiedTemplate, setCopiedTemplate] = useState(false);
    const [showSampleTemplate, setShowSampleTemplate] = useState(false);
    const [loading, setLoading] = useState(false);

    // Parse markdown automatically as admin types/pastes
    useEffect(() => {
        if (markdownInput.trim()) {
            const parsed = parseMarkdownQuestions(markdownInput);
            setParsedPreview(parsed);
        } else {
            setParsedPreview([]);
        }
    }, [markdownInput]);

    const handleCopyTemplate = () => {
        navigator.clipboard.writeText(SAMPLE_MARKDOWN_TEMPLATE);
        setCopiedTemplate(true);
        setTimeout(() => setCopiedTemplate(false), 2500);
    };

    const handleAppendMarkdownQuestions = () => {
        if (parsedPreview.length === 0) {
            alert('No valid questions parsed from Markdown. Please check your format.');
            return;
        }
        setQuestions([...questions, ...parsedPreview]);
        setMarkdownInput('');
        setParsedPreview([]);
        alert(`✅ Successfully added ${parsedPreview.length} questions from Markdown!`);
    };

    const handleReplaceWithMarkdownQuestions = () => {
        if (parsedPreview.length === 0) {
            alert('No valid questions parsed from Markdown. Please check your format.');
            return;
        }
        setQuestions([...parsedPreview]);
        setMarkdownInput('');
        setParsedPreview([]);
        alert(`✅ Quiz questions replaced with ${parsedPreview.length} questions from Markdown!`);
    };

    const addQuestion = () => {
        if (!currentQuestion.trim() || options.some(o => !o.trim())) {
            alert('Please fill all fields');
            return;
        }

        if (editingIndex !== null) {
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = {
                question: currentQuestion,
                codeSnippet: codeSnippet.trim(),
                codeLanguage,
                options: [...options],
                correctAnswer
            };
            setQuestions(updatedQuestions);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, {
                question: currentQuestion,
                codeSnippet: codeSnippet.trim(),
                codeLanguage,
                options: [...options],
                correctAnswer
            }]);
        }

        setCurrentQuestion('');
        setCodeSnippet('');
        setCodeLanguage('javascript');
        setShowCodeBlock(false);
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
    };

    const editQuestion = (index) => {
        const question = questions[index];
        setCurrentQuestion(question.question);
        setCodeSnippet(question.codeSnippet || '');
        setCodeLanguage(question.codeLanguage || 'javascript');
        setShowCodeBlock(!!(question.codeSnippet));
        setOptions([...question.options]);
        setCorrectAnswer(question.correctAnswer);
        setEditingIndex(index);
        setCreationMode('single');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setCurrentQuestion('');
        setCodeSnippet('');
        setCodeLanguage('javascript');
        setShowCodeBlock(false);
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
        <div className="space-y-6 text-slate-100">
            <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-6 h-6 text-[#4169e2]" />
                    Create New Quiz
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                            Quiz Name *
                        </label>
                        <input
                            type="text"
                            value={quizName}
                            onChange={(e) => setQuizName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] transition-all text-sm"
                            placeholder="e.g: Mathematics Chapter 1"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] transition-all text-sm"
                            placeholder="30"
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                            Marks per Question *
                        </label>
                        <input
                            type="number"
                            value={marksPerQuestion}
                            onChange={(e) => setMarksPerQuestion(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] transition-all text-sm"
                            placeholder="4"
                            min="1"
                        />
                        <p className="text-xs text-slate-400 mt-1">Marks for correct answer (No negative marking)</p>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                    {/* Creation Mode Toggle Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 self-start">
                            <button
                                type="button"
                                onClick={() => setCreationMode('single')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    creationMode === 'single'
                                        ? 'bg-[#4169e2] text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                Manual Question Form
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreationMode('markdown')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    creationMode === 'markdown'
                                        ? 'bg-violet-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Markdown Bulk Import
                                <span className="px-1.5 py-0.5 text-[10px] bg-violet-950 text-violet-300 rounded font-mono border border-violet-700/50">NEW</span>
                            </button>
                        </div>

                        {editingIndex !== null && (
                            <button
                                onClick={cancelEdit}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                            >
                                <X className="w-4 h-4" />
                                Cancel Edit
                            </button>
                        )}
                    </div>

                    {creationMode === 'single' ? (
                        /* Manual Single Question Form */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-blue-400" />
                                    {editingIndex !== null ? `Edit Question #${editingIndex + 1}` : 'Add Single Question'}
                                </h3>
                            </div>

                            {editingIndex !== null && (
                                <div className="p-3 bg-blue-950/60 border border-blue-800/80 rounded-xl">
                                    <p className="text-xs sm:text-sm text-blue-300 font-medium">
                                        Editing Question #{editingIndex + 1}
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                    Question *
                                </label>
                                <textarea
                                    value={currentQuestion}
                                    onChange={(e) => setCurrentQuestion(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] transition-all text-sm"
                                    placeholder="Enter your question here..."
                                    rows="3"
                                />
                            </div>

                            {/* Code Snippet Toggle */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setShowCodeBlock(!showCodeBlock)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                        showCodeBlock
                                            ? 'bg-violet-900/60 border-violet-600 text-violet-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                                    }`}
                                >
                                    <Code className="w-4 h-4" />
                                    {showCodeBlock ? 'Remove Code Snippet' : '+ Attach Code Snippet'}
                                </button>

                                {showCodeBlock && (
                                    <div className="mt-3 bg-[#0d1117] border border-violet-800/60 rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Code className="w-3.5 h-3.5 text-violet-400" />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Snippet</span>
                                            </div>
                                            <select
                                                value={codeLanguage}
                                                onChange={(e) => setCodeLanguage(e.target.value)}
                                                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                                            >
                                                <option value="javascript">JavaScript</option>
                                                <option value="python">Python</option>
                                                <option value="java">Java</option>
                                                <option value="cpp">C++</option>
                                                <option value="c">C</option>
                                                <option value="csharp">C#</option>
                                                <option value="typescript">TypeScript</option>
                                                <option value="html">HTML</option>
                                                <option value="css">CSS</option>
                                                <option value="sql">SQL</option>
                                                <option value="bash">Bash / Shell</option>
                                                <option value="plaintext">Plain Text</option>
                                            </select>
                                        </div>
                                        <textarea
                                            value={codeSnippet}
                                            onChange={(e) => setCodeSnippet(e.target.value)}
                                            className="w-full px-4 py-4 bg-transparent text-green-300 font-mono text-sm placeholder-slate-600 focus:outline-none resize-y"
                                            placeholder={`// Paste your ${codeLanguage} code here...`}
                                            rows="8"
                                            spellCheck={false}
                                            style={{ tabSize: 4 }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {options.map((option, idx) => (
                                    <div key={idx} className="relative">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                                            Option {idx + 1} *
                                            {idx === correctAnswer && (
                                                <span className="ml-2 text-emerald-400 text-xs lowercase tracking-normal">✓ Correct</span>
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
                                            className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#4169e2] ${idx === correctAnswer ? 'border-emerald-500 bg-emerald-950/30 text-white' : 'border-slate-700 bg-slate-900 text-white placeholder-slate-500'
                                                }`}
                                            placeholder={`Option ${idx + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setCorrectAnswer(idx)}
                                            className={`mt-2 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${idx === correctAnswer
                                                ? 'bg-emerald-600 text-white shadow-xs'
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                                                }`}
                                        >
                                            {idx === correctAnswer ? '✓ Correct Answer' : 'Mark as Correct'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={addQuestion}
                                className={`w-full ${editingIndex !== null ? 'bg-blue-600 hover:bg-blue-500' : 'bg-[#4169e2] hover:bg-[#3557c5]'} text-white rounded-xl px-6 py-3 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer`}
                            >
                                {editingIndex !== null ? (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Update Question
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Add Question
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* Markdown Bulk Import Feature */
                        <div className="space-y-5 bg-slate-900/40 p-5 rounded-2xl border border-violet-900/40">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-violet-400" />
                                        Paste Quiz Questions in Markdown
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Paste questions, code snippets with language tags (e.g. ```javascript, ```python), options, and correct answers.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCopyTemplate}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-950/80 hover:bg-violet-900 text-violet-300 border border-violet-700/60 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                    >
                                        {copiedTemplate ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                        {copiedTemplate ? 'Copied Template!' : 'Copy Sample Markdown'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowSampleTemplate(!showSampleTemplate)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                    >
                                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                                        {showSampleTemplate ? 'Hide Format' : 'View Format'}
                                    </button>
                                </div>
                            </div>

                            {/* Sample Template Viewer Drawer */}
                            {showSampleTemplate && (
                                <div className="p-4 bg-[#0d1117] border border-violet-800/60 rounded-xl text-xs space-y-2">
                                    <div className="flex items-center justify-between text-violet-400 font-bold uppercase tracking-wider">
                                        <span>Markdown Syntax Guide & Example</span>
                                        <span className="text-[10px] text-slate-500 font-mono">Question / Code / Options / Answer</span>
                                    </div>
                                    <pre className="text-green-300 font-mono text-xs overflow-x-auto p-3 bg-slate-950/80 rounded-lg border border-slate-800 leading-relaxed">
                                        {SAMPLE_MARKDOWN_TEMPLATE}
                                    </pre>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                                    <span>Markdown Input Box</span>
                                    {parsedPreview.length > 0 && (
                                        <span className="text-emerald-400 font-bold text-xs lowercase">
                                            ✓ {parsedPreview.length} question{parsedPreview.length > 1 ? 's' : ''} detected
                                        </span>
                                    )}
                                </label>
                                <textarea
                                    value={markdownInput}
                                    onChange={(e) => setMarkdownInput(e.target.value)}
                                    rows="10"
                                    className="w-full px-4 py-3 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-200 font-mono text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all leading-relaxed"
                                    placeholder={`Paste your Markdown text here...

Example format:
### Question 1: What is the output of this Python code?
\`\`\`python
x = [1, 2, 3]
print(len(x))
\`\`\`
- A) 1
- B) 2
- C) 3
- D) 4
Answer: C`}
                                    spellCheck={false}
                                />
                            </div>

                            {/* Live Parse Results Preview */}
                            {parsedPreview.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-center justify-between">
                                        <span className="text-xs sm:text-sm text-emerald-300 font-bold flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                            Successfully parsed {parsedPreview.length} question(s) from Markdown
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleAppendMarkdownQuestions}
                                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Append (+{parsedPreview.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReplaceWithMarkdownQuestions}
                                                className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                                            >
                                                <Save className="w-3.5 h-3.5" />
                                                Replace All ({parsedPreview.length})
                                            </button>
                                        </div>
                                    </div>

                                    {/* Parsed Cards Preview */}
                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                        {parsedPreview.map((q, idx) => (
                                            <div key={idx} className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-bold text-white">
                                                        {idx + 1}. {q.question}
                                                    </p>
                                                    {q.codeSnippet && (
                                                        <span className="px-2 py-0.5 bg-violet-950 text-violet-300 font-mono font-bold text-[10px] rounded border border-violet-800 shrink-0">
                                                            {q.codeLanguage || 'code'}
                                                        </span>
                                                    )}
                                                </div>

                                                {q.codeSnippet && (
                                                    <pre className="p-2.5 bg-[#0d1117] text-green-300 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
                                                        {q.codeSnippet}
                                                    </pre>
                                                )}

                                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                                    {q.options.map((opt, optIdx) => (
                                                        <div
                                                            key={optIdx}
                                                            className={`px-2.5 py-1.5 rounded-lg border text-[11px] ${
                                                                optIdx === q.correctAnswer
                                                                    ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 font-bold'
                                                                    : 'bg-slate-850 border-slate-800 text-slate-300'
                                                            }`}
                                                        >
                                                            {String.fromCharCode(65 + optIdx)}. {opt}
                                                            {optIdx === q.correctAnswer && ' ✓'}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : markdownInput.trim() ? (
                                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                                    <span>No valid questions parsed yet. Make sure your markdown includes options starting with A), B), C), D) or bullets, and an Answer line (e.g. Answer: B). Click "View Format" above for a template.</span>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {questions.length > 0 && (
                <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                        Added Questions: {questions.length} • Total Marks: {questions.length * (parseInt(marksPerQuestion) || 1)} (+{parseInt(marksPerQuestion) || 1} each)
                    </h3>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-1">
                        {questions.map((q, idx) => (
                            <div
                                key={idx}
                                className={`border rounded-xl p-4 transition-colors ${editingIndex === idx
                                    ? 'border-blue-500 bg-blue-950/40'
                                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-semibold text-white">
                                                {idx + 1}. {q.question}
                                            </p>
                                            {q.codeSnippet && (
                                                <span className="px-2 py-0.5 bg-violet-950 text-violet-300 font-mono text-[10px] font-bold rounded border border-violet-800/80">
                                                    {q.codeLanguage || 'code'}
                                                </span>
                                            )}
                                        </div>

                                        {q.codeSnippet && (
                                            <div className="my-2 bg-[#0d1117] border border-violet-900/60 rounded-lg overflow-hidden">
                                                <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-violet-400 font-bold uppercase flex justify-between items-center">
                                                    <span>{q.codeLanguage || 'code'} snippet</span>
                                                </div>
                                                <pre className="p-3 text-green-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                                                    {q.codeSnippet}
                                                </pre>
                                            </div>
                                        )}

                                        <div className="space-y-1 mt-2">
                                            {q.options.map((opt, optIdx) => (
                                                <p key={optIdx} className={`text-xs sm:text-sm ${optIdx === q.correctAnswer ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                                    {optIdx === q.correctAnswer && ' ✓'}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => editQuestion(idx)}
                                            className="text-blue-400 hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer"
                                            title="Edit Question"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeQuestion(idx)}
                                            className="text-red-400 hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer"
                                            title="Remove Question"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={createQuiz}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 py-3.5 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                        {loading ? '⏳ Creating...' : '✅ Create Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

// Activity Logs Tab (Full Search by Name, Email, Roll No, Quiz ID & Action - Dark Theme)
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
        <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] text-slate-100">
            {/* Header with Live Indicator & Counts */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">
                            Real-time Activity & Anti-Cheat Logs
                        </h2>
                        <p className="text-xs text-slate-400 font-medium">
                            Showing {filteredLogs.length} of {logs.length} total logs (All records loaded)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/80 border border-red-800 rounded-xl self-start sm:self-auto shadow-2xs">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live Monitoring Active</span>
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] shadow-2xs transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 cursor-pointer"
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
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4169e2] shadow-2xs cursor-pointer"
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
                    <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p className="text-base font-bold text-slate-300">No Activity Logs Found</p>
                        <p className="text-xs text-slate-500 mt-1">No suspicious activity or violation logs have been recorded yet.</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="text-center py-14 bg-slate-900/60 rounded-2xl border border-dashed border-slate-800">
                        <Search className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm font-bold text-slate-300">No matching logs found</p>
                        <p className="text-xs text-slate-500 mt-1">Try searching with a different student name, roll number, email, or reset filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setActionFilter('all'); }}
                            className="mt-3 px-4 py-1.5 bg-[#4169e2] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#3557c5] transition-colors cursor-pointer"
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
                                className="border border-red-900/40 bg-red-950/20 hover:bg-red-950/30 p-4 rounded-2xl transition-all duration-200 shadow-2xs"
                            >
                                <div className="flex items-start gap-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shrink-0 mt-0.5 shadow-2xs">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-extrabold text-sm text-white">
                                                    {log.userName || 'Anonymous Student'}
                                                </span>
                                                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700">
                                                    {log.rollNumber || 'No Roll'}
                                                </span>
                                                {(log.userEmail || log.email) && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                                                        <Mail className="w-3 h-3 text-slate-500" />
                                                        {log.userEmail || log.email}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-xs font-bold text-red-400 bg-red-950/80 border border-red-800/60 px-2 py-0.5 rounded-md">
                                                    {timeStr}
                                                </span>
                                                {dateStr && (
                                                    <span className="text-[10px] text-slate-500 block sm:inline sm:ml-2">
                                                        {dateStr}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="px-2.5 py-1 bg-red-950/80 text-red-300 rounded-lg text-xs font-bold border border-red-800/80">
                                                ⚠️ {log.action}
                                            </span>
                                            {log.quizId && (
                                                <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800">
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

// Manage Quizzes Component (Live Quizzes, Past Quizzes & Edit Quiz Options)
const ManageQuizzesTab = ({ quizzes, submissions, onRefresh, adminUser }) => {
    const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'live' | 'past'
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedQuizId, setExpandedQuizId] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Edit Modal form state
    const [editName, setEditName] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [editMarks, setEditMarks] = useState('4');
    const [editStatus, setEditStatus] = useState('active');
    const [editQuestions, setEditQuestions] = useState([]);

    // Single Question edit state inside Edit Modal
    const [qMode, setQMode] = useState('single'); // 'single' | 'markdown'
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const [showCodeBlock, setShowCodeBlock] = useState(false);
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [editingQIndex, setEditingQIndex] = useState(null);

    // Markdown import state inside Edit Modal
    const [markdownText, setMarkdownText] = useState('');
    const [parsedPreview, setParsedPreview] = useState([]);

    useEffect(() => {
        if (markdownText.trim()) {
            const parsed = parseMarkdownQuestions(markdownText);
            setParsedPreview(parsed);
        } else {
            setParsedPreview([]);
        }
    }, [markdownText]);

    const getSubmissionCount = (quizId) => {
        return submissions.filter(s => s.quizId === quizId).length;
    };

    const handleStartEdit = (quiz) => {
        setEditingQuiz(quiz);
        setEditName(quiz.name || '');
        setEditDuration(quiz.duration ? quiz.duration.toString() : '30');
        setEditMarks(quiz.marksPerQuestion ? quiz.marksPerQuestion.toString() : '4');
        setEditStatus(quiz.status || 'active');
        setEditQuestions(quiz.questions ? [...quiz.questions] : []);

        // Reset nested question inputs
        setQMode('single');
        setCurrentQuestion('');
        setCodeSnippet('');
        setCodeLanguage('javascript');
        setShowCodeBlock(false);
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
        setEditingQIndex(null);
        setMarkdownText('');
        setParsedPreview([]);
    };

    const handleSaveQuiz = async () => {
        if (!editName.trim() || !editDuration || editQuestions.length === 0) {
            alert('Please provide a Quiz Name, valid Duration in minutes, and keep at least 1 question.');
            return;
        }

        setSaving(true);
        try {
            const quizRef = doc(db, 'quizzes', editingQuiz.id);
            await updateDoc(quizRef, {
                name: editName.trim(),
                duration: parseInt(editDuration, 10),
                marksPerQuestion: parseInt(editMarks, 10) || 1,
                status: editStatus,
                questions: editQuestions,
                updatedAt: serverTimestamp(),
                updatedBy: adminUser.email
            });

            alert('✅ Quiz updated successfully!');
            setEditingQuiz(null);
            onRefresh();
        } catch (error) {
            console.error('Error updating quiz:', error);
            alert('Failed to update quiz. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteDoc(doc(db, 'quizzes', quizId));
            setDeleteConfirmId(null);
            alert('🗑️ Quiz deleted successfully.');
            onRefresh();
        } catch (error) {
            console.error('Error deleting quiz:', error);
            alert('Failed to delete quiz.');
        }
    };

    const handleToggleStatus = async (quiz) => {
        const newStatus = quiz.status === 'completed' ? 'active' : 'completed';
        try {
            await updateDoc(doc(db, 'quizzes', quiz.id), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            onRefresh();
        } catch (error) {
            console.error('Error toggling quiz status:', error);
        }
    };

    const handleToggleHide = async (quiz) => {
        const isHidden = quiz.status === 'hidden' || quiz.status === 'archived';
        const newStatus = isHidden ? 'active' : 'hidden';
        try {
            await updateDoc(doc(db, 'quizzes', quiz.id), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
            onRefresh();
        } catch (error) {
            console.error('Error toggling hide status:', error);
        }
    };

    const addQuestionToEdit = () => {
        if (!currentQuestion.trim() || options.some(o => !o.trim())) {
            alert('Please fill question text and all options');
            return;
        }

        const newQ = {
            question: currentQuestion.trim(),
            codeSnippet: codeSnippet.trim(),
            codeLanguage,
            options: [...options],
            correctAnswer
        };

        if (editingQIndex !== null) {
            const updated = [...editQuestions];
            updated[editingQIndex] = newQ;
            setEditQuestions(updated);
            setEditingQIndex(null);
        } else {
            setEditQuestions([...editQuestions, newQ]);
        }

        setCurrentQuestion('');
        setCodeSnippet('');
        setCodeLanguage('javascript');
        setShowCodeBlock(false);
        setOptions(['', '', '', '']);
        setCorrectAnswer(0);
    };

    const editQuestionFromList = (index) => {
        const q = editQuestions[index];
        setCurrentQuestion(q.question);
        setCodeSnippet(q.codeSnippet || '');
        setCodeLanguage(q.codeLanguage || 'javascript');
        setShowCodeBlock(!!q.codeSnippet);
        setOptions([...q.options]);
        setCorrectAnswer(q.correctAnswer);
        setEditingQIndex(index);
        setQMode('single');
    };

    const removeQuestionFromEdit = (index) => {
        setEditQuestions(editQuestions.filter((_, idx) => idx !== index));
        if (editingQIndex === index) {
            setCurrentQuestion('');
            setCodeSnippet('');
            setEditingQIndex(null);
        }
    };

    const appendMarkdownToEdit = () => {
        if (parsedPreview.length === 0) return;
        setEditQuestions([...editQuestions, ...parsedPreview]);
        setMarkdownText('');
        setParsedPreview([]);
    };

    // Filter logic for quizzes
    const filteredQuizzes = quizzes.filter(quiz => {
        const isHidden = quiz.status === 'hidden' || quiz.status === 'archived';
        const isCompleted = quiz.status === 'completed';
        const isLive = !isHidden && !isCompleted;

        if (filterStatus === 'live' && !isLive) return false;
        if (filterStatus === 'past' && !isCompleted) return false;
        if (filterStatus === 'hidden' && !isHidden) return false;

        const queryStr = searchQuery.toLowerCase().trim();
        if (queryStr) {
            return (
                quiz.name?.toLowerCase().includes(queryStr) ||
                quiz.id?.toLowerCase().includes(queryStr)
            );
        }
        return true;
    });

    const liveCount = quizzes.filter(q => q.status !== 'completed' && q.status !== 'archived' && q.status !== 'hidden').length;
    const pastCount = quizzes.filter(q => q.status === 'completed').length;
    const hiddenCount = quizzes.filter(q => q.status === 'hidden' || q.status === 'archived').length;

    return (
        <div className="space-y-6 text-slate-100 font-sans">
            {/* Header & Filter Controls */}
            <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-[#4169e2]" />
                            All Quizzes & Management
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            View live active quizzes, past completed quizzes, hide quizzes from students, or edit quiz details, time limits, and questions.
                        </p>
                    </div>

                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer self-start md:self-auto border border-slate-700"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh List
                    </button>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                filterStatus === 'all'
                                    ? 'bg-[#4169e2] text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            📊 All Quizzes ({quizzes.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('live')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                filterStatus === 'live'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            🟢 Live Quizzes ({liveCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('past')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                filterStatus === 'past'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            🏁 Past Quizzes ({pastCount})
                        </button>
                        <button
                            onClick={() => setFilterStatus('hidden')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                filterStatus === 'hidden'
                                    ? 'bg-amber-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            👁️‍🗨️ Hidden Quizzes ({hiddenCount})
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-xs">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search quizzes by title or ID..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2]"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quizzes List Cards */}
            <div className="space-y-4">
                {filteredQuizzes.length === 0 ? (
                    <div className="bg-[#131b2e]/90 rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                        <p className="font-bold text-slate-200">No Quizzes Found</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {searchQuery ? 'No quizzes match your search query.' : filterStatus === 'live' ? 'No live quizzes published right now.' : filterStatus === 'hidden' ? 'No hidden quizzes.' : 'No past quizzes recorded.'}
                        </p>
                    </div>
                ) : (
                    filteredQuizzes.map((quiz) => {
                        const isHidden = quiz.status === 'hidden' || quiz.status === 'archived';
                        const isCompleted = quiz.status === 'completed';
                        const isLive = !isHidden && !isCompleted;
                        const subCount = getSubmissionCount(quiz.id);
                        const isExpanded = expandedQuizId === quiz.id;
                        const createdDate = quiz.createdAt?.toDate ? quiz.createdAt.toDate().toLocaleDateString() : '';

                        return (
                            <div
                                key={quiz.id}
                                className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    {/* Quiz Header Information */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <h3 className="text-lg font-bold text-white tracking-tight">
                                                {quiz.name}
                                            </h3>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 border ${
                                                    isHidden
                                                        ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                                                        : isCompleted
                                                        ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                                                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                                                }`}
                                            >
                                                {isHidden ? (
                                                    <>👁️‍🗨️ Hidden from Students</>
                                                ) : isCompleted ? (
                                                    <>🏁 Past / Completed</>
                                                ) : (
                                                    <>
                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                                        Live / Active
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Badges Bar */}
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1">
                                                <Timer className="w-3.5 h-3.5 text-amber-400" />
                                                Duration: <strong className="text-white">{quiz.duration} mins</strong>
                                            </span>

                                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1">
                                                <Target className="w-3.5 h-3.5 text-blue-400" />
                                                Marks/Q: <strong className="text-white">{quiz.marksPerQuestion || 4}</strong>
                                            </span>

                                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1">
                                                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                                                Questions: <strong className="text-white">{quiz.questions?.length || 0}</strong>
                                            </span>

                                            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-semibold flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-emerald-400" />
                                                Submissions: <strong className="text-white">{subCount}</strong>
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-slate-500 font-mono">
                                            ID: {quiz.id} {createdDate ? `• Created: ${createdDate}` : ''} {quiz.createdBy ? `• By: ${quiz.createdBy}` : ''}
                                        </p>
                                    </div>

                                    {/* Action Buttons Toolbar */}
                                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                                        {/* Hide / Unhide Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleHide(quiz)}
                                            className={`px-3 py-2 bg-slate-900 hover:bg-slate-800 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                                isHidden ? 'border-amber-700 text-amber-300' : 'border-slate-700 text-slate-300 hover:text-white'
                                            }`}
                                            title={isHidden ? "Unhide and make visible to students" : "Hide from students without deleting"}
                                        >
                                            {isHidden ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
                                            {isHidden ? 'Unhide' : 'Hide'}
                                        </button>

                                        {/* Toggle Status Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(quiz)}
                                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                            title="Toggle Live vs Past Status"
                                        >
                                            {isCompleted ? <PlayCircle className="w-4 h-4 text-emerald-400" /> : <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                                            {isCompleted ? 'Mark as Live' : 'Mark as Past'}
                                        </button>

                                        {/* View Questions Accordion Toggle */}
                                        <button
                                            type="button"
                                            onClick={() => setExpandedQuizId(isExpanded ? null : quiz.id)}
                                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Eye className="w-4 h-4 text-blue-400" />
                                            {isExpanded ? 'Hide Questions' : 'View Questions'}
                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>

                                        {/* EDIT QUIZ BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(quiz)}
                                            className="px-4 py-2 bg-[#4169e2] hover:bg-[#3557c5] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-1.5"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Quiz
                                        </button>

                                        {/* DELETE QUIZ BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirmId(quiz.id)}
                                            className="px-3 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-400 hover:text-red-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Questions Accordion Drawer */}
                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            Questions Preview ({quiz.questions?.length || 0})
                                        </h4>
                                        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                                            {quiz.questions?.map((q, qIdx) => (
                                                <div key={qIdx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="font-bold text-white">
                                                            {qIdx + 1}. {q.question}
                                                        </p>
                                                        {q.codeSnippet && (
                                                            <span className="px-2 py-0.5 bg-violet-950 text-violet-300 font-mono text-[10px] font-bold rounded border border-violet-800">
                                                                {q.codeLanguage || 'code'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {q.codeSnippet && (
                                                        <pre className="p-2.5 bg-[#0d1117] text-green-300 font-mono text-[11px] rounded-lg overflow-x-auto border border-slate-800">
                                                            {q.codeSnippet}
                                                        </pre>
                                                    )}

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                                                        {q.options?.map((opt, optIdx) => (
                                                            <p
                                                                key={optIdx}
                                                                className={`${
                                                                    optIdx === q.correctAnswer
                                                                        ? 'text-emerald-400 font-bold'
                                                                        : 'text-slate-400'
                                                                }`}
                                                            >
                                                                {String.fromCharCode(65 + optIdx)}. {opt}
                                                                {optIdx === q.correctAnswer && ' ✓'}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* DELETE CONFIRMATION MODAL */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#131b2e] border border-red-900/80 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-red-950 rounded-full border border-red-800 flex items-center justify-center mx-auto text-red-400">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Delete Quiz Permanently?</h3>
                        <p className="text-xs text-slate-400">
                            Are you sure you want to delete this quiz? This action cannot be undone and will remove the quiz from student views.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteQuiz(deleteConfirmId)}
                                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-lg shadow-red-600/30"
                            >
                                Delete Quiz
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL FEATURED EDIT QUIZ MODAL */}
            {editingQuiz && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
                    <div className="bg-[#131b2e] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-slate-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div>
                                <h3 className="text-xl font-black text-white flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-[#4169e2]" />
                                    Edit Quiz Details & Questions
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Update Quiz Name, Duration Time, Marks per Question, or Edit Questions list.
                                </p>
                            </div>
                            <button
                                onClick={() => setEditingQuiz(null)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Top Controls: Name, Duration (minutes), Marks per Q, Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Quiz Name *
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4169e2]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Duration (minutes) *
                                </label>
                                <input
                                    type="number"
                                    value={editDuration}
                                    onChange={(e) => setEditDuration(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4169e2]"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Marks / Question *
                                </label>
                                <input
                                    type="number"
                                    value={editMarks}
                                    onChange={(e) => setEditMarks(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4169e2]"
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Quiz Status *
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4169e2] cursor-pointer"
                                >
                                    <option value="active">🟢 Live / Active</option>
                                    <option value="completed">🏁 Past / Completed</option>
                                    <option value="hidden">👁️‍🗨️ Hidden (Hide from Students)</option>
                                </select>
                            </div>
                        </div>

                        {/* Questions Editor Section inside Edit Modal */}
                        <div className="border-t border-slate-800 pt-5 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h4 className="text-base font-bold text-white flex items-center gap-2">
                                    <Hash className="w-5 h-5 text-blue-400" />
                                    Manage Quiz Questions ({editQuestions.length})
                                </h4>

                                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
                                    <button
                                        type="button"
                                        onClick={() => setQMode('single')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            qMode === 'single' ? 'bg-[#4169e2] text-white' : 'text-slate-400'
                                        }`}
                                    >
                                        Form Entry
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQMode('markdown')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                            qMode === 'markdown' ? 'bg-violet-600 text-white' : 'text-slate-400'
                                        }`}
                                    >
                                        Markdown Paste
                                    </button>
                                </div>
                            </div>

                            {qMode === 'single' ? (
                                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                                    <p className="text-xs font-bold text-slate-300">
                                        {editingQIndex !== null ? `Editing Question #${editingQIndex + 1}` : 'Add New Question to Quiz'}
                                    </p>
                                    <div>
                                        <textarea
                                            value={currentQuestion}
                                            onChange={(e) => setCurrentQuestion(e.target.value)}
                                            placeholder="Question text..."
                                            rows="2"
                                            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2]"
                                        />
                                    </div>

                                    {/* Code Snippet Toggle */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => setShowCodeBlock(!showCodeBlock)}
                                            className="text-xs text-violet-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                            <Code className="w-3.5 h-3.5" />
                                            {showCodeBlock ? 'Remove Code Snippet' : '+ Attach Code Snippet'}
                                        </button>

                                        {showCodeBlock && (
                                            <div className="mt-2 bg-[#0d1117] border border-slate-800 rounded-lg overflow-hidden">
                                                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800">
                                                    <span className="text-[10px] font-bold text-slate-400">Code Snippet</span>
                                                    <select
                                                        value={codeLanguage}
                                                        onChange={(e) => setCodeLanguage(e.target.value)}
                                                        className="bg-slate-800 text-white text-[10px] rounded px-1.5 py-0.5"
                                                    >
                                                        <option value="javascript">JavaScript</option>
                                                        <option value="python">Python</option>
                                                        <option value="java">Java</option>
                                                        <option value="cpp">C++</option>
                                                        <option value="html">HTML</option>
                                                        <option value="css">CSS</option>
                                                        <option value="sql">SQL</option>
                                                    </select>
                                                </div>
                                                <textarea
                                                    value={codeSnippet}
                                                    onChange={(e) => setCodeSnippet(e.target.value)}
                                                    rows="4"
                                                    className="w-full px-3 py-2 bg-transparent text-green-300 font-mono text-xs focus:outline-none"
                                                    placeholder="Paste code here..."
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Options Inputs */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {options.map((opt, idx) => (
                                            <div key={idx} className="flex gap-1.5 items-center">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const copy = [...options];
                                                        copy[idx] = e.target.value;
                                                        setOptions(copy);
                                                    }}
                                                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-slate-900 text-white focus:outline-none ${
                                                        idx === correctAnswer ? 'border-emerald-500' : 'border-slate-700'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setCorrectAnswer(idx)}
                                                    className={`px-2 py-2 text-[10px] font-bold rounded cursor-pointer shrink-0 ${
                                                        idx === correctAnswer ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                                                    }`}
                                                >
                                                    {idx === correctAnswer ? '✓' : 'Mark'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addQuestionToEdit}
                                        className="w-full py-2 bg-[#4169e2] hover:bg-[#3557c5] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                    >
                                        {editingQIndex !== null ? 'Update Question' : '+ Add Question to List'}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                                    <textarea
                                        value={markdownText}
                                        onChange={(e) => setMarkdownText(e.target.value)}
                                        rows="6"
                                        className="w-full px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-200 font-mono text-xs placeholder-slate-600 focus:outline-none"
                                        placeholder="Paste Markdown questions here..."
                                    />
                                    {parsedPreview.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={appendMarkdownToEdit}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                                        >
                                            + Add {parsedPreview.length} Parsed Questions
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Current Questions List in Edit Modal */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {editQuestions.map((q, idx) => (
                                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs flex justify-between items-start gap-3">
                                        <div className="space-y-1 flex-1">
                                            <p className="font-bold text-white">
                                                {idx + 1}. {q.question}
                                                {q.codeSnippet && <span className="ml-2 text-[10px] text-violet-400 font-mono">[{q.codeLanguage || 'code'}]</span>}
                                            </p>
                                            <p className="text-slate-400 text-[11px]">
                                                Answer: <strong className="text-emerald-400">{String.fromCharCode(65 + (q.correctAnswer || 0))}. {q.options?.[q.correctAnswer || 0]}</strong>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => editQuestionFromList(idx)}
                                                className="p-1.5 text-blue-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestionFromEdit(idx)}
                                                className="p-1.5 text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                                                title="Delete"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Action Footer */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                                type="button"
                                onClick={() => setEditingQuiz(null)}
                                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveQuiz}
                                disabled={saving}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? '⏳ Saving Updates...' : '💾 Save Changes & Update Quiz'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Results & Leaderboard Tab (Dark Theme)
// Results & Leaderboard Tab (Dark Theme)
const ResultsTab = ({ submissions, quizzes, onRefresh }) => {
    const [selectedQuiz, setSelectedQuiz] = useState('all');

    const handleDeleteSubmission = async (sub) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete the submission for ${sub.userName} (Roll: ${sub.rollNumber}) on quiz "${sub.quizName || 'this quiz'}"?\n\nThis will reset their score and allow the student to re-take the quiz.`
        );
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'submissions', sub.id));
            alert(`✅ Entry deleted! ${sub.userName} can now re-attempt the quiz.`);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error("Error deleting submission:", err);
            alert("Failed to delete submission entry.");
        }
    };

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
        <div className="space-y-6 text-slate-100 font-sans">
            <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-amber-400" />
                            Leaderboard & Results
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            View top student rankings, inspect individual submissions, or reset an entry to allow a student to reattempt a test.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={selectedQuiz}
                            onChange={(e) => setSelectedQuiz(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4169e2] cursor-pointer"
                        >
                            <option value="all">📊 All Quizzes</option>
                            {quizzes.map(quiz => (
                                <option key={quiz.id} value={quiz.id}>📝 {quiz.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Selected Quiz Info Banner */}
                <div className="mb-6 p-4 bg-blue-950/40 border border-blue-900/60 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold text-slate-200">
                            Viewing Results for: <span className="text-blue-400 font-bold">{selectedQuizName}</span>
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
                        color="bg-emerald-600"
                    />
                    <StatsCard
                        icon={Trophy}
                        title="Top Score"
                        value={leaderboard[0]?.score || 0}
                        color="bg-amber-600"
                    />
                </div>

                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Top Student Leaderboard
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Roll Number</th>
                                {selectedQuiz === 'all' && (
                                    <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Quiz</th>
                                )}
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Percentage</th>
                                <th className="px-6 py-4 text-left font-semibold text-xs uppercase tracking-wider">Submitted At</th>
                                <th className="px-6 py-4 text-right font-semibold text-xs uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                            {leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan={selectedQuiz === 'all' ? '8' : '7'} className="px-6 py-12 text-center text-slate-400">
                                        <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                                        <p className="font-semibold text-slate-300">No submissions yet for this quiz</p>
                                        <p className="text-xs text-slate-500 mt-1">Results will appear here once students submit their answers</p>
                                    </td>
                                </tr>
                            ) : (
                                leaderboard.map((sub, idx) => {
                                    const maxMarks = sub.totalMarks || (sub.marksPerQuestion ? sub.totalQuestions * sub.marksPerQuestion : sub.totalQuestions * 4);
                                    const percentage = maxMarks > 0 ? ((sub.score / maxMarks) * 100).toFixed(1) : '0.0';
                                    return (
                                        <tr key={sub.id} className={`hover:bg-slate-800/60 transition-colors ${idx < 3 ? 'bg-amber-950/15' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {idx === 0 && <span className="text-2xl">🥇</span>}
                                                    {idx === 1 && <span className="text-2xl">🥈</span>}
                                                    {idx === 2 && <span className="text-2xl">🥉</span>}
                                                    <span className="font-bold text-white">{idx + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-white">{sub.userName}</td>
                                            <td className="px-6 py-4 text-slate-300">{sub.rollNumber}</td>
                                            {selectedQuiz === 'all' && (
                                                <td className="px-6 py-4 text-slate-300">{sub.quizName}</td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-full font-bold text-xs">
                                                    {sub.score} / {maxMarks}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${percentage >= 75 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="font-semibold text-white text-xs">{percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                {sub.submittedAt?.toDate?.()?.toLocaleString() || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSubmission(sub)}
                                                    className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                                    title="Delete entry to allow student to re-take this quiz"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    Reset & Reattempt
                                                </button>
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
            <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    All Student Attempts & Reset Access {selectedQuiz !== 'all' && `- ${selectedQuizName}`}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full">
                        <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Student</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Roll No</th>
                                {selectedQuiz === 'all' && (
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Quiz</th>
                                )}
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                            {filteredSubmissions.length === 0 ? (
                                <tr>
                                    <td colSpan={selectedQuiz === 'all' ? '7' : '6'} className="px-4 py-12 text-center text-slate-400">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                        <p>No submissions found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSubmissions.map((sub, idx) => {
                                    const maxMarks = sub.totalMarks || (sub.marksPerQuestion ? sub.totalQuestions * sub.marksPerQuestion : sub.totalQuestions * 4);
                                    return (
                                        <tr key={sub.id} className="hover:bg-slate-800/60 transition-colors">
                                            <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-white">{sub.userName}</td>
                                            <td className="px-4 py-3 text-xs text-slate-300">{sub.rollNumber}</td>
                                            {selectedQuiz === 'all' && (
                                                <td className="px-4 py-3 text-xs text-slate-300">{sub.quizName}</td>
                                            )}
                                            <td className="px-4 py-3">
                                                <span className="text-xs font-bold text-blue-400">
                                                    {sub.score}/{maxMarks}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {sub.submittedAt?.toDate?.()?.toLocaleString() || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSubmission(sub)}
                                                    className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                                                    title="Delete entry to allow student to re-take this quiz"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    Reset & Reattempt
                                                </button>
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

// Main Admin Dashboard (Dark Theme)
const AdminDashboard = ({ adminUser, onLogout }) => {
    const [activeTab, setActiveTab] = useState('create');
    const [activityLogs, setActivityLogs] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const initAdmin = async () => {
            if (!auth.currentUser) {
                try {
                    await signInWithEmailAndPassword(auth, 'admin@admin.com', 'HelixAdminPassword123!');
                } catch {
                    try {
                        await createUserWithEmailAndPassword(auth, 'admin@admin.com', 'HelixAdminPassword123!');
                    } catch (err) {
                        console.error('Firebase Auth auto-login error:', err);
                    }
                }
            }
            loadData();
        };

        initAdmin();
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

    const statsGridRef = useRef(null);
    const tabContentRef = useRef(null);

    useEffect(() => {
        if (statsGridRef.current) {
            gsap.fromTo(
                statsGridRef.current.children,
                { opacity: 0, y: 20, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'power2.out' }
            );
        }
    }, [quizzes.length, submissions.length, activityLogs.length]);

    useEffect(() => {
        if (tabContentRef.current) {
            gsap.fromTo(
                tabContentRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
        }
    }, [activeTab]);

    const tabs = [
        { id: 'create', label: 'Create Quiz', icon: Plus },
        { id: 'manage', label: 'All & Live Quizzes', icon: BookOpen },
        { id: 'results', label: 'Results & Leaderboard', icon: Trophy },
        { id: 'logs', label: 'Activity Logs', icon: Activity }
    ];

    return (
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between text-slate-100 font-sans">
            <div>
                <nav className="bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-md">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
                        <div className="flex justify-between items-center flex-nowrap gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <img
                                    src={logoImg}
                                    alt="Helix Logo"
                                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(65,105,226,0.35)] shrink-0"
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-black text-sm sm:text-lg text-white leading-tight truncate">Helix Club Quiz</span>
                                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 sm:px-2 py-0.5 bg-blue-950/80 text-blue-400 font-bold rounded-full border border-blue-800/60 shrink-0">Admin</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-400 truncate">{adminUser.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 rounded-xl">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-semibold text-emerald-400">Live Feed</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-xs font-medium cursor-pointer border border-slate-700/60 shrink-0"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div ref={statsGridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        <StatsCard
                            icon={Award}
                            title="Total Quizzes"
                            value={quizzes.length}
                            color="bg-blue-600"
                        />
                        <StatsCard
                            icon={Users}
                            title="Total Submissions"
                            value={submissions.length}
                            color="bg-indigo-600"
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
                            color="bg-emerald-600"
                        />
                    </div>

                    <div className="bg-[#131b2e]/90 rounded-2xl border border-slate-800 p-1.5 mb-6 shadow-md overflow-x-auto">
                        <nav className="flex gap-1.5 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 whitespace-nowrap ${isActive
                                            ? 'bg-[#4169e2] text-white shadow-lg shadow-blue-600/30'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div ref={tabContentRef}>
                        {activeTab === 'create' && (
                            <CreateQuizTab onQuizCreated={loadData} adminUser={adminUser} />
                        )}
                        {activeTab === 'manage' && (
                            <ManageQuizzesTab quizzes={quizzes} submissions={submissions} onRefresh={loadData} adminUser={adminUser} />
                        )}
                        {activeTab === 'results' && (
                            <ResultsTab submissions={submissions} quizzes={quizzes} onRefresh={loadData} />
                        )}
                        {activeTab === 'logs' && (
                            <ActivityLogsTab logs={activityLogs} />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom spacer */}
            <div className="w-full h-2"></div>
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