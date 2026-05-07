import type { GameDefinition } from "@codequest/games-sdk";

/**
 * Maps a GameDefinition.color key to concrete Tailwind classes.
 * Centralized so adding a new ramp means one edit, not a sweep.
 */
export const colorRamp: Record<
  GameDefinition["color"],
  { bg: string; ink: string; ring: string; chip: string }
> = {
  teal: {
    bg: "bg-teal-soft",
    ink: "text-teal-ink",
    ring: "ring-teal/40",
    chip: "bg-teal text-white",
  },
  blue: {
    bg: "bg-blue-soft",
    ink: "text-blue-ink",
    ring: "ring-blue/40",
    chip: "bg-blue text-white",
  },
  amber: {
    bg: "bg-amber-soft",
    ink: "text-amber-ink",
    ring: "ring-amber/40",
    chip: "bg-amber text-white",
  },
  pink: {
    bg: "bg-pink-soft",
    ink: "text-pink-ink",
    ring: "ring-pink/40",
    chip: "bg-pink text-white",
  },
  purple: {
    bg: "bg-purple-soft",
    ink: "text-purple-ink",
    ring: "ring-purple/40",
    chip: "bg-purple text-white",
  },
  coral: {
    bg: "bg-coral-soft",
    ink: "text-coral-ink",
    ring: "ring-coral/40",
    chip: "bg-coral text-white",
  },
};
