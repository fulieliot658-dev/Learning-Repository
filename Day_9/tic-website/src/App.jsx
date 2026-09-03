import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  Menu,
  X,
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Play,
  Video,
  Award,
  Users,
  Briefcase,
  Target,
  BookOpen,
  Calendar,
  Globe,
  Radio,
  Share2,
  Heart,
  CheckCircle,
  Lightbulb,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Cpu,
  GraduationCap,
  ArrowRight,
  Minimize2,
  Move,
  ThumbsUp,
  Flame,
} from "lucide-react";

// ==========================================
// DATA STRUCTURES & CONSTANTS
// ==========================================

const PARTNERS = [
  {
    name: "TIC Summit",
    url: "https://www.ticsummit.org/",
    logo: "./1631355902238.jpg",
    category: "Flagship Innovation Summit",
    tag: "Youth Innovation",
    desc: "Annual flagship technology summit hosting youth entrepreneurs, developers, and tech ecosystem builders.",
  },
  {
    name: "Skolarr",
    url: "https://www.skolarr.com/",
    logo: "./A Tic logo.jpg",
    category: "Educational Technology",
    tag: "EdTech Infrastructure",
    desc: "Digital learning platform accelerating student academic success and tech skill acquisition.",
  },
  {
    name: "AgricFresh",
    url: "https://www.agricfresh.com/",
    logo: "./1723577561905.jpg",
    category: "Agritech Partner",
    tag: "Supply Chain & Tech",
    desc: "Leveraging technological solutions to transform agricultural supply chains and food security.",
  },
  {
    name: "Open Dreams",
    url: "http://www.open-dreams.org/",
    logo: "./1631355902238.jpg",
    category: "Educational NGO",
    tag: "Scholarship & Mentorship",
    desc: "Empowering high-achieving scholars with educational access, mentorship, and international opportunities.",
  },
  {
    name: "DV2S Broadcast Channel",
    url: "https://www.youtube.com/@DV2S2025",
    logo: "./1723577561905.jpg",
    category: "Media & Broadcasting",
    tag: "Video & Streaming",
    desc: "Official broadcast channel streaming technology webinars, event keynotes, and student presentations.",
  },
  {
    name: "Nervtek",
    url: "https://www.nervtek.cc/",
    logo: "./nervtek_logo.jpg",
    category: "Technology Solutions",
    tag: "Software & Hardware",
    desc: "Engineering innovation hub delivering software development, IoT systems, and technical consulting.",
  },
  {
    name: "TogetTech",
    url: "https://www.togettech.ca/",
    logo: "./jamie_pajoel_international_logo.jpg",
    category: "International Incubator",
    tag: "Global Expansion",
    desc: "Connecting African tech innovators with North American technology networks and investment bridges.",
  },
  {
    name: "DelTech Hub",
    url: "https://deltechhub.space/",
    logo: "./nervtek_logo.jpg",
    category: "Startup Incubator",
    tag: "Coworking & Innovation",
    desc: "Tech ecosystem space supporting early-stage technical startups with hardware, mentorship, and cloud tools.",
  },
  {
    name: "MTN Cameroon",
    url: "http://www.mtn.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "Telecom Partner",
    tag: "Connectivity & Cloud",
    desc: "Telecommunications enterprise delivering mobile connectivity, digital payment, and infrastructure support.",
  },
  {
    name: "Orange Cameroon",
    url: "http://www.orange.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "Telecom & Digital Services",
    tag: "Digital Ecosystem",
    desc: "Global telecommunications leader providing enterprise connectivity and backing digital skills development.",
  },
  {
    name: "Camtel",
    url: "http://www.camtel.cm/",
    logo: "./ecobankcameroun_logo.jpg",
    category: "National Telecom Partner",
    tag: "Fiber & Infrastructure",
    desc: "Cameroon's national telecommunications provider backing optical fiber infrastructure and academic networks.",
  },
];

