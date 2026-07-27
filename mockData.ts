import { Doctor, QueueItem, Appointment, MedicalRecord, HospitalLocation, ConsultationSummary } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Vance, MD',
    specialty: 'Interventional Cardiology',
    department: 'Cardiology',
    experienceYears: 14,
    rating: 4.95,
    reviewsCount: 382,
    consultationFee: 50,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    hospitalName: 'MediFlow Central Tech Hospital',
    distanceMiles: 1.2,
    estimatedWaitMins: 8,
    availableSlots: ['09:30 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:45 PM'],
    status: 'Available',
    dailyCapacity: 25,
    currentPatientsCount: 18,
  },
  {
    id: 'doc-2',
    name: 'Dr. Alexander Mercer, PhD',
    specialty: 'Clinical Neurophysiology',
    department: 'Neurology',
    experienceYears: 18,
    rating: 4.92,
    reviewsCount: 420,
    consultationFee: 65,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    hospitalName: 'MediFlow Central Tech Hospital',
    distanceMiles: 1.2,
    estimatedWaitMins: 12,
    availableSlots: ['10:00 AM', '11:30 AM', '01:30 PM', '04:15 PM'],
    status: 'Busy',
    dailyCapacity: 20,
    currentPatientsCount: 15,
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    specialty: 'Emergency Medicine Specialist',
    department: 'Emergency & Trauma',
    experienceYears: 11,
    rating: 4.88,
    reviewsCount: 295,
    consultationFee: 40,
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=300',
    hospitalName: 'MediFlow North Emergency Wing',
    distanceMiles: 2.5,
    estimatedWaitMins: 4,
    availableSlots: ['Immediate', '10:15 AM', '11:00 AM', '12:30 PM'],
    status: 'Available',
    dailyCapacity: 40,
    currentPatientsCount: 28,
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Chen',
    specialty: 'Orthopedic Robotic Surgery',
    department: 'Orthopedics',
    experienceYears: 16,
    rating: 4.97,
    reviewsCount: 512,
    consultationFee: 55,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    hospitalName: 'MediFlow West Robotic Care',
    distanceMiles: 3.8,
    estimatedWaitMins: 15,
    availableSlots: ['11:00 AM', '02:30 PM', '04:00 PM'],
    status: 'In Surgery',
    dailyCapacity: 22,
    currentPatientsCount: 19,
  },
  {
    id: 'doc-5',
    name: 'Dr. Amara Thorne',
    specialty: 'Pediatric Pulmonology',
    department: 'Pediatrics',
    experienceYears: 9,
    rating: 4.91,
    reviewsCount: 210,
    consultationFee: 45,
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300',
    hospitalName: 'MediFlow Childrens Wing',
    distanceMiles: 1.9,
    estimatedWaitMins: 10,
    availableSlots: ['09:45 AM', '11:15 AM', '01:45 PM', '03:15 PM'],
    status: 'Available',
    dailyCapacity: 30,
    currentPatientsCount: 21,
  }
];

export const INITIAL_QUEUE: QueueItem[] = [
  {
    id: 'q-101',
    patientName: 'Minahil Raza (You)',
    tokenNumber: 'A-104',
    position: 3,
    estimatedTime: '11 mins',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Vance',
    status: 'Vitals Kiosk',
    priority: 'Medium'
  },
  {
    id: 'q-102',
    patientName: 'David K.',
    tokenNumber: 'A-101',
    position: 1,
    estimatedTime: 'In Session',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Vance',
    status: 'In Consultation',
    priority: 'High'
  },
  {
    id: 'q-103',
    patientName: 'Maria S.',
    tokenNumber: 'A-102',
    position: 2,
    estimatedTime: '4 mins',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Vance',
    status: 'Next in Line',
    priority: 'Medium'
  },
  {
    id: 'q-104',
    patientName: 'James L.',
    tokenNumber: 'A-105',
    position: 4,
    estimatedTime: '18 mins',
    department: 'Cardiology',
    doctorName: 'Dr. Sarah Vance',
    status: 'Arrived',
    priority: 'Low'
  },
];

