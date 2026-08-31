import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";

// --- FULL PARTNER & INVESTOR DIRECTORY WITH AUTHENTIC LINKS ---
const PARTNERS = [
  {
    name: "TIC Summit",
    url: "https://www.ticsummit.org/",
    logo: "./1631355902238.jpg",
    category: "Flagship Innovation Summit",
    tag: "Youth Innovation",
    desc: "Annual flagship technology summit hosting youth entrepreneurs, developers, and tech ecosystem builders."
  },
  {
    name: "Skolarr",
    url: "https://www.skolarr.com/",
    logo: "./A Tic logo.jpg",
    category: "Educational Technology",
    tag: "EdTech Infrastructure",
    desc: "Digital learning platform accelerating student academic success and tech skill acquisition."
  },
  {
    name: "AgricFresh",
    url: "https://www.agricfresh.com/",
    logo: "./1723577561905.jpg",
    category: "Agritech Partner",
    tag: "Supply Chain & Tech",
    desc: "Leveraging technological solutions to transform agricultural supply chains and food security."
  },
  {
    name: "Open Dreams",
    url: "http://www.open-dreams.org/",
    logo: "./1631355902238.jpg",
    category: "Educational NGO",
    tag: "Scholarship & Mentorship",
    desc: "Empowering high-achieving scholars with educational access, mentorship, and international opportunities."
  },
  {
    name: "DV2S Broadcast Channel",
    url: "https://www.youtube.com/@DV2S2025",
    logo: "./1723577561905.jpg",
    category: "Media & Broadcasting",
    tag: "Video & Streaming",
    desc: "Official broadcast channel streaming technology webinars, event keynotes, and student presentations."
  },
  {
    name: "Nervtek",
    url: "https://www.nervtek.cc/",
    logo: "./nervtek_logo.jpg",
    category: "Technology Solutions",
    tag: "Software & Hardware",
    desc: "Engineering innovation hub delivering software development, IoT systems, and technical consulting."
  },
  {
    name: "TogetTech",
    url: "https://www.togettech.ca/",
    logo: "./jamie_pajoel_international_logo.jpg",
    category: "International Incubator",
    tag: "Global Expansion",
    desc: "Connecting African tech innovators with North American technology networks and investment bridges."
  },
  {
    name: "DelTech Hub",
    url: "https://deltechhub.space/",
    logo: "./nervtek_logo.jpg",
    category: "Startup Incubator",
    tag: "Coworking & Innovation",
    desc: "Tech ecosystem space supporting early-stage technical startups with hardware, mentorship, and cloud tools."
  },
  {
    name: "MTN Cameroon",
    url: "http://www.mtn.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "Telecom Partner",
    tag: "Connectivity & Cloud",
    desc: "Telecommunications enterprise delivering mobile connectivity, digital payment, and infrastructure support."
  },
  {
    name: "Orange Cameroon",
    url: "http://www.orange.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "Telecom & Digital Services",
    tag: "Digital Ecosystem",
    desc: "Global telecommunications leader providing enterprise connectivity and backing digital skills development."
  },
  {
    name: "Camtel",
    url: "http://www.camtel.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "National Telecom Partner",
    tag: "Fiber & Infrastructure",
    desc: "Cameroon's national telecommunications provider backing optical fiber infrastructure and academic networks."
  },
];

// --- VECTOR SVG ICON COMPONENT SUITE ---
const Icons = {
  Sun: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  Layers: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Volume2: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  ),
  BookOpen: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  LogOut: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Loader2: () => (
    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  MessageSquare: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Play: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pause: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  )
};

