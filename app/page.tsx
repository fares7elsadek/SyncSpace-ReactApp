import Image from "next/image";
import BG from "@/public/backgound.avif";
import Center from "./components/Center";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        backgroundImage: `url(${BG.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
      className=""
    >
      {/* Overlay */}
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      ></div>
      <Center className="pl-[10vw] w-full" centerXOnly>
        <div
          className="flex flex-col gap-8 mt-10 w-full relative"
          style={{ zIndex: 2 }}
        >
          <h1 className="text-8xl font-semibold textGradient w-full">
            SyncSpace
          </h1>
          <h2 className="text-white text-xl font-semibold">
            Your Gateway to Social Fun and Activities!
          </h2>
          <p className="text-white font-semibold w-[60%]">
            Where Social Media Meets Real-Time Fun! Join our vibrant community
            for interactive activities and shared virtual experiences. Connect,
            play, and engage like never before!
          </p>
          <Link
            href="/signup"
            className="px-8 py-4 rounded-full BGGradient text-nowrap text-base text-white my-20 w-32"
          >
            Start Now
          </Link>
        </div>
      </Center>
    </div>
  );
}
