import React, { useState, useEffect, useRef } from "react";
import { get, set, del } from 'idb-keyval';
import { 
  Heart, 
  Gift, 
  Sparkles, 
  Music, 
  Image as ImageIcon, 
  BookOpen, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
  Grid,
  ChevronRight,
  Info,
  Settings,
  Upload,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Eye,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AudioPlayer from "./components/AudioPlayer";
import BirthdayGarden from "./components/BirthdayGarden";
import { MessageCard, GalleryPhoto } from "./types";

// Original Default Constants for Instant Resets or Fallbacks
const defaultWhispers: MessageCard[] = [
  {
    id: "laughter",
    title: "Your Laughter",
    subtitle: "The light in every room",
    content: "Whenever you laugh, the entire world gets slightly warmer and quieter. It is a soft melody of perfect, unfiltered happiness that heals the deepest parts of my soul. I celebrate you today because you carry that effortless joy everywhere.",
    icon: "💝"
  },
  {
    id: "strength",
    title: "Your Strength",
    subtitle: "Gentle yet unwavering",
    content: "You find magic in the daily quietude, showing an incredible, quiet resilience that leaves me in absolute awe. In every storm we navigate, your gentle hand reminds me that we are protected, loved, and always moving towards grace.",
    icon: "🕊️"
  },
  {
    id: "you",
    title: "Simply You",
    subtitle: "My sacred harbor",
    content: "There are no words in any library that fully capture the peace of just sitting next to you. In vanilla beige cafés or quiet rainy evenings, you are my home. Today, tomorrow, and for all the lifetimes ahead, you are my serene everything.",
    icon: "🎉"
  }
];

const defaultGallery: GalleryPhoto[] = [
  {
    id: "photo-1",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=700",
    caption: "Holding tight through seasons",
    size: "medium",
    cursiveNote: "Your hand, mine, forever aligned"
  },
  {
    id: "photo-2",
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=700",
    caption: "Chasing golden-hour rays",
    size: "tall",
    cursiveNote: "Where the sky is our canvas"
  },
  {
    id: "photo-3",
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=700",
    caption: "Chasing shadows and flowers",
    size: "small",
    cursiveNote: "Wild flowers in soft bloom"
  },
  {
    id: "photo-4",
    url: "https://images.unsplash.com/photo-1501901657958-c9653243f884?auto=format&fit=crop&q=80&w=700",
    caption: "Sunny weekend picnic daze",
    size: "medium",
    cursiveNote: "Lazy afternoons and sweet teas"
  },
  {
    id: "photo-5",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=700",
    caption: "A vintage candid laugh",
    size: "tall",
    cursiveNote: "Your radiant soul"
  }
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [showGarden, setShowGarden] = useState(false);
  const [flowerBurst, setFlowerBurst] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const [stars, setStars] = useState<{ id: number; top: number; left: number; scale: number; delay: number }[]>([]);

  // 1. Detect Admin hash location route
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const hash = window.location.hash;
    return hash === "#admin" || hash === "##admin";
  });

  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimerRef = useRef<any>(null);

  // 2. Load dynamic customizable texts with backend persistence
  const [coverTitle, setCoverTitle] = useState("Happy Birthday, My Everything");
  const [coverGreeting, setCoverGreeting] = useState("For my only one,");
  const [coverSub, setCoverSub] = useState("Celebrating the day the universe bloomed with your presence. A collection of whispers and memories.");
  const [coverSecretTag, setCoverSecretTag] = useState("Secret");

  // Love Letter State Elements
  const [letterTitle, setLetterTitle] = useState("A Memoir in Bloom");
  const [letterGreeting, setLetterGreeting] = useState("My Sweetheart,");
  const [letterParagraphs, setLetterParagraphs] = useState<string[]>([
    "There is a particular kind of quiet grace that came into my existence the moment you stepped into it. Sometimes, on normal weekday afternoons, I find myself looking at you while you read or giggle, and I am struck by how completely lucky I am. To be loved by you is to understand what warmth feels like in a chaotic universe.",
    "Our journey feels like a beautiful slow-spinning vinyl record. In every note and crackle, there is a signature of our togetherness—the cozy tea dates, our quiet whispered dreams under silver moonlight, and the absolute peacefulness that blankets me whenever you are near. You don't just occupy space in my life; you cultivate it, transforming ordinary corners into vibrant, sweet gardens.",
    "Today, as you celebrate another calendar orbit, my only wish is for you to know how deeply and entirely you are celebrated. You are my home, my soft morning tea, my everything.",
    "May the cosmos continue to bless your paths, your laughter never grow dim, and your gentle heart always find its comfy cream harbor right here. Happy Birthday, my moonlit melody. Forever yours."
  ]);
  const [letterSignature, setLetterSignature] = useState("Forever Devoted, Always");

  // Music State Configuration
  const [musicTitle, setMusicTitle] = useState("Semua Aku Dirayakan");
  const [musicArtist, setMusicArtist] = useState("by Nadin Amizah (Chords Synth)");
  const [customAudioUrl, setCustomAudioUrl] = useState("");

  const [musicMelody, setMusicMelody] = useState("semua_aku");

  // Gallery Photos Custom List 
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(defaultGallery);

  // Whispers Custom Cards List
  const [whisperCards, setWhisperCards] = useState<MessageCard[]>(defaultWhispers);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch initial data from server
  useEffect(() => {
    fetch("/api/data")
      .then(r => r.json())
      .then(data => {
        if (data.coverTitle) setCoverTitle(data.coverTitle);
        if (data.coverGreeting) setCoverGreeting(data.coverGreeting);
        if (data.coverSub) setCoverSub(data.coverSub);
        if (data.coverSecretTag) setCoverSecretTag(data.coverSecretTag);
        
        if (data.letterTitle) setLetterTitle(data.letterTitle);
        if (data.letterGreeting) setLetterGreeting(data.letterGreeting);
        if (data.letterParagraphs) setLetterParagraphs(data.letterParagraphs);
        if (data.letterSignature) setLetterSignature(data.letterSignature);
        
        if (data.musicTitle) setMusicTitle(data.musicTitle);
        if (data.musicArtist) setMusicArtist(data.musicArtist);
        if (data.musicMelody) setMusicMelody(data.musicMelody);
        if (data.customAudioUrl) setCustomAudioUrl(data.customAudioUrl);
        
        if (data.galleryPhotos) setGalleryPhotos(data.galleryPhotos);
        if (data.whisperCards) setWhisperCards(data.whisperCards);
      })
      .catch(e => console.warn("Could not load server data:", e))
      .finally(() => setIsDataLoaded(true));
  }, []);

  // Save changes to backend automatically when variables update
  useEffect(() => {
    if (!isDataLoaded) return;
    
    const dataToSave = {
      coverTitle, coverGreeting, coverSub, coverSecretTag,
      letterTitle, letterGreeting, letterParagraphs, letterSignature,
      musicTitle, musicArtist, musicMelody, customAudioUrl,
      galleryPhotos, whisperCards
    };

    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave)
    }).catch(e => console.error("Failed to auto-save to server", e));
  }, [
    isDataLoaded,
    coverTitle, coverGreeting, coverSub, coverSecretTag,
    letterTitle, letterGreeting, letterParagraphs, letterSignature,
    musicTitle, musicArtist, musicMelody, customAudioUrl,
    galleryPhotos, whisperCards
  ]);

  // State elements for adding new photo inside the admin menu
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");
  const [newPhotoNote, setNewPhotoNote] = useState("");
  const [newPhotoSize, setNewPhotoSize] = useState<"large" | "medium" | "small" | "tall">("medium");
  const [imageUploadError, setImageUploadError] = useState("");

  // Listen to hash change to toggle Admin Panel in real-time
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      setIsAdminMode(hash === "#admin" || hash === "##admin");
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Refs for auto-scrolling options once screens unlock
  const screenRefs = {
    1: useRef<HTMLDivElement>(null),
    2: useRef<HTMLDivElement>(null),
    3: useRef<HTMLDivElement>(null),
    4: useRef<HTMLDivElement>(null),
    5: useRef<HTMLDivElement>(null),
    6: useRef<HTMLDivElement>(null)
  };

  // Generate random stars for page 1 backdrop
  useEffect(() => {
    const starArray = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      scale: 0.4 + Math.random() * 0.7,
      delay: Math.random() * 5
    }));
    setStars(starArray);
  }, []);

  // Smooth scroll reactive listener for screen changes to ensure perfect UX transitions in single-screen scrollers
  useEffect(() => {
    if (isOpen && activeScreen > 1) {
      const ref = screenRefs[activeScreen as keyof typeof screenRefs];
      if (ref && ref.current) {
        const timer = setTimeout(() => {
          ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [activeScreen, isOpen]);

  // Handle gift open trigger
  const handleOpenGift = (e: React.MouseEvent) => {
    // Note: Removed the Web Audio chime (bib bib bib) as user requested default sound to be disabled.

    // Generate flower burst emojis
    const flowerEmojis = ["🌹", "🌸", "🌺", "🌼", "🎉", "💝", "🍃", "🌿", "🌸"];
    const bursts = Array.from({ length: 30 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 250;
      return {
        id: i + Date.now(),
        emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      };
    });
    setFlowerBurst(bursts);

    // Delay slightly to enjoy the cinematic flower explosion and the audio chime on Page 1 first
    setTimeout(() => {
      setIsOpen(true);
      setActiveScreen(2);
    }, 1500);
  };

  const jumpToScreen = (screenNumber: number) => {
    if (screenNumber === 1) {
      setIsOpen(false);
      setActiveScreen(1);
      setFlowerBurst([]);
      return;
    }
    setActiveScreen(screenNumber);
    // Use short timeout to ensure DOM content is updated before scrolling
    setTimeout(() => {
      screenRefs[screenNumber as keyof typeof screenRefs].current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleLogoClick = () => {
    jumpToScreen(1);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    clickTimerRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2500);

    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        window.location.hash = "admin";
        setIsAdminMode(true);
        return 0;
      }
      return next;
    });
  };

  // Convert uploaded image and POST to backend
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    try {
      setImageUploadError("Uploading...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setNewPhotoUrl(data.url);
        setImageUploadError("");
      } else {
        setImageUploadError("Server failed to upload image.");
      }
    } catch (e) {
      setImageUploadError("Network error on upload.");
    }
  };

  // Save uploaded custom MP3 securely using server upload API
  const handleMusicFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Fail MP3 terlalu besar! Sila gunakan fail di bawah 15MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setCustomAudioUrl(data.url);
        setMusicMelody("custom");
        alert("Fail MP3 kustom berjaya dimuat naik (Tersimpan di server)!");
      }
    } catch(err) {
      console.error(err);
      alert("Ralat semasa menyimpan ke pelayan.");
    }
  };

  // Safe function to save dynamic picture addition inside admin panel
  const handleAddNewPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhotoItem: GalleryPhoto = {
      id: "photo-" + Date.now(),
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || "Cherished Snapshot",
      size: newPhotoSize,
      cursiveNote: newPhotoNote.trim() || "Love is captured here"
    };

    setGalleryPhotos(prev => [newPhotoItem, ...prev]);
    setNewPhotoUrl("");
    setNewPhotoCaption("");
    setNewPhotoNote("");
    setImageUploadError("");
  };

  // Delete picture from gallery
  const handleDeletePhoto = (id: string) => {
    setGalleryPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Reset to original cozy themes instantly
  const handleResetToDefaults = () => {
    if (window.confirm("Restore Nadin Amizah theme, original letter, and photographs defaults?")) {
      setCoverTitle("Happy Birthday, My Everything");
      setCoverGreeting("For my only one,");
      setCoverSub("Celebrating the day the universe bloomed with your presence. A collection of whispers and memories.");
      setCoverSecretTag("Secret");
      setLetterTitle("A Memoir in Bloom");
      setLetterGreeting("My Sweetheart,");
      setLetterParagraphs([
        "There is a particular kind of quiet grace that came into my existence the moment you stepped into it. Sometimes, on normal weekday afternoons, I find myself looking at you while you read or giggle, and I am struck by how completely lucky I am. To be loved by you is to understand what warmth feels like in a chaotic universe.",
        "Our journey feels like a beautiful slow-spinning vinyl record. In every note and crackle, there is a signature of our togetherness—the cozy tea dates, our quiet whispered dreams under silver moonlight, and the absolute peacefulness that blankets me whenever you are near. You don't just occupy space in my life; you cultivate it, transforming ordinary corners into vibrant, sweet gardens.",
        "Today, as you celebrate another calendar orbit, my only wish is for you to know how deeply and entirely you are celebrated. You are my home, my soft morning tea, my everything.",
        "May the cosmos continue to bless your paths, your laughter never grow dim, and your gentle heart always find its comfy cream harbor right here. Happy Birthday, my moonlit melody. Forever yours."
      ]);
      setLetterSignature("Forever Devoted, Always");
      setMusicTitle("Semua Aku Dirayakan");
      setMusicArtist("by Nadin Amizah (Chords Synth)");
      setMusicMelody("semua_aku");
      setCustomAudioUrl("");
      setGalleryPhotos(defaultGallery);
      setWhisperCards(defaultWhispers);
      
      fetch("/api/data/reset", { method: "POST" })
        .catch(e => console.error("Failed to reset server db", e));
      
      alert("Succesfully restored perfect defaults!");
    }
  };

  // Exit Admin View to preview the beautiful template
  const handleExitAdmin = () => {
    window.location.hash = "";
    setIsAdminMode(false);
  };

  // Edit whisper content safely
  const updateWhisperCardField = (id: string, field: "title" | "subtitle" | "content" | "icon", value: string) => {
    setWhisperCards(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  // Edit paragraph of letter
  const updateLetterParagraph = (index: number, value: string) => {
    setLetterParagraphs(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-cream-bg text-chocolate antialiased relative selection:bg-rose-accent/30 selection:text-chocolate font-sans overflow-x-hidden w-full">
      
      {/* Absolute Backdrop Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ivory warm organic visual details */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-ivory-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-accent/5 blur-[120px]" />
        
        {/* Floating Design Accents: Fine Gold Micro-Stars from Editorial Template */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-[#D4AF37] rounded-full opacity-40"></div>
        <div className="absolute top-40 left-1/4 w-2 h-2 bg-[#D4AF37] rounded-full opacity-25"></div>
        <div className="absolute bottom-32 right-12 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-35"></div>
        <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-[#D4AF37] rounded-full opacity-40"></div>
        
        {/* Floating Stars for Cover Backdrop */}
        {!isAdminMode && activeScreen === 1 && stars.map((s) => (
          <div 
            key={s.id}
            className="absolute bg-champagne/40 rounded-full w-1 h-1"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--scale": s.scale,
              animation: `float-slow 4s ease-in-out infinite`,
              animationDelay: `${s.delay}s`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* FLOATING TOP BRANDING BAR */}
      <nav id="branding-nav-header" className="fixed top-0 inset-x-0 z-40 bg-cream-bg/95 backdrop-blur-md border-b border-cream-border px-3.5 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between shadow-xs">
        <div className="flex flex-row items-baseline gap-1.5 cursor-pointer max-w-[35%] sm:max-w-none shrink-0" onClick={handleLogoClick}>
          <span className="font-cursive text-2xl sm:text-3xl md:text-4xl text-terracotta leading-none">Ivory & Rose</span>
          <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-champagne hidden sm:inline">
            // A Birthday Serenade
          </span>
        </div>

        {/* Global Nav Indicator */}
        <div className="flex items-center gap-2 sm:gap-4 max-w-[65%] sm:max-w-none justify-end">
          {isAdminMode ? (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-terracotta bg-terracotta/10 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-terracotta/25 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              Admin Mode Panel
            </span>
          ) : isOpen ? (
            <div className="flex items-center space-x-2.5 sm:space-x-5 text-[10px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase font-bold text-chocolate/85 overflow-x-auto no-scrollbar max-w-[200px] min-[400px]:max-w-[260px] sm:max-w-none whitespace-nowrap py-1">
              {[
                { num: 2, label: "The Music" },
                { num: 3, label: "The Greeting" },
                { num: 4, label: "The Letter" },
                { num: 5, label: "Whispers" },
                { num: 6, label: "Gallery" }
              ].map((s) => (
                <button
                  key={s.num}
                  onClick={() => jumpToScreen(s.num)}
                  className={`py-1 text-[9px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.18em] uppercase transition-all duration-300 font-bold cursor-pointer hover:text-chocolate relative shrink-0 ${
                    activeScreen === s.num
                      ? "text-chocolate border-b-2 border-champagne"
                      : "text-chocolate/50 hover:opacity-100"
                  }`}
                >
                  <span className="hidden md:inline">{s.label}</span>
                  <span className="md:hidden">{s.label.split(" ").pop()}</span>
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold text-chocolate/60 bg-cream-card/60 px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-cream-border/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              Locked Gift Inside
            </span>
          )}

          {/* Settings icon redirecting to Admin panel - only visible when already in Admin mode to allow closing/exiting easily */}
          {isAdminMode && (
            <button 
              id="admin-settings-panel-toggle-btn"
              onClick={() => {
                if (isAdminMode) {
                  handleExitAdmin();
                } else {
                  window.location.hash = "admin";
                  setIsAdminMode(true);
                }
              }}
              title={isAdminMode ? "Exit Control Room" : "Go to Admin Dashboard"}
              className={`w-8 h-8 sm:w-9 sm:h-9 border rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                isAdminMode 
                  ? "bg-chocolate border-chocolate text-cream-bg hover:bg-terracotta hover:border-terracotta" 
                  : "border-cream-border text-chocolate hover:bg-cream-border/40"
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </nav>

      {/* MAIN CONTAINER STREAM */}
      <main className="relative z-10 w-full pt-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          
          {/* ========================================================= */}
          {/* ADMIN ROOM VIEW CONTROLLER */}
          {/* ========================================================= */}
          {isAdminMode ? (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="max-w-4xl mx-auto px-4 py-8 mt-4 relative z-20 space-y-8"
            >
              {/* Header Title Block */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-[0_15px_40px_rgba(61,38,26,0.02)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-terracotta block">
                    Customization Suite
                  </span>
                  <h1 className="font-serif text-3xl font-normal text-chocolate tracking-tight">
                    Serenade Admin Canvas
                  </h1>
                  <p className="text-xs text-chocolate/70 leading-relaxed font-sans max-w-lg font-semibold">
                    Silakan ubah tulisan kado, atur instrumen musik synth analog, dan upload foto collage terbaikmu di bawah ini. Semua perubahan tersimpan otomatis di browser pengguna!
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleResetToDefaults}
                    className="px-4 py-2.5 bg-cream-bg hover:bg-cream-border text-chocolate border border-cream-border rounded text-xs font-semibold font-sans tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                    title="Kembalikan semua teks & foto ke pengaturan awal"
                  >
                    <RotateCcw className="w-4 h-4 text-chocolate" />
                    <span>Reset Original</span>
                  </button>
                  <button
                    onClick={handleExitAdmin}
                    className="px-5 py-2.5 bg-chocolate hover:bg-terracotta text-cream-bg rounded text-xs font-semibold font-sans tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4 text-cream-bg" />
                    <span>Selesai & Lihat</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: COVER GREETINGS & INTRO */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-cream-border/60 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate">
                    1. Cover & Aesthetic Main Greeting
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Greeting Top Accent</label>
                    <input 
                      type="text" 
                      value={coverGreeting} 
                      onChange={(e) => setCoverGreeting(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-serif text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Secret Pill Label Tag</label>
                    <input 
                      type="text" 
                      value={coverSecretTag} 
                      onChange={(e) => setCoverSecretTag(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-sans font-bold text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Cover Main Title (Use Tag &lt;br/&gt; for linebreaks)</label>
                    <input 
                      type="text" 
                      value={coverTitle} 
                      onChange={(e) => setCoverTitle(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-serif font-bold text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Cover Subtitle Poem</label>
                    <textarea 
                      value={coverSub} 
                      onChange={(e) => setCoverSub(e.target.value)}
                      rows={2}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-sans leading-relaxed text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: AUDIO SYNTH & VINYL SCALE SELECTION */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-cream-border/60 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <Music className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate">
                    2. Background Music & Chords Synthesizer
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Music Title Display</label>
                    <input 
                      type="text" 
                      value={musicTitle} 
                      onChange={(e) => setMusicTitle(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-sans font-semibold text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Artist & Instrument Label</label>
                    <input 
                      type="text" 
                      value={musicArtist} 
                      onChange={(e) => setMusicArtist(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-sans font-semibold italic text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                  {/* Manual MP3 Audio Uploader */}
                  <div className="sm:col-span-2 space-y-2 border-t border-cream-border/40 pt-4 mt-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block">
                      Manual MP3 Audio Upload (Custom)
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div className="space-y-1.5">
                        <input 
                          type="file" 
                          id="manual-music-mp3-uploader"
                          accept="audio/mp3,audio/mpeg"
                          onChange={handleMusicFileUpload}
                          className="block w-full text-xs text-chocolate/80
                            file:mr-4 file:py-2 file:px-4
                            file:rounded file:border-0
                            file:text-xs file:font-semibold
                            file:bg-chocolate file:text-cream-bg
                            file:cursor-pointer hover:file:bg-terracotta
                            cursor-pointer"
                        />
                        <p className="text-[9px] text-chocolate/50 font-sans">
                          Saranan: Gunakan file MP3 instrumental / lofi di bawah 2MB agar muat di storan lokal (localStorage).
                        </p>
                      </div>

                      <div className="bg-cream-bg/30 p-3 rounded-lg border border-cream-border flex items-center justify-between text-xs">
                        <div className="truncate max-w-[200px]">
                          <span className="font-bold text-chocolate/70 block text-[9px] uppercase tracking-wider">Status MP3 Kustom:</span>
                          <span className="font-semibold text-chocolate truncate">
                            {customAudioUrl ? "✅ MP3 sedia dimainkan" : "⚠️ Tiada fail dimuat naik"}
                          </span>
                        </div>
                        {customAudioUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomAudioUrl("");
                              if (musicMelody === "custom") {
                                setMusicMelody("semua_aku");
                              }
                            }}
                            className="bg-red-500/15 text-red-600 border border-red-500/25 text-[10px] px-2.5 py-1 rounded font-bold hover:bg-red-500/25 transition-all cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: THE LOVE LETTER MEMOIR */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-cream-border/60 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate">
                    3. Letter of Love & Devotion
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Heading Accent Indicator</label>
                      <input 
                        type="text" 
                        value={letterTitle} 
                        onChange={(e) => setLetterTitle(e.target.value)}
                        className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-serif text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Recipient Salutation</label>
                      <input 
                        type="text" 
                        value={letterGreeting} 
                        onChange={(e) => setLetterGreeting(e.target.value)}
                        className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-serif italic text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                      />
                    </div>
                  </div>

                  {letterParagraphs.map((para, idx) => (
                    <div key={idx} className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block">Paragraph // 0{idx + 1}</label>
                      <textarea 
                        value={para} 
                        onChange={(e) => updateLetterParagraph(idx, e.target.value)}
                        rows={3}
                        className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-serif leading-relaxed text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                      />
                    </div>
                  ))}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Signature Sign-off</label>
                    <input 
                      type="text" 
                      value={letterSignature} 
                      onChange={(e) => setLetterSignature(e.target.value)}
                      className="w-full bg-cream-bg/40 border border-cream-border rounded p-2.5 text-xs font-cursive text-terracotta text-lg focus:ring-1 focus:ring-chocolate focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: THE GALLERY MANAGER (EXCLUSIVE PHOTO UPLOAD FOR ADMIN) */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-cream-border/60 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate">
                    4. Scrapbook Gallery Manager (Exclusive Admin Uploads)
                  </h3>
                </div>

                {/* Subheading alert */}
                <div className="p-3.5 bg-cream-bg rounded-lg border border-cream-border text-xs text-chocolate/80 font-medium">
                  <strong>Pemberitahuan:</strong> Hanya Anda yang memiliki akses sebagai Admin ke panel edit ini untuk mengunggah bauran gambar baru atau merombak teks. Tamu biasa tidak akan melihat tombol upload ataupun hapus fotomu.
                </div>

                {/* Add new photo form block */}
                <form onSubmit={handleAddNewPhotoSubmit} className="bg-cream-bg/35 border border-cream-border/70 p-4 sm:p-6 rounded-xl space-y-4">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-extrabold text-chocolate/60 block">
                    + Tambah Foto Baru ke Scrapbook
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Method A: File Upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block">Unggah File Foto Dari Gadget</label>
                      <div className="relative border-2 border-dashed border-cream-border rounded-lg bg-white p-4 text-center cursor-pointer hover:bg-cream-card/25 transition-all">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <Upload className="w-5 h-5 text-terracotta/75 mx-auto mb-1.5" />
                        <span className="text-[11px] font-sans font-bold text-chocolate block">Klik Untuk Pilih File</span>
                        <span className="text-[9px] text-[#361f01]/50 font-sans block mt-0.5">JPEG, PNG, GIF maks 2MB</span>
                      </div>
                    </div>

                    {/* Method B: URL input */}
                    <div className="space-y-2 flex flex-col justify-end">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block">Atau Tempel URL Gambar Web</label>
                        <input 
                          type="url" 
                          value={newPhotoUrl} 
                          onChange={(e) => {
                            setNewPhotoUrl(e.target.value);
                            setImageUploadError("");
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-white border border-cream-border rounded p-2.5 text-xs font-sans text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none"
                        />
                      </div>
                    </div>

                    {imageUploadError && (
                      <span className="sm:col-span-2 text-[10px] font-bold text-red-600 block">{imageUploadError}</span>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Caption Utama Foto</label>
                      <input 
                        type="text" 
                        value={newPhotoCaption} 
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="e.g., Makan malam lilin syahdu"
                        className="w-full bg-white border border-cream-border rounded p-2.5 text-xs text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none font-sans font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Catatan Cursive (Scrapbook style)</label>
                      <input 
                        type="text" 
                        value={newPhotoNote} 
                        onChange={(e) => setNewPhotoNote(e.target.value)}
                        placeholder="e.g., Selamanya dalam tawa"
                        className="w-full bg-white border border-cream-border rounded p-2.5 text-xs text-chocolate focus:ring-1 focus:ring-chocolate focus:outline-none font-sans font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 col-span-full">Ukuan Tampilan Layout Grid</label>
                      {[
                        { id: "medium", label: "Sedang (Medium Square)" },
                        { id: "tall", label: "Tinggi (Vertical Tall)" },
                        { id: "large", label: "Lebar (Landscape Large)" },
                        { id: "small", label: "Kecil (Tiny Square)" }
                      ].map((spec) => (
                        <button
                          key={spec.id}
                          type="button"
                          onClick={() => setNewPhotoSize(spec.id as any)}
                          className={`p-2 rounded border text-xs font-bold transition-all ${
                            newPhotoSize === spec.id
                              ? "bg-chocolate text-cream-bg border-chocolate"
                              : "bg-white text-chocolate border-cream-border hover:bg-cream-border/30"
                          }`}
                        >
                          {spec.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>

                    {/* Preview box */}
                    {newPhotoUrl && (
                      <div className="sm:col-span-2 pt-3">
                        <span className="text-[9px] uppercase tracking-widest font-extrabold text-[#361f01]/40 block mb-1.5">Live Image Preview:</span>
                        <div className="border border-cream-border p-2 bg-white rounded flex gap-4 items-center">
                          <img src={newPhotoUrl} alt="Preview" className="w-16 h-16 object-cover rounded border border-cream-border" />
                          <div className="text-xs">
                            <p className="font-bold text-chocolate">{newPhotoCaption || "No Title Specified"}</p>
                            <p className="font-cursive text-terracotta text-lg">{newPhotoNote || "No Scrapbook note Added"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!newPhotoUrl}
                      className={`sm:col-span-2 py-3 px-4 rounded font-sans text-xs uppercase tracking-widest font-bold text-cream-bg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
                        newPhotoUrl ? "bg-chocolate hover:bg-terracotta active:scale-98 shadow-sm" : "bg-neutral-300 cursor-not-allowed text-neutral-500"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambahkan Gambar ke Collage</span>
                    </button>
                  </div>
                </form>

                {/* CURRENT LIST OF COLLAGE IMAGES WITH DELETE OPTIONS */}
                <div className="space-y-3">
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] font-extrabold text-chocolate/60 block">
                    Koleksi Foto Kolelas Saat Ini ({galleryPhotos.length} foto)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {galleryPhotos.map((photo, pIdx) => (
                      <div 
                        key={photo.id}
                        className="bg-cream-bg/40 rounded-xl p-3 border border-cream-border/80 flex gap-3 h-28 justify-between items-center relative group overflow-hidden"
                      >
                        <div className="flex gap-3 items-center min-w-0 pr-8">
                          <img src={photo.url} alt={photo.caption} className="w-20 h-20 object-cover rounded-md border border-cream-border shrink-0" />
                          <div className="text-xs min-w-0">
                            <span className="text-[9px] uppercase font-bold text-champagne">Index #{pIdx + 1} // {photo.size}</span>
                            <p className="font-bold text-chocolate truncate">{photo.caption}</p>
                            <span className="font-cursive text-terracotta text-md block truncate">{photo.cursiveNote}</span>
                          </div>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="absolute right-3.5 p-2 bg-white text-chocolate/50 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg border border-cream-border/60 transition-all cursor-pointer"
                          title="Hapus foto ini dari scrapbook"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 5: CUSTOM WHISPER CARDS */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-border shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 border-b border-cream-border/60 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <Grid className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-chocolate">
                    5. Whispers of The Heart (3 Features Grid)
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {whisperCards.map((card, cIndex) => (
                    <div key={card.id} className="border border-cream-border/80 p-4 sm:p-5 rounded-xl bg-cream-bg/25 space-y-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Whisper Card // 0{cIndex + 1}</span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-1 space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Emoji</label>
                          <input 
                            type="text" 
                            value={card.icon} 
                            onChange={(e) => updateWhisperCardField(card.id, "icon", e.target.value)}
                            className="w-full bg-white border border-cream-border rounded p-2 text-center text-sm font-bold focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Judul Fitur</label>
                          <input 
                            type="text" 
                            value={card.title} 
                            onChange={(e) => updateWhisperCardField(card.id, "title", e.target.value)}
                            className="w-full bg-white border border-cream-border rounded p-2 text-xs font-serif font-bold focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-6 space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Subjudul / Deskripsi Kecil</label>
                          <input 
                            type="text" 
                            value={card.subtitle} 
                            onChange={(e) => updateWhisperCardField(card.id, "subtitle", e.target.value)}
                            className="w-full bg-white border border-cream-border rounded p-2 text-xs font-sans font-bold focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-12 space-y-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60">Isi Pesan Pendek</label>
                          <textarea 
                            value={card.content} 
                            onChange={(e) => updateWhisperCardField(card.id, "content", e.target.value)}
                            rows={3}
                            className="w-full bg-white border border-cream-border rounded p-2.5 text-xs font-sans leading-relaxed text-chocolate/80 focus:outline-none focus:ring-1 focus:ring-chocolate"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action area footer */}
              <div className="flex justify-end gap-3 pt-4 pb-16">
                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className="px-6 py-3.5 bg-chocolate hover:bg-terracotta text-cream-bg text-xs font-sans font-extrabold uppercase tracking-widest rounded-lg shadow-md hover:scale-[1.02] active:scale-97 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-cream-bg" />
                  <span>Simpan Perubahan & Selesai</span>
                </button>
              </div>
            </motion.div>
          ) : (
            
            // =========================================================
            // STANDARD VISITOR VIEW
            // =========================================================
            <motion.div
              key="main-frontend-scroller"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <AnimatePresence mode="wait">
                {!isOpen ? (
                  <motion.div
                    key="locked-gift-page"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                    className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"
                  >
                  {/* SCREEN 1 - THE COVER */}
                  <section 
                    ref={screenRefs[1]}
                    className="w-full flex flex-col items-center justify-center px-4 py-8 relative"
                  >
                    <div className="max-w-xl text-center flex flex-col items-center justify-center">
                      
                      {/* Title / Aesthetic Intro */}
                      <div className="mb-6 space-y-1.5 text-center mt-8">
                        <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block">
                          Ivory & Rose // 2026
                        </span>
                        <p className="text-terracotta italic font-serif text-lg mb-1">{coverGreeting}</p>
                        <h1 
                          className="text-5xl sm:text-6xl font-serif font-normal leading-[1.1] tracking-tight mb-4 text-[#361f01] text-balance"
                          dangerouslySetInnerHTML={{ __html: coverTitle }}
                        />
                        <div className="w-16 h-px bg-champagne mx-auto my-4"></div>
                        <p className="text-[10px] leading-relaxed opacity-70 uppercase tracking-widest font-bold max-w-sm mx-auto">
                          {coverSub}
                        </p>
                      </div>

                      {/* Giant 3D Interactive Gift Box */}
                      <div 
                        id="cinematic-gift-box-wrapper"
                        className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center"
                      >
                        {/* Pulsing Light Glow Behind Box */}
                        <div className="absolute inset-0 bg-rose-accent/15 blur-[60px] rounded-full scale-125 animate-pulse" />

                        {/* Gift Box Interaction Wrapper */}
                        <button 
                          id="main-unwrapping-interactive-btn"
                          onClick={handleOpenGift}
                          disabled={isOpen && activeScreen > 1}
                          className="group relative cursor-pointer outline-none focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          {/* 3D-Like Ribbon & Linen Gift Box */}
                          <div className="relative w-52 h-52 sm:w-56 sm:h-56">
                            
                            {/* Gift Box Base */}
                            <div className="absolute bottom-0 w-full h-4/5 bg-gradient-to-tr from-[#EADFC9]/70 to-[#FAF7F0] rounded-2xl shadow-xl border border-cream-border/90 overflow-hidden flex flex-col justify-end w-[96%] left-[2%]">
                              {/* Vertical Gold Ribbon Line */}
                              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-champagne/60 via-champagne to-champagne/60 shadow-inner z-10" />
                              <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#333]/5 pointer-events-none" />
                            </div>

                            {/* Gift Box Lid */}
                            <div className="absolute top-2 w-[100%] left-0 h-1/4 bg-gradient-to-tr from-[#EADFC9] to-[#FAF7F0] rounded-xl shadow-lg border border-cream-border z-20 flex items-center justify-center">
                              {/* Horizontal Gold Ribbon Line */}
                              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-champagne/60 via-champagne to-champagne/60" />
                            </div>

                            {/* Magnificent Ribbon Bow */}
                            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 z-30 drop-shadow-md transition-all duration-500 group-hover:scale-110">
                              <svg className="w-20 h-20 text-champagne" viewBox="0 0 100 100" fill="currentColor">
                                <path d="M50,50 C30,30 20,45 50,50 Z" />
                                <path d="M50,50 C70,30 80,45 50,50 Z" />
                                <path d="M50,50 C30,70 20,55 50,50 Z" />
                                <path d="M50,50 C70,70 80,55 50,50 Z" />
                                <path d="M50,50 Q40,80 30,85" stroke="currentColor" strokeWidth="3" fill="none" />
                                <path d="M50,50 Q60,80 70,85" stroke="currentColor" strokeWidth="3" fill="none" />
                                <circle cx="50" cy="50" r="8" fill="#D4AF37" />
                              </svg>
                            </div>
                          </div>

                          {/* Animated flower sparkles burst indicator inside wrapper */}
                          <AnimatePresence>
                            {flowerBurst.length > 0 && flowerBurst.map((burst) => (
                              <motion.div
                                key={burst.id}
                                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                animate={{ x: burst.x, y: burst.y, scale: 1.5, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute left-[45%] top-[45%] text-2xl z-40 pointer-events-none select-none"
                              >
                                {burst.emoji}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </button>
                      </div>

                      {/* Instruction Typography below gift box */}
                      <p className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-chocolate/75 flex items-center gap-1.5 animate-bounce mb-4 mt-2">
                        Tap ke kado untuk membuka 🎁
                      </p>

                      {/* Subtext Quote */}
                      <div className="w-16 h-[1px] bg-cream-border my-4" />
                      <p className="font-serif italic text-chocolate/70 leading-relaxed text-[15px] max-w-sm px-4">
                        "Setiap rasa yang indah bermula dari kesediaan sunyi untuk melipat pintu kepingan hati."
                      </p>
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="unlocked-birthday-memoirs"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                  className="w-full"
                >
                  {/* ========================================================= */}
                  {/* SCREEN 2 - THE MUSIC & TURNTABLE */}
                  {/* ========================================================= */}
                  <section 
                    ref={screenRefs[2]}
                    className="min-h-screen flex flex-col items-center justify-center px-4 py-11 relative"
                  >
                    {/* Section Indicator */}
                    <div className="text-center mb-8 space-y-1">
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block">
                        Part II — The Serenade
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate tracking-tight italic">
                        The Bloom & The Turntable
                      </h2>
                    </div>

                    <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-white rounded-lg p-4 sm:p-8 md:p-10 border border-cream-border shadow-[0_20px_50px_rgba(61,38,26,0.03)]">
                      
                      {/* Vintage Turntable Block */}
                      <div className="lg:col-span-6 flex flex-col items-center w-full">
                        <div 
                          id="interactive-vintage-vinyl-turntable"
                          className="relative bg-[#F4EDE2] border-4 border-cream-border rounded-3xl p-4 sm:p-6 shadow-md w-full max-w-sm flex flex-col items-center justify-center aspect-square"
                        >
                          <div className="absolute inset-1.5 sm:inset-2 border border-cream-border/40 rounded-2xl pointer-events-none" />
 
                          {/* Spinning disk record */}
                          <div 
                            className={`relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-[#1C1C1A] border-8 border-chocolate shadow-xl flex items-center justify-center ${
                              isOpen ? "animate-spin-slow" : ""
                            }`}
                            style={{
                              boxShadow: "inset 0 0 40px #000, 0 10px 25px rgba(61, 38, 26, 0.15)"
                            }}
                          >
                            <div className="absolute inset-2.5 sm:inset-4 rounded-full border border-white/5" />
                            <div className="absolute inset-5 sm:inset-8 rounded-full border border-white/5" />
                            <div className="absolute inset-7 sm:inset-12 rounded-full border border-white/5" />
                            <div className="absolute inset-10 sm:inset-16 rounded-full border border-white/5" />
                            <div className="absolute inset-12 sm:inset-20 rounded-full border border-white/10" />
 
                            {/* Record Label Center */}
                            <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cream-bg border-2 sm:border-4 border-champagne flex flex-col items-center justify-center text-center p-1 sm:p-2 z-10 select-none">
                              <span className="font-cursive text-lg sm:text-xl text-terracotta leading-none">Serenade</span>
                              <span className="text-[6px] sm:text-[7px] uppercase font-sans tracking-widest font-extrabold text-chocolate/80 mt-0.5 sm:mt-1 truncate max-w-[60px] sm:max-w-[80px]">
                                {musicTitle.split(" ")[0]}
                              </span>
                              <span className="text-[5px] sm:text-[6px] text-chocolate/50 font-bold uppercase tracking-wider block truncate max-w-[60px] sm:max-w-[80px]">
                                {musicTitle.split(" ").slice(1).join(" ") || "Melody"}
                              </span>
                              <div className="absolute w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#2E2214] border border-cream-bg shadow-inner animate-pulse" />
                            </div>
 
                            {/* Floating micro floral buds dynamically */}
                            {isOpen && (
                              <>
                                <span className="absolute top-2 left-6 sm:left-10 text-2xl sm:text-3xl animate-bounce pointer-events-none select-none" style={{ animationDelay: "0.2s" }}>🌸</span>
                                <span className="absolute bottom-1 right-8 sm:right-12 text-2xl sm:text-3xl animate-bounce pointer-events-none select-none" style={{ animationDelay: "0.6s" }}>🌹</span>
                                <span className="absolute top-10 right-4 sm:right-6 text-xl sm:text-2xl animate-bounce pointer-events-none select-none" style={{ animationDelay: "1.2s" }}>🌼</span>
                                <span className="absolute bottom-8 left-4 sm:left-6 text-2xl animate-bounce pointer-events-none select-none" style={{ animationDelay: "1.5s" }}>🌸</span>
                              </>
                            )}
                          </div>
 
                          {/* Vinyl Needle Tonearm */}
                          <div 
                            className="absolute top-6 sm:top-8 right-4 sm:right-6 w-20 sm:w-24 h-36 sm:h-44 origin-top-right transition-transform duration-1000 z-20 pointer-events-none flex flex-col items-center"
                            style={{
                              transform: isOpen ? "rotate(-18deg) translateY(0px)" : "rotate(10deg) translateY(-10px)"
                            }}
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-champagne/80 to-champagne shadow-md border-2 border-cream-border" />
                            <div className="w-1 h-20 sm:w-1.5 sm:h-28 bg-[#C0982E] shadow-inner -mt-1" />
                            <div className="w-3.5 h-5 sm:w-4 sm:h-6 bg-chocolate rounded-sm shadow-xs -mt-1 rounded-bl-lg" />
                          </div>
                        </div>
                      </div>

                      {/* Music info column */}
                      <div className="lg:col-span-6 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 bg-terracotta/10 px-3 py-1 rounded-full text-xs text-terracotta font-bold w-fit uppercase tracking-widest font-sans">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
                            </span>
                            Analog Cozy Stage
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-chocolate font-normal tracking-tight">
                            Your Personal Serenade
                          </h3>
                          <p className="text-xs text-chocolate/85 font-sans leading-relaxed font-semibold">
                            Lagu hangat <span className="font-serif italic text-terracotta">"{musicTitle}"</span> mengalun membawa melodi instrumen lofi yang disulap khusus untuk mengutarakan rasa hormat penuh padamu. Nyalakan kotak musik vintage di bawah ini sepanjang membaca.
                          </p>
                        </div>

                        {/* Live Audio player component utilizing custom chords */}
                        <div className="transition-all duration-500">
                          <AudioPlayer title={musicTitle} artist={musicArtist} melodyType={musicMelody} customAudioUrl={customAudioUrl} forcePlayTrigger={isOpen} />
                        </div>

                        {/* Interactive Info block */}
                        <div className="p-4 bg-cream-bg rounded-2xl border border-cream-border flex items-start gap-3">
                          <Info className="w-5 h-5 text-champagne shrink-0 mt-0.5" />
                          <div className="text-xs font-sans text-chocolate/75 font-medium leading-relaxed">
                            <span className="font-bold text-chocolate">Tips Interaktif:</span> Musik instrumen box terus bersenandung syahdu di latar belakang selagi Anda menggulir ke bawah menuju petualangan lembaran kado kustom selanjutnya.
                          </div>
                        </div>

                        {isOpen && (
                          <button
                            onClick={() => jumpToScreen(3)}
                            className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-terracotta hover:text-chocolate transition-colors cursor-pointer group"
                          >
                            <span>Lanjut Ke Ucapan Utama</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* ========================================================= */}
                  {/* SCREEN 3 - MAIN GREETING */}
                  {/* ========================================================= */}
                  <section 
                    ref={screenRefs[3]}
                    className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
                  >
                    <div className="absolute inset-8 sm:inset-16 md:inset-24 border border-champagne/15 rounded-3xl pointer-events-none flex items-center justify-center">
                      <div className="absolute top-2 left-2 text-3xl opacity-20 filter sepia">✿</div>
                      <div className="absolute top-2 right-2 text-3xl opacity-20 filter sepia">✿</div>
                      <div className="absolute bottom-2 left-2 text-3xl opacity-20 filter sepia">✿</div>
                      <div className="absolute bottom-2 right-2 text-3xl opacity-20 filter sepia">✿</div>
                    </div>

                    <div className="max-w-3xl w-full text-center relative z-10 px-8 py-14 rounded-lg bg-white border border-cream-border shadow-[0_20px_50px_rgba(61,38,26,0.03)]">
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block mb-6">
                        Part III — The Dedicated Wish
                      </span>

                      <p className="text-terracotta italic font-serif text-lg sm:text-xl mb-2">{coverGreeting}</p>
                      <h1 
                        className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#361f01] leading-[1.1] tracking-tight mb-8 text-balance break-words overflow-wrap-anywhere w-full"
                        dangerouslySetInnerHTML={{ __html: coverTitle }}
                      />

                      <div className="my-8 flex items-center justify-center gap-4">
                        <div className="w-16 h-px bg-champagne" />
                        <span className="text-champagne font-bold text-lg select-none">✦</span>
                        <div className="w-16 h-px bg-champagne" />
                      </div>

                      <p className="font-serif italic text-chocolate/85 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto px-4">
                        "Dalam labirin alam semesta yang terus memutar melodi, tawa manismu tetap menjadi satusatunya muara tenang bernaung."
                      </p>

                      <span className="font-cursive text-5xl text-terracotta block mt-8 animate-pulse">
                        {letterSignature}
                      </span>
                    </div>

                    {isOpen && (
                      <div className="absolute bottom-8 flex flex-col items-center gap-1 opacity-70 animate-bounce">
                        <span className="text-[9px] uppercase tracking-widest font-bold text-chocolate/50">Lanjut Gulir Kebawah</span>
                        <div className="w-[1px] h-10 bg-cream-border" />
                      </div>
                    )}
                  </section>

                  {/* ========================================================= */}
                  {/* SCREEN 4 - THE LOVE LETTER */}
                  {/* ========================================================= */}
                  <section 
                    ref={screenRefs[4]}
                    className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
                  >
                    <div className="text-center mb-10 space-y-1">
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block">
                        Part IV — The Love Letter
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl font-normal text-chocolate tracking-tight italic">
                        {letterTitle}
                      </h2>
                    </div>

                    <div 
                      id="romantic-love-letter-envelope"
                      className="max-w-2xl w-full bg-white rounded-lg p-5 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(61,38,26,0.05)] border border-cream-border relative overflow-hidden"
                    >
                      <div className="absolute inset-2.5 sm:inset-4 border border-champagne/20 pointer-events-none" />

                      <div className="absolute top-0 right-10 transform -translate-y-1/2 z-20">
                        <div className="bg-[#C27461] text-white text-[10px] px-4 py-1.5 tracking-widest uppercase font-bold shadow-sm">
                          {coverSecretTag}
                        </div>
                      </div>

                      <div className="relative z-10 space-y-6">
                        <div className="text-center pb-6 border-b border-cream-border">
                          <span className="text-2xl text-terracotta/80 block mb-2 font-serif">❝</span>
                          <p className="font-serif italic font-semibold text-chocolate/90 text-md sm:text-lg max-w-md mx-auto">
                            "Bagiku, hari kelahiranmu barangkali adalah cara terbaik semesta merayakan dirinya sendiri."
                          </p>
                          <div className="w-8 h-1 bg-champagne/30 mx-auto mt-3.5 rounded-full" />
                        </div>

                        <div className="font-serif text-chocolate/90 text-sm sm:text-[15px] leading-relaxed space-y-5 text-justify pr-1 px-1 sm:px-4">
                          <p className="font-bold underline text-chocolate">{letterGreeting}</p>
                          {letterParagraphs.map((para, pIdx) => (
                            <p key={pIdx}>{para}</p>
                          ))}
                          <p className="text-right font-cursive text-4xl text-terracotta pr-4 mt-6 leading-none block">
                            {letterSignature}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-cream-border flex justify-between items-center text-[10px] font-mono text-chocolate/40 uppercase tracking-widest font-bold">
                          <span>Aesthetic Memoirs</span>
                          <span>Terukir Abadi</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ========================================================= */}
                  {/* SCREEN 5 - MESSAGE WHISPER CARDS */}
                  {/* ========================================================= */}
                  <section 
                    ref={screenRefs[5]}
                    className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
                  >
                    <div className="text-center mb-10 space-y-2">
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block">
                        Part V — The Grid
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-chocolate tracking-tight capitalize">
                        Whispers of the Heart
                      </h2>
                    </div>

                    <div className="max-w-5xl w-full space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {whisperCards.map((card) => (
                          <div 
                            key={card.id}
                            className="bg-cream-card hover:bg-white border border-cream-border rounded-lg p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-[0_20px_50px_rgba(61,38,26,0.03)] transition-all duration-500 hover:-translate-y-1 group"
                          >
                            <div className="space-y-4">
                              <div className="w-12 h-12 rounded-2xl bg-cream-bg border border-cream-border flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform duration-300">
                                {card.icon}
                              </div>

                              <div className="space-y-1">
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">
                                  {card.title}
                                </h3>
                                <p className="font-sans text-[10px] uppercase tracking-widest font-extrabold text-terracotta">
                                  {card.subtitle}
                                </p>
                              </div>

                              <p className="font-sans text-xs text-chocolate/80 font-medium leading-relaxed pt-2">
                                {card.content}
                              </p>
                            </div>

                            <div className="mt-8 pt-4 border-t border-cream-border/60 flex justify-between items-center">
                              <span className="text-[9px] font-bold text-chocolate/40 font-mono">
                                MEMO-0{card.id === "laughter" ? "1" : card.id === "strength" ? "02" : "03"}
                              </span>
                              <Heart className="w-3.5 h-3.5 text-terracotta/40 fill-current group-hover:text-terracotta hover:scale-110 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Plant flower garden CTA */}
                      <div className="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-6 sm:p-8 border border-cream-border shadow-[0_20px_50px_rgba(61,38,26,0.03)] max-w-2xl mx-auto text-center">
                        <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold text-[#D4AF37] block">
                          Interactive Birthday Garden
                        </span>
                        <p className="text-xs text-chocolate/80 max-w-md font-sans font-medium">
                          Anda dan kekasih dapat menyiram benih kembang mawar, peony, jasmine, atau tulip kustom yang akan tumbuh mekar seketika di taman digital interaktif bawah ini.
                        </p>
                        
                        <button
                          id="trigger-birthday-garden-panel-btn"
                          onClick={() => setShowGarden(prev => !prev)}
                          className="px-6 py-3 bg-chocolate hover:bg-terracotta text-cream-bg rounded font-sans text-xs uppercase tracking-widest transition-all shadow-md active:scale-97 flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <Sparkles className="w-4 h-4 text-cream-bg" />
                          <span>{showGarden ? "Tutup Taman Digital" : "Buka Taman Kembang Interaktif"}</span>
                        </button>
                      </div>

                      {/* Expandable Garden component */}
                      <AnimatePresence>
                        {showGarden && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                          >
                            <BirthdayGarden />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </section>

                  {/* ========================================================= */}
                  {/* SCREEN 6 - COLLAGE MASONRY SCAPBOOK */}
                  {/* ========================================================= */}
                  <section 
                    ref={screenRefs[6]}
                    className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative bg-white/40"
                  >
                    <div className="text-center mb-10 space-y-1">
                      <span className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold text-champagne block">
                        Part VI — The Visual Collage
                      </span>
                      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-chocolate tracking-tight italic">
                        Our Beautiful Pictures
                      </h2>
                    </div>

                    <div className="max-w-5xl w-full space-y-12">
                      {galleryPhotos.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-cream-border rounded-lg max-w-md mx-auto">
                          <span className="text-4xl">🖼️</span>
                          <p className="text-xs text-[#361f01]/50 font-semibold font-sans italic mt-3">
                            Scrapbook masih kosong. Silakan masuk ke Mode Admin (tombol roda gigi di kanan atas) untuk mengunggah bauran momen fotomu.
                          </p>
                        </div>
                      ) : (
                        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
                          {galleryPhotos.map((photo, index) => (
                            <div 
                              key={photo.id}
                              className="break-inside-avoid bg-white border border-cream-border rounded-none p-4 shadow-[0_12px_44px_rgba(61,38,26,0.035)] hover:shadow-md hover:scale-[1.01] transition-all duration-500 flex flex-col gap-3 group relative"
                            >
                              <div className="relative w-full overflow-hidden rounded-none bg-chocolate/5 border border-cream-border">
                                <img 
                                  src={photo.url} 
                                  alt={photo.caption} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-auto object-cover filter grayscale sepia brightness-90 contrast-105 group-hover:filter-none transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-[#361f01]/5 mix-blend-overlay group-hover:opacity-0 transition-opacity pointer-events-none" />
                              </div>

                              <div className="px-1 text-center sm:text-left">
                                <p className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-champagne mb-1">
                                  Portrait // {`0${index + 1}`}
                                </p>
                                <h4 className="font-serif font-bold text-[15px] text-chocolate leading-tight mb-2">
                                  {photo.caption}
                                </h4>
                                <p className="font-cursive text-3xl text-terracotta border-t border-cream-border/55 pt-2 leading-none mt-1">
                                  {photo.cursiveNote}
                                </p>
                              </div>

                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-16 h-4 bg-[#F4EFDF]/60 backdrop-blur-xs border-x border-champagne/10 rotate-[-1deg] pointer-events-none" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Collage description footer */}
                      <div className="mt-12 p-6 border-t border-cream-border/80 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-chocolate/50 font-bold uppercase tracking-widest max-w-4xl mx-auto">
                        <span>Scrapbook Diary Log</span>
                        <span className="font-cursive text-4xl text-terracotta normal-case font-normal animate-pulse">
                          "Loved with a quiet depth that never fades"
                        </span>
                        <span>Est. June 2026</span>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

              {/* FOOTER LAYER */}
              <footer className="w-full py-12 px-6 bg-cream-card border-t border-cream-border relative z-25 text-center space-y-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="font-cursive text-4xl text-terracotta">Birthday Serenade</span>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-extrabold text-[#361f01]/40 block">
                    Crafted for My Serene Moonlit Jasmine
                  </span>
                </div>
                <div className="w-12 h-[1px] bg-cream-border mx-auto" />
                <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#361f01]/50 max-w-md mx-auto leading-relaxed">
                  © 2026 Ivory Serenade. All feelings preserved eternally inside this soft cream sanctuary.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = "admin";
                    setIsAdminMode(true);
                  }}
                  className="mx-auto block text-[9px] uppercase tracking-widest text-[#361f01]/40 hover:text-chocolate font-extrabold"
                >
                  Admin Control panel
                </button>
              </footer>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
