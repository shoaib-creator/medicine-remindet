import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Helper function to get current user ID
const getUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.uid;
};

// Patient Medicine Functions
export const savePatientMedicine = async (medicine) => {
  try {
    const userId = getUserId();
    const docRef = await addDoc(collection(db, 'users', userId, 'patientMedicines'), {
      ...medicine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...medicine };
  } catch (error) {
    console.error('Error saving patient medicine:', error);
    throw error;
  }
};

export const getPatientMedicines = async () => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, 'users', userId, 'patientMedicines'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const medicines = [];
    querySnapshot.forEach((doc) => {
      medicines.push({ id: doc.id, ...doc.data() });
    });
    return medicines;
  } catch (error) {
    console.error('Error getting patient medicines:', error);
    return [];
  }
};

export const updatePatientMedicine = async (id, updatedData) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, 'users', userId, 'patientMedicines', id);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating patient medicine:', error);
    throw error;
  }
};

export const deletePatientMedicine = async (id) => {
  try {
    const userId = getUserId();
    await deleteDoc(doc(db, 'users', userId, 'patientMedicines', id));
  } catch (error) {
    console.error('Error deleting patient medicine:', error);
    throw error;
  }
};

// Clinic Medicine Functions
export const saveClinicMedicine = async (medicine) => {
  try {
    const userId = getUserId();
    const docRef = await addDoc(collection(db, 'users', userId, 'clinicMedicines'), {
      ...medicine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...medicine };
  } catch (error) {
    console.error('Error saving clinic medicine:', error);
    throw error;
  }
};

export const getClinicMedicines = async () => {
  try {
    const userId = getUserId();
    const q = query(
      collection(db, 'users', userId, 'clinicMedicines'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const medicines = [];
    querySnapshot.forEach((doc) => {
      medicines.push({ id: doc.id, ...doc.data() });
    });
    return medicines;
  } catch (error) {
    console.error('Error getting clinic medicines:', error);
    return [];
  }
};

export const updateClinicMedicine = async (id, updatedData) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, 'users', userId, 'clinicMedicines', id);
    await updateDoc(docRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating clinic medicine:', error);
    throw error;
  }
};

export const deleteClinicMedicine = async (id) => {
  try {
    const userId = getUserId();
    await deleteDoc(doc(db, 'users', userId, 'clinicMedicines', id));
  } catch (error) {
    console.error('Error deleting clinic medicine:', error);
    throw error;
  }
};

// Clinic Info Functions
export const saveClinicInfo = async (clinicInfo) => {
  try {
    const userId = getUserId();
    const docRef = doc(db, 'users', userId, 'clinicInfo', 'data');
    await setDoc(docRef, {
      ...clinicInfo,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error saving clinic info:', error);
    throw error;
  }
};

export const getClinicInfo = async () => {
  try {
    const userId = getUserId();
    const docRef = doc(db, 'users', userId, 'clinicInfo', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting clinic info:', error);
    return null;
  }
};

// Helper function to find nearby clinics with specific medicine
// This searches across all users who have clinic info set up
export const findNearbyClinicsWithMedicine = async (medicineName, patientLocation) => {
  try {
    // For now, we'll search only the current user's clinic
    // In a full implementation, you'd want to search all public clinics
    const clinicInfo = await getClinicInfo();
    const clinicMedicines = await getClinicMedicines();
    
    if (!clinicInfo || !clinicInfo.latitude || !clinicInfo.longitude) {
      return [];
    }
    
    // Filter medicines that match the search
    const matchingMedicines = clinicMedicines.filter(med => 
      med.name.toLowerCase().includes(medicineName.toLowerCase()) && 
      med.stock > 0
    );
    
    if (matchingMedicines.length === 0) {
      return [];
    }
    
    // Calculate distance
    const distance = calculateDistance(
      patientLocation.latitude,
      patientLocation.longitude,
      clinicInfo.latitude,
      clinicInfo.longitude
    );
    
    return [{
      clinic: clinicInfo,
      medicines: matchingMedicines,
      distance: distance.toFixed(2),
    }];
  } catch (error) {
    console.error('Error finding nearby clinics:', error);
    return [];
  }
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
