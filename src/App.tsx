import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  Sun,
  Coffee,
  Compass,
  Stars,
  Volume2,
  VolumeX,
  PartyPopper,
  Gift,
  Check,
  Send,
  Music,
} from 'lucide-react';
import { CelebrationCanvas } from './components/CelebrationCanvas';
import { InteractiveCakeSection } from './components/InteractiveCakeSection';
import { soundController } from './utils/soundEngine';

interface SpecialCard {
  id: string;
  number: string;
  category: 'warmth' | 'joy' | 'magic';
  title: string;
  subtitle: string;
  description: string;
  memoryNote: string;
  icon: React.ReactNode;
  accentBorder: string;
  softBg: string;
}

interface CustomWish {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}

const SPECIAL_CARDS: SpecialCard[] = [
  {
    id: 'sunlight-energy',
    number: '01.',
    category: 'joy',
    title: 'Your Effortless Sunlight',
    subtitle: 'Radiant Presence · Everyday Magic',
    description:
      'You have this rare, unmistakable gift of walking into any room and immediately making everyone feel lighter, seen, and genuinely valued.',
    memoryNote:
      'Even on the busiest days, a five-minute conversation with you feels like a breath of fresh morning air.',
    icon: <Sun className="w-5 h-5 text-[#D97706]" />,
    accentBorder: 'border-amber-200/80',
    softBg: 'from-[#FFFBEB] to-white',
  },
  {
    id: 'deep-kindness',
    number: '02.',
    category: 'warmth',
    title: 'A Heart That Truly Listens',
    subtitle: 'Unmatched Empathy · True Friendship',
    description:
      'You remember the smallest details people mention in passing—their favorite coffee order, a big deadline, or a quiet dream they were nervous to share.',
    memoryNote:
      'Your kindness is never performative; it is woven into everything you do and every person you care for.',
    icon: <Heart className="w-5 h-5 text-[#E11D48]" />,
    accentBorder: 'border-rose-200/80',
    softBg: 'from-[#FFF1F2] to-white',
  },
  {
    id: 'contagious-laughter',
    number: '03.',
    category: 'joy',
    title: 'Unfiltered, Contagious Laughter',
    subtitle: 'Pure Joy · Inside Jokes',
    description:
      'From turning ordinary errands into comedy specials to laughing until we cannot breathe over a single look across the table—life with you is never dull.',
    memoryNote:
      'Nobody tells a story with as much sparkle, wit, and comedic timing as you do, Farha.',
    icon: <Coffee className="w-5 h-5 text-[#9F1239]" />,
    accentBorder: 'border-pink-200/80',
    softBg: 'from-[#FDF2F8] to-white',
  },
  {
    id: 'grace-resilience',
    number: '04.',
    category: 'magic',
    title: 'Quiet Strength & Grace',
    subtitle: 'Fearless Spirit · Inspiring Drive',
    description:
      'Behind your gentle humor is someone fiercely determined, thoughtful, and resilient. Watching you chase your goals inspires everyone around you.',
    memoryNote:
      'You handle challenges with poise and turn every obstacle into a stepping stone.',
    icon: <Compass className="w-5 h-5 text-[#7C3AED]" />,
    accentBorder: 'border-purple-200/80',
    softBg: 'from-[#FAF5FF] to-white',
  },
  {
    id: 'creative-soul',
    number: '05.',
    category: 'magic',
    title: 'An Eye for Beauty in Little Things',
    subtitle: 'Poetic Soul · Curated Moments',
    description:
      'Whether it is noticing a golden-hour sky, picking out the most thoughtful gift, or making a simple gathering feel like a celebration, you elevate every moment.',
    memoryNote:
      'You remind the rest of us to slow down and savor the beauty right in front of us.',
    icon: <Sparkles className="w-5 h-5 text-[#D97706]" />,
    accentBorder: 'border-amber-200/80',
    softBg: 'from-[#FFFBEB] to-white',
  },
  {
    id: 'once-in-a-lifetime',
    number: '06.',
    category: 'warmth',
    title: 'A Once-in-a-Lifetime Friend',
    subtitle: 'Unwavering Loyalty · Safe Harbor',
    description:
      'Through every season of life, having you in my corner has been one of the greatest privileges. You make friendship feel effortless, grounding, and joyful.',
    memoryNote:
      'Here is to celebrating you today and for many, many chapters still to come.',
    icon: <Stars className="w-5 h-5 text-[#E11D48]" />,
    accentBorder: 'border-rose-200/80',
    softBg: 'from-[#FFF1F2] to-white',
  },
];

