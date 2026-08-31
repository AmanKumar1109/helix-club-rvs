import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Clock, LogOut, ChevronRight, Trophy, User, Hash, BookOpen, Award, Timer, CheckCircle, XCircle, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
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

// Anti-Cheat Hook
const useAntiCheat = (user, quizId, isQuizActive) => {
    useEffect(() => {
        if (!isQuizActive || !user) return;

        const logActivity = async (action) => {
            try {
                await addDoc(collection(db, 'activityLogs'), {
                    userId: user.uid,
                    userName: user.fullName || user.displayName || 'Student',
                    userEmail: user.email || '',
                    rollNumber: user.rollNumber || 'N/A',
                    action,
                    quizId,
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error('Error logging activity:', error);
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                logActivity('Tab switched / Browser minimized');
            }
        };

        const handleBlur = () => {
            logActivity('Window lost focus');
        };

        // Split screen / window resize detection
        const originalWidth = window.innerWidth;
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newWidth = window.innerWidth;
                const shrinkPercent = ((originalWidth - newWidth) / originalWidth) * 100;
                if (shrinkPercent > 20) {
                    logActivity(`Window resized (possible split screen) — width: ${newWidth}px`);
                }
            }, 500);
        };

        // Screen capture / screen recording detection (browser-level)
        const handleCaptureDetected = () => {
            logActivity('Screen capture / screen recording detected');
        };

        // PrintScreen key press attempt log
        const handlePrintScreen = (e) => {
            if (e.key === 'PrintScreen') {
                logActivity('PrintScreen key pressed during quiz');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('resize', handleResize);
        document.addEventListener('helix:capture-detected', handleCaptureDetected);
        document.addEventListener('keyup', handlePrintScreen);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('helix:capture-detected', handleCaptureDetected);
            document.removeEventListener('keyup', handlePrintScreen);
            clearTimeout(resizeTimer);
        };
    }, [user, quizId, isQuizActive]);
};

// Timer Hook
const useQuizTimer = (duration, onTimeUp, isActive) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = duration - elapsed;

            if (remaining <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                onTimeUp();
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [duration, startTime, onTimeUp, isActive]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return { timeLeft, formatTime };
};

