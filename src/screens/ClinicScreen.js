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
import {
  getClinicMedicines,
  saveClinicMedicine,
  updateClinicMedicine,
  deleteClinicMedicine,
  getClinicInfo,
  saveClinicInfo,
} from '../utils/storage';

export default function ClinicScreen() {
  const [medicines, setMedicines] = useState([]);
  const [clinicInfo, setClinicInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [clinicModalVisible, setClinicModalVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: '',
    stock: '',
    price: '',
    barcode: '',
  });
  const [clinicForm, setClinicForm] = useState({
    name: '',
    address: '',
    phone: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedMedicines = await getClinicMedicines();
    const loadedClinicInfo = await getClinicInfo();
    setMedicines(loadedMedicines);
    setClinicInfo(loadedClinicInfo);
    if (loadedClinicInfo) {
      setClinicForm(loadedClinicInfo);
    }
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.stock) {
      Alert.alert('Error', 'Please fill in at least medicine name and stock');
      return;
    }

    try {
      await saveClinicMedicine({
        ...newMedicine,
        stock: parseInt(newMedicine.stock) || 0,
        price: parseFloat(newMedicine.price) || 0,
      });
      await loadData();
      setModalVisible(false);
      resetMedicineForm();
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
            await deleteClinicMedicine(id);
            await loadData();
          },
        },
      ]
    );
  };

  const handleUpdateStock = async (medicine, increment) => {
    const newStock = Math.max(0, medicine.stock + increment);
    await updateClinicMedicine(medicine.id, { stock: newStock });
    await loadData();
  };

  const handleBarcodeScanned = (data) => {
    setNewMedicine({ ...newMedicine, barcode: data });
    setScannerVisible(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setClinicForm({
        ...clinicForm,
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      });
      Alert.alert('Success', 'Location captured successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleSaveClinicInfo = async () => {
    if (!clinicForm.name || !clinicForm.address || !clinicForm.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await saveClinicInfo({
        ...clinicForm,
        latitude: parseFloat(clinicForm.latitude) || 0,
        longitude: parseFloat(clinicForm.longitude) || 0,
      });
      await loadData();
      setClinicModalVisible(false);
      Alert.alert('Success', 'Clinic information saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save clinic information');
    }
  };

  const resetMedicineForm = () => {
    setNewMedicine({
      name: '',
      description: '',
      stock: '',
      price: '',
      barcode: '',
    });
  };

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineHeader}>
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{item.name}</Text>
          {item.barcode && (
            <Text style={styles.barcodeText}>Barcode: {item.barcode}</Text>
          )}
          {item.description && (
            <Text style={styles.detailText}>{item.description}</Text>
          )}
          {item.price > 0 && (
            <Text style={styles.priceText}>Price: ${item.price.toFixed(2)}</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => handleDeleteMedicine(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <View style={styles.stockSection}>
        <Text style={styles.stockText}>
          Stock: {item.stock} {item.stock === 0 && '❌ Out of Stock'}
          {item.stock > 0 && item.stock <= 10 && '⚠️ Low Stock'}
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
          <TouchableOpacity
            style={[styles.stockButton, styles.addBulkButton]}
            onPress={() => handleUpdateStock(item, 10)}
          >
            <Text style={styles.bulkText}>+10</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Clinic Info Header */}
      <View style={styles.clinicInfoCard}>
        {clinicInfo ? (
          <>
            <Text style={styles.clinicName}>{clinicInfo.name}</Text>
            <Text style={styles.clinicAddress}>{clinicInfo.address}</Text>
            <Text style={styles.clinicPhone}>📞 {clinicInfo.phone}</Text>
            {clinicInfo.latitude && clinicInfo.longitude && (
              <Text style={styles.clinicLocation}>
                📍 {clinicInfo.latitude.toFixed(6)}, {clinicInfo.longitude.toFixed(6)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setClinicModalVisible(true)}
            >
              <Ionicons name="create-outline" size={16} color="white" />
              <Text style={styles.editButtonText}>Edit Info</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => setClinicModalVisible(true)}
          >
            <Ionicons name="business-outline" size={24} color="white" />
            <Text style={styles.setupButtonText}>Setup Clinic Information</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Medicines List */}
      <FlatList
        data={medicines}
        renderItem={renderMedicineItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical" size={64} color="#BDC3C7" />
            <Text style={styles.emptyText}>No medicines in stock</Text>
            <Text style={styles.emptySubText}>Tap the + button to add medicines</Text>
          </View>
        }
      />

      {/* Add Medicine FAB */}
      <TouchableOpacity
        style={styles.fab}
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
                placeholder="Description"
                value={newMedicine.description}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, description: text })}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Stock Quantity *"
                value={newMedicine.stock}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, stock: text })}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Price (USD)"
                value={newMedicine.price}
                onChangeText={(text) => setNewMedicine({ ...newMedicine, price: text })}
                keyboardType="decimal-pad"
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
                    resetMedicineForm();
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

      {/* Clinic Info Modal */}
      <Modal
        visible={clinicModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clinic Information</Text>
            <ScrollView style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Clinic Name *"
                value={clinicForm.name}
                onChangeText={(text) => setClinicForm({ ...clinicForm, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address *"
                value={clinicForm.address}
                onChangeText={(text) => setClinicForm({ ...clinicForm, address: text })}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                value={clinicForm.phone}
                onChangeText={(text) => setClinicForm({ ...clinicForm, phone: text })}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={clinicForm.latitude}
                onChangeText={(text) => setClinicForm({ ...clinicForm, latitude: text })}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={clinicForm.longitude}
                onChangeText={(text) => setClinicForm({ ...clinicForm, longitude: text })}
                keyboardType="decimal-pad"
              />

              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleGetCurrentLocation}
              >
                <Ionicons name="location" size={24} color="white" />
                <Text style={styles.scanButtonText}>Get Current Location</Text>
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setClinicModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveClinicInfo}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  clinicInfoCard: {
    backgroundColor: '#4A90E2',
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clinicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  clinicPhone: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  clinicLocation: {
    fontSize: 12,
    color: 'white',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  setupButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setupButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
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
  priceText: {
    fontSize: 16,
    color: '#27AE60',
    fontWeight: '600',
    marginTop: 4,
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
    flex: 1,
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
  addBulkButton: {
    backgroundColor: '#3498DB',
    width: 44,
  },
  bulkText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  fab: {
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
    paddingTop: 60,
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
  locationButton: {
    flexDirection: 'row',
    backgroundColor: '#3498DB',
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
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
