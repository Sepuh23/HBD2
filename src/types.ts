export interface MessageCard {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  icon: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  size: "large" | "medium" | "small" | "tall";
  cursiveNote: string;
}

export interface GardenFlower {
  id: string;
  sender: string;
  wish: string;
  flowerType: "rose" | "peony" | "jasmine" | "tulip";
  color: string;
  plantedAt: Date;
  growth: number; // 0 to 100
}
