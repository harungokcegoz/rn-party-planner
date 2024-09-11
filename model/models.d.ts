export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface Party {
  id: string;
  name: string;
  description: string;
  date: Date;
  invitees: string[];
  calendarEventId?: string;
  place: string;
}