const STAFF_MEMBERS = [
  {
    name: "Mr. Bill Agha",
    role: "Founder & Current President",
    region: "Executive Leadership",
    bio: "Pioneering technology visionary driving youth empowerment, entrepreneurship, and digital transformation across Cameroon and Africa.",
    tag: "Leadership",
  },
  {
    name: "Mr. Nobert",
    role: "Vice President",
    region: "Executive Leadership",
    bio: "Co-leading strategic growth, organizational compliance, regional expansions, and high-impact partnership development.",
    tag: "Executive",
  },
  {
    name: "Azambou Yollande",
    role: "National Coordinator",
    region: "National Headquarters",
    bio: "Cameroonian tech and youth empowerment leader leading nationwide programs like TIC Summit, workshops, and hackathons reaching over 1,000+ students.",
    tag: "Coordination",
  },
  {
    name: "Afesi Ayafor Bill Adip",
    role: "South West Regional Coordinator",
    period: "2025/2026",
    region: "South West Region",
    bio: "Engineering student passionate about solving local challenges in electricity/internet connectivity to position Cameroon in technology and space advancement.",
    tag: "Regional Leader",
  },
  {
    name: "Njingti Shanelle",
    role: "Centre Regional Coordinator",
    period: "2025/2026",
    region: "Centre Region",
    bio: "Tech enthusiast and aspiring backend developer supporting youth-focused technology, community engagement, and digital skills delivery.",
    tag: "Regional Leader",
  },
  {
    name: "Ngoh Precious Fon",
    role: "Littoral Regional Coordinator",
    period: "2025/2026",
    region: "Littoral Region",
    bio: "Cloud computing advocate, Chief Program Officer at Skolarr Olympiads, and community builder focused on youth empowerment and problem solving.",
    tag: "Regional Leader",
  },
  {
    name: "Soh Talla Erick",
    role: "North West Regional Coordinator",
    period: "2025/2026",
    region: "North West Region",
    bio: "Computer Engineering student, founder of AntCodeHub, driving youth development through coding, digital skills, mentorship, branding, and marketing.",
    tag: "Regional Leader",
  },
  {
    name: "Punwo Komolo",
    role: "North West Regional Deputy",
    period: "2025/2026",
    region: "North West Region",
    bio: "Software Engineering student at College of Technology Bambili, passionate about climate change innovation, software engineering, and open mentorship.",
    tag: "Deputy Leader",
  },
  {
    name: "Mr. Afuh Flynn",
    role: "Lead Facilitator (Best Facilitator 2026)",
    region: "Bootcamp & Mentorship",
    bio: "Awarded Best Facilitator for the 2026 TiC Bootcamp. Expert instructor mentoring young talents in modern software and practical development.",
    tag: "Top Facilitator",
  },
  {
    name: "Mr. Bah Emmanuel",
    role: "Facilitator - Software & Bootcamp",
    region: "Technical Training",
    bio: "Core facilitator guiding students through full-stack software development, problem solving, and hands-on coding bootcamps.",
    tag: "Facilitator",
  },
  {
    name: "Mr. Kombou Daniel",
    role: "Facilitator - Summit & Workshops",
    region: "Technical Training",
    bio: "Technical mentor leading workshops and project building sessions during TIC Summit events across regions.",
    tag: "Facilitator",
  },
  {
    name: "Joyceline Ngwebeh Manjoh",
    role: "Communication Volunteer",
    period: "2023 - 2026",
    region: "Media & Outreach",
    bio: "Passionate about leadership and practical education in Africa. Bridging theoretical learning with hands-on creative and digital skills.",
    tag: "Volunteer",
  },
  {
    name: "Nsawir Hope Fonyuy",
    role: "Project Management Volunteer",
    period: "2023 - 2025",
    region: "Project Management",
    bio: "Medical student at KNUST Ghana using innovative thinking and project organization to improve community health access and drive youth change.",
    tag: "Volunteer",
  },
];

