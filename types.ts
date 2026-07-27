export type ScreenId = 
  | 'welcome'        // Screen 1
  | 'healthCheck'    // Screen 2
  | 'dashboard'      // Screen 3
  | 'booking'        // Screen 4
  | 'queueTracker'   // Screen 5
  | 'wallet'         // Screen 6
  | 'aiAssistant'    // Screen 7
  | 'analytics'      // Screen 8
  | 'profile'        // Screen 9
  | 'adminManagement'; // Screen 10

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  avatar: string;
  hospitalName: string;
  distanceMiles: number;
  estimatedWaitMins: number;
  availableSlots: string[];
  status: 'Available' | 'Busy' | 'Break' | 'In Surgery';
  dailyCapacity: number;
  currentPatientsCount: number;
}

export interface QueueItem {
  id: string;
  patientName: string;
  tokenNumber: string;
  position: number;
  estimatedTime: string;
  department: string;
  doctorName: string;
  status: 'Arrived' | 'Vitals Kiosk' | 'Next in Line' | 'In Consultation' | 'Completed';
  priority: PriorityLevel;
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  hospitalName: string;
  roomNumber: string;
  date: string;
  time: string;
  tokenNumber: string;
  status: 'Confirmed' | 'In Queue' | 'Completed' | 'Cancelled';
  queuePosition?: number;
  estimatedWaitMins?: number;
  rating?: number;
  facilityRating?: number;
  waitTimeRating?: string;
  feedbackText?: string;
  feedbackTags?: string[];
  feedbackSubmitted?: boolean;
  ratedAt?: string;
}

export interface DoctorFeedback {
  id?: string;
  appointmentId: string;
  doctorName: string;
  doctorSpecialty?: string;
  hospitalName?: string;
  rating: number;
  facilityRating?: number;
  waitTimeRating?: string;
  feedbackText: string;
  tags: string[];
  submittedAt: string;
  userId?: string;
}

export interface TriageResult {
  symptoms: string;
  priority: PriorityLevel;
  department: string;
  estimatedTime: string;
  confidence: number;
  summary: string;
  recommendedDoctorType: string;
  suggestedActions: string[];
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Vaccination' | 'Insurance' | 'Scan';
  date: string;
  doctorName?: string;
  details: string;
  fileSize?: string;
  downloadUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isAudio?: boolean;
}

export type NotificationType = 'queue_update' | 'appointment_reminder' | 'triage_alert' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionScreen?: ScreenId;
  priority?: NotificationPriority;
  metadata?: {
    tokenNumber?: string;
    position?: number;
    doctorName?: string;
    roomNumber?: string;
    timeUntil?: string;
    department?: string;
  };
}

export interface ConsultationSummary {
  id: string;
  consultationDate: string;
  doctorName: string;
  doctorTitle: string;
  department: string;
  doctorAvatar: string;
  chiefComplaint: string;
  diagnosis: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    spO2: string;
    temperature: string;
  };
  prescribedMedications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
  clinicalNotes: string;
  followUpInstructions: string;
  reportPdfUrl?: string;
}

export interface HospitalLocation {
  id: string;
  name: string;
  distanceMiles: number;
  currentOccupancyPercent: number;
  avgWaitMins: number;
  availableSpecialistsCount: number;
  travelTimeMins: number;
  isOvercrowded: boolean;
}
