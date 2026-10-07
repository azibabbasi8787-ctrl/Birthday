import React, { useState } from 'react';
import { Flame, RotateCcw, PartyPopper } from 'lucide-react';
import { soundController } from '../utils/soundEngine';

interface InteractiveCakeSectionProps {
  onCelebrateBurst: (origin?: { x: number; y: number }) => void;
}

interface CandleState {
  id: number;
  label: string;
  lit: boolean;
  wishText: string;
}

interface BalloonItem {
  id: number;
  color: string;
  accent: string;
  label: string;
  wish: string;
  popped: boolean;
  offsetY: string;
}

const INITIAL_CANDLES: CandleState[] = [
  { id: 1, label: 'Joy', lit: true, wishText: 'Endless laughter & bright mornings' },
  { id: 2, label: 'Dreams', lit: true, wishText: 'Every bold dream coming true' },
  { id: 3, label: 'Peace', lit: true, wishText: 'Calm skies & peace of heart' },
  { id: 4, label: 'Adventure', lit: true, wishText: 'Unforgettable new places & stories' },
  { id: 5, label: 'Love', lit: true, wishText: 'Surrounded by warmth & true friends' },
];

const INITIAL_BALLOONS: BalloonItem[] = [
  {
    id: 1,
    color: '#FB7185',
    accent: '#FFE4E6',
    label: 'Radiant Joy',
    wish: 'May your smile outshine every room you enter!',
    popped: false,
    offsetY: '0px',
  },
  {
    id: 2,
    color: '#F59E0B',
    accent: '#FEF3C7',
    label: 'Golden Hours',
    wish: 'Here is to golden sunsets and spontaneous coffee dates!',
    popped: false,
    offsetY: '-12px',
  },
  {
    id: 3,
    color: '#A855F7',
    accent: '#F3E8FF',
    label: 'Big Magic',
    wish: 'May this chapter surprise you with magic at every turn!',
    popped: false,
    offsetY: '-4px',
  },
  {
    id: 4,
    color: '#EC4899',
    accent: '#FCE7F3',
    label: 'Pure Love',
    wish: 'You deserve all the kindness you so freely give to others!',
    popped: false,
    offsetY: '-14px',
  },
];

