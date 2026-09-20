export interface MenuItem {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

/** 0 = minimum pull, 1 = maximum pull */
export type Intensity = number;
