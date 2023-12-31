import Image from "next/image";

export default function GrassAnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-20 flex items-center justify-center h-screen pointer-events-none select-none">
      <Image
        src="/theme/animated-background/grass/bg.svg"
        alt="Grass BG"
        height={1000}
        width={1000}
        className="object-cover w-full h-full"
        priority={true}
      />
    </div>
  );
}
