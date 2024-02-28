export interface Tournament {
    id: string;
    name: string;
    slug: string;
    images: { id: string; url: string }[];
    startAt: number;
    endAt: number;
    url: string;
    venueName: string;
    locationDisplayName: string;
    numAttendees: number;
  }