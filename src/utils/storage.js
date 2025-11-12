import AsyncStorage from '@react-native-async-storage/async-storage';

const PATIENT_MEDICINES_KEY = '@patient_medicines';
const CLINIC_MEDICINES_KEY = '@clinic_medicines';
const CLINIC_INFO_KEY = '@clinic_info';

// Patient Medicine Functions
export const savePatientMedicine = async (medicine) => {
  try {
    const existingMedicines = await getPatientMedicines();
    const newMedicine = {
      id: Date.now().toString(),
      ...medicine,
      createdAt: new Date().toISOString(),
    };
    const updatedMedicines = [...existingMedicines, newMedicine];
    await AsyncStorage.setItem(PATIENT_MEDICINES_KEY, JSON.stringify(updatedMedicines));
    return newMedicine;
  } catch (error) {
    console.error('Error saving patient medicine:', error);
    throw error;
  }
};

export const getPatientMedicines = async () => {
  try {
    const medicines = await AsyncStorage.getItem(PATIENT_MEDICINES_KEY);
    return medicines ? JSON.parse(medicines) : [];
  } catch (error) {
    console.error('Error getting patient medicines:', error);
    return [];
  }
};

export const updatePatientMedicine = async (id, updatedData) => {
  try {
    const medicines = await getPatientMedicines();
    const updatedMedicines = medicines.map(med => 
      med.id === id ? { ...med, ...updatedData } : med
    );
    await AsyncStorage.setItem(PATIENT_MEDICINES_KEY, JSON.stringify(updatedMedicines));
    return updatedMedicines.find(med => med.id === id);
  } catch (error) {
    console.error('Error updating patient medicine:', error);
    throw error;
  }
};

export const deletePatientMedicine = async (id) => {
  try {
    const medicines = await getPatientMedicines();
    const updatedMedicines = medicines.filter(med => med.id !== id);
    await AsyncStorage.setItem(PATIENT_MEDICINES_KEY, JSON.stringify(updatedMedicines));
  } catch (error) {
    console.error('Error deleting patient medicine:', error);
    throw error;
  }
};

// Clinic Medicine Functions
export const saveClinicMedicine = async (medicine) => {
  try {
    const existingMedicines = await getClinicMedicines();
    const newMedicine = {
      id: Date.now().toString(),
      ...medicine,
      createdAt: new Date().toISOString(),
    };
    const updatedMedicines = [...existingMedicines, newMedicine];
    await AsyncStorage.setItem(CLINIC_MEDICINES_KEY, JSON.stringify(updatedMedicines));
    return newMedicine;
  } catch (error) {
    console.error('Error saving clinic medicine:', error);
    throw error;
  }
};

export const getClinicMedicines = async () => {
  try {
    const medicines = await AsyncStorage.getItem(CLINIC_MEDICINES_KEY);
    return medicines ? JSON.parse(medicines) : [];
  } catch (error) {
    console.error('Error getting clinic medicines:', error);
    return [];
  }
};

export const updateClinicMedicine = async (id, updatedData) => {
  try {
    const medicines = await getClinicMedicines();
    const updatedMedicines = medicines.map(med => 
      med.id === id ? { ...med, ...updatedData } : med
    );
    await AsyncStorage.setItem(CLINIC_MEDICINES_KEY, JSON.stringify(updatedMedicines));
    return updatedMedicines.find(med => med.id === id);
  } catch (error) {
    console.error('Error updating clinic medicine:', error);
    throw error;
  }
};

export const deleteClinicMedicine = async (id) => {
  try {
    const medicines = await getClinicMedicines();
    const updatedMedicines = medicines.filter(med => med.id !== id);
    await AsyncStorage.setItem(CLINIC_MEDICINES_KEY, JSON.stringify(updatedMedicines));
  } catch (error) {
    console.error('Error deleting clinic medicine:', error);
    throw error;
  }
};

// Clinic Info Functions
export const saveClinicInfo = async (clinicInfo) => {
  try {
    await AsyncStorage.setItem(CLINIC_INFO_KEY, JSON.stringify(clinicInfo));
  } catch (error) {
    console.error('Error saving clinic info:', error);
    throw error;
  }
};

export const getClinicInfo = async () => {
  try {
    const info = await AsyncStorage.getItem(CLINIC_INFO_KEY);
    return info ? JSON.parse(info) : null;
  } catch (error) {
    console.error('Error getting clinic info:', error);
    return null;
  }
};

// Helper function to find nearby clinics with specific medicine
export const findNearbyClinicsWithMedicine = async (medicineName, patientLocation) => {
  try {
    const clinicMedicines = await getClinicMedicines();
    const clinicInfo = await getClinicInfo();
    
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
