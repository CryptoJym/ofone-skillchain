import { Composition } from "remotion";
import { OfOneWalkthrough } from "./OfOneWalkthrough";

export const RemotionRoot = () => {
  return (
    <Composition
      id="OfOneWalkthrough"
      component={OfOneWalkthrough}
      durationInFrames={3600}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        audioSrc: ""
      }}
    />
  );
};