export const INITIAL_APPOINTMENT: Appointment = {
  id: 'apt-2026-001',
  doctorName: 'Dr. Sarah Vance, MD',
  doctorSpecialty: 'Interventional Cardiology',
  doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  hospitalName: 'MediFlow Central Tech Hospital',
  roomNumber: 'Suite 304 - Pod B',
  date: 'Today, Jul 25',
  time: '10:30 AM',
  tokenNumber: 'A-104',
  status: 'In Queue',
  queuePosition: 3,
  estimatedWaitMins: 11
};

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-1',
    title: 'Cardiovascular AI ECG Analysis',
    category: 'Scan',
    date: 'Jul 20, 2026',
    doctorName: 'Dr. Sarah Vance',
    details: 'Normal Sinus Rhythm. 0.02% PVC detected, clinically insignificant. AI Heart Health Score: 94/100.',
    fileSize: '2.4 MB'
  },
  {
    id: 'rec-2',
    title: 'Lipid & Metabolic Panel 2026',
    category: 'Lab Report',
    date: 'Jul 15, 2026',
    doctorName: 'Dr. Alexander Mercer',
    details: 'Total Cholesterol: 172 mg/dL. LDL: 94 mg/dL. Fasting Glucose: 88 mg/dL. All key biomarkers within optimal ranges.',
    fileSize: '1.8 MB'
  },
  {
    id: 'rec-3',
    title: 'Amoxicillin + Clavulanate 500mg',
    category: 'Prescription',
    date: 'Jul 10, 2026',
    doctorName: 'Dr. Elena Rostova',
    details: 'Take 1 tablet every 12 hours after meals for 7 days. 2 Refills Remaining.',
    fileSize: '512 KB'
  },
  {
    id: 'rec-4',
    title: 'mRNA Multivalent Booster 2026',
    category: 'Vaccination',
    date: 'Jan 12, 2026',
    details: 'Verified digitally signed record. Batch #MF-8829-X. Next booster due: Jan 2027.',
    fileSize: '890 KB'
  },
  {
    id: 'rec-5',
    title: 'Apex Platinum Care Policy',
    category: 'Insurance',
    date: 'Active Policy',
    details: 'Policy #AP-99210-2026. $100,000 Emergency Coverage. 100% In-network Co-pay covered.',
    fileSize: '3.1 MB'
  }
];