const PROGRAM_LIST = [
  {
    id: "tic-nationals",
    title: "TIC Nationals",
    category: "National Competition",
    desc: "Premier nationwide tech innovation challenge uniting top young minds from across all ten regions of Cameroon to build impactful solutions.",
    badge: "Flagship",
  },
  {
    id: "girls-for-tech",
    title: "#GirlsForTech",
    category: "Inclusion & STEM",
    desc: "Empowerment program designed to bridge the gender gap in technology by giving young women training in coding, AI, and digital leadership.",
    badge: "Social Impact",
  },
  {
    id: "sap",
    title: "Startup Acceleration Program (SAP)",
    category: "Incubation",
    desc: "Intensive venture building track providing seed resources, technical support, legal guidance, and mentorship to early-stage youth startups.",
    badge: "Entrepreneurship",
  },
  {
    id: "earn-digital",
    title: "Earn with Digital Skills",
    category: "Vocational & Freelancing",
    desc: "Practical training enabling youth to monetize skills in web development, graphic design, content creation, and remote freelancing.",
    badge: "Livelihood",
  },
  {
    id: "pre-seed",
    title: "TIC Pre-Seed Accelerator",
    category: "Venture Capital Preparation",
    desc: "Bridge program preparing high-potential student prototypes for institutional funding, angel investment, and global accelerator acceptance.",
    badge: "Investment",
  },
  {
    id: "techcrunch",
    title: "TechCrunch (Hackathon)",
    category: "Rapid Prototyping",
    desc: "48-hour continuous coding and design competition where teams collaborate under pressure to solve real business and community challenges.",
    badge: "Hackathon",
  },
  {
    id: "tic-summit",
    title: "TIC Summit",
    category: "Flagship Conference",
    desc: "The largest annual youth innovation summit in Cameroon featuring keynotes, product exhibitions, investor pitching, and ecosystem networking.",
    badge: "Annual Flagship",
  },
  {
    id: "tic-bootcamp",
    title: "TIC Bootcamp",
    category: "Intensive Tech Training",
    desc: "Hands-on coding and software engineering bootcamp mentored by industry experts like Best Facilitator 2026 Mr. Afuh Flynn.",
    badge: "Training",
  },
  {
    id: "tic-internship",
    title: "TIC Internship Program",
    category: "Professional Experience",
    desc: "Two to three-month structured internship placing students into live software development, marketing, and project management roles.",
    badge: "Career Growth",
  },
];

const MEDIA_CHANNELS = [
  {
    name: "TIC Summit Official YouTube",
    url: "https://www.youtube.com/@ticsummit",
    type: "YouTube Channel",
    desc: "Watch keynote addresses, summit highlights, and tech project showcases.",
    icon: Video,
  },
  {
    name: "TIC Summit Secondary Channel",
    url: "https://www.youtube.com/@TiCSummit-t9u",
    type: "YouTube Channel",
    desc: "Extended event streams, workshop archives, and student presentations.",
    icon: Radio,
  },
  {
    name: "Impact Hungry Media (Partner)",
    url: "https://www.youtube.com/@impacthungrymedia",
    type: "Podcast & Media Partner",
    desc: "In-depth podcast interviews with tech leaders, innovators, and entrepreneurs across Africa.",
    icon: Globe,
  },
  {
    name: "TIC Foundation Facebook Community",
    url: "https://www.facebook.com/TiCFoundation237/",
    type: "Social Community",
    desc: "Live updates, community announcements, photos, and event coverage.",
    icon: Share2,
  },
];

