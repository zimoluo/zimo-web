import { useToast } from "@/components/contexts/ToastContext";

export default function SignalGeneratorWindow() {
  const { appendToast } = useToast();

  return (
    <button
      className="w-full h-full text-center bg-widget-80 font-bold"
      onClick={() => {
        appendToast({
          title: "Test signal",
          description: "Notification sent!",
        });
      }}
    >
      send signal
    </button>
  );
}
