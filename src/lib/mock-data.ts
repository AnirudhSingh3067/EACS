export type Psychologist = {
  id: string;
  name: string;
  specialization: string[];
  languages: string[];
  experience: number;
  price: number;
  rating: number;
  reviewsCount: number;
  license: string;
  bio: string;
  availability: string[];
  imageUrl: string;
};

export const MOCK_PSYCHOLOGISTS: Psychologist[] = [
  {
    id: "1",
    name: "Dr. Manoj Sharma",
    specialization: ["Cognitive Behavioral Therapy", "Anxiety", "Depression"],
    languages: ["English", "Spanish"],
    experience: 12,
    price: 120,
    rating: 4.9,
    reviewsCount: 128,
    license: "PSY-99281-NY",
    bio: "Dr. Sharma specializes in CBT for adults struggling with anxiety and work-life balance. He has over 12 years of experience in clinical settings.",
    availability: ["Monday 10:00 AM", "Monday 2:00 PM", "Wednesday 4:00 PM"],
    imageUrl: "https://images.unsplash.com/photo-1592947945242-69312358628b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwc3ljaG9sb2dpc3R8ZW58MHx8fHwxNzcyMjcwNjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "2",
    name: "Dr. Neha Kapoor",
    specialization: ["Family Therapy", "Couples Counseling", "Trauma"],
    languages: ["English", "Mandarin"],
    experience: 8,
    price: 95,
    rating: 4.7,
    reviewsCount: 84,
    license: "LMFT-88321-CA",
    bio: "Dr. Kapoor focus on relational dynamics and trauma-informed care. She works with families to build bridges of understanding.",
    availability: ["Tuesday 9:00 AM", "Thursday 11:00 AM", "Friday 3:00 PM"],
    imageUrl: "https://images.unsplash.com/photo-1714976694810-85add1a29c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0aGVyYXBpc3R8ZW58MHx8fHwxNzcyMjcwNjg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  },
  {
    id: "3",
    name: "Dr. Arjun Mehta",
    specialization: ["Child Psychology", "ADHD", "Autism Spectrum"],
    languages: ["Spanish", "English", "Portuguese"],
    experience: 15,
    price: 150,
    rating: 5.0,
    reviewsCount: 210,
    license: "PSY-11029-TX",
    bio: "Dr. Mehta is a board-certified child psychologist with a passion for supporting neurodivergent youth and their families.",
    availability: ["Monday 11:00 AM", "Tuesday 4:00 PM", "Thursday 10:00 AM"],
    imageUrl: "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBtZW58ZW58MHx8fHwxNzcyMjcwODc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
  }
];

export const MOCK_REVIEWS = [
  { id: "r1", user: "Anonymous", rating: 5, comment: "Dr. Sarah helped me navigate a very difficult career transition.", date: "2024-03-15" },
  { id: "r2", user: "Jason T.", rating: 4, comment: "Great listener and very practical advice.", date: "2024-02-10" }
];

export const MOCK_SESSIONS = [
  { id: "s1", psychologistName: "Dr. Sarah Jenkins", date: "2024-05-20", time: "10:00 AM", status: "Upcoming" },
  { id: "s2", psychologistName: "Michael Chen", date: "2024-04-12", time: "3:00 PM", status: "Completed" }
];

export const MOCK_MOOD_DATA = [
  { date: "Mon", score: 3 },
  { date: "Tue", score: 4 },
  { date: "Wed", score: 2 },
  { date: "Thu", score: 5 },
  { date: "Fri", score: 4 },
  { date: "Sat", score: 5 },
  { date: "Sun", score: 4 },
];

export const MOCK_FLAGGED_CHATS = [
  { id: "f1", user: "User_882", timestamp: "2024-05-18 09:21", riskScore: 85, summary: "Expressions of extreme hopelessness." },
  { id: "f2", user: "User_119", timestamp: "2024-05-18 11:45", riskScore: 72, summary: "Repeated mentions of panic and chest pain." }
];