// ==========================================
// MAIN COMPONENT: APP
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Student",
    region: "Centre",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Close sidebar on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    try {
      if (supabase) {
        await supabase.from("registrations").insert([formData]);
      }
    } catch (err) {
      console.log("Supabase submission notice:", err);
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setShowSignUpModal(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "Student",
        region: "Centre",
      });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            onClick={() => handleTabChange("home")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="flex flex-col">
              <img 
  src="/path-to-your-logo/logo.png" 
  alt="TiC Foundation Logo" 
  className="h-9 w-auto object-contain" 
/>
            </div>
          </div>
          {/* Mobile Hamburger Trigger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Open Menu"
          >
            <Menu className="w-7 h-7 text-blue-800" />
          </button>
        </div>
      </header>

      {/* MOBILE SIDEBAR (SWIPE/SLIDE-OVER INSTEAD OF OVER-SATURATED DROP-DOWN) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />

          {/* Sidebar Container */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                    TiC
                  </div>
                  <span className="font-bold text-slate-900">Navigation</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="mt-6 flex flex-col space-y-2">
                {[
                  { id: "home", label: "Home" },
                  { id: "about", label: "About & Team" },
                  { id: "programs", label: "Programs" },
                  { id: "partners", label: "Partners & Investors" },
                  { id: "media", label: "Media & Blog" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-800 border-l-4 border-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Bottom CTA */}
            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setShowSignUpModal(true);
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl font-bold shadow-md hover:from-blue-800 hover:to-blue-900 transition-all text-center"
              >
                Sign Up Now
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                Empowering 50,000+ Cameroonian Youth
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeTab === "home" && (
          <HomeTab
            onNavigate={handleTabChange}
            onOpenSignUp={() => setShowSignUpModal(true)}
          />
        )}
        {activeTab === "about" && <AboutTab />}
        {activeTab === "programs" && (
          <ProgramsTab onOpenSignUp={() => setShowSignUpModal(true)} />
        )}
        {activeTab === "partners" && <PartnersTab />}
        {activeTab === "media" && <MediaTab />}
      </main>

      {/* MOVABLE AI CHATBOT PULSER */}
      <AiChatbotPulser />

      {/* SIGN UP MODAL */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Welcome!
                </h3>
                <p className="text-slate-600 text-sm">
                  Thank you for joining the TiC Foundation ecosystem. We will
                  contact you shortly with your onboarding details.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    Enrichment Platform
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    Join TiC Foundation
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Sign up to participate in programs, mentorship, and tech
                    bootcamps across Cameroon.
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="johndoe@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+237 6xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        I am a
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                      >
                        <option value="Student">Student</option>
                        <option value="Developer">Developer</option>
                        <option value="Entrepreneur">Entrepreneur</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Investor">Investor / Partner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Region
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) =>
                          setFormData({ ...formData, region: e.target.value })
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white"
                      >
                        <option value="Centre">Centre (Yaoundé)</option>
                        <option value="Littoral">Littoral (Douala)</option>
                        <option value="North West">North West (Bamenda)</option>
                        <option value="South West">South West (Buea)</option>
                        <option value="Other">Other Region</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all mt-2 text-sm"
                  >
                    Submit Registration
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center">
                  TiC
                </div>
                <span className="font-bold text-lg">TiC Foundation</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering Cameroonian youth through digital innovation, coding
                bootcamps, mentorship, and enterprise creation.
              </p>
              <div className="text-xs text-red-400 font-semibold">
                Serving 20,000+ Students Nationwide
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => handleTabChange("home")}
                    className="hover:text-white transition-colors"
                  >
                    Home Page
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("about")}
                    className="hover:text-white transition-colors"
                  >
                    About Leadership & Staff
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("programs")}
                    className="hover:text-white transition-colors"
                  >
                    All Programs & Hackathons
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("partners")}
                    className="hover:text-white transition-colors"
                  >
                    Partners & Investors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleTabChange("media")}
                    className="hover:text-white transition-colors"
                  >
                    Media, Blog & Videos
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Featured Programs
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>TIC Summit & Bootcamps</li>
                <li>#GirlsForTech Initiative</li>
                <li>Startup Acceleration Program (SAP)</li>
                <li>TechCrunch Hackathon</li>
                <li>Earn with Digital Skills</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Official Channels
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <a
                    href="https://www.youtube.com/@ticsummit"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-red-500" /> YouTube
                    @ticsummit
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@impacthungrymedia"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-red-500" /> Impact
                    Hungry Media
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/TiCFoundation237/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-400" /> Facebook
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© {new Date().getFullYear()} TiC Foundation Cameroon. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">
              Building African Tech Leaders with Simple & Actionable Tools.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// TAB 1: HOME PAGE (WHITE SUPER CONTAINER)
