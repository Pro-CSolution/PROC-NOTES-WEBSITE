import Lottie from "lottie-react";
import flowAnimation from "../assets/flow-background.json";

export default function AnimatedBackground() {
  return (
    <div className="lottie-background" aria-hidden="true">
      <Lottie
        animationData={flowAnimation}
        autoplay
        loop
        className="lottie-background-animation"
      />
      <div className="lottie-background-overlay" />
    </div>
  );
}