export const InteractiveCakeSection: React.FC<InteractiveCakeSectionProps> = ({
  onCelebrateBurst,
}) => {
  const [candles, setCandles] = useState<CandleState[]>(INITIAL_CANDLES);
  const [balloons, setBalloons] = useState<BalloonItem[]>(INITIAL_BALLOONS);
  const [activeWishToast, setActiveWishToast] = useState<string>(
    'Tap each flickering candle or click "Blow Out Candles" to make a birthday wish!'
  );

  const litCount = candles.filter((c) => c.lit).length;
  const allBlownOut = litCount === 0;

  const toggleCandle = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const target = candles.find((c) => c.id === id);
    if (!target) return;

    const nextCandles = candles.map((c) => (c.id === id ? { ...c, lit: !c.lit } : c));
    setCandles(nextCandles);

    if (target.lit) {
      soundController.playSoftPop(1.2);
      setActiveWishToast(`✨ Wish for ${target.label}: "${target.wishText}"`);
      const remaining = nextCandles.filter((c) => c.lit).length;
      if (remaining === 0) {
        soundController.playSparkleChime();
        onCelebrateBurst({ x: rect.left + rect.width / 2, y: rect.top });
        setActiveWishToast(
          '🎉 Happy Birthday, Farha! All 5 candles are blown out — may every single wish come true!'
        );
      }
    } else {
      soundController.playSoftPop(0.9);
      setActiveWishToast(`🕯️ Relit the candle of ${target.label}!`);
    }
  };

  const blowAllCandles = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCandles((prev) => prev.map((c) => ({ ...c, lit: false })));
    soundController.playSparkleChime();
    onCelebrateBurst({ x: rect.left + rect.width / 2, y: rect.top - 80 });
    setActiveWishToast(
      '🎉 Make a big wish, Farha! All candles blown out in one magical breath!'
    );
  };

  const relightAllCandles = () => {
    setCandles(INITIAL_CANDLES);
    setBalloons(INITIAL_BALLOONS);
    soundController.playSoftPop(1.0);
    setActiveWishToast('✨ Candles relit and balloons floated back up! Make another wish anytime.');
  };

  const handlePopBalloon = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const target = balloons.find((b) => b.id === id);
    if (!target || target.popped) return;

    soundController.playSoftPop(1.35);
    setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setActiveWishToast(`🎈 Balloon Popped — ${target.wish}`);
    onCelebrateBurst({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <section
      id="wishes-cake"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-10 top-16 h-96 bg-gradient-to-r from-[#FFE4E6]/60 via-[#FEF3C7]/60 to-[#F3E8FF]/60 blur-3xl -z-10 rounded-full"
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs tracking-widest uppercase text-[#9F1239] font-medium mb-3">
          02 · Make A Birthday Wish
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-serif-display font-semibold text-[#1C1917] tracking-tight mb-4"
          style={{ textWrap: 'balance' }}
        >
          Close Your Eyes &amp; Blow Out the Candles, Farha
        </h2>
        <p className="text-base text-[#57534E] leading-relaxed">
          Every candle holds a special blessing for your year ahead. Tap individual candles or
          floating balloons to reveal hidden birthday wishes, or blow them all out at once!
        </p>
      </div>

      <div className="bg-white/90 border border-[#F5D0FE]/60 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_-20px_rgba(225,29,72,0.12)]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {balloons.map((balloon, index) => (
            <div
              key={balloon.id}
              className="flex flex-col items-center justify-center min-h-[128px] p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 transition-all"
            >
              {!balloon.popped ? (
                <button
                  type="button"
                  onClick={(e) => handlePopBalloon(balloon.id, e)}
                  className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded-xl p-1 cursor-pointer"
                  aria-label={`Pop ${balloon.label} balloon`}
                >
                  <div
                    className="relative flex items-center justify-center w-14 h-16 rounded-full shadow-md transition-transform duration-200 group-hover:scale-110 animate-float-slow"
                    style={{
                      backgroundColor: balloon.color,
                      animationDelay: `${index * 0.6}s`,
                    }}
                  >
                    <span className="absolute top-2.5 left-3 w-2.5 h-5 rounded-full bg-white/45 rotate-[-20deg]" />
                    <span
                      className="absolute -bottom-1.5 w-2.5 h-2 rotate-45"
                      style={{ backgroundColor: balloon.color }}
                    />
                  </div>
                  <div className="w-px h-5 bg-stone-300 my-0.5" />
                  <span className="text-xs font-medium text-[#57534E] group-hover:text-[#E11D48] transition-colors whitespace-nowrap">
                    Pop: {balloon.label}
                  </span>
                </button>
              ) : (
                <div className="text-center px-2 animate-fadeIn">
                  <p className="text-xs font-semibold text-[#E11D48] mb-1">
                    ✨ {balloon.label}
                  </p>
                  <p className="text-xs text-[#57534E] leading-snug">{balloon.wish}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative flex flex-col items-center justify-center pt-6 pb-4">
          <div
            aria-hidden="true"
            className={`absolute top-2 w-72 h-72 rounded-full transition-opacity duration-700 pointer-events-none blur-2xl ${
              allBlownOut
                ? 'opacity-15 bg-pink-200'
                : 'opacity-80 bg-gradient-to-b from-amber-200/75 via-rose-200/50 to-transparent'
            }`}
          />

          <div
            className="relative z-20 flex items-end justify-center gap-4 sm:gap-7 mb-[-6px]"
            role="group"
            aria-label="Birthday candles"
          >
            {candles.map((candle) => (
              <button
                key={candle.id}
                type="button"
                onClick={(e) => toggleCandle(candle.id, e)}
                className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded-lg px-1.5 pt-2 cursor-pointer"
                aria-label={`${candle.lit ? 'Blow out' : 'Light'} ${candle.label} candle`}
              >
                <span className="mb-2 text-[11px] font-medium text-[#57534E] group-hover:text-[#E11D48] transition-colors whitespace-nowrap">
                  {candle.label}
                </span>

                <div className="h-8 flex items-center justify-center">
                  {candle.lit ? (
                    <div className="relative flex items-center justify-center animate-flame">
                      <div className="absolute -inset-2 rounded-full bg-amber-300/60 blur-sm" />
                      <svg
                        width="18"
                        height="26"
                        viewBox="0 0 18 26"
                        fill="none"
                        className="relative drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                      >
                        <path
                          d="M9 1C9 1 16 9.5 16 15.5C16 19.6421 12.866 23 9 23C5.13401 23 2 19.6421 2 15.5C2 9.5 9 1 9 1Z"
                          fill="url(#flameGrad)"
                        />
                        <path
                          d="M9 8C9 8 13 13 13 16.5C13 18.9853 11.2091 21 9 21C6.79086 21 5 18.9853 5 16.5C5 13 9 8 9 8Z"
                          fill="#FEF08A"
                        />
                        <defs>
                          <linearGradient
                            id="flameGrad"
                            x1="9"
                            y1="1"
                            x2="9"
                            y2="23"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#F59E0B" />
                            <stop offset="0.6" stopColor="#FBBF24" />
                            <stop offset="1" stopColor="#FDE047" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-end h-full pb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-ping" />
                    </div>
                  )}
                </div>

                <div className="w-0.5 h-2 bg-stone-700" />

                <div className="w-4 sm:w-5 h-14 sm:h-16 rounded-t-md bg-gradient-to-b from-white via-rose-50 to-pink-100 border border-rose-200 shadow-sm overflow-hidden flex flex-col justify-around">
                  <div className="w-full h-1.5 bg-[#FB7185]/60 -rotate-12 transform scale-125" />
                  <div className="w-full h-1.5 bg-[#F59E0B]/60 -rotate-12 transform scale-125" />
                  <div className="w-full h-1.5 bg-[#FB7185]/60 -rotate-12 transform scale-125" />
                </div>
              </button>
            ))}
          </div>

          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            <div className="relative w-56 sm:w-68 h-24 sm:h-28 bg-gradient-to-b from-[#FFF1F2] to-[#FFE4E6] border-2 border-[#FECDD3] rounded-t-3xl shadow-inner flex flex-col justify-between overflow-hidden">
              <div className="flex justify-around -mt-2">
                {Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-6 rounded-full bg-white border-b-2 border-rose-200/80 shadow-xs"
                  />
                ))}
              </div>

              <div className="mx-auto px-4 py-1 rounded-full bg-white/90 border border-amber-200/80 shadow-xs">
                <span className="font-serif-display italic text-xs sm:text-sm font-semibold text-[#9F1239]">
                  Happy Birthday, Farha ✨
                </span>
              </div>

              <div className="flex justify-around items-center px-4 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
              </div>
            </div>

            <div className="relative w-72 sm:w-88 h-28 sm:h-32 -mt-1 bg-gradient-to-b from-[#FFE4E6] via-[#FECDD3]/70 to-[#FDA4AF]/50 border-2 border-[#FECDD3] rounded-t-2xl rounded-b-xl shadow-md flex flex-col justify-between overflow-hidden">
              <div className="flex justify-around -mt-2.5">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-9 h-7 rounded-full bg-[#FFFDF9] border-b-2 border-rose-200/90"
                  />
                ))}
              </div>

              <div className="flex justify-evenly items-center px-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                ))}
              </div>

              <div className="w-full h-3 bg-gradient-to-r from-[#E11D48]/80 via-[#F59E0B]/80 to-[#E11D48]/80" />
            </div>

            <div className="w-80 sm:w-96 h-4 bg-gradient-to-r from-stone-200 via-white to-stone-200 border border-stone-300 rounded-full shadow-md" />
            <div className="w-28 h-8 bg-gradient-to-b from-stone-200 to-stone-100 border-x border-stone-300" />
            <div className="w-44 h-3.5 bg-stone-200 border border-stone-300 rounded-full shadow-xs" />
          </div>
        </div>

        <div className="mt-6 max-w-xl mx-auto text-center px-5 py-3.5 rounded-2xl bg-[#FAF8F5] border border-rose-200/80">
          <p className="text-sm sm:text-base font-medium text-[#1C1917]">{activeWishToast}</p>
          <p className="text-xs text-[#57534E] mt-1 tabular-nums">
            Candles Lit: {litCount} of {candles.length} · Balloons Popped:{' '}
            {balloons.filter((b) => b.popped).length} of {balloons.length}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          {!allBlownOut ? (
            <button
              type="button"
              onClick={blowAllCandles}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Flame className="w-4 h-4" />
              <span>Blow Out All Candles</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                soundController.playSparkleChime();
                onCelebrateBurst({ x: rect.left + rect.width / 2, y: rect.top });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#D97706] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <PartyPopper className="w-4 h-4" />
              <span>Send Another Wish Burst!</span>
            </button>
          )}

          <button
            type="button"
            onClick={relightAllCandles}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1C1917] font-medium text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 text-[#57534E]" />
            <span>Reset Candles &amp; Balloons</span>
          </button>
        </div>
      </div>
    </section>
  );
};
