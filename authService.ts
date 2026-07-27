import { 
  auth, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  doc, 
  setDoc, 
  getDoc,
  handleFirestoreError
} from '../lib/firebase';
import { UserProfileData } from './firestoreService';

export async function signUpUser(
  name: string, 
  email: string, 
  pass: string, 
  extraInfo?: { bloodType?: string; height?: string; weight?: string; allergies?: string }
) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    
    await updateProfile(user, { displayName: name });

    const userProfile: UserProfileData = {
      name,
      email,
      bloodType: extraInfo?.bloodType || 'O Positive',
      height: extraInfo?.height || '175 cm',
      weight: extraInfo?.weight || '70 kg',
      allergies: extraInfo?.allergies || 'None'
    };

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userProfile, { merge: true });

    return { user, profile: userProfile };
  } catch (error: any) {
    handleFirestoreError(error, 'signUpUser');
    throw error;
  }
}

export async function signInUser(email: string, pass: string) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCred.user;
    
    // Fetch profile
    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);
    let profile: UserProfileData | null = null;
    if (docSnap.exists()) {
      profile = docSnap.data() as UserProfileData;
    }

    return { user, profile };
  } catch (error: any) {
    handleFirestoreError(error, 'signInUser');
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCred = await signInWithPopup(auth, provider);
    const user = userCred.user;

    const userProfile: UserProfileData = {
      name: user.displayName || 'MediFlow Patient',
      email: user.email || '',
      bloodType: 'O Positive',
      height: '175 cm',
      weight: '70 kg',
      allergies: 'None'
    };

    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, userProfile, { merge: true });

    return { user, profile: userProfile };
  } catch (error: any) {
    handleFirestoreError(error, 'signInWithGoogle');
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    handleFirestoreError(error, 'signOutUser');
    throw error;
  }
}
