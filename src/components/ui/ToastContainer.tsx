import { useToastStore } from '../../store/toastStore';

const styles: Record<string, string> = {
  success: 'border-dispatch-success/40 text-dispatch-success',
  error: 'border-dispatch-danger/40 text-dispatch-danger',
  info: 'border-dispatch-accentDim text-dispatch-accent',
};

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[2000] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`animate-toast-in cursor-pointer rounded-lg border bg-dispatch-panel px-4 py-3 text-sm shadow-lg ${styles[t.kind]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
