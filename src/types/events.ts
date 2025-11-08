export interface EventMedia {
  id: number;
  type: "image" | "video";
  url: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // Format: "2024-03-15" ou "15 Mars 2024"
  location?: string;
  media: EventMedia[];
}

export interface EventsByYear {
  [year: number]: Event[];
}