// Auth Screen — Login + Register tabs (Email/Password)
const AuthScreen = ({ onLogin }) => {
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const cardRef = useRef(null);
    const logoRef = useRef(null);

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Register state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regRoll, setRegRoll] = useState('');
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState('');
    const [showLoginPwd, setShowLoginPwd] = useState(false);
    const [showRegPwd, setShowRegPwd] = useState(false);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current.children,
                { opacity: 0, y: 24, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
            );
        }
        gsap.to('.gsap-ambient-glow', { y: '-=15', scale: 1.05, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('.login-logo-ring', { scale: 1.35, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out', stagger: 0.6 });
        gsap.to('.login-card-border', { backgroundPosition: '200% center', duration: 4, repeat: -1, ease: 'none' });
        gsap.to('.orbit-ring-1', { rotation: 360, duration: 12, repeat: -1, ease: 'none', transformOrigin: 'center center' });
        gsap.to('.orbit-ring-2', { rotation: -360, duration: 18, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    }, []);

    // Re-animate on tab switch
    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(
                cardRef.current.querySelectorAll('.form-field'),
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }
            );
        }
    }, [tab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        if (!loginEmail.trim() || !loginPassword) { setLoginError('Please fill all fields.'); return; }
        setLoginLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                onLogin({ ...result.user, fullName: data.fullName, rollNumber: data.rollNumber, phone: data.phone });
            } else {
                setLoginError('Account found but profile missing. Please register again.');
                await signOut(auth);
            }
        } catch (err) {
            const msgs = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password. Please try again.',
                'auth/invalid-credential': 'Invalid email or password.',
                'auth/too-many-requests': 'Too many attempts. Please try later.',
            };
            setLoginError(msgs[err.code] || 'Login failed. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        if (!regName.trim() || !regEmail.trim() || !regPassword || !regPhone.trim() || !regRoll.trim()) {
            setRegError('Please fill in all fields.'); return;
        }
        if (regPassword.length < 6) { setRegError('Password must be at least 6 characters.'); return; }
        if (!/^[6-9]\d{9}$/.test(regPhone.trim())) { setRegError('Enter a valid 10-digit Indian phone number.'); return; }
        setRegLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
            await setDoc(doc(db, 'users', result.user.uid), {
                fullName: regName.trim(),
                rollNumber: regRoll.trim(),
                email: regEmail.trim(),
                phone: regPhone.trim(),
                createdAt: serverTimestamp()
            });
            onLogin({ ...result.user, fullName: regName.trim(), rollNumber: regRoll.trim(), phone: regPhone.trim() });
        } catch (err) {
            const msgs = {
                'auth/email-already-in-use': 'This email is already registered. Please login.',
                'auth/invalid-email': 'Invalid email address.',
                'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
            };
            setRegError(msgs[err.code] || 'Registration failed. Please try again.');
        } finally {
            setRegLoading(false);
        }
    };

    const inputClass = 'w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm font-medium outline-none placeholder-slate-500 focus:ring-2 focus:ring-[#4169e2] focus:border-transparent transition-all';

    return (
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden font-sans select-none text-slate-100">
            <div className="gsap-ambient-glow absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="gsap-ambient-glow absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 sm:-left-8 top-1/4 w-72 sm:w-96 h-72 sm:h-96 pointer-events-none select-none z-0 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500 fill-current">
                    <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,42.2C64.8,55.3,53.8,66.9,40.4,74.1C27.1,81.3,13.5,84.1,-0.5,85C-14.6,85.8,-29.1,84.7,-42.2,78.2C-55.3,71.8,-66.9,60,-74.8,46.1C-82.7,32.2,-86.8,16.1,-86.3,0.3C-85.8,-15.6,-80.6,-31.1,-71.9,-43.8C-63.1,-56.4,-50.7,-66.1,-37.2,-73.6C-23.7,-81,-11.8,-86.1,1.7,-89C15.3,-92,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
            </div>
            <div className="absolute -right-16 sm:-right-8 top-1/3 w-80 sm:w-112 h-80 sm:h-112 pointer-events-none select-none z-0 opacity-20">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-500 fill-current">
                    <path d="M47.7,-79.8C61.4,-73.4,71.9,-59.9,78.4,-44.8C84.8,-29.7,87.2,-14.8,85.4,0.1C83.5,14.9,77.4,29.8,69.5,43.2C61.7,56.5,52.1,68.3,39.6,75.7C27.1,83.1,11.7,86.1,-3.8,92.7C-19.3,99.3,-34.9,109.5,-47.9,104.9C-60.9,100.3,-71.4,80.9,-78.9,64.2C-86.4,47.5,-90.9,33.5,-91.9,19.2C-92.9,4.9,-90.4,-9.7,-84.9,-23.4C-79.3,-37.1,-70.7,-49.9,-59,-57.2C-47.3,-64.5,-32.5,-66.3,-18.4,-72.1C-4.3,-77.9,9,-87.7,24,-89.8C38.9,-91.9,55.5,-86.3,47.7,-79.8Z" transform="translate(100 100)" />
                </svg>
            </div>

            <div className="w-full h-2"></div>

            <div className="relative z-10 my-auto w-full max-w-md">
                <div className="login-card-border absolute inset-0 rounded-3xl p-[1.5px] opacity-60" style={{background:'linear-gradient(90deg,#4169e2,#818cf8,#4169e2)', backgroundSize:'200% auto'}}></div>
                <div ref={cardRef} className="relative bg-[#0e1524]/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-7 sm:p-9 transition-all">

                    {/* Logo */}
                    <div className="flex justify-center mb-4 relative">
                        <div className="login-logo-ring absolute inset-0 m-auto w-20 h-20 rounded-full border-2 border-blue-500/50"></div>
                        <div className="login-logo-ring absolute inset-0 m-auto w-20 h-20 rounded-full border-2 border-indigo-500/40"></div>
                        <div className="orbit-ring-1 absolute inset-0 m-auto w-28 h-28 rounded-full border border-dashed border-blue-500/20"></div>
                        <div className="orbit-ring-2 absolute inset-0 m-auto w-36 h-36 rounded-full border border-dashed border-indigo-500/15"></div>
                        <img ref={logoRef} src={logoImg} alt="Helix Logo" className="relative w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(65,105,226,0.6)] z-10" />
                    </div>

                    <h1 className="text-xl font-black text-white tracking-tight text-center mb-0.5">Helix Club Quiz</h1>
                    <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase text-center mb-1">Assessment &amp; Contest Portal</p>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mb-5">
                        <span>powered by</span>
                        <a href="https://zectral.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#4169e2] hover:text-[#587ef0] underline underline-offset-2 transition-colors">ZECTRAL</a>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-slate-900/80 rounded-2xl p-1 mb-6 border border-slate-800">
                        <button
                            onClick={() => setTab('login')}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === 'login' ? 'bg-[#4169e2] text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
                        >Login</button>
                        <button
                            onClick={() => setTab('register')}
                            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${tab === 'register' ? 'bg-[#4169e2] text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
                        >Register</button>
                    </div>

                    {/* LOGIN FORM */}
                    {tab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="form-field">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email</label>
                                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputClass} placeholder="your@email.com" autoComplete="email" />
                            </div>
                            <div className="form-field relative">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password</label>
                                <input type={showLoginPwd ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={inputClass + ' pr-11'} placeholder="••••••••" autoComplete="current-password" />
                                <button type="button" onClick={() => setShowLoginPwd(p => !p)} className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                    {showLoginPwd
                                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            {loginError && <p className="form-field text-xs text-red-400 font-semibold bg-red-950/40 border border-red-800/60 rounded-xl px-3 py-2">{loginError}</p>}
                            <button type="submit" disabled={loginLoading} className="form-field w-full bg-[#4169e2] hover:bg-[#3557c5] active:scale-[0.99] text-white rounded-2xl px-6 py-3.5 font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-1">
                                {loginLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Signing in...</> : 'Login to Quiz Portal →'}
                            </button>
                        </form>
                    )}

                    {/* REGISTER FORM */}
                    {tab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-3">
                            <div className="form-field">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Full Name *</label>
                                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" autoComplete="name" />
                            </div>
                            <div className="form-field">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email *</label>
                                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className={inputClass} placeholder="your@email.com" autoComplete="email" />
                            </div>
                            <div className="form-field relative">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Password *</label>
                                <input type={showRegPwd ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} className={inputClass + ' pr-11'} placeholder="Min. 6 characters" autoComplete="new-password" />
                                <button type="button" onClick={() => setShowRegPwd(p => !p)} className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors cursor-pointer">
                                    {showRegPwd
                                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    }
                                </button>
                            </div>
                            <div className="form-field">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Phone Number *</label>
                                <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className={inputClass} placeholder="10-digit mobile number" maxLength={10} autoComplete="tel" />
                            </div>
                            <div className="form-field">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Roll Number *</label>
                                <input type="text" value={regRoll} onChange={e => setRegRoll(e.target.value)} className={inputClass} placeholder="e.g. 23BCE1045" />
                            </div>
                            {regError && <p className="form-field text-xs text-red-400 font-semibold bg-red-950/40 border border-red-800/60 rounded-xl px-3 py-2">{regError}</p>}
                            <button type="submit" disabled={regLoading} className="form-field w-full bg-[#4169e2] hover:bg-[#3557c5] active:scale-[0.99] text-white rounded-2xl px-6 py-3.5 font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-1">
                                {regLoading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Creating Account...</> : 'Create Account & Continue →'}
                            </button>
                        </form>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Secure Auth</span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1 font-medium"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Anti-Cheat Active</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-2"></div>
        </div>
    );
};

// Leaderboard Panel Component — shows ranked students for a given quiz
const LeaderboardPanel = ({ quizId, myUserId, formatSecs }) => {
    const [entries, setEntries] = useState([]);
    const [lbLoading, setLbLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const q = query(collection(db, 'submissions'), where('quizId', '==', quizId));
                const snap = await getDocs(q);
                const data = snap.docs.map(d => d.data());
                // Sort: highest score first, then lowest timeTaken
                data.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    const ta = a.timeTaken ?? Infinity;
                    const tb = b.timeTaken ?? Infinity;
                    return ta - tb;
                });
                setEntries(data);
            } catch (err) {
                console.error('Leaderboard fetch error:', err);
            } finally {
                setLbLoading(false);
            }
        };
        fetchLeaderboard();
    }, [quizId]);

    if (lbLoading) return (
        <div className="flex items-center justify-center py-3">
            <div className="w-4 h-4 border-2 border-[#4169e2] border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-xs text-slate-400">Loading...</span>
        </div>
    );

    if (entries.length === 0) return (
        <p className="text-xs text-slate-500 text-center py-2">No submissions yet.</p>
    );

    const medals = ['🥇', '🥈', '🥉'];

    return (
        <div className="space-y-2">
            {entries.slice(0, 10).map((entry, idx) => {
                const isMe = entry.userId === myUserId;
                return (
                    <div
                        key={entry.userId + idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${
                            isMe
                                ? 'bg-blue-950/70 border border-blue-700/60 text-white'
                                : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                        }`}
                    >
                        {/* Rank */}
                        <span className="shrink-0 w-6 text-center font-black text-sm">
                            {idx < 3 ? medals[idx] : `#${idx + 1}`}
                        </span>
                        {/* Name + Roll */}
                        <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate ${isMe ? 'text-blue-200' : 'text-slate-200'}`}>
                                {entry.userName || 'Student'} {isMe && <span className="text-blue-400 text-[10px]">(You)</span>}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">{entry.rollNumber || '—'}</p>
                        </div>
                        {/* Score */}
                        <div className="text-right shrink-0">
                            <p className={`font-black ${isMe ? 'text-blue-300' : 'text-emerald-400'}`}>
                                {entry.score}/{entry.totalMarks}
                            </p>
                            <p className="text-[10px] text-amber-400 flex items-center justify-end gap-0.5">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                                </svg>
                                {formatSecs(entry.timeTaken)}
                            </p>
                        </div>
                    </div>
                );
            })}
            {entries.length > 10 && (
                <p className="text-[10px] text-slate-500 text-center pt-1">+ {entries.length - 10} more participants</p>
            )}
        </div>
    );
};

// Quiz List Component (Matching Login Screen Aesthetic & Rich GSAP Animations)
const QuizList = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'available', 'completed'
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'marks', 'duration'
    
    // GSAP Animation References
    const headerRef = useRef(null);
    const sidebarRef = useRef(null);
    const gridRef = useRef(null);
    const mainHeaderRef = useRef(null);
    const backgroundRef = useRef(null);

    useEffect(() => {
        loadQuizzesAndSubmissions();
    }, [user]);

    // Initial Screen Load GSAP Animations (Header, Sidebar, Ambient floating elements)
    useEffect(() => {
        // 1. Ambient Background Floating Spheres & Organic Blobs
        if (backgroundRef.current) {
            const floaters = backgroundRef.current.querySelectorAll('.gsap-floating-orb');
            if (floaters.length > 0) {
                gsap.to(floaters, {
                    y: '-=18',
                    x: '+=10',
                    rotation: 8,
                    duration: 3.8,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    stagger: {
                        each: 0.6,
                        from: 'random'
                    }
                });
            }

            const blobs = backgroundRef.current.querySelectorAll('.gsap-fluid-blob');
            if (blobs.length > 0) {
                gsap.to(blobs, {
                    scale: 1.08,
                    rotation: 5,
                    duration: 6,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    stagger: 1.2
                });
            }
        }

        // 2. Top Header Glass Navbar Staggered Slide In
        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current.children,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }
            );
        }

        // 3. Left Sidebar Staggered Pop-in
        if (sidebarRef.current) {
            gsap.fromTo(
                sidebarRef.current.children,
                { opacity: 0, x: -30, scale: 0.96 },
                { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)', delay: 0.1 }
            );
        }

        // 4. Section Controls Fade In
        if (mainHeaderRef.current) {
            gsap.fromTo(
                mainHeaderRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.2 }
            );
        }
    }, []);

    // Staggered Entrance for Quiz Cards on Data / Filter / Search updates
    useEffect(() => {
        if (!loading && gridRef.current) {
            const cards = gridRef.current.querySelectorAll('.gsap-quiz-card');
            if (cards.length > 0) {
                gsap.fromTo(
                    cards,
                    { opacity: 0, y: 30, scale: 0.94 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.48, 
                        stagger: 0.07, 
                        ease: 'back.out(1.2)',
                        clearProps: 'transform' // clean transform property after GSAP finishes for flawless CSS hover effects
                    }
                );
            }
        }
    }, [loading, statusFilter, searchQuery, sortBy, quizzes]);

    const loadQuizzesAndSubmissions = async () => {
        try {
            const quizSnapshot = await getDocs(collection(db, 'quizzes'));
            const quizData = quizSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuizzes(quizData);

            const submissionsQuery = query(
                collection(db, 'submissions'),
                where('userId', '==', user.uid)
            );
            const submissionsSnapshot = await getDocs(submissionsQuery);
            const submissionsMap = {};
            submissionsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                submissionsMap[data.quizId] = {
                    score: data.score,
                    totalMarks: data.totalMarks,
                    timeTaken: data.timeTaken ?? null,
                    submittedAt: data.submittedAt
                };
            });
            setSubmissions(submissionsMap);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (quiz) => {
        if (submissions[quiz.id]) {
            alert('You have already submitted this quiz!');
            return;
        }
        navigate(`/quiz/${quiz.id}`);
    };

    // 3D tilt on mouse move for cards
    const handleCardMouseMove = (e, cardEl) => {
        if (!cardEl) return;
        const rect = cardEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        cardEl.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
        cardEl.style.boxShadow = `0 20px 60px rgba(65,105,226,0.25), 0 0 0 1px rgba(65,105,226,0.4)`;
    };
    const handleCardMouseLeave = (cardEl) => {
        if (!cardEl) return;
        cardEl.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
        cardEl.style.boxShadow = '';
        cardEl.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
    };

    // Color theme cycling for aesthetic dark cards matching #4169e2 dark palette
    const cardThemes = [
        { bg: 'bg-[#131b2e]/90', border: 'border-slate-800', badge: 'bg-blue-950/80 text-blue-300 border border-blue-800/40', tag: 'bg-slate-900/90 text-blue-300 border border-slate-700/60', dot: 'bg-[#4169e2]', glowColor: 'rgba(65,105,226,0.35)' },
        { bg: 'bg-[#151c33]/90', border: 'border-slate-800', badge: 'bg-sky-950/80 text-sky-300 border border-sky-800/40', tag: 'bg-slate-900/90 text-sky-300 border border-slate-700/60', dot: 'bg-sky-500', glowColor: 'rgba(14,165,233,0.3)' },
        { bg: 'bg-[#161b36]/90', border: 'border-slate-800', badge: 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/40', tag: 'bg-slate-900/90 text-indigo-300 border border-slate-700/60', dot: 'bg-indigo-500', glowColor: 'rgba(99,102,241,0.3)' },
        { bg: 'bg-[#141d38]/90', border: 'border-slate-800', badge: 'bg-blue-950/80 text-blue-300 border border-blue-800/40', tag: 'bg-slate-900/90 text-blue-300 border border-slate-700/60', dot: 'bg-[#4169e2]', glowColor: 'rgba(65,105,226,0.35)' }
    ];

    // Filter & Sort Logic
    const filteredQuizzes = quizzes
        .filter(quiz => {
            const matchesSearch = quiz.name?.toLowerCase().includes(searchQuery.toLowerCase());
            const isSubmitted = !!submissions[quiz.id];
            if (statusFilter === 'available') return matchesSearch && !isSubmitted;
            if (statusFilter === 'completed') return matchesSearch && isSubmitted;
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'marks') {
                const marksA = (a.questions?.length || 0) * (a.marksPerQuestion || 4);
                const marksB = (b.questions?.length || 0) * (b.marksPerQuestion || 4);
                return marksB - marksA;
            }
            if (sortBy === 'duration') {
                return (a.duration || 0) - (b.duration || 0);
            }
            return 0; // default latest order
        });

    const completedCount = Object.keys(submissions).length;
    const availableCount = Math.max(0, quizzes.length - completedCount);

    return (
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between font-sans w-full relative overflow-hidden text-slate-100">
            {/* Ambient Background Gradient Blurs & GSAP Animated Floating Elements */}
            <div ref={backgroundRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/6 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

                {/* Left Organic Fluid Blob */}
                <div className="gsap-fluid-blob absolute -left-16 sm:-left-8 top-1/4 w-72 sm:w-96 h-72 sm:h-96 opacity-15">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-500 fill-current">
                        <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,42.2C64.8,55.3,53.8,66.9,40.4,74.1C27.1,81.3,13.5,84.1,-0.5,85C-14.6,85.8,-29.1,84.7,-42.2,78.2C-55.3,71.8,-66.9,60,-74.8,46.1C-82.7,32.2,-86.8,16.1,-86.3,0.3C-85.8,-15.6,-80.6,-31.1,-71.9,-43.8C-63.1,-56.4,-50.7,-66.1,-37.2,-73.6C-23.7,-81,-11.8,-86.1,1.7,-89C15.3,-92,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                {/* Right Organic Fluid Blob */}
                <div className="gsap-fluid-blob absolute -right-16 sm:-right-8 top-1/3 w-80 sm:w-112 h-80 sm:h-112 opacity-15">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-500 fill-current">
                        <path d="M47.7,-79.8C61.4,-73.4,71.9,-59.9,78.4,-44.8C84.8,-29.7,87.2,-14.8,85.4,0.1C83.5,14.9,77.4,29.8,69.5,43.2C61.7,56.5,52.1,68.3,39.6,75.7C27.1,83.1,11.7,86.1,-3.8,92.7C-19.3,99.3,-34.9,109.5,-47.9,104.9C-60.9,100.3,-71.4,80.9,-78.9,64.2C-86.4,47.5,-90.9,33.5,-91.9,19.2C-92.9,4.9,-90.4,-9.7,-84.9,-23.4C-79.3,-37.1,-70.7,-49.9,-59,-57.2C-47.3,-64.5,-32.5,-66.3,-18.4,-72.1C-4.3,-77.9,9,-87.7,24,-89.8C38.9,-91.9,55.5,-86.3,47.7,-79.8Z" transform="translate(100 100)" />
                    </svg>
                </div>

                {/* Decorative Floating Circles & Geometric Elements */}
                <div className="gsap-floating-orb absolute top-20 right-1/4 w-20 h-20 rounded-full border border-blue-500/20"></div>
                <div className="gsap-floating-orb absolute top-36 left-1/3 w-3.5 h-3.5 rounded-full bg-indigo-500/40"></div>
                <div className="gsap-floating-orb absolute top-44 left-10 sm:left-24 w-8 h-8 bg-blue-500/20 rotate-12 rounded-lg"></div>
                <div className="gsap-floating-orb absolute bottom-36 right-12 sm:right-28 w-6 h-6 bg-indigo-500/20 rotate-45 rounded-sm"></div>
                <div className="gsap-floating-orb absolute bottom-28 left-16 w-12 h-12 rounded-full border border-blue-400/20"></div>
            </div>

            {/* Full-width Main Wrapper */}
            <div className="w-full flex-1 relative z-10">
                {/* 1. Modern Dark Glassmorphic Navbar */}
                <header ref={headerRef} className="bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                    {/* Top Row: Brand & Navigation */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
                        {/* Logo & Portal Name */}
                        <div className="flex items-center gap-3">
                            <img
                                src={logoImg}
                                alt="Helix Logo"
                                className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-[0_0_12px_rgba(65,105,226,0.35)] hover:scale-105 transition-transform duration-200"
                            />

                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-lg sm:text-xl tracking-tight text-white leading-tight">
                                        Helix Club Quiz
                                    </span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-full">
                                        Official
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 leading-tight">
                                    <span className="hidden sm:inline">Assessment & Contest Portal</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1 text-slate-400">
                                        powered by{' '}
                                        <a
                                            href="https://zectral.vercel.app/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-[#4169e2] hover:text-[#587ef0] underline decoration-blue-500/50 underline-offset-2 hover:decoration-blue-400 transition-colors"
                                        >
                                            ZECTRAL
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs (Desktop) */}
                        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-[#4169e2] text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                All Quizzes ({quizzes.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('available')}
                                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${statusFilter === 'available' ? 'bg-[#4169e2] text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                Available ({availableCount})
                            </button>
                            <button
                                onClick={() => setStatusFilter('completed')}
                                className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer ${statusFilter === 'completed' ? 'bg-[#4169e2] text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                Submissions ({completedCount})
                            </button>
                        </nav>

                        {/* Right: User Profile & Logout */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-2xl border border-slate-800 shadow-2xs">
                                <div className="w-7 h-7 rounded-full bg-[#4169e2] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-bold text-white leading-tight">{user.fullName}</p>
                                    <p className="text-[10px] font-semibold text-slate-400 leading-tight">{user.rollNumber}</p>
                                </div>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Sub-Header Search & Quick Indicators */}
                    <div className="bg-[#0b101c]/80 border-t border-slate-800/80 w-full">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search quizzes by title..."
                                    className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4169e2] shadow-2xs"
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                                <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
                                    <ShieldCheck className="w-4 h-4 text-blue-400" /> Anti-Cheat Monitored
                                </span>
                                <span className="hidden sm:inline text-slate-600">•</span>
                                <span className="flex items-center gap-1 text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span> Live Assessments
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* 2. Main Content Body Area (Left Sidebar + Right Quiz Grid) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar */}
                    <aside ref={sidebarRef} className="w-full lg:w-72 shrink-0 space-y-6">
                        {/* Vibrant Dark Blue Hero Card */}
                        <div className="bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e1b4b] text-white rounded-3xl p-6 relative overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] border border-blue-500/25">
                            {/* Abstract Geometric Circle Elements in background */}
                            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full border border-blue-500/20 pointer-events-none"></div>
                            <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full border border-blue-500/10 pointer-events-none"></div>
                            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full border border-indigo-500/20 pointer-events-none"></div>
                            <div className="absolute top-1/2 right-4 w-3 h-3 rounded-full bg-blue-400/40 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="w-9 h-9 rounded-2xl bg-blue-500/20 backdrop-blur-xs border border-blue-400/30 flex items-center justify-center mb-4 shadow-sm text-blue-300">
                                    <Sparkles className="w-4.5 h-4.5" />
                                </div>
                                <h3 className="text-xl font-black leading-snug mb-2 text-white">
                                    Helix Club Quiz Assessment
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                                    Test your technical knowledge, solve timed challenges, and earn your ranking on the leaderboard.
                                </p>
                                <div className="p-3 bg-slate-900/60 backdrop-blur-xs border border-slate-700/60 rounded-2xl mb-2 text-xs text-slate-300 space-y-1.5 font-medium">
                                    <div className="flex items-center gap-2 text-sky-300">
                                        <Award className="w-3.5 h-3.5" /> No Negative Marking
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-300">
                                        <Timer className="w-3.5 h-3.5" /> Real-time Countdown
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-300">
                                        <Trophy className="w-3.5 h-3.5" /> Instant Scoring
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Pill Panel */}
                        <div className="bg-[#131b2e]/90 rounded-3xl p-5 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)] space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Overview</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-black text-white">{quizzes.length}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Available</p>
                                </div>
                                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
                                    <p className="text-xl font-black text-emerald-400">{completedCount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted</p>
                                </div>
                            </div>
                        </div>

                        {/* Per-Quiz Leaderboard Panel */}
                        {quizzes.map(quiz => {
                            const isSubmitted = !!submissions[quiz.id];
                            if (!isSubmitted) return null;
                            const mySubmission = submissions[quiz.id];
                            const formatSecs = (s) => {
                                if (s == null) return '—';
                                const m = Math.floor(s / 60);
                                const sec = s % 60;
                                return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
                            };
                            return (
                                <div key={quiz.id} className="bg-[#131b2e]/90 rounded-3xl p-5 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Trophy className="w-4 h-4 text-amber-400" />
                                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider truncate">{quiz.name}</h4>
                                    </div>
                                    <LeaderboardPanel quizId={quiz.id} myUserId={user.uid} formatSecs={formatSecs} />
                                </div>
                            );
                        })}
                    </aside>

                    {/* Right Quiz Grid */}
                    <main className="flex-1 min-w-0">
                        {/* Section Header Controls */}
                        <div ref={mainHeaderRef} className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">Active Tests & Quizzes</h2>
                                <p className="text-xs text-slate-400 font-medium">Select an assessment to start your test</p>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-bold">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#4169e2] cursor-pointer"
                                >
                                    <option value="latest">Latest First</option>
                                    <option value="marks">Highest Marks</option>
                                    <option value="duration">Shortest Duration</option>
                                </select>
                            </div>
                        </div>

                        {/* Quiz Cards Grid */}
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#4169e2] border-t-transparent mb-3"></div>
                                <p className="text-xs font-bold text-slate-400">Loading Available Quizzes...</p>
                            </div>
                        ) : filteredQuizzes.length === 0 ? (
                            <div className="bg-[#131b2e]/90 rounded-3xl border border-slate-800 p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                <div className="w-16 h-16 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <BookOpen className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-1">No Quizzes Found</h3>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'No quizzes match your current search or filter criteria.'
                                        : 'There are no quizzes published right now. Please check back later!'}
                                </p>
                            </div>
                        ) : (
                            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredQuizzes.map((quiz, index) => {
                                    const isSubmitted = !!submissions[quiz.id];
                                    const marksPerQ = quiz.marksPerQuestion ?? 4;
                                    const totalMarks = (quiz.questions?.length || 0) * marksPerQ;
                                    const theme = cardThemes[index % cardThemes.length];

                                    return (
                                        <div
                                            key={quiz.id}
                                            className={`gsap-quiz-card ${theme.bg} ${theme.border} border rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md`}
                                            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', willChange: 'transform' }}
                                            onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
                                            onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
                                        >
                                            <div>
                                                {/* Top Tag & Bookmark */}
                                                <div className="flex items-center justify-between gap-2 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${theme.tag} shadow-xs flex items-center gap-1.5`}>
                                                        <Clock className="w-3 h-3 text-blue-400" />
                                                        {quiz.duration} mins
                                                    </span>
                                                    <div className="w-7 h-7 rounded-full bg-slate-900/90 flex items-center justify-center shadow-2xs border border-slate-700/60">
                                                        <Award className="w-3.5 h-3.5 text-slate-400" />
                                                    </div>
                                                </div>

                                                {/* Category Subtitle */}
                                                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                                                    Helix Club • Quiz
                                                </p>

                                                {/* Quiz Name */}
                                                <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-4 line-clamp-2">
                                                    {quiz.name}
                                                </h3>

                                                {/* Badges / Information Tags */}
                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                    <span className="px-2.5 py-1 bg-slate-900/80 rounded-xl text-[11px] font-semibold text-slate-300 border border-slate-700/60 flex items-center gap-1">
                                                        <Hash className="w-3 h-3 text-blue-400" /> {quiz.questions?.length || 0} Questions
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-slate-900/80 rounded-xl text-[11px] font-semibold text-slate-300 border border-slate-700/60">
                                                        +{marksPerQ} Marks/Q
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-slate-900/80 rounded-xl text-[11px] font-semibold text-emerald-400 border border-slate-700/60">
                                                        0 -ve
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bottom Marks & Action Button */}
                                            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium">Total Marks</p>
                                                    <p className="text-base font-black text-white">{totalMarks} Pts</p>
                                                </div>

                                                {isSubmitted ? (
                                                    <div className="flex flex-col gap-1 items-end">
                                                        <div className="px-4 py-2 bg-emerald-600/90 text-white rounded-2xl text-xs font-bold shadow-sm flex items-center gap-1.5">
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            <span>Score: {submissions[quiz.id].score}/{submissions[quiz.id].totalMarks || totalMarks}</span>
                                                        </div>
                                                        {submissions[quiz.id].timeTaken != null && (
                                                            <div className="px-3 py-1 bg-slate-800/90 text-slate-300 rounded-xl text-[11px] font-semibold flex items-center gap-1 border border-slate-700/60">
                                                                <Timer className="w-3 h-3 text-amber-400" />
                                                                Time: {Math.floor(submissions[quiz.id].timeTaken / 60)}m {submissions[quiz.id].timeTaken % 60}s
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStartQuiz(quiz)}
                                                        className="px-5 py-2.5 bg-[#4169e2] hover:bg-[#3557c5] active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 group cursor-pointer"
                                                    >
                                                        <span>Start Quiz</span>
                                                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Bottom spacer */}
            <div className="w-full h-2"></div>
        </div>
    );
};

// Quiz Component (Active Test Interface - GSAP Animated)
const Quiz = ({ user, quiz, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const questionBoxRef = useRef(null);
    const optionsContainerRef = useRef(null);
    const exitModalRef = useRef(null);

    useAntiCheat(user, quiz.id, !submitted);

    // Trap browser back button & beforeunload event
    useEffect(() => {
        if (submitted) return;

        // Push state so back button can be intercepted
        window.history.pushState({ quizActive: true }, '');

        const handlePopState = () => {
            if (!submitted) {
                // Keep user in current URL state and open the submit modal
                window.history.pushState({ quizActive: true }, '');
                setShowExitModal(true);
            }
        };

        const handleBeforeUnload = (e) => {
            if (!submitted) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your quiz will not be saved.';
                return e.returnValue;
            }
        };

        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [submitted]);

    // GSAP Question Transition Animation
    useEffect(() => {
        if (questionBoxRef.current) {
            gsap.fromTo(
                questionBoxRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
        }
        if (optionsContainerRef.current) {
            gsap.fromTo(
                optionsContainerRef.current.children,
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [currentQuestion]);

    // GSAP Exit Modal Entrance
    useEffect(() => {
        if (showExitModal && exitModalRef.current) {
            gsap.fromTo(
                exitModalRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' }
            );
        }
    }, [showExitModal]);

    const handleTimeUp = async () => {
        if (!submitted) {
            await submitQuiz();
        }
    };

    const { timeLeft, formatTime } = useQuizTimer(
        quiz.duration * 60,
        handleTimeUp,
        !submitted
    );

    const quizStartTime = useRef(Date.now());

    const submitQuiz = async () => {
        if (submitted) return;

        setSubmitted(true);

        const timeTaken = Math.round((Date.now() - quizStartTime.current) / 1000);
        const marksPerQuestion = Number(quiz.marksPerQuestion) || 4;
        let score = 0;
        let correct = 0;
        let wrong = 0;
        let notAttempted = 0;

        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                score += marksPerQuestion;
                correct++;
            } else if (answers[idx] !== undefined) {
                wrong++;
            } else {
                notAttempted++;
            }
        });

        const totalMarks = quiz.questions.length * marksPerQuestion;

        try {
            await addDoc(collection(db, 'submissions'), {
                userId: user.uid,
                userName: user.fullName,
                rollNumber: user.rollNumber,
                quizId: quiz.id,
                quizName: quiz.name,
                score,
                totalQuestions: quiz.questions.length,
                marksPerQuestion,
                totalMarks,
                correct,
                wrong,
                notAttempted,
                timeTaken,
                answers,
                submittedAt: serverTimestamp()
            });

            onComplete({
                score,
                totalQuestions: quiz.questions.length,
                marksPerQuestion,
                totalMarks,
                correct,
                wrong,
                notAttempted
            });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
            setSubmitted(false);
        }
    };

    const handleAnswer = (optionIndex) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            if (newAnswers[currentQuestion] === optionIndex) {
                delete newAnswers[currentQuestion];
            } else {
                newAnswers[currentQuestion] = optionIndex;
            }
            return newAnswers;
        });
    };

    const question = quiz.questions[currentQuestion];
    const attemptedCount = Object.keys(answers).length;
    const notAttemptedCount = quiz.questions.length - attemptedCount;

    return (
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between font-sans relative overflow-hidden text-slate-100">
            {/* Ambient Background Gradient Blurs (Dark Glow) */}
            <div className="gsap-ambient-glow absolute top-1/6 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="gsap-ambient-glow absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Decorative Floating Circles */}
            <div className="absolute top-20 right-1/4 w-20 h-20 rounded-full border border-blue-500/20 pointer-events-none"></div>
            <div className="absolute top-36 left-1/3 w-3.5 h-3.5 rounded-full bg-indigo-500/40 pointer-events-none"></div>
            <div className="absolute bottom-28 left-16 w-12 h-12 rounded-full border border-blue-400/20 pointer-events-none"></div>

            <div className="relative z-10 flex-1">
                {/* Header (Dark Glassmorphic) */}
                <div className="bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 shadow-md">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowExitModal(true)}
                                className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                                title="Exit or Submit Quiz"
                            >
                                ← Exit
                            </button>
                            <img src={logoImg} alt="Helix Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(65,105,226,0.35)]" />
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">{quiz.name}</h2>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                    <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-slate-400">
                                        powered by{' '}
                                        <a
                                            href="https://zectral.vercel.app/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-[#4169e2] hover:text-[#587ef0] underline decoration-blue-500/50 underline-offset-2 hover:decoration-blue-400 transition-colors"
                                        >
                                            ZECTRAL
                                        </a>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-red-950/60 border border-red-800/80 px-3.5 py-1.5 rounded-2xl shadow-2xs">
                            <Clock className="w-4 h-4 text-red-400" />
                            <span className="font-mono text-base font-bold text-red-400">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Question Progress Bar */}
                <div className="w-full h-1 bg-slate-800/80">
                    <div
                        className="h-full bg-gradient-to-r from-[#4169e2] to-indigo-400 transition-all duration-500 ease-out relative overflow-hidden"
                        style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto px-3 py-1 text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {currentQuestion + 1} / {quiz.questions.length} questions
                    </span>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-6">
                    {/* Status Stats bar */}
                    <div className="bg-[#131b2e]/90 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-slate-800 p-4 mb-6 grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl font-black text-white">{quiz.questions.length}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</div>
                        </div>
                        <div className="text-center border-x border-slate-800">
                            <div className="text-xl sm:text-2xl font-black text-emerald-400">{attemptedCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attempted</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl sm:text-2xl font-black text-amber-400">{notAttemptedCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Not Attempted</div>
                        </div>
                    </div>

                    {/* Question Box (GSAP Animated) */}
                    <div ref={questionBoxRef} className="bg-[#131b2e]/90 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-slate-800 p-6 sm:p-8 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-800/60 rounded-full">
                                Question {currentQuestion + 1}
                            </span>
                            {question.codeSnippet && (
                                <span className="text-xs font-bold px-2.5 py-1 bg-violet-950/80 text-violet-300 border border-violet-800/60 rounded-full flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    {question.codeLanguage || 'code'}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 leading-relaxed">
                            {question.question}
                        </h3>

                        {/* Code Snippet Block */}
                        {question.codeSnippet && (
                            <div className="mb-6 rounded-2xl overflow-hidden border border-violet-800/50 shadow-[0_4px_20px_rgba(109,40,217,0.15)]">
                                {/* Code header bar */}
                                <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b2e] border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        {/* Traffic light dots */}
                                        <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
                                        <span className="w-3 h-3 rounded-full bg-amber-400/70"></span>
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/70"></span>
                                        <span className="ml-2 text-xs font-mono font-bold text-slate-400">
                                            {question.codeLanguage || 'code'}
                                        </span>
                                    </div>
                                    <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                {/* Code body */}
                                <pre className="bg-[#0d1117] px-5 py-4 overflow-x-auto text-sm leading-relaxed" style={{fontFamily:"'Fira Code','Cascadia Code','Consolas',monospace"}}>
                                    <code className="text-green-300 whitespace-pre">{question.codeSnippet}</code>
                                </pre>
                            </div>
                        )}

                        <div ref={optionsContainerRef} className="space-y-3">
                            {question.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all cursor-pointer ${answers[currentQuestion] === idx
                                        ? 'border-[#4169e2] bg-blue-950/70 shadow-[0_0_20px_rgba(65,105,226,0.15)] text-white'
                                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/70 text-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQuestion] === idx
                                            ? 'border-[#4169e2] bg-[#4169e2]'
                                            : 'border-slate-600'
                                            }`}>
                                            {answers[currentQuestion] === idx && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-base font-medium">{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="px-6 py-3 border border-slate-700 rounded-2xl font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer bg-slate-900"
                        >
                            ← Previous
                        </button>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={submitQuiz}
                                disabled={submitted}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 disabled:opacity-50 transition-all text-sm shadow-lg shadow-emerald-600/30 cursor-pointer"
                            >
                                {submitted ? 'Submitting...' : 'Submit Quiz ✓'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-7 py-3 bg-[#4169e2] text-white rounded-2xl font-bold hover:bg-[#3557c5] transition-all text-sm shadow-lg shadow-blue-600/30 cursor-pointer"
                            >
                                Next →
                            </button>
                        )}
                    </div>

                    {/* Question Palette */}
                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-4">Question Palette</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {quiz.questions.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestion(idx)}
                                    className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer ${answers[idx] !== undefined
                                        ? 'bg-emerald-600 text-white shadow-sm'
                                        : idx === currentQuestion
                                            ? 'bg-[#4169e2] text-white ring-2 ring-blue-400 shadow-sm'
                                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit on Back / Leave Popup Modal (GSAP Animated) */}
            {showExitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div ref={exitModalRef} className="bg-[#131b2e] border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
                        {/* Ambient inner glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                        {/* Warning Icon */}
                        <div className="w-16 h-16 bg-amber-950/80 border border-amber-800/80 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <AlertCircle className="w-8 h-8" />
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                            Submit Quiz Now?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                            You are attempting to leave the assessment. Would you like to submit your quiz now or continue taking the test?
                        </p>

                        {/* Progress Summary in Modal */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-lg font-black text-white">{quiz.questions.length}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Total</div>
                            </div>
                            <div className="border-x border-slate-800">
                                <div className="text-lg font-black text-emerald-400">{attemptedCount}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Attempted</div>
                            </div>
                            <div>
                                <div className="text-lg font-black text-amber-400">{notAttemptedCount}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase">Left</div>
                            </div>
                        </div>

                        {/* Exactly the 2 options for the student */}
                        <div className="space-y-3">
                            {/* Option 1: Submit Quiz */}
                            <button
                                onClick={async () => {
                                    setShowExitModal(false);
                                    await submitQuiz();
                                }}
                                disabled={submitted}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Yes, Submit Quiz ✓</span>
                            </button>

                            {/* Option 2: Cancel & Continue Quiz */}
                            <button
                                onClick={() => setShowExitModal(false)}
                                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-slate-200 rounded-2xl font-bold text-sm border border-slate-700 transition-all cursor-pointer"
                            >
                                Cancel & Continue Test ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom spacer */}
            <div className="w-full h-2"></div>
        </div>
    );
};

// Confetti Component for pass celebration
const Confetti = () => {
    const pieces = Array.from({ length: 48 }, (_, i) => i);
    const colors = ['#4169e2', '#818cf8', '#34d399', '#fbbf24', '#f472b6', '#60a5fa'];
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {pieces.map(i => {
                const color = colors[i % colors.length];
                const left = `${Math.random() * 100}%`;
                const delay = `${(Math.random() * 3).toFixed(2)}s`;
                const duration = `${(2.5 + Math.random() * 2).toFixed(2)}s`;
                const size = `${6 + Math.random() * 8}px`;
                const rotate = `${Math.random() * 360}deg`;
                return (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            left,
                            top: '-20px',
                            width: size,
                            height: size,
                            backgroundColor: color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            transform: `rotate(${rotate})`,
                            animation: `confettiFall ${duration} ${delay} ease-in forwards`,
                            opacity: 0.85
                        }}
                    />
                );
            })}
            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

// Result Component (Dark Theme - GSAP Animated)
const Result = ({ score, totalQuestions, totalMarks, correct, wrong, notAttempted, onBackToList }) => {
    const maxMarks = totalMarks || (totalQuestions * 4);
    const percentage = maxMarks > 0 ? ((score / maxMarks) * 100).toFixed(1) : '0.0';
    const isPassing = parseFloat(percentage) >= 50;
    const resultCardRef = useRef(null);
    const [displayScore, setDisplayScore] = useState(0);
    const [displayPercent, setDisplayPercent] = useState(0);

    useEffect(() => {
        if (resultCardRef.current) {
            gsap.fromTo(
                resultCardRef.current.children,
                { opacity: 0, y: 25, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.3)' }
            );
        }
        // Animate score counter
        const scoreTarget = score;
        const percentTarget = parseFloat(percentage);
        const duration = 1400;
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(scoreTarget * ease));
            setDisplayPercent((percentTarget * ease).toFixed(1));
            if (progress < 1) requestAnimationFrame(tick);
        };
        const raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-hidden text-slate-100">
            {isPassing && <Confetti />}
            {/* Ambient Background Gradient Blurs (Dark Glow) */}
            <div className="gsap-ambient-glow absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="gsap-ambient-glow absolute top-1/3 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Floating Geometric Elements */}
            <div className="absolute top-16 right-1/4 w-20 h-20 rounded-full border border-blue-500/20 pointer-events-none"></div>
            <div className="absolute bottom-24 left-1/4 w-12 h-12 rounded-full border border-blue-400/20 pointer-events-none"></div>

            <div ref={resultCardRef} className="bg-[#131b2e]/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-slate-800 p-8 sm:p-10 max-w-md w-full text-center my-auto relative z-10">
                {isPassing && (
                    <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent"></div>
                    </div>
                )}
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative ${isPassing ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.2)]' : 'bg-red-950/80 border border-red-800 text-red-400'}`}>
                    {isPassing ? (
                        <CheckCircle className="w-10 h-10" />
                    ) : (
                        <XCircle className="w-10 h-10" />
                    )}
                </div>

                <h2 className="text-2xl font-black text-white mb-1">{isPassing ? '🎉 Excellent Work!' : 'Quiz Completed!'}</h2>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Helix Club Quiz Submission</p>
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

                <div className="bg-slate-900/90 rounded-2xl p-6 mb-6 border border-slate-800 relative overflow-hidden">
                    {/* Circular progress ring */}
                    <div className="flex items-center justify-center mb-3">
                        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke={isPassing ? '#34d399' : '#f87171'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - parseFloat(percentage) / 100)}`}
                                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.25,1,0.5,1)' }}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <div className={`text-3xl font-black ${isPassing ? 'text-emerald-400' : 'text-red-400'}`}>{displayScore}</div>
                            <div className="text-[10px] font-bold text-slate-500">of {maxMarks} pts</div>
                        </div>
                    </div>
                    <div className="text-2xl font-black text-white">{displayPercent}%</div>
                    <div className="text-xs font-bold text-slate-400 mt-0.5">{isPassing ? 'Great performance!' : 'Keep practicing!'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 text-left">
                    <div className="bg-blue-950/40 rounded-2xl p-3 border border-blue-900/40">
                        <div className="text-lg font-black text-blue-400">{totalQuestions}</div>
                        <div className="text-[11px] font-semibold text-slate-400">Total Questions</div>
                    </div>
                    <div className="bg-purple-950/40 rounded-2xl p-3 border border-purple-900/40">
                        <div className="text-lg font-black text-purple-400">{correct + wrong}</div>
                        <div className="text-[11px] font-semibold text-slate-400">Attempted</div>
                    </div>
                    <div className="bg-emerald-950/40 rounded-2xl p-3 border border-emerald-900/40">
                        <div className="text-lg font-black text-emerald-400">{correct}</div>
                        <div className="text-[11px] font-semibold text-slate-400">Correct</div>
                    </div>
                    <div className="bg-red-950/40 rounded-2xl p-3 border border-red-900/40">
                        <div className="text-lg font-black text-red-400">{wrong}</div>
                        <div className="text-[11px] font-semibold text-slate-400">Wrong</div>
                    </div>
                    <div className="bg-amber-950/40 rounded-2xl p-3 border border-amber-900/40 col-span-2">
                        <div className="text-lg font-black text-amber-400">{notAttempted}</div>
                        <div className="text-[11px] font-semibold text-slate-400">Not Attempted</div>
                    </div>
                </div>

                <button
                    onClick={onBackToList}
                    className="w-full bg-[#4169e2] hover:bg-[#3557c5] text-white rounded-2xl px-6 py-3.5 font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                    Back to Quiz List →
                </button>
            </div>

            {/* Bottom spacer */}
            <div className="w-full h-2"></div>
        </div>
    );
};

// Dedicated Quiz Taking Screen Component for Route: /quiz/:quizId (Dark Theme)
export const QuizTakeScreen = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState(null);
    const [alreadySubmitted, setAlreadySubmitted] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserDetails({
                            ...firebaseUser,
                            fullName: userData.fullName,
                            rollNumber: userData.rollNumber
                        });
                    } else {
                        setUser(firebaseUser);
                    }
                } catch (err) {
                    console.error('Error fetching user details:', err);
                }
            } else {
                setUser(null);
                setUserDetails(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchQuizAndSubmission = async () => {
            if (!quizId) return;
            try {
                setLoading(true);
                const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
                if (quizDoc.exists()) {
                    setQuiz({ id: quizDoc.id, ...quizDoc.data() });
                } else {
                    setError('Quiz not found or it may have been removed.');
                }

                if (auth.currentUser) {
                    const subQuery = query(
                        collection(db, 'submissions'),
                        where('userId', '==', auth.currentUser.uid),
                        where('quizId', '==', quizId)
                    );
                    const subSnap = await getDocs(subQuery);
                    if (!subSnap.empty) {
                        setAlreadySubmitted(subSnap.docs[0].data());
                    }
                }
            } catch (err) {
                console.error('Error loading quiz:', err);
                setError('Failed to load quiz details.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAndSubmission();
    }, [quizId, userDetails]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4169e2] border-t-transparent"></div>
                    <p className="mt-4 text-sm font-bold text-slate-400">Loading Assessment Question Paper...</p>
                </div>
            </div>
        );
    }

    if (!userDetails) {
        return <AuthScreen onLogin={(u) => setUserDetails(u)} />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between items-center p-4 text-slate-100">
                <div className="w-full h-2"></div>
                <div className="bg-[#131b2e]/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 my-auto">
                    <div className="w-16 h-16 bg-red-950/80 border border-red-800 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Quiz Not Found</h2>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mb-4">
                        <span>powered by</span>
                        <a href="https://zectral.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#4169e2] underline">
                            ZECTRAL
                        </a>
                    </div>
                    <p className="text-xs text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3.5 bg-[#4169e2] hover:bg-[#3557c5] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                    >
                        ← Back to All Quizzes
                    </button>
                </div>
                <div className="w-full h-2"></div>
            </div>
        );
    }

    if (alreadySubmitted && !quizResult) {
        return (
            <div className="min-h-screen bg-[#0b0f17] flex flex-col justify-between items-center p-4 text-slate-100">
                <div className="w-full h-2"></div>
                <div className="bg-[#131b2e]/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 my-auto">
                    <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">Already Submitted!</h2>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
                        <span>powered by</span>
                        <a href="https://zectral.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#4169e2] underline">
                            ZECTRAL
                        </a>
                    </div>
                    <p className="text-xs text-slate-400 mb-6">You have already completed this test.</p>

                    <div className="bg-slate-900/90 p-5 rounded-2xl mb-6 border border-slate-800">
                        <div className="text-3xl font-black text-[#4169e2] mb-1">{alreadySubmitted.score}</div>
                        <div className="text-xs font-semibold text-slate-400">
                            out of {alreadySubmitted.totalMarks || (alreadySubmitted.totalQuestions * 4)} marks
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3.5 bg-[#4169e2] hover:bg-[#3557c5] text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                    >
                        ← Back to Quiz Dashboard
                    </button>
                </div>
                <div className="w-full h-2"></div>
            </div>
        );
    }

    if (quizResult) {
        return (
            <Result
                score={quizResult.score}
                totalQuestions={quizResult.totalQuestions}
                totalMarks={quizResult.totalMarks}
                correct={quizResult.correct}
                wrong={quizResult.wrong}
                notAttempted={quizResult.notAttempted}
                onBackToList={() => navigate('/')}
            />
        );
    }

    if (quiz) {
        return (
            <Quiz
                user={userDetails}
                quiz={quiz}
                onComplete={(result) => setQuizResult(result)}
            />
        );
    }

    return null;
};

// Main App Component for Route: /
export default function QuizzApp() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserDetails({
                            ...firebaseUser,
                            fullName: userData.fullName,
                            rollNumber: userData.rollNumber,
                            phone: userData.phone
                        });
                    } else {
                        // Profile missing — force re-auth
                        await signOut(auth);
                        setUserDetails(null);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                setUserDetails(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserDetails(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4169e2] border-t-transparent"></div>
                    <p className="mt-4 text-sm font-bold text-slate-400">Loading Helix Club Quiz...</p>
                </div>
            </div>
        );
    }

    if (!userDetails) {
        return <AuthScreen onLogin={(u) => setUserDetails(u)} />;
    }

    return (
        <QuizList
            user={userDetails}
            onLogout={handleLogout}
        />
    );
}