import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import BarcodeScanner from '../components/BarcodeScanner';
import { useAuth } from '../context/AuthContext';
import {
  getPatientMedicines,
  savePatientMedicine,
  updatePatientMedicine,
  deletePatientMedicine,
  findNearbyClinicsWithMedicine,
} from '../utils/storage';

export default function PatientScreen({ navigation }) {
  const { user, logout, accountType } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [nearbyClinics, setNearbyClinics] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: '',
    currentStock: '',
    minStock: '',
    barcode: '',
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    const loadedMedicines = await getPatientMedicines();
    setMedicines(loadedMedicines);
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.currentStock) {
      Alert.alert('Error', 'Please fill in at least medicine name and current stock');
      return;
    }

    try {
      await savePatientMedicine({
        ...newMedicine,
        currentStock: parseInt(newMedicine.currentStock) || 0,
        minStock: parseInt(newMedicine.minStock) || 5,
      });
      await loadMedicines();
      setModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Medicine added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine');
    }
  };

  const handleDeleteMedicine = async (id) => {
    Alert.alert(
      'Delete Medicine',
      'Are you sure you want to delete this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePatientMedicine(id);
            await loadMedicines();
          },
        },
      ]
    );
  };

  const handleUpdateStock = async (medicine, increment) => {
    const newStock = Math.max(0, medicine.currentStock + increment);
    await updatePatientMedicine(medicine.id, { currentStock: newStock });
    await loadMedicines();
  };

  const handleBarcodeScanned = (data) => {
    setNewMedicine({ ...newMedicine, barcode: data });
    setScannerVisible(false);
  };

  const findNearbyStores = async (medicine) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find nearby clinics');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const clinics = await findNearbyClinicsWithMedicine(
        medicine.name,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      );

      if (clinics.length === 0) {
        Alert.alert('No Results', 'No nearby clinics found with this medicine in stock');
      } else {
        setNearbyClinics(clinics);
        setSearchModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to find nearby clinics');
    }
  };

  const resetForm = () => {
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: '',
      currentStock: '',
      minStock: '',
      barcode: '',
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const isLowStock = (medicine) => {
    return medicine.currentStock <= medicine.minStock;
  };

  const renderMedicineItem = ({ item }) => (
    <View style={[styles.medicineCard, isLowStock(item) && styles.lowStockCard]}>
      <View style={styles.medicineHeader}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{item.name}</Text>
          {item.barcode && (
            <Text style={styles.barcodeText}>Barcode: {item.barcode}</Text>
          )}
          {item.dosage && <Text style={styles.detailText}>Dosage: {item.dosage}</Text>}
          {item.frequency && <Text style={styles.detailText}>Frequency: {item.frequency}</Text>}
        </View>
        <TouchableOpacity onPress={() => handleDeleteMedicine(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <View style={styles.stockSection}>
        <Text style={styles.stockText}>
          Stock: {item.currentStock} {isLowStock(item) && '⚠️ Low Stock'}
        </Text>
        <View style={styles.stockButtons}>
          <TouchableOpacity
            style={styles.stockButton}
            onPress={() => handleUpdateStock(item, -1)}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.stockButton, styles.addButton]}
            onPress={() => handleUpdateStock(item, 1)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {isLowStock(item) && (
        <TouchableOpacity
          style={styles.findStoreButton}
          onPress={() => findNearbyStores(item)}
        >
          <Ionicons name="location" size={16} color="white" />
          <Text style={styles.findStoreText}>Find Nearby Clinics</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* User Info Header */}
      <View style={styles.userInfoHeader}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={32} color="#4A90E2" />
          <View style={styles.userDetails}>
            <Text style={styles.userEmail}>
              {user?.email || user?.phoneNumber || user?.displayName || 'User'}
            </Text>
            <Text style={styles.userLabel}>
              {accountType === 'clinic' ? 'Clinic Account' : 'Patient Account'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical" size={64} color="#BDC3C7" />
            <Text style={styles.emptyText}>No medicines added yet</Text>
            <Text style={styles.emptySubText}>Tap the + button to add your first medicine</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Add Medicine Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medicine</Text>
            <ScrollView style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Medicine Name *"
                value={newMedicine.name}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Dosage (e.g., 500mg)"
                value={newMedicine.dosage}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, dosage: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Frequency (e.g., 2x daily)"
                value={newMedicine.frequency}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, frequency: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Current Stock *"
                value={newMedicine.currentStock}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, currentStock: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Minimum Stock (default: 5)"
                value={newMedicine.minStock}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, minStock: text })}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setScannerVisible(true)}
              >
                <Ionicons name="barcode-outline" size={24} color="white" />
                <Text style={styles.scanButtonText}>
                  {newMedicine.barcode ? `Barcode: ${newMedicine.barcode}` : 'Scan Barcode'}
                </Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleAddMedicine}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Barcode Scanner */}
      <BarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Nearby Clinics Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nearby Clinics</Text>
            <ScrollView style={styles.clinicsContainer}>
              {nearbyClinics.map((clinicData, index) => (
                <View key={index} style={styles.clinicCard}>
                  <Text style={styles.clinicName}>{clinicData.clinic.name}</Text>
                  <Text style={styles.clinicAddress}>{clinicData.clinic.address}</Text>
                  <Text style={styles.clinicDistance}>Distance: {clinicData.distance} km</Text>
                  <Text style={styles.clinicPhone}>Phone: {clinicData.clinic.phone}</Text>
                  <Text style={styles.availableMedicines}>Available Medicines:</Text>
                  {clinicData.medicines.map((med, idx) => (
                    <Text key={idx} style={styles.medicineItem}>
                      • {med.name} - Stock: {med.stock}
                    </Text>
                  ))}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setSearchModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    marginLeft: 12,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  userLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  logoutButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  medicineCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  barcodeText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  stockSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stockText: {
    fontSize: 16,
    color: '#34495E',
    fontWeight: '600',
  },
  stockButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  stockButton: {
    backgroundColor: '#E74C3C',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#27AE60',
  },
  findStoreButton: {
    flexDirection: 'row',
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findStoreText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#7F8C8D',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: '#9B59B6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#95A5A6',
  },
  saveButton: {
    backgroundColor: '#27AE60',
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  clinicsContainer: {
    maxHeight: 400,
  },
  clinicCard: {
    backgroundColor: '#ECF0F1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  clinicDistance: {
    fontSize: 14,
    color: '#3498DB',
    fontWeight: '600',
    marginBottom: 4,
  },
  clinicPhone: {
    fontSize: 14,
    color: '#27AE60',
    marginBottom: 8,
  },
  availableMedicines: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 8,
    marginBottom: 4,
  },
  medicineItem: {
    fontSize: 14,
    color: '#34495E',
    marginLeft: 8,
  },
});
