import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function BarcodeScanner({ visible, onClose, onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    if (visible) {
      getBarCodeScannerPermissions();
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    onScan(data);
    Alert.alert('Barcode Scanned', `Barcode data: ${data}`, [
      { text: 'OK', onPress: () => setScanned(false) }
    ]);
  };

  if (hasPermission === null) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text>Requesting camera permission...</Text>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.text}>No access to camera</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <Text style={styles.text}>Scan Medicine Barcode</Text>
          <Button 
            title={scanned ? "Tap to Scan Again" : "Cancel"} 
            onPress={() => {
              if (scanned) {
                setScanned(false);
              } else {
                onClose();
              }
            }} 
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
});
