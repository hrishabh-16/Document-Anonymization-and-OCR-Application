import { Spotlight } from "./Spotlight";
import { Cover } from "./ui/cover";

export default function Hero() {
  return (
    <div className="h-[40rem] w-full rounded-md flex flex-col gap-14 md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-12xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6  dark:via-white dark:to-white">
          Document <Cover>Shield</Cover>
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Protect your privacy with our advanced anonymization technology.
        </p>
      </div>
      <a
        href="#upload"
        className="inline-flex h-10 sm:h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 sm:px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-0 focus:border-transparent text-white overflow-hidden text-base sm:text-lg font-semibold hover:cursor-pointer relative z-10 hover:brightness-150"
      >
        Get Started
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
      </a>
    </div>
  );
}