// ==========================================

function HomeTab({ onNavigate, onOpenSignUp }) {
  return (
    <div className="space-y-12 pb-16">
      {/* COMPACT & NON-OBSCURING WHITE WELCOME CONTAINER */}
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-red-600" />
            Empowering 1,000+ Cameroonian Youth
          </div>

          {/* FONT NOT MASSIVE - DIRECT CORE AIM */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Driving innovation and empowering the next generation of tech
            leaders.
          </h1>

          {/* VERY SIMPLE ENGLISH PURPOSE - NO AMBIGUITY */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            TiC Foundation provides young people in Cameroon with practical digital
            skills, coding bootcamps, startup mentorship, and nationwide pitch
            events to build real career opportunities.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={onOpenSignUp}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center gap-2"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("programs")}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all text-sm"
            >
              Explore Our Programs
            </button>
          </div>
        </div>
      </section>

      {/* CORE STATS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              number: "1,000+",
              label: "Students Reached",
              icon: Users,
              color: "text-blue-700",
            },
            {
              number: "10+",
              label: "Key Tech Programs",
              icon: BookOpen,
              color: "text-red-600",
            },
            {
              number: "11+",
              label: "Ecosystem Partners",
              icon: Globe,
              color: "text-blue-700",
            },
            {
              number: "4 Regions",
              label: "Active Operations",
              icon: Target,
              color: "text-red-600",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-2"
              >
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {stat.number}
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* KEY HIGHLIGHTED PROGRAMS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              Core Initiatives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Programs for Youth
            </h2>
          </div>
          <button
            onClick={() => onNavigate("programs")}
            className="mt-3 md:mt-0 text-sm font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            View All 9 Programs <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROGRAM_LIST.slice(0, 3).map((prog) => (
            <div
              key={prog.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">
                  {prog.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {prog.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {prog.desc}
                </p>
              </div>
              <button
                onClick={onOpenSignUp}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-blue-700 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-colors text-center"
              >
                Join Initiative
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK ABOUT SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Nationwide Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Led by Dedicated Leaders across Cameroon
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Under Founder Mr. Bill Agha, Vice President Mr. Nobert, and National
              Coordinator Azambou Yollande, our team organizes workshops,
              hackathons, and bootcamps to transform youth potential into tech enterprise.
            </p>
          </div>
          <button
            onClick={() => onNavigate("about")}
            className="whitespace-nowrap px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all text-sm"
          >
            Meet the Full Team
          </button>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// TAB 2: ABOUT & STAFF (UPDATED STAFF DATA)
// ==========================================

function AboutTab() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Our Team & Facilitators
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          The Staff Behind TiC Foundation
        </h1>
        <p className="text-slate-600 text-base mt-2 leading-relaxed">
          Meet our visionary founders, regional coordinators, lead facilitators,
          and dedicated volunteers driving technology education across Cameroon.
        </p>
      </div>

      {/* Leadership & Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STAFF_MEMBERS.map((staff, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">
                  {staff.tag}
                </span>
                {staff.period && (
                  <span className="text-xs text-slate-400 font-medium">
                    {staff.period}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{staff.name}</h3>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-0.5">
                {staff.role}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {staff.region}
              </p>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {staff.bio}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>TiC Official Staff</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TAB 3: PROGRAMS (SIMPLE & EASY TO USE)
// ==========================================

function ProgramsTab({ onOpenSignUp }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Youth Opportunities
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          TiC Foundation Programs
        </h1>
        <p className="text-slate-600 text-base mt-2">
          Simple, practical, and highly engaging programs designed for students,
          innovators, and aspiring software engineers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROGRAM_LIST.map((prog) => (
          <div
            key={prog.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                  {prog.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {prog.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{prog.title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {prog.desc}
              </p>
            </div>

            <button
              onClick={onOpenSignUp}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Sign Up For This Program <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TAB 4: PARTNERS & INVESTORS (WITH LOGO URLS)
// ==========================================

function PartnersTab() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Supporters
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Investors & Partners
        </h1>
        <p className="text-slate-600 text-base mt-2">
          We collaborate with leading institutions, telecommunication providers,
          educational NGOs, and media organizations to support young African innovators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PARTNERS.map((partner, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center space-x-4 mb-4">
                {/* Partner Image Placeholder URL */}
                <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if local image not found
                      e.target.style.display = "none";
                      e.target.parentNode.innerText = partner.name.substring(0, 2);
                      e.target.parentNode.className =
                        "w-14 h-14 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center text-lg";
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {partner.name}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[11px] font-semibold rounded-full mt-1">
                    {partner.tag}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                {partner.category}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {partner.desc}
              </p>
            </div>

            <a
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            >
              Visit Partner Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TAB 5: MEDIA, BLOG & PODCASTS
// ==========================================

function MediaTab() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600">
          Multimedia & News
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Blogs, Videos & Podcasts
        </h1>
        <p className="text-slate-600 text-base mt-2">
          Explore our latest video broadcasts, podcast episodes with Impact Hungry
          Media, hackathon recaps, and community stories.
        </p>
      </div>

      {/* Official Media Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEDIA_CHANNELS.map((chan, idx) => {
          const Icon = chan.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-red-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {chan.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {chan.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {chan.desc}
                </p>
              </div>

              <a
                href={chan.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Watch / Subscribe <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Sample Blog / Article Preview Section */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Featured Community Highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              Bootcamp Spotlight
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Highlights from the 2026 TiC Bootcamp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Award-winning facilitator Mr. Afuh Flynn guided over 100 students
              through full-stack engineering and cloud deployment skills in Yaoundé and Bamenda.
            </p>
            <div className="text-xs text-slate-400">Published: August 2026</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              Impact Podcast
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Impact Hungry Media: Youth Tech Leadership
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Listen to National Coordinator Azambou Yollande discuss bridging the
              gap between theoretical education and real-world tech innovation across Cameroon.
            </p>
            <div className="text-xs text-slate-400">Published: July 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MOVABLE / DRAGGABLE AI CHATBOT PULSER
// ==========================================

function AiChatbotPulser() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am the TiC Foundation AI Assistant. Ask me anything about our Staff (Mr. Bill Agha, Azambou Yollande, facilitators) or Programs (TIC Summit, Bootcamp, #GirlsForTech)!",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");

  // Position state for movable icon
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Handle Drag Start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Handle AI Chat Answer Query Logic
const handleSendMessage = (e) => {
  e.preventDefault();
  if (!inputQuery.trim()) return;

  const userText = inputQuery;
  const updatedMessages = [...messages, { sender: "user", text: userText }];
  setMessages(updatedMessages);
  setInputQuery("");

  // Helper function to generate clean timestamp
  const getFormattedTimestamp = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    return `[${timeStr} - ${dateStr}]`;
  };

  // Knowledge Search Logic
  setTimeout(() => {
    const timestamp = getFormattedTimestamp();
    const q = userText.toLowerCase().trim();

    let aiReply = `Hi! TiC Foundation is dedicated to empowering Cameroonian youth through digital skills, tech bootcamps, and startup support. You can reach out directly via our Sign Up button! ${timestamp}`;

    if (q.includes("time") || q.includes("date") || q.includes("clock")) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const formattedDate = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      aiReply = `The current time is ${formattedTime} on ${formattedDate}.`;
    } else if (q.includes("president") || q.includes("founder") || q.includes("bill agha") || q.includes("leadership") || q.includes("chairman") || q.includes("chiarman")) {
      aiReply = `Mr. Bill Agha is the Founder and current President of TiC Foundation, driving technology vision and youth empowerment across Cameroon. ${timestamp}`;
    } else if (q.includes("vice president") || q.includes("nobert") || q.includes("vp") || q.includes("co-lead")) {
      aiReply = `Mr. Anseh Norbert serves as the Vice President of TiC Foundation, co-leading strategic growth and organizational partnerships. ${timestamp}`;
    } else if (q.includes("yollande") || q.includes("coordinator") || q.includes("national coordinator")) {
      aiReply = `Azambou Yollande is the National Coordinator of TiC Foundation. She leads nationwide programs like TIC Summit, reaching over 1,000+ students across Cameroon. ${timestamp}`;
    } else if (q.includes("flynn") || q.includes("best facilitator")) {
      aiReply = `Mr. Afuh Flynn was awarded the Best Facilitator for the 2026 TiC Bootcamp for his outstanding instruction in software engineering! ${timestamp}`;
    } else if (q.includes("facilitator") || q.includes("bah") || q.includes("kombou")) {
      aiReply = `Our key facilitators include Mr. Bah Emmanuel (Logistics), Mr. Kombou Daniel (Software), and Mr. Afuh Flynn (Best TiC Bootcamp Facilitator 2026). ${timestamp}`;
    } else if (q.includes("girlsfortech") || q.includes("girls")) {
      aiReply = `#GirlsForTech is our specialized STEM program designed to bridge the gender gap in technology by training young women in coding and AI. ${timestamp}`;
    } else if (q.includes("bootcamp") || q.includes("summit")) {
      aiReply = `TIC Summit and TIC Bootcamp are our flagship events. The Summit brings together founders and investors, while the Bootcamp offers hands-on coding training. ${timestamp}`;
    } else if (q.includes("south west") || q.includes("adip")) {
      aiReply = `Afesi Ayafor Bill Adip is the South West Regional Coordinator (2025/2026), working on technology solutions for local power and internet challenges. ${timestamp}`;
    } else if (q.includes("centre") || q.includes("shanelle")) {
      aiReply = `Njingti Shanelle is the Centre Regional Coordinator (2025/2026), focusing on youth digital skills and backend software community engagement. ${timestamp}`;
    } else if (q.includes("littoral") || q.includes("precious")) {
      aiReply = `Ngoh Precious Fon is the Littoral Regional Coordinator (2025/2026) and Cloud advocate, who also serves as Chief Program Officer at Skolarr Olympiads. ${timestamp}`;
    } else if (q.includes("north west") || q.includes("talla") || q.includes("punwo")) {
      aiReply = `Soh Talla Erick is the North West Regional Coordinator (2025/2026, Founder of AntCodeHub) and Punwo Komolo serves as the North West Regional Deputy. ${timestamp}`;
    } else if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("greetings")) {
      aiReply = `Hi! Welcome to the TiC website where you can ask me about our staff and programs. How can I assist you today? ${timestamp}`;
    }

    setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
  }, 500);
};

  return (
    <>
      {/* MOVABLE PULSER ICON */}
      <div
        ref={dragRef}
        style={{
          position: "fixed",
          bottom: `${position.y}px`,
          right: `${position.x}px`,
          zIndex: 50,
        }}
        className="cursor-move group"
        onMouseDown={handleMouseDown}
      >
        <div className="relative flex items-center justify-center">
          {/* Pulsing Aura Rings */}
          <span className="absolute inline-flex h-14 w-14 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="absolute inline-flex h-12 w-12 rounded-full bg-blue-600 opacity-50 animate-pulse" />

          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-14 h-14 bg-gradient-to-r from-blue-700 to-red-600 rounded-full text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
            title="Drag to move, Click to chat"
          >
            <Bot className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* CHAT MODAL WINDOW */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: `${position.y + 65}px`,
            right: `${position.x}px`,
            zIndex: 50,
          }}
          className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[420px]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 to-slate-900 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">TiC AI Assistant</h4>
                <span className="text-[10px] text-blue-200 font-medium">
                  Staff & Program Info
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-300 hover:text-white rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-700 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-2 bg-white border-t border-slate-200 flex items-center gap-1.5"
          >
            <input
              type="text"
              placeholder="Ask about staff or programs..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-100 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}