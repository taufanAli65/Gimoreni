import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useUpdateMe } from '../../domains/users/hooks/useUpdateMe';

interface TutorialStep {
  emoji: string;
  title: string;
  body: string;
}

const STEPS: TutorialStep[] = [
  {
    emoji: '📝',
    title: 'Log Your Daily Record',
    body: 'Tap Add at the bottom to record your income and expenses. Log every day to keep your streak alive and avoid deductions at month-end!',
  },
  {
    emoji: '📊',
    title: 'View Stats & Quests on Home',
    body: 'Your Home page shows your expense chart, active quest, total points, and balance — everything you need at a glance.',
  },
  {
    emoji: '💰',
    title: 'Bonus & Deduction System',
    body: 'Log every day this month → earn a bonus on your allowance. Miss even one day → a deduction is applied. Stay consistent!',
  },
  {
    emoji: '🎯',
    title: 'Submit a Quest Redemption',
    body: 'Complete a quest? Tap "Submit Proof" on the active quest card, upload your evidence, and wait for the Admin to confirm your points.',
  },
  {
    emoji: '🔥',
    title: 'Streaks Matter',
    body: 'Your streak counts consecutive days you\'ve logged finances. Build it up for milestones and bonus points — and don\'t break it!',
  },
];

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal = ({ onClose }: TutorialModalProps) => {
  const [step, setStep] = useState(0);
  const { mutate: updateMe, isPending } = useUpdateMe();

  const markComplete = () => {
    updateMe(
      { hasCompletedTutorial: true },
      { onSuccess: onClose, onError: onClose }
    );
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      markComplete();
    }
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl px-6 pt-6 pb-10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Getting Started
          </span>
          <button
            onClick={markComplete}
            disabled={isPending}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] justify-center"
            aria-label="Skip tutorial"
          >
            <X className="w-4 h-4" />
            Skip
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#2D6A4F]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{current.emoji}</div>
          <h2 className="text-xl font-bold text-[#2D6A4F] mb-3">{current.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{current.body}</p>
        </div>

        {/* Next / Done button */}
        <button
          onClick={handleNext}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] text-white font-bold py-4 rounded-xl hover:bg-[#1B4332] transition-colors disabled:opacity-60 min-h-[56px]"
        >
          {isPending ? 'Saving...' : isLast ? '🎉 Let\'s Go!' : (
            <>Next <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};
