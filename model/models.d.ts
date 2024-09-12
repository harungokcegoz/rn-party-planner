export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface Party {
  id: string;
  name: string;
  description: string;
  date: string; // Changed from Date to string
  invitees: Contact[]; // Changed from string[] to Contact[]
  calendarEventId?: string;
  place: string;
}
