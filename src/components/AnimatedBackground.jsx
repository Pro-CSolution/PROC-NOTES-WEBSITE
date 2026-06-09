import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import flowAnimation from "../assets/flow-background.json";

const optimizedFlowAnimation = {
  ...flowAnimation,
  fr: 30,
};

export default function AnimatedBackground() {
  const animationRef = useRef(null);

  useEffect(() => {
    let resumeTimer;

    const pauseAnimation = () => animationRef.current?.pause();
    const playAnimation = () => {
      if (!document.hidden) animationRef.current?.play();
    };
    const pauseWhileScrolling = () => {
      pauseAnimation();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(playAnimation, 180);
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAnimation();
      } else {
        playAnimation();
      }
    };

    animationRef.current?.setSubframe(false);
    window.addEventListener("scroll", pauseWhileScrolling, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(resumeTimer);
      window.removeEventListener("scroll", pauseWhileScrolling);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="lottie-background" aria-hidden="true">
      <Lottie
        lottieRef={animationRef}
        animationData={optimizedFlowAnimation}
        autoplay
        loop
        renderer="canvas"
        rendererSettings={{
          clearCanvas: true,
          progressiveLoad: true,
          dpr: 1,
        }}
        className="lottie-background-animation"
      />
      <div className="lottie-background-overlay" />
    </div>
  );
}