export const INITIAL_CONSULTATION_SUMMARIES: ConsultationSummary[] = [
  {
    id: 'CONS-2026-8812',
    consultationDate: 'July 18, 2026 • 10:15 AM',
    doctorName: 'Dr. Sarah Vance, MD',
    doctorTitle: 'Chief Interventional Cardiologist',
    department: 'Cardiology',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    chiefComplaint: 'Mild chest discomfort after strenuous exercise and occasional heart palpitations.',
    diagnosis: 'Atypical Non-Cardiac Chest Strain / Grade 1 Exercise Induced Palpitations',
    vitalSigns: {
      bloodPressure: '122/78 mmHg',
      heartRate: '68 bpm',
      spO2: '99%',
      temperature: '98.6 °F'
    },
    prescribedMedications: [
      { name: 'Metoprolol Succinate ER', dosage: '25mg', instructions: 'Take 1 tablet daily every morning with water.' },
      { name: 'Magnesium Glycinate Supplement', dosage: '200mg', instructions: 'Take 1 capsule before sleep for muscle relaxation.' }
    ],
    clinicalNotes: '12-lead ECG conducted at clinic revealed normal sinus rhythm with crisp QRS complex and no ST segment elevation. Echocardiogram telemetry showed 62% ejection fraction with clear aortic valves. Patient advised to reduce high-caffeine intake and monitor daily HRV via smartwatch telemetry.',
    followUpInstructions: 'Schedule routine follow-up check in 6 weeks or utilize AI Medical Assistant if symptoms recur during intense workouts.'
  },
  {
    id: 'CONS-2026-7419',
    consultationDate: 'June 29, 2026 • 02:30 PM',
    doctorName: 'Dr. Alexander Mercer, PhD',
    doctorTitle: 'Senior Clinical Neurophysiologist',
    department: 'Neurology',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    chiefComplaint: 'Tension headaches occurring twice weekly following prolonged screen work.',
    diagnosis: 'Cervicogenic Tension Headache with Ocular Fatigue Strain',
    vitalSigns: {
      bloodPressure: '118/76 mmHg',
      heartRate: '72 bpm',
      spO2: '98%',
      temperature: '98.4 °F'
    },
    prescribedMedications: [
      { name: 'Electrolyte Balance Infusion', dosage: '500ml', instructions: 'Daily hydration protocol with 2L water minimum.' }
    ],
    clinicalNotes: 'Neurological exam intact. Cranial nerves I-XII grossly normal. Motor strength 5/5 bilateral. Cervical spine mobility intact without acute nerve compression. Advised 20-20-20 screen rest rule and ergonomic workstation setup.',
    followUpInstructions: 'PRN follow-up if headache frequency exceeds 3 times a week.'
  },
  {
    id: 'CONS-2026-6104',
    consultationDate: 'May 14, 2026 • 11:00 AM',
    doctorName: 'Dr. Elena Rostova',
    doctorTitle: 'Emergency Medicine Specialist',
    department: 'Emergency & Trauma',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78c80?auto=format&fit=crop&q=80&w=300',
    chiefComplaint: 'Acute seasonal respiratory congestion, dry cough, and mild fever.',
    diagnosis: 'Acute Viral Upper Respiratory Tract Infection (Non-COVID/Flu)',
    vitalSigns: {
      bloodPressure: '120/80 mmHg',
      heartRate: '78 bpm',
      spO2: '97%',
      temperature: '100.2 °F'
    },
    prescribedMedications: [
      { name: 'Amoxicillin + Clavulanate', dosage: '500mg', instructions: '1 tablet twice daily after meals for 7 days.' },
      { name: 'Benzonatate Oral Capsules', dosage: '100mg', instructions: '1 capsule every 8 hours PRN for persistent dry cough.' }
    ],
    clinicalNotes: 'Oropharynx slightly erythematous without exudate. Lungs clear to auscultation bilaterally without wheezing or rales. Tympanic membranes intact. Patient given thermal cooling guidance and hydration protocol.',
    followUpInstructions: 'Completed treatment course. Patient reported full symptom resolution within 5 days.'
  }
];

export const HOSPITALS_OVERFLOW: HospitalLocation[] = [
  {
    id: 'hosp-1',
    name: 'MediFlow Central Tech Hospital',
    distanceMiles: 1.2,
    currentOccupancyPercent: 88,
    avgWaitMins: 14,
    availableSpecialistsCount: 12,
    travelTimeMins: 5,
    isOvercrowded: true,
  },
  {
    id: 'hosp-2',
    name: 'MediFlow Metro Care Center',
    distanceMiles: 3.4,
    currentOccupancyPercent: 42,
    avgWaitMins: 5,
    availableSpecialistsCount: 18,
    travelTimeMins: 11,
    isOvercrowded: false,
  },
  {
    id: 'hosp-3',
    name: 'St. Jude Smart Health Hub',
    distanceMiles: 4.8,
    currentOccupancyPercent: 55,
    avgWaitMins: 8,
    availableSpecialistsCount: 15,
    travelTimeMins: 14,
    isOvercrowded: false,
  }
];

export const DAILY_HEALTH_TIPS = [
  "🧠 AI Insight: Based on your recent sleep telemetry, going to bed 20 mins earlier tonight will boost HRV recovery by 14%.",
  "💧 Hydration Goal: Drink 500ml of water before 11:00 AM to balance blood pressure levels during queue waiting.",
  "🫀 Cardio Check: Your average resting heart rate is 64 bpm today — excellent cardiovascular recovery status!"
];