export default function App() {
  // --- APPLICATION STATE MANAGEMENT ---
  const [theme, setTheme] = useState(() => localStorage.getItem("tic_theme") || "dark");
  const [activeTab, setActiveTab] = useState("overview");

  // Supabase Auth State
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: "", text: "" });

  // Database States: Surveys
  const [surveys, setSurveys] = useState([]);
  const [surveyFilter, setSurveyFilter] = useState("All");
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveyForm, setSurveyForm] = useState({
    track: "Full-Stack Web Development",
    experience: "Beginner",
    goals: "",
  });

  // Database States: Feedback
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");

  // Storage State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Audio Broadcast State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "bot", text: "Welcome to Tech Innovation Center! Ask me about our 11 strategic partners, survey forms, or technical tracks." }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef(null);

  // --- LIFECYCLE LISTENERS & FETCHES ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSurveys();
    fetchFeedback();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tic_theme", theme);
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatOpen]);

  // --- AUTHENTICATION HANDLERS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage({ type: "", text: "" });

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthMessage({ type: "success", text: "Account created! Please check your email to verify." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });
        if (error) throw error;
        setAuthMessage({ type: "success", text: "Successfully authenticated." });
        setActiveTab("overview");
      }
    } catch (err) {
      setAuthMessage({ type: "error", text: err.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAuthMessage({ type: "success", text: "Signed out successfully." });
  };

  // --- DATABASE: SURVEYS ---
  const fetchSurveys = async () => {
    setSurveyLoading(true);
    const { data, error } = await supabase
      .from("surveys")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSurveys(data);
    setSurveyLoading(false);
  };

  const handleSurveySubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      setActiveTab("auth");
      setAuthMessage({ type: "error", text: "Please sign in to submit your survey." });
      return;
    }

    setSurveyLoading(true);
    const { error } = await supabase.from("surveys").insert([
      {
        user_id: session.user.id,
        user_email: session.user.email,
        track: surveyForm.track,
        experience: surveyForm.experience,
        goals: surveyForm.goals,
      },
    ]);

    if (error) {
      alert("Database Error: " + error.message);
    } else {
      setSurveyForm({ track: "Full-Stack Web Development", experience: "Beginner", goals: "" });
      fetchSurveys();
    }
    setSurveyLoading(false);
  };

  // --- DATABASE: FEEDBACK ---
  const fetchFeedback = async () => {
    setFeedbackLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setFeedbackList(data);
    setFeedbackLoading(false);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setFeedbackLoading(true);
    const { error } = await supabase.from("feedback").insert([
      {
        user_id: session ? session.user.id : null,
        user_email: session ? session.user.email : "Community Member",
        message: newFeedback,
      },
    ]);

    if (error) {
      alert("Feedback Error: " + error.message);
    } else {
      setNewFeedback("");
      fetchFeedback();
    }
    setFeedbackLoading(false);
  };

  // --- STORAGE BUCKET HANDLER ---
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select a file first.");
    if (!session) {
      setActiveTab("auth");
      return setAuthMessage({ type: "error", text: "Sign in required to upload files." });
    }

    setUploading(true);
    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("user-uploads")
      .upload(fileName, selectedFile);

    if (error) {
      alert("Upload Error: " + error.message);
    } else {
      setUploadedFiles((prev) => [...prev, { name: selectedFile.name, path: data.path }]);
      setSelectedFile(null);
      alert("File uploaded to Supabase storage bucket successfully.");
    }
    setUploading(false);
  };

  // --- SPEECH SYNTHESIS SPEECH ---
  const toggleSpeech = (text) => {
    if ("speechSynthesis" in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // --- CHATBOT ASSISTANT ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMsgList = [...chatMessages, { id: Date.now(), sender: "user", text: userText }];
    setChatMessages(newMsgList);
    setInputMessage("");

    setTimeout(() => {
      let botResponse = "The Tech Innovation Center partners with key African and international institutions.";
      const low = userText.toLowerCase();

      if (low.includes("partner") || low.includes("website") || low.includes("link")) {
        botResponse = "Our active partner network includes TIC Summit (ticsummit.org), Open Dreams (open-dreams.org), Skolarr (skolarr.com), AgricFresh (agricfresh.com), MTN, Orange, Camtel, Nervtek, TogetTech, DelTech Hub, and DV2S Broadcast.";
      } else if (low.includes("survey") || low.includes("track")) {
        botResponse = "Navigate to the Skill Survey tab to record your track preferences directly into our Supabase PostgreSQL database.";
      } else if (low.includes("auth") || low.includes("login")) {
        botResponse = "Click the Sign In button at the top right to create an account or sign in with your credentials.";
      }

      setChatMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: botResponse }]);
    }, 500);
  };

  const filteredSurveys = surveyFilter === "All"
    ? surveys
    : surveys.filter((s) => s.track === surveyFilter);

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>

      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 w-full" />

      {/* HEADER & NAVIGATION BAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
        theme === "dark" ? "bg-slate-950/80 border-slate-800/80" : "bg-white/80 border-slate-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab("overview")}>
            <div className="relative p-0.5 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 group-hover:scale-105 transition-transform">
              <img src="./A Tic logo.jpg" alt="TIC Logo" className="h-9 w-auto object-contain rounded-lg bg-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                Tech Innovation Center
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Ecosystem Portal
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
            {[
              { id: "overview", label: "Overview", icon: Icons.Layers },
              { id: "partners", label: "Partner Network", icon: Icons.Globe },
              { id: "survey", label: "Skill Survey", icon: Icons.FileText },
              { id: "podcast", label: "Audio Lecture", icon: Icons.Volume2 },
              { id: "blog", label: "Curriculum", icon: Icons.BookOpen },
              { id: "feedback", label: "Storage & Feedback", icon: Icons.Upload },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <IconComponent />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === "light" ? <Icons.Moon /> : <Icons.Sun />}
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-200">{session.user.email.split('@')[0]}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Session
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all"
                >
                  <Icons.LogOut />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("auth")}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs px-4 py-2 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Icons.User />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* OVERVIEW HERO & PARTNER TICKER */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-2xl">
              <div className="relative max-w-3xl space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                  <Icons.Sparkles /> Educational Platform
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Empowering African Innovators & The Next Generation Of Tech Entrepreneurs
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Tech Innovation Center coordinates skill acquisition, computer science training, database architecture, and startup acceleration in collaboration with our international partner ecosystem.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <button
                    onClick={() => setActiveTab("survey")}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    Take Skill Assessment <Icons.ArrowRight />
                  </button>
                  <button
                    onClick={() => setActiveTab("partners")}
                    className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    Explore 11 Partner Websites <Icons.Globe />
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK-ACCESS PARTNER LOGOS & LINKS */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  Institutional Partners & Digital Ecosystem Allies
                </h2>
                <p className="text-sm text-slate-400">Click any partner card to visit their official platform website</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {PARTNERS.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:border-blue-500/50 hover:shadow-xl transition-all text-center gap-3"
                  >
                    <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain rounded-lg p-1 bg-white shadow-sm group-hover:scale-105 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center justify-center gap-1">
                        {p.name} <Icons.ExternalLink />
                      </span>
                      <span className="text-[10px] text-cyan-500 font-semibold">{p.tag}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* DETAILED PARTNER NETWORK DIRECTORY */}
        {activeTab === "partners" && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Icons.Briefcase /> Ecosystem Collaboration Directory
              </span>
              <h2 className="text-2xl font-black">Official Web Platforms & Strategic Organizations</h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                The Tech Innovation Center framework integrates with leading educational institutions, incubators, agricultural innovation platforms, telecommunications infrastructure providers, and broadcast channels.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PARTNERS.map((p, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <img src={p.logo} alt={p.name} className="h-10 w-auto object-contain rounded-lg bg-white p-1" />
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-cyan-400 border border-blue-500/20 font-bold">
                        {p.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{p.name}</h3>
                      <span className="text-[10px] text-cyan-500 font-semibold">{p.tag}</span>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">{p.url}</span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Visit Website <Icons.ExternalLink />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUTHENTICATION */}
        {activeTab === "auth" && (
          <div className="max-w-md mx-auto my-8 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-2">
                <Icons.ShieldCheck />
              </div>
              <h2 className="text-2xl font-bold">{authMode === "signup" ? "Create Account" : "Sign In"}</h2>
              <p className="text-xs text-slate-400">Authenticated via Supabase PostgreSQL Auth</p>
            </div>

            {authMessage.text && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                authMessage.type === "error"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                <div className="mt-0.5">{authMessage.type === "error" ? <Icons.AlertCircle /> : <Icons.CheckCircle />}</div>
                <span>{authMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                {authLoading && <Icons.Loader2 />}
                {authMode === "signup" ? "Register Account" : "Authenticate"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setAuthMode(authMode === "signup" ? "login" : "signup");
                  setAuthMessage({ type: "", text: "" });
                }}
                className="text-xs text-cyan-500 hover:underline font-semibold"
              >
                {authMode === "signup" ? "Existing account? Sign In" : "Need an account? Register"}
              </button>
            </div>
          </div>
        )}

        {/* SKILL SURVEYS */}
        {activeTab === "survey" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400"><Icons.FileText /></span>
                Skill Assessment Survey
              </h2>
              
              <form onSubmit={handleSurveySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">Learning Track</label>
                  <select
                    value={surveyForm.track}
                    onChange={(e) => setSurveyForm({ ...surveyForm, track: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                    <option value="Systems Engineering & OS">Systems Engineering & OS</option>
                    <option value="Database Design & SQL">Database Design & SQL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Current Experience Level</label>
                  <select
                    value={surveyForm.experience}
                    onChange={(e) => setSurveyForm({ ...surveyForm, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">Technical Objectives</label>
                  <textarea
                    required
                    rows="4"
                    value={surveyForm.goals}
                    onChange={(e) => setSurveyForm({ ...surveyForm, goals: e.target.value })}
                    placeholder="Specify frameworks, tools, or architectural concepts you aim to learn..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={surveyLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {surveyLoading && <Icons.Loader2 />}
                  Submit Survey Record
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="font-bold text-base">Recorded Surveys ({filteredSurveys.length})</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filter Track:</span>
                  <select
                    value={surveyFilter}
                    onChange={(e) => setSurveyFilter(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                  >
                    <option value="All">All Tracks</option>
                    <option value="Full-Stack Web Development">Full-Stack</option>
                    <option value="Systems Engineering & OS">Systems</option>
                    <option value="Database Design & SQL">Databases</option>
                  </select>
                </div>
              </div>

              {surveyLoading && surveys.length === 0 ? (
                <div className="flex items-center justify-center p-12 text-slate-400">
                  <Icons.Loader2 />
                </div>
              ) : filteredSurveys.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-3xl dark:border-slate-800 text-slate-500 text-xs">
                  No submissions matching the filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSurveys.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-cyan-400">{item.track}</span>
                        <span className="text-[10px] text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.experience}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.user_email || "Anonymous"}</span>
                      </div>
                      <p className="text-slate-300 pt-1 leading-relaxed">{item.goals}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AUDIO BROADCAST */}
        {activeTab === "podcast" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Icons.Volume2 /> Speech Broadcast
                </span>
                <span className="text-xs text-slate-500">Browser Speech API</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black">Episode 1: Tech Center Ecosystem & Partner Alliances</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Overview of technical tracks, full-stack architecture, relational database setup, and collaboration with TIC Summit, Open Dreams, and Skolarr.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleSpeech("Welcome to the Tech Innovation Center audio briefing. Our platform connects developers and youth entrepreneurs with institutional partners including TIC Summit, Open Dreams, Skolarr, AgricFresh, Nervtek, and telecommunications leaders.")}
                    className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 transition-transform"
                  >
                    {isPlayingAudio ? <Icons.Pause /> : <Icons.Play />}
                  </button>
                  <div>
                    <span className="block text-xs font-bold">{isPlayingAudio ? "Playing Speech Synthesis..." : "Listen to Ecosystem Overview"}</span>
                    <span className="text-[10px] text-slate-500">{isPlayingAudio ? "Active Speech Synthesis" : "Click to play audio"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CURRICULUM BLOG */}
        {activeTab === "blog" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <article className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Engineering Curriculum</span>
              <h2 className="text-2xl font-bold">Practical Full-Stack Engineering & Database Architecture</h2>
              <p className="text-xs leading-relaxed text-slate-300">
                Building reliable software applications requires integrated knowledge of client interfaces, relational schemas, database normalization, session management, and cloud object storage. Through practical project development, engineers gain hands-on expertise with modern software development lifecycles.
              </p>
            </article>
          </div>
        )}

        {/* STORAGE & FEEDBACK */}
        {activeTab === "feedback" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400"><Icons.Upload /></span>
                Storage Bucket Upload
              </h2>
              <p className="text-xs text-slate-400">Upload documentation or code assignments to the Supabase storage bucket.</p>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-cyan-400 hover:file:bg-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {uploading && <Icons.Loader2 />}
                  Upload to Storage Bucket
                </button>
              </form>

              {uploadedFiles.length > 0 && (
                <div className="pt-2 border-t dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 mb-2">Session Uploads:</h4>
                  <ul className="space-y-1">
                    {uploadedFiles.map((f, i) => (
                      <li key={i} className="text-xs text-emerald-400 flex items-center gap-2">
                        <Icons.CheckCircle /> {f.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-cyan-400"><Icons.MessageSquare /></span>
                Platform Feedback
              </h2>

              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <textarea
                  required
                  rows="3"
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  placeholder="Share feedback regarding curriculum structure or platform features..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  disabled={feedbackLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-5 py-2.5 rounded-xl font-bold flex items-center gap-2"
                >
                  {feedbackLoading && <Icons.Loader2 />}
                  Submit Feedback
                </button>
              </form>

              <div className="space-y-3 pt-2 max-h-60 overflow-y-auto">
                {feedbackList.map((fb) => (
                  <div key={fb.id} className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-cyan-400">{fb.user_email || "Community Member"}</span>
                      <span className="text-[10px] text-slate-500">{new Date(fb.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300">{fb.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CHATBOT ASSISTANT */}
      <div className="fixed bottom-6 right-6 z-50">
        {isChatOpen ? (
          <div className="w-80 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-xs">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><Icons.Sparkles /> TIC Assistant</span>
              <button onClick={() => setIsChatOpen(false)} className="hover:opacity-80">✕</button>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white ml-auto"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about partners or courses..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none"
              />
              <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-2.5 rounded-xl">
                <Icons.Send />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs px-5 py-3.5 rounded-full shadow-2xl shadow-cyan-500/30 font-bold transition-transform hover:scale-105"
          >
            <Icons.MessageSquare /> Assistant
          </button>
        )}
      </div>

    </div>
  );
}