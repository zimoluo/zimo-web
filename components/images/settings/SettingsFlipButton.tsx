import flipStyle from "./flip.module.css";

interface Props {
  className?: string;
}

export default function SettingsFlipButton({ className = "" }: Props) {
  return (
    <div aria-hidden={true} className={className}>
      <div className="relative flex items-center justify-center w-full h-full pointer-events-none select-none">
        <div className={`${flipStyle.proportion} bg-neutral-50 rounded-full`} />
      </div>
    </div>
  );
}
