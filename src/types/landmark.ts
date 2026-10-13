export type Landmark = {
  x: number;
  y: number;
  z: number;
};

export type HandFrame = {
  landmarks: Landmark[];
  timestamp: number;
};
