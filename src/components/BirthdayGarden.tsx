import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Plus, Trash2 } from "lucide-react";
import { GardenFlower } from "../types";

export default function BirthdayGarden() {
  const [flowers, setFlowers] = useState<GardenFlower[]>([]);
  const [sender, setSender] = useState("");
  const [wish, setWish] = useState("");
  const [flowerType, setFlowerType] = useState<"rose" | "peony" | "jasmine" | "tulip">("rose");
  const [isGrowing, setIsGrowing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const initialPresetFlowers: GardenFlower[] = [
    {
      id: "preset-1",
      sender: "Your Love",
      wish: "To a lifetime of sharing warm teas, stargazing on chilly nights, and growing older together.",
      flowerType: "rose",
      color: "#C27461",
      plantedAt: new Date(Date.now() - 3600000 * 24),
      growth: 100,
    },
    {
      id: "preset-2",
      sender: "Always Yours",
      wish: "May your sweet laughter continue to fill our rooms with everlasting sunshine and grace.",
      flowerType: "peony",
      color: "#E8AA9C",
      plantedAt: new Date(Date.now() - 3600000 * 5),
      growth: 100,
    },
    {
      id: "preset-3",
      sender: "Deepest Devotion",
      wish: "You make the ordinary moments feel like poetic adventures in ivory fields.",
      flowerType: "jasmine",
      color: "#FAF6EE",
      plantedAt: new Date(Date.now() - 3600000 * 12),
      growth: 100,
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("birthday_garden");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFlowers(parsed.map((f: any) => ({ ...f, plantedAt: new Date(f.plantedAt) })));
      } catch (e) {
        setFlowers(initialPresetFlowers);
      }
    } else {
      setFlowers(initialPresetFlowers);
    }
  }, []);

  const saveToStorage = (data: GardenFlower[]) => {
    localStorage.setItem("birthday_garden", JSON.stringify(data));
  };

  const getFlowerColor = (type: string) => {
    switch (type) {
      case "rose": return "#C27461"; // terracotta
      case "peony": return "#E8AA9C"; // dusty rose
      case "jasmine": return "#FAF6EE"; // warm ivory cream
      case "tulip": return "#C0982E"; // gold champagne
      default: return "#C27461";
    }
  };

  const handlePlantFlower = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    const chosenSender = sender.trim() || "Forever Yours";
    const selectedColor = getFlowerColor(flowerType);

    const newFlower: GardenFlower = {
      id: "flower-" + Date.now(),
      sender: chosenSender,
      wish: wish.trim(),
      flowerType,
      color: selectedColor,
      plantedAt: new Date(),
      growth: 10, // starts small, animates up
    };

    setIsGrowing(true);
    setFlowers(prev => {
      const updated = [newFlower, ...prev];
      saveToStorage(updated);
      return updated;
    });

    // Simulate growth animation
    setTimeout(() => {
      setFlowers(current => {
        const fullyGrown = current.map(f => f.id === newFlower.id ? { ...f, growth: 100 } : f);
        saveToStorage(fullyGrown);
        return fullyGrown;
      });
      setIsGrowing(false);
      setSuccessMessage(`Taman kado Anda berkembang dengan bunga ${flowerType} baru! 🌸`);
      setWish("");
      setSender("");
      setTimeout(() => setSuccessMessage(""), 4000);
    }, 1500);
  };

  const deleteFlower = (id: string) => {
    const filter = flowers.filter(f => f.id !== id);
    setFlowers(filter);
    saveToStorage(filter);
  };

  const renderFlowerSVG = (f: GardenFlower) => {
    const scale = f.growth / 100;
    
    // Custom vector flowers designed meticulously in clean SVGs
    switch (f.flowerType) {
      case "rose":
        return (
          <svg className="w-16 h-28 mx-auto origin-bottom transition-all duration-1000 ease-out" viewBox="0 0 100 150" style={{ transform: `scale(${scale})` }}>
            {/* Stem */}
            <path d="M50,150 C50,110 45,80 50,45" fill="none" stroke="#879F84" strokeWidth="3" />
            {/* Thorn & Leaf */}
            <path d="M48,110 C30,105 32,95 48,90" fill="none" stroke="#879F84" strokeWidth="2" />
            <path d="M32,95 C25,95 20,85 30,80 C36,78 37,84 48,90" fill="#879F84" />
            <path d="M52,75 C68,75 70,85 52,90" fill="none" stroke="#879F84" strokeWidth="2" />
            <path d="M68,85 C75,85 78,75 70,72 C64,70 63,76 52,90" fill="#879F84" />
            {/* Rose Buds */}
            <circle cx="50" cy="40" r="22" fill={f.color} />
            <path d="M50,18 C40,25 35,38 50,62 C65,38 60,25 50,18 Z" fill="#A86E5E" opacity="0.8" />
            <path d="M50,22 C44,28 40,38 50,56 C60,38 56,28 50,22 Z" fill={f.color} />
            {/* Inner Spiral */}
            <path d="M42,35 Q50,25 58,35 Q50,45 42,35" fill="none" stroke="#FAF8F5" strokeWidth="2" opacity="0.6" />
            {/* Sepal */}
            <path d="M38,45 C42,55 58,55 62,45 C50,55 50,55 38,45" fill="#879F84" />
          </svg>
        );
      case "peony":
        return (
          <svg className="w-16 h-28 mx-auto origin-bottom transition-all duration-1000 ease-out" viewBox="0 0 100 150" style={{ transform: `scale(${scale})` }}>
            {/* Stem */}
            <path d="M50,150 C50,100 55,75 50,48" fill="none" stroke="#879F84" strokeWidth="3" />
            {/* Rounded Peony Leaf */}
            <path d="M52,100 C68,110 75,90 53,80" fill="#879F84" opacity="0.9" />
            <path d="M48,115 C30,110 25,125 48,95" fill="#879F84" opacity="0.9" />
            {/* Layered Peony petals */}
            <circle cx="50" cy="42" r="25" fill="#C38270" opacity="0.3" />
            <circle cx="50" cy="42" r="21" fill={f.color} />
            <path d="M35,35 C35,20 65,20 65,35" fill="none" stroke="#FAF8F5" strokeWidth="1.5" opacity="0.5" />
            <path d="M30,42 C30,30 70,30 70,42" fill="none" stroke="#FAF8F5" strokeWidth="1.5" opacity="0.5" />
            {/* Petal overlapping layers */}
            <circle cx="42" cy="38" r="10" fill="#F0C5BC" opacity="0.6" />
            <circle cx="58" cy="38" r="10" fill="#F0C5BC" opacity="0.6" />
            <circle cx="50" cy="46" r="10" fill="#E5A394" />
          </svg>
        );
      case "jasmine":
        return (
          <svg className="w-16 h-28 mx-auto origin-bottom transition-all duration-1000 ease-out" viewBox="0 0 100 150" style={{ transform: `scale(${scale})` }}>
            {/* Thin stem */}
            <path d="M50,150 C50,110 48,70 50,55" fill="none" stroke="#879F84" strokeWidth="2" />
            {/* Delicate leaves */}
            <path d="M50,110 C62,110 65,102 50,95 C35,102 38,110 50,110 Z" fill="#879F84" opacity="0.8" />
            {/* Jasmine flower star shape */}
            <g transform="translate(50, 52)">
              {/* Petals radiating */}
              <path d="M0,-20 C5,-5 5,-5 20,0 C5,5 5,5 0,20 C-5,5 -5,5 -20,0 C-5,-5 -5,-5 0,-20 Z" fill={f.color} stroke="#E6E1D5" strokeWidth="1" />
              <path d="M0,-20 C5,-5 5,-5 20,0 C5,5 5,5 0,20 C-5,5 -5,5 -20,0 C-5,-5 -5,-5 0,-20 Z" fill={f.color} stroke="#E6E1D5" strokeWidth="1" transform="rotate(45)" opacity="0.9" />
              {/* Center point */}
              <circle cx="0" cy="0" r="5" fill="#D4AF37" />
            </g>
          </svg>
        );
      case "tulip":
        return (
          <svg className="w-16 h-28 mx-auto origin-bottom transition-all duration-1000 ease-out" viewBox="0 0 100 150" style={{ transform: `scale(${scale})` }}>
            {/* Clean upright stem */}
            <path d="M50,150 L50,52" fill="none" stroke="#7BA278" strokeWidth="3" />
            {/* Long dramatic leaf */}
            <path d="M50,130 C20,110 32,70 49,65" fill="#7BA278" />
            {/* Tulip Cup */}
            <path d="M30,50 C26,20 40,25 50,52 C60,25 74,20 70,50 C66,66 34,66 30,50 Z" fill={f.color} />
            <path d="M42,50 C40,32 50,22 50,52 C50,22 60,32 58,50 Z" fill="#E6C843" opacity="0.8" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 md:p-8 max-w-4xl mx-auto border border-cream-border shadow-[0_20px_50px_rgba(61,38,26,0.03)]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left column: Seeds & wishes planting center */}
        <div id="garden-seed-pitcher" className="flex-1 bg-cream-card rounded-lg p-5 border border-cream-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-terracotta" />
              <h4 className="font-serif font-bold text-chocolate text-lg">Plant a Birthday Wish</h4>
            </div>
            <p className="text-xs text-chocolate/70 font-sans font-semibold mb-5 leading-normal">
              Select a sacred seed to plant. Each seedling grows instantly when nourished with custom birthday thoughts.
            </p>

            <form onSubmit={handlePlantFlower} className="space-y-4">
              {/* Flower Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block mb-2">
                  1. Plant Seed Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "rose", label: "🌹 Rose", col: "#C38270" },
                    { id: "peony", label: "🌸 Peony", col: "#E5A394" },
                    { id: "jasmine", label: "🌼 Jasmine", col: "#EADFD0" },
                    { id: "tulip", label: "🌷 Tulip", col: "#D4AF37" }
                  ].map(spec => (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => setFlowerType(spec.id as any)}
                      className={`p-2 rounded-lg border text-xs font-semibold font-sans transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                        flowerType === spec.id 
                          ? "bg-chocolate text-cream-bg border-chocolate" 
                          : "bg-white text-chocolate border-cream-border hover:bg-cream-border/30"
                      }`}
                    >
                      <span>{spec.label.split(" ")[1]}</span>
                      <span className="text-[9px] font-bold block" style={{ color: flowerType === spec.id ? "#FFF" : spec.col }}>
                        {spec.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* sender field */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block mb-1">
                  2. Your Name / Devoted Moniker
                </label>
                <input
                  type="text"
                  placeholder="e.g. Always Yours, Sweetheart"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-white border border-cream-border rounded-lg px-3.5 py-2.5 text-xs text-chocolate font-sans font-medium focus:outline-none focus:ring-1 focus:ring-chocolate focus:border-chocolate"
                />
              </div>

              {/* secret wish block */}
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-chocolate/60 block mb-1">
                  3. Your Whispered Birthday Wish
                </label>
                <textarea
                  placeholder="Write a sweet, romantic sentence to fertilize your beautiful flower..."
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  rows={4}
                  maxLength={180}
                  required
                  className="w-full bg-white border border-cream-border rounded-lg p-3.5 text-xs text-chocolate font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-chocolate focus:border-chocolate"
                />
                <span className="text-[9px] font-bold text-chocolate/40 font-mono text-right block mt-1">
                  {wish.length}/180 characters max
                </span>
              </div>

              <button
                type="submit"
                disabled={isGrowing || !wish.trim()}
                className={`w-full py-3 px-4 rounded-lg font-sans text-xs uppercase tracking-widest font-bold text-cream-bg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isGrowing || !wish.trim() 
                    ? "bg-chocolate/30 cursor-not-allowed" 
                    : "bg-chocolate hover:bg-terracotta active:scale-98 shadow-sm"
                }`}
              >
                {isGrowing ? (
                  <>
                    <span className="animate-spin text-xs">❀</span>
                    <span>Growing Your Flower...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-cream-bg" />
                    <span>Plant & Seed Garden</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {successMessage && (
            <div className="mt-4 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg text-xs text-chocolate font-medium animated-fade-in flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-terracotta fill-current" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Right column: Dynamic Flower Fields */}
        <div id="interactive-flower-fields" className="flex-[1.4] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif font-bold text-chocolate text-xl text-glow block">
                The Whispering Garden
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest font-sans bg-cream-border/30 text-chocolate/80 px-2.5 py-1 rounded-full">
                {flowers.length} Bloom{flowers.length !== 1 && "s"}
              </span>
            </div>

            {/* List of dynamic flowers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
              {flowers.length === 0 ? (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-cream-border rounded-lg flex flex-col items-center justify-center gap-3">
                  <span className="text-3xl opacity-50">🌾</span>
                  <p className="text-xs text-chocolate/50 font-semibold font-sans italic">
                    The garden is currently resting. Plant a seed above to warm her soul.
                  </p>
                </div>
              ) : (
                flowers.map((f) => (
                  <div
                    key={f.id}
                    className="bg-cream-card border border-cream-border rounded-lg p-4 flex flex-col items-center relative group hover:shadow-md transition-all duration-500 overflow-hidden"
                  >
                    {/* SVG Flower container */}
                    <div className="h-28 flex items-end justify-center mb-2.5 pointer-events-none relative z-10 w-full">
                      {renderFlowerSVG(f)}
                      {f.growth < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs animate-ping font-serif text-terracotta">
                          ✦
                        </div>
                      )}
                    </div>

                    <div className="text-center relative z-10 w-full">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-chocolate block truncate px-1">
                        {f.sender}
                      </span>
                      {/* Hover details with the secret wish */}
                      <div className="mt-1">
                        <p className="text-[10px] leading-relaxed text-chocolate/80 italic font-medium px-1 max-h-[44px] overflow-hidden text-ellipsis line-clamp-2" title={f.wish}>
                          "{f.wish}"
                        </p>
                      </div>
                    </div>

                    {/* Delete button (only visible on hover or tiny scale) */}
                    <button
                      type="button"
                      onClick={() => deleteFlower(f.id)}
                      className="absolute top-2.5 right-2.5 p-1 text-chocolate/30 hover:text-terracotta hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Uproot this flower"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Flower classification pill */}
                    <span 
                      className="absolute bottom-2 left-2 text-[8px] tracking-widest uppercase font-bold text-chocolate/40"
                    >
                      {f.flowerType}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-cream-border flex items-center gap-2 justify-between">
            <span className="text-[9px] font-bold tracking-widest font-sans text-chocolate/40 uppercase block">
              Romantic Garden Simulator
            </span>
            <span className="text-[10px] font-serif text-terracotta italic block">
              "Love is a garden cultivated daily"
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
