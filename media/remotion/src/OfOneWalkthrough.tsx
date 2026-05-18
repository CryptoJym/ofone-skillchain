import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";
import { toneColors, walkthroughCues } from "./data/ofoneWalkthrough";

type Props = {
  audioSrc?: string;
};

const findCue = (frame: number) => {
  return walkthroughCues.find((cue) => frame >= cue.startFrame && frame < cue.startFrame + cue.durationFrames) ?? walkthroughCues[0];
};

export const OfOneWalkthrough = ({ audioSrc = "" }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = findCue(frame);
  const localFrame = frame - cue.startFrame;
  const progress = Math.min(1, Math.max(0, localFrame / cue.durationFrames));
  const accent = toneColors[cue.tone];
  const titleIn = spring({ frame: localFrame, fps, config: { damping: 24, stiffness: 110 } });
  const lineProgress = interpolate(localFrame, [20, cue.durationFrames - 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1)
  });
  const nextIndex = walkthroughCues.findIndex((item) => item.id === cue.id) + 1;
  const nextCue = walkthroughCues[nextIndex] ?? walkthroughCues[0];

  return (
    <AbsoluteFill style={styles.stage}>
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
      <div style={styles.header}>
        <div style={styles.brand}>OfOne</div>
        <div style={styles.mode}>Decision-state compiler walkthrough</div>
      </div>

      <div style={styles.canvas}>
        <div style={{ ...styles.leftRail, borderColor: accent }}>
          <div style={styles.kicker}>Frame {cue.id}</div>
          <h1 style={{ ...styles.title, transform: `translateY(${(1 - titleIn) * 28}px)`, opacity: titleIn }}>
            {cue.title}
          </h1>
          <p style={styles.subtitle}>{cue.subtitle}</p>
          <div style={styles.movement}>{cue.movement}</div>
        </div>

        <div style={styles.graphPanel}>
          <div style={styles.graphHeader}>
            <span>Typed state</span>
            <b>{Math.round((frame / 3600) * 100)}%</b>
          </div>
          <div style={styles.nodeField}>
            {cue.artifacts.map((artifact, index) => {
              const enter = spring({
                frame: localFrame - index * 8,
                fps,
                config: { damping: 20, stiffness: 90 }
              });
              const angle = (index / Math.max(1, cue.artifacts.length)) * Math.PI * 2;
              const radius = 230 + (index % 2) * 58;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius * 0.62;
              return (
                <div
                  key={artifact}
                  style={{
                    ...styles.graphNode,
                    borderColor: accent,
                    transform: `translate(${x}px, ${y}px) scale(${0.84 + enter * 0.16})`,
                    opacity: Math.min(1, enter)
                  }}
                >
                  {artifact}
                </div>
              );
            })}
            <div style={{ ...styles.coreNode, borderColor: accent, boxShadow: `0 0 0 10px ${accent}16` }}>
              {cue.id === "10" ? "benchmark" : "map"}
            </div>
            <div style={{ ...styles.connectorLine, background: accent, transform: `scaleX(${lineProgress})` }} />
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${progress * 100}%`, background: accent }} />
        </div>
        <div style={styles.next}>
          Next: {nextCue.title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const styles: Record<string, React.CSSProperties> = {
  stage: {
    background: "linear-gradient(180deg, #f7f8fb 0%, #ffffff 62%, #eef3f7 100%)",
    color: "#111318",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    padding: 58
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #d9dee8",
    paddingBottom: 20
  },
  brand: {
    fontWeight: 800,
    fontSize: 34
  },
  mode: {
    color: "#596272",
    fontSize: 24
  },
  canvas: {
    display: "grid",
    gridTemplateColumns: "0.92fr 1.08fr",
    gap: 44,
    height: 790,
    alignItems: "stretch",
    paddingTop: 46
  },
  leftRail: {
    background: "#ffffff",
    border: "2px solid",
    borderRadius: 18,
    padding: 44,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  kicker: {
    color: "#596272",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    fontWeight: 800,
    fontSize: 22,
    marginBottom: 24
  },
  title: {
    fontSize: 82,
    lineHeight: 0.95,
    margin: 0,
    letterSpacing: 0
  },
  subtitle: {
    margin: "28px 0 0",
    color: "#596272",
    fontSize: 30,
    lineHeight: 1.32
  },
  movement: {
    marginTop: 44,
    padding: "18px 20px",
    border: "1px solid #d9dee8",
    borderRadius: 10,
    background: "#f7f8fb",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 22
  },
  graphPanel: {
    background: "#111318",
    color: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    display: "grid",
    gridTemplateRows: "84px 1fr"
  },
  graphHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    borderBottom: "1px solid rgba(255,255,255,0.18)",
    color: "#d9dee8",
    fontSize: 24
  },
  nodeField: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  coreNode: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    border: "4px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 32,
    background: "#ffffff",
    color: "#111318",
    zIndex: 3
  },
  graphNode: {
    position: "absolute",
    minWidth: 150,
    minHeight: 58,
    padding: "0 18px",
    border: "2px solid",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.96)",
    color: "#111318",
    fontWeight: 750,
    fontSize: 20,
    textAlign: "center"
  },
  connectorLine: {
    position: "absolute",
    width: 560,
    height: 4,
    opacity: 0.6,
    transformOrigin: "left center",
    zIndex: 1
  },
  footer: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 22,
    alignItems: "center",
    marginTop: 30
  },
  progressTrack: {
    height: 14,
    background: "#d9dee8",
    borderRadius: 999,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999
  },
  next: {
    color: "#596272",
    fontSize: 22
  }
};