export default function App() {
  const [burstCounter, setBurstCounter] = useState<number>(1);
  const [burstOrigin, setBurstOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'warmth' | 'joy' | 'magic'>('all');
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [giftOpened, setGiftOpened] = useState<boolean>(false);
  const [hugRedeemed, setHugRedeemed] = useState<boolean>(false);

  const [wishes, setWishes] = useState<CustomWish[]>([
    {
      id: 'w1',
      sender: 'Your Best Friend',
      message:
        'May this year bring you every ounce of happiness, peace, and adventure your heart desires. Happy Birthday, Farha! ❤️',
      timestamp: 'Pinned Keepsake Note',
    },
  ]);
  const [newSender, setNewSender] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [wishSubmitted, setWishSubmitted] = useState(false);

  const triggerCelebration = (origin?: { x: number; y: number }) => {
    setBurstOrigin(origin ?? null);
    setBurstCounter((prev) => prev + 1);
  };

  const handleToggleMusic = () => {
    const playing = soundController.toggleMusic();
    setIsPlayingMusic(playing);
  };

  const handleFlipCard = (id: string) => {
    soundController.playSoftPop(1.1);
    setFlippedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const item: CustomWish = {
      id: `wish-${Date.now()}`,
      sender: newSender.trim() || 'A Loving Friend',
      message: newMessage.trim(),
      timestamp: 'Added Just Now',
    };
    setWishes((prev) => [item, ...prev]);
    setNewSender('');
    setNewMessage('');
    setWishSubmitted(true);
    soundController.playSparkleChime();
    triggerCelebration();
    window.setTimeout(() => setWishSubmitted(false), 3500);
  };

  const filteredCards =
    selectedCategory === 'all'
      ? SPECIAL_CARDS
      : SPECIAL_CARDS.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] relative selection:bg-[#E11D48]/15 selection:text-[#E11D48]">
      <CelebrationCanvas burstCounter={burstCounter} burstOrigin={burstOrigin} />

      {/* Top Bar Contract: 3 Zones */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#opening"
            className="font-serif-display text-lg sm:text-xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap"
          >
            For Farha ✨
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
            <a
              href="#letter"
              className="hover:text-[#E11D48] transition-colors whitespace-nowrap"
            >
              Heartfelt Letter
            </a>
            <a
              href="#wishes-cake"
              className="hover:text-[#E11D48] transition-colors whitespace-nowrap"
            >
              Birthday Cake
            </a>
            <a
              href="#why-special"
              className="hover:text-[#E11D48] transition-colors whitespace-nowrap"
            >
              Why You’re Special
            </a>
            <a
              href="#final-surprise"
              className="hover:text-[#E11D48] transition-colors whitespace-nowrap"
            >
              Surprise
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleMusic}
              aria-label={isPlayingMusic ? 'Pause birthday music' : 'Play birthday music'}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                isPlayingMusic
                  ? 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3] shadow-xs'
                  : 'bg-white text-[#1C1917] border-stone-200 hover:border-rose-300'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#E11D48] animate-pulse" />
                  <span>Pause Melody</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#57534E]" />
                  <span>Play Melody</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                soundController.playSparkleChime();
                triggerCelebration({ x: rect.left + rect.width / 2, y: rect.bottom + 20 });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <PartyPopper className="w-3.5 h-3.5" />
              <span>Celebrate</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. ANIMATED OPENING HERO */}
        <section
          id="opening"
          className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div
            aria-hidden="true"
            className="absolute -top-12 left-1/4 w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-[#FFE4E6] via-[#FCE7F3] to-transparent blur-3xl opacity-80 -z-10 animate-pulse-soft"
          />
          <div
            aria-hidden="true"
            className="absolute top-24 right-10 w-[24rem] h-[24rem] rounded-full bg-gradient-to-tl from-[#FEF3C7] via-[#F3E8FF] to-transparent blur-3xl opacity-75 -z-10"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#9F1239]">
                <span>A One-of-a-Kind Digital Keepsake</span>
                <span aria-hidden="true">·</span>
                <span>Crafted with Love</span>
              </div>

              <h1
                className="font-serif-display text-4xl sm:text-6xl lg:text-[4.25rem] font-semibold text-[#1C1917] leading-[1.08] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Happy Birthday,{' '}
                <span className="italic bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#D97706] bg-clip-text text-transparent">
                  Farha!
                </span>{' '}
                <span className="inline-block animate-bounce">🎉</span>
              </h1>

              <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-2xl">
                Today the world gets to celebrate the brightest, kindest, and most unforgettable
                soul. This entire space was created just for you—filled with warm wishes, heartfelt
                words, birthday candles waiting for your wish, and a gentle melody to celebrate
                your day.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    soundController.playSparkleChime();
                    if (!isPlayingMusic) {
                      const started = soundController.startMusic();
                      setIsPlayingMusic(started);
                    }
                    triggerCelebration({ x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E11D48] to-[#DB2777] hover:from-[#BE123C] hover:to-[#BE185D] text-white font-semibold text-sm sm:text-base shadow-[0_12px_30px_-8px_rgba(225,29,72,0.45)] hover:shadow-[0_16px_36px_-6px_rgba(225,29,72,0.6)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Shower Confetti &amp; Start Music</span>
                </button>

                <a
                  href="#letter"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#FFF1F2] text-[#1C1917] border border-stone-200/90 font-semibold text-sm sm:text-base shadow-xs transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <span>Read Your Birthday Letter</span>
                </a>
              </div>

              <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#57534E]">
                <span>365 Days of New Adventures</span>
                <span aria-hidden="true">·</span>
                <span>100% Pure Appreciation</span>
                <span aria-hidden="true">·</span>
                <span>Infinite Smiles Ahead</span>
              </div>
            </div>

            {/* Right Column: Elegant Floral & Keepsake Card Artwork */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF1F2] via-[#FEF3C7]/60 to-[#FCE7F3] border border-rose-200/90 p-8 sm:p-10 shadow-[0_24px_60px_-15px_rgba(225,29,72,0.16)] flex flex-col justify-between min-h-[380px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-[#9F1239] font-medium">
                    Personal Digital Gift
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#E11D48]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="my-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-3xl mx-auto sm:mx-0">
                    🎂
                  </div>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1C1917] leading-snug">
                    “May your new year be filled with calm skies, endless laughter, and true joy.”
                  </h3>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Dedicated to Farha — a celebration of who you are, the smiles you bring, and the warmth you share.
                  </p>
                </div>

                <div className="pt-5 border-t border-rose-200/70 flex items-center justify-between text-xs text-[#9F1239] font-medium">
                  <span>Happy Birthday, Farha</span>
                  <span>Chapter {new Date().getFullYear()} ✨</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee Ribbon */}
        <div
          aria-hidden="true"
          className="py-3.5 bg-gradient-to-r from-[#FFF1F2] via-[#FEF3C7]/60 to-[#F3E8FF] border-y border-rose-200/60 overflow-hidden"
        >
          <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-medium text-[#9F1239]">
            {Array.from({ length: 2 }).map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-8 shrink-0">
                <span>HAPPY BIRTHDAY FARHA 🎉</span>
                <span>·</span>
                <span>SHINING BRIGHTER EVERY YEAR ✨</span>
                <span>·</span>
                <span>ENDLESS LAUGHTER &amp; PEACEFUL MORNINGS ☀️</span>
                <span>·</span>
                <span>YOU ARE SO DEEPLY APPRECIATED ❤️</span>
                <span>·</span>
                <span>HERE’S TO YOUR BEST CHAPTER YET 🥂</span>
                <span>·</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. HEARTFELT BIRTHDAY MESSAGE */}
        <section
          id="letter"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <p className="text-xs tracking-widest uppercase text-[#9F1239] font-medium mb-3">
              01 · A Personal Note For You
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-[#1C1917] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              A Heartfelt Birthday Letter to Farha
            </h2>
          </div>

          <article className="relative bg-white rounded-3xl p-7 sm:p-12 md:p-14 border border-rose-200/70 shadow-[0_20px_50px_-20px_rgba(225,29,72,0.1)]">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-6 mb-8">
              <div>
                <p className="font-serif-display italic text-xl sm:text-2xl text-[#1C1917]">
                  Dearest Farha,
                </p>
                <p className="text-xs text-[#57534E] mt-1">
                  Written with gratitude, joy, and warmest birthday wishes
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#E11D48]">
                <Heart className="w-5 h-5 fill-[#E11D48]" />
              </div>
            </div>

            <div className="space-y-5 text-base sm:text-[17px] text-[#3F3B37] leading-[1.8]">
              <p>
                On your birthday, I wanted to give you something more personal than a simple text
                message—a little corner of the world dedicated entirely to celebrating the wonderful
                person you are. Some people walk into our lives and quietly make everything brighter,
                kinder, and infinitely more meaningful. For everyone lucky enough to know you,{' '}
                <strong className="font-semibold text-[#1C1917]">you are that person, Farha.</strong>
              </p>

              <p>
                Thank you for being the friend who celebrates every small victory as if it were her
                own, who listens with her whole heart, and who can turn even an ordinary afternoon
                into a memory worth treasuring forever. Your warmth, your effortless humor, and your
                genuine care for the people around you are rare gifts in this world.
              </p>

              <p>
                As you step into this brand-new chapter of your life, my biggest wish for you is
                that all the love, light, and encouragement you pour into others returns to you
                tenfold. May your days be filled with peaceful mornings, exciting new doors opening,
                unplanned adventures, and laughter that echoes late into the night.
              </p>

              <p className="font-serif-display italic text-lg sm:text-xl text-[#9F1239] pt-2">
                Never stop shining the way you do. The world is so much prettier, warmer, and
                happier with you in it.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#57534E]">With endless love &amp; cheers,</p>
                <p className="font-serif-display italic text-xl font-semibold text-[#1C1917] mt-0.5">
                  Your Forever Grateful Friend ❤️
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  soundController.playSparkleChime();
                  triggerCelebration({ x: rect.left + rect.width / 2, y: rect.top });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
              >
                <Heart className="w-4 h-4 fill-[#E11D48]" />
                <span>Send a Heart Burst for Farha</span>
              </button>
            </div>
          </article>
        </section>

        {/* 3. ANIMATED BIRTHDAY CAKE & BALLOONS */}
        <InteractiveCakeSection onCelebrateBurst={triggerCelebration} />

        {/* 4. "WHY YOU'RE SPECIAL" SECTION */}
        <section
          id="why-special"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <p className="text-xs tracking-widest uppercase text-[#9F1239] font-medium mb-3">
                03 · Six Reasons You Are Unforgettable
              </p>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-[#1C1917] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Why You’re So Special, Farha
              </h2>
              <p className="text-base text-[#57534E] mt-3 leading-relaxed">
                Every card below holds a quality that makes you one in a million. Click any card to
                reveal a personal note on the back.
              </p>
            </div>

            <div
              className="flex items-center gap-1 p-1.5 bg-stone-200/60 rounded-xl self-start"
              role="tablist"
              aria-label="Filter special qualities"
            >
              {[
                { key: 'all', label: 'All Qualities' },
                { key: 'warmth', label: 'Heart & Warmth' },
                { key: 'joy', label: 'Joy & Laughter' },
                { key: 'magic', label: 'Grace & Magic' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === tab.key}
                  onClick={() =>
                    setSelectedCategory(tab.key as 'all' | 'warmth' | 'joy' | 'magic')
                  }
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === tab.key
                      ? 'bg-white text-[#1C1917] shadow-xs'
                      : 'text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const isFlipped = !!flippedCardIds[card.id];
              return (
                <div
                  key={card.id}
                  onClick={() => handleFlipCard(card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleFlipCard(card.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} card. Click to toggle personal note.`}
                  className={`group relative rounded-3xl p-7 bg-gradient-to-br ${card.softBg} border ${card.accentBorder} shadow-[0_12px_32px_-16px_rgba(28,25,23,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.16)] transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[265px]`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif-display italic text-lg font-semibold text-[#9F1239]">
                        {card.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        {card.icon}
                      </div>
                    </div>

                    <p className="text-xs text-[#57534E] mb-1.5">{card.subtitle}</p>
                    <h3 className="font-serif-display text-xl sm:text-2xl font-semibold text-[#1C1917] mb-3">
                      {card.title}
                    </h3>

                    {!isFlipped ? (
                      <p className="text-sm sm:text-[15px] text-[#57534E] leading-relaxed">
                        {card.description}
                      </p>
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/90 border border-rose-200/80 animate-fadeIn">
                        <p className="text-xs uppercase tracking-wider text-[#E11D48] font-semibold mb-1">
                          Personal Keepsake Note
                        </p>
                        <p className="font-serif-display italic text-base text-[#1C1917] leading-relaxed">
                          “{card.memoryNote}”
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-stone-200/60 flex items-center justify-between text-xs font-medium text-[#9F1239]">
                    <span>{isFlipped ? 'Click to view front' : 'Click to reveal personal note'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. FINAL SURPRISE SECTION WITH REDEEMABLE HUG VOUCHER */}
        <section
          id="final-surprise"
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF1F2] via-[#FFFBEB] to-[#FAF5FF] border border-rose-200/90 p-8 sm:p-12 md:p-16 text-center shadow-[0_25px_70px_-20px_rgba(225,29,72,0.18)]">
            <p className="text-xs tracking-widest uppercase text-[#9F1239] font-medium mb-3">
              04 · The Grand Finale Surprise
            </p>

            <h2
              className="font-serif-display text-3xl sm:text-5xl md:text-6xl font-semibold text-[#1C1917] tracking-tight mb-6"
              style={{ textWrap: 'balance' }}
            >
              Wishing you the happiest birthday, Farha ❤️
            </h2>

            <p className="text-base sm:text-lg text-[#57534E] max-w-2xl mx-auto leading-relaxed mb-10">
              May every sunrise of this new year bring you closer to your biggest dreams, surround
              you with people who cherish you, and fill your heart with peace and unstoppable joy.
            </p>

            {/* Interactive Surprise Gift Box Reveal: REDEEMABLE HUG VOUCHER */}
            <div className="max-w-xl mx-auto mb-10">
              {!giftOpened ? (
                <button
                  type="button"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setGiftOpened(true);
                    soundController.playSparkleChime();
                    triggerCelebration({ x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  className="group w-full rounded-2xl bg-white/90 hover:bg-white border-2 border-dashed border-rose-300 p-6 sm:p-8 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#E11D48] mb-3 group-hover:scale-110 transition-transform">
                    <Gift className="w-8 h-8" />
                  </div>
                  <span className="font-serif-display text-xl font-semibold text-[#1C1917]">
                    Tap to Unwrap Your Birthday Keepsake
                  </span>
                  <span className="text-xs text-[#57534E] mt-1">
                    Includes a special redeemable voucher waiting for Farha
                  </span>
                </button>
              ) : (
                <div className="rounded-3xl bg-white border-2 border-rose-200 p-6 sm:p-8 shadow-md text-left animate-fadeIn relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/60 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#E11D48] font-semibold">
                        Official Birthday Keepsake Voucher
                      </p>
                      <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1C1917] mt-0.5">
                        One Free Redeemable Big Warm Hug 🫂
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1F2] flex items-center justify-center text-[#E11D48] shrink-0">
                      <Heart className="w-6 h-6 fill-[#E11D48]" />
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#57534E] leading-relaxed mb-6">
                    Redeemable anytime, anywhere—on good days to celebrate, on stressful days for comforting warmth, or simply whenever you need a reminder that you are loved, supported, and never alone. No expiration date, valid for a lifetime!
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 text-xs text-[#57534E]">
                    <div>
                      <span className="font-semibold text-[#1C1917]">Issued To:</span> Farha
                    </div>
                    <div>
                      <span className="font-semibold text-[#1C1917]">Terms:</span> Unlimited redemptions
                    </div>
                    <div>
                      <span className="font-semibold text-[#1C1917]">Status:</span>{' '}
                      <span className={hugRedeemed ? 'text-emerald-600 font-semibold' : 'text-[#E11D48] font-semibold'}>
                        {hugRedeemed ? 'Redeemed with Love ❤️' : 'Ready to Redeem ✨'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <span className="text-xs text-[#78716C] italic">
                      Tied with endless love &amp; care
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHugRedeemed(true);
                        soundController.playSparkleChime();
                        triggerCelebration({ x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        hugRedeemed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-xs'
                      }`}
                    >
                      {hugRedeemed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Hug Claimed! Sending Warmth ❤️</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>Redeem Farha’s Hug Now</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Grand Fireworks Celebration Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  soundController.playSparkleChime();
                  triggerCelebration({ x: rect.left + rect.width / 2, y: rect.top });
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#D97706] hover:opacity-95 text-white font-semibold text-base sm:text-lg shadow-[0_14px_34px_-8px_rgba(225,29,72,0.55)] hover:shadow-[0_18px_42px_-6px_rgba(225,29,72,0.7)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <PartyPopper className="w-5 h-5" />
                <span>Launch Grand Birthday Fireworks! 🎆</span>
              </button>

              <button
                type="button"
                onClick={handleToggleMusic}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-[#1C1917] border border-stone-200 font-semibold text-sm sm:text-base shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <Music className="w-4 h-4 text-[#E11D48]" />
                <span>{isPlayingMusic ? 'Pause Birthday Melody' : 'Play Birthday Melody'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Birthday Keepsake Wall */}
          <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <p className="text-xs uppercase tracking-widest text-[#9F1239] font-medium mb-2">
                  Interactive Keepsake Wall
                </p>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#1C1917] mb-2">
                  Add a Birthday Wish or Message
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed mb-5">
                  Leave another birthday blessing or note for Farha right on this page. Every note launches a celebratory burst of sparkles!
                </p>

                <form onSubmit={handleAddWish} className="space-y-3.5">
                  <div>
                    <label
                      htmlFor="sender-name"
                      className="block text-xs font-medium text-[#57534E] mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      value={newSender}
                      onChange={(e) => setNewSender(e.target.value)}
                      placeholder="e.g. Bestie / Your Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-sm text-[#1C1917] focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wish-message"
                      className="block text-xs font-medium text-[#57534E] mb-1"
                    >
                      Birthday Wish for Farha
                    </label>
                    <textarea
                      id="wish-message"
                      rows={3}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a sweet birthday message for Farha..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200 text-sm text-[#1C1917] focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C1917] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {wishSubmitted ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Wish Pinned with Sparkles!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Pin Wish to Keepsake Wall</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-4">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl bg-[#FAF8F5] border border-rose-200/70"
                  >
                    <p className="font-serif-display italic text-base sm:text-lg text-[#1C1917] leading-relaxed mb-3">
                      “{w.message}”
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#57534E]">
                      <span className="font-semibold text-[#9F1239]">{w.sender}</span>
                      <span aria-hidden="true">·</span>
                      <span>{w.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-[#57534E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif-display italic text-base text-[#1C1917]">
            Farha’s Magical Birthday Surprise — May your light always shine ✨
          </p>
          <div className="flex items-center gap-4">
            <a href="#opening" className="hover:text-[#E11D48] transition-colors">
              Back to Top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
