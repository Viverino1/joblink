import Spline from "@splinetool/react-spline";
export default function Hero() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center pt-16 overflow-x-clip">
      <div className="absolute flex flex-col items-center w-full px-4">
        <h1 className="text-[10vw] md:text-[5vw] md:h-[6vw] font-mont text-center leading-tight">
          Find work today.
        </h1>
        <p className="text-[3.5vw] md:text-[1.25vw] text-center mt-2">
          Choose from reputable opportunities approved by Lafayette High Scool.
        </p>
      </div>
      <div className="translate-y-[3vh] md:translate-x-[2vw] translate-x-[5vw] opacity-50 pointer-events-none relative flex aspect-square h-[100vh] w-[200vh] items-center justify-center overflow-clip -z-10">
        <div className="absolute h-[185vh] w-[185vw]">
          <Spline scene="/splinecode/LandingHero.splinecode" />
        </div>
      </div>
    </div>
  );
}
