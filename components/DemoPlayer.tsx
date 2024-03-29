// components/DemoPlayer.tsx
import { Player } from "@livepeer/react";

interface DemoPlayerProps {
  playbackId: string;
}

export const DemoPlayer: React.FC<DemoPlayerProps> = ({ playbackId }) => {
  return <Player playbackId={playbackId} />;
};
