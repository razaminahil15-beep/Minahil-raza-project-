import { 
  db, 
  auth,
  ensureAuthenticatedUser, 
  handleFirestoreError,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot 
} from '../lib/firebase';
import { Appointment, MedicalRecord, DoctorFeedback } from '../types';

export interface UserProfileData {
  id?: string;
  name: string;
  email: string;
  bloodType: string;
  height: string;
  weight: string;
  allergies: string;
}

export interface MedicationData {
  id?: string;
  userId: string;
  name: string;
  dosage: string;
  time: string;
  instruction: string;
  taken: boolean;
  streakCount: number;
}

/**
 * Save or update appointment in Firestore
 */
export async function saveAppointmentToFirestore(apt: Appointment): Promise<string | null> {
  try {
    const user = await ensureAuthenticatedUser();
    if (!user) {
      console.warn("Cannot save appointment: No authenticated Firebase user.");
      return null;
    }
    const docData = {
      ...apt,
      userId: user.uid,
      createdAt: new Date().toISOString()
    };
    const docRef = doc(db, 'appointments', apt.id);
    await setDoc(docRef, docData, { merge: true });
    return apt.id;
  } catch (err) {
    handleFirestoreError(err, 'saveAppointmentToFirestore');
    return null;
  }
}

/**
 * Listen for user's appointments in real-time
 */
export function subscribeUserAppointments(
  onUpdate: (appointments: Appointment[]) => void
) {
  let snapshotUnsub: (() => void) | null = null;

  const authUnsub = auth.onAuthStateChanged((user) => {
    if (snapshotUnsub) {
      snapshotUnsub();
      snapshotUnsub = null;
    }

    if (user) {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid)
      );
      snapshotUnsub = onSnapshot(
        q,
        (snapshot) => {
          const list: Appointment[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
          });
          if (list.length > 0) {
            onUpdate(list);
          }
        },
        (error) => {
          handleFirestoreError(error, 'subscribeUserAppointments');
        }
      );
    }
  });

  return () => {
    if (snapshotUnsub) snapshotUnsub();
    authUnsub();
  };
}

/**
 * Save medical record to Firestore
 */
export async function saveMedicalRecordToFirestore(record: MedicalRecord): Promise<string | null> {
  try {
    const user = await ensureAuthenticatedUser();
    if (!user) return null;
    const docData = {
      ...record,
      userId: user.uid
    };
    const docRef = doc(db, 'medicalRecords', record.id);
    await setDoc(docRef, docData, { merge: true });
    return record.id;
  } catch (err) {
    handleFirestoreError(err, 'saveMedicalRecordToFirestore');
    return null;
  }
}

/**
 * Fetch all medical records for authenticated user
 */
export async function fetchUserMedicalRecords(): Promise<MedicalRecord[]> {
  try {
    const user = await ensureAuthenticatedUser();
    if (!user) return [];
    const q = query(
      collection(db, 'medicalRecords'),
      where('userId', '==', user.uid)
    );
    const querySnapshot = await getDocs(q);
    const records: MedicalRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({ id: docSnap.id, ...docSnap.data() } as MedicalRecord);
    });
    return records;
  } catch (err) {
    handleFirestoreError(err, 'fetchUserMedicalRecords');
    return [];
  }
}

/**
 * Save or update user profile
 */
export async function saveUserProfileToFirestore(profile: UserProfileData): Promise<boolean> {
  try {
    const user = await ensureAuthenticatedUser();
    if (!user) return false;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { ...profile, email: user.email || profile.email }, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveUserProfileToFirestore');
    return false;
  }
}

/**
 * Fetch user profile
 */
export async function fetchUserProfileFromFirestore(): Promise<UserProfileData | null> {
  try {
    const user = await ensureAuthenticatedUser();
    if (!user) return null;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfileData;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, 'fetchUserProfileFromFirestore');
    return null;
  }
}

/**
 * ADMIN: Real-time subscription to ALL appointments in Firestore
 */
export function subscribeAllAppointments(
  onUpdate: (appointments: (Appointment & { patientName?: string; patientEmail?: string })[]) => void
) {
  const q = query(collection(db, 'appointments'));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const list: (Appointment & { patientName?: string; patientEmail?: string })[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as any);
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, 'subscribeAllAppointments');
    }
  );

  return unsubscribe;
}

/**
 * ADMIN: Create or update an appointment
 */
export async function adminSaveAppointment(
  apt: Appointment & { patientName?: string; patientEmail?: string }
): Promise<boolean> {
  try {
    const docRef = doc(db, 'appointments', apt.id);
    const docData = {
      ...apt,
      createdAt: new Date().toISOString()
    };
    await setDoc(docRef, docData, { merge: true });
    return true;
  } catch (err) {
    handleFirestoreError(err, 'adminSaveAppointment');
    return false;
  }
}

/**
 * ADMIN: Update appointment status
 */
export async function adminUpdateAppointmentStatus(
  aptId: string, 
  status: 'In Queue' | 'Completed' | 'Cancelled'
): Promise<boolean> {
  try {
    const docRef = doc(db, 'appointments', aptId);
    await updateDoc(docRef, { status });
    return true;
  } catch (err) {
    handleFirestoreError(err, 'adminUpdateAppointmentStatus');
    return false;
  }
}

/**
 * ADMIN: Delete an appointment from Firestore
 */
export async function adminDeleteAppointment(aptId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'appointments', aptId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, 'adminDeleteAppointment');
    return false;
  }
}

/**
 * Save doctor feedback & review rating to Firestore
 */
export async function saveDoctorFeedbackToFirestore(feedback: DoctorFeedback): Promise<boolean> {
  try {
    const user = auth.currentUser;
    const docData = {
      ...feedback,
      userId: user?.uid || 'anonymous',
      submittedAt: new Date().toISOString()
    };
    const collectionRef = collection(db, 'doctorFeedbacks');
    await addDoc(collectionRef, docData);

    // Also update appointment record in firestore with feedbackSubmitted flag & rating
    if (feedback.appointmentId) {
      const aptRef = doc(db, 'appointments', feedback.appointmentId);
      await updateDoc(aptRef, {
        rating: feedback.rating,
        facilityRating: feedback.facilityRating || 5,
        waitTimeRating: feedback.waitTimeRating || 'Reasonable',
        feedbackText: feedback.feedbackText || '',
        feedbackTags: feedback.tags || [],
        feedbackSubmitted: true,
        status: 'Completed',
        ratedAt: new Date().toISOString()
      }).catch(() => {
        // If doc doesn't exist yet, ignore
      });
    }
    return true;
  } catch (err) {
    handleFirestoreError(err, 'saveDoctorFeedbackToFirestore');
    return false;
  }
}

