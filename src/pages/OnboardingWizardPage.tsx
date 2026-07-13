import { useMemo, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import type { OnboardingAnswers, UserSegment } from '../types';

interface OptionStep {
  key: keyof OnboardingAnswers;
  question: string;
  options?: { value: string; label: string }[];
  type?: 'options' | 'number';
  showIf?: (answers: OnboardingAnswers) => boolean;
}

const SEGMENT_OPTIONS: { value: UserSegment; label: string }[] = [
  { value: 'solo', label: 'I plan my own errands and trips' },
  { value: 'delivery', label: 'I deliver for a restaurant or courier service' },
  { value: 'field_team', label: 'I manage a small team of drivers' },
  { value: 'enterprise', label: 'I manage a large fleet or logistics operation' },
];

const STEPS: OptionStep[] = [
  {
    key: 'segment',
    question: 'What best describes you?',
    options: SEGMENT_OPTIONS,
    type: 'options',
  },
  {
    key: 'stops_per_day',
    question: 'How many stops do you usually plan at once?',
    type: 'number',
  },
  {
    key: 'transport_mode',
    question: 'How do you usually get around?',
    options: [
      { value: 'car', label: 'My own vehicle (car)' },
      { value: 'bike', label: 'Bicycle' },
      { value: 'walk', label: 'Mostly on foot' },
      { value: 'van', label: 'Van or truck' },
      { value: 'public_transit', label: 'Public transit' },
    ],
    type: 'options',
  },
  {
    key: 'team_size',
    question: 'How many drivers are on your team?',
    type: 'number',
    showIf: (answers) => answers.segment === 'field_team' || answers.segment === 'enterprise',
  },
];

export default function OnboardingWizardPage() {
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    segment: null,
    primary_goal: null,
    stops_per_day: null,
    transport_mode: null,
    team_size: null,
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [numberInput, setNumberInput] = useState<string>('');
  const submitOnboarding = useAuthStore((s) => s.submitOnboarding);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const activeSteps = useMemo(
    () => STEPS.filter((s) => !s.showIf || s.showIf(answers)),
    [answers]
  );
  const step = activeSteps[stepIndex];
  const isLast = stepIndex === activeSteps.length - 1;
  const currentValue = step ? (answers[step.key] as string | number | null) : null;

  function selectOption(value: string) {
    if (!step) return;
    setAnswers((prev) => ({ ...prev, [step.key]: value }));
  }

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setNumberInput(val);
    }
  }

  function getNumberValue(): number | null {
    const num = parseInt(numberInput, 10);
    return isNaN(num) || num <= 0 ? null : num;
  }

  async function handleNext() {
    if (!step) return;
  
    // Use a mutable copy so we always work with the latest state
    let nextAnswers = answers;
  
    if (step.type === 'number') {
      const num = getNumberValue();
      if (num === null) {
        alert('Please enter a valid number greater than 0.');
        return;
      }
      // Build the updated object locally and set it
      nextAnswers = { ...answers, [step.key]: num };
      setAnswers(nextAnswers);
      setNumberInput('');
    }
  
    if (isLast) {
      // Now nextAnswers includes the number value we just added
      const payload: OnboardingAnswers = {
        ...nextAnswers,
        primary_goal: nextAnswers.primary_goal || 'route_optimization',
      };
      await submitOnboarding(payload);
      navigate('/choose-plan');
      return;
    }
    // If not last, advance the step – the state is already updated
    setStepIndex((i) => Math.min(i + 1, activeSteps.length - 1));
  }

  function handleBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (!step) return null;

  const isNumberStep = step.type === 'number';
  const isValidNumber = isNumberStep ? getNumberValue() !== null : true;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex gap-1.5 mb-8">
          {activeSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= stepIndex ? 'bg-dispatch-accent' : 'bg-dispatch-line'
              }`}
            />
          ))}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold mb-6 animate-fade-up" key={step.key}>
          {step.question}
        </h1>

        {step.type === 'options' && step.options && (
          <div className="space-y-2.5 mb-8">
            {step.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-colors ${
                  currentValue === opt.value
                    ? 'border-dispatch-accent bg-dispatch-accent/10 text-dispatch-text'
                    : 'border-dispatch-line text-dispatch-dim hover:border-dispatch-dim'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step.type === 'number' && (
          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={numberInput}
              onChange={handleNumberChange}
              placeholder="Enter a number"
              className="w-full px-4 py-3.5 rounded-lg border border-dispatch-line bg-transparent text-sm focus:border-dispatch-accent focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-xs text-dispatch-dim">Please enter a whole number greater than 0.</p>
          </div>
        )}

        <div className="flex gap-3">
          {stepIndex > 0 && (
            <Button variant="secondary" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={step.type === 'options' ? !currentValue : !isValidNumber}
            loading={isLast && loading}
            className="flex-1"
          >
            {isLast ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}