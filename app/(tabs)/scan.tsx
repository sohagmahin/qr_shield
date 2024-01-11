import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  Platform,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(true);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(data);
    console.log(type);

    // In android qr code is 256
    // In ios qr code is org.iso.QRCode
    const barCodeType =
      Platform.OS === "ios"
        ? type?.split(".")[2]
        : type === 256
        ? "QRCode"
        : "barcode";
    router.push({
      pathname: "/modal",
      params: { data: data, type: barCodeType },
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View className="flex items-center justify-center flex-1">
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && (
        <Pressable
          className="p-3 bg-blue-400 rounded-md"
          onPress={() => setScanned(false)}
        >
          <Text className="text-white">Tap to Scan Again</Text>
        </Pressable>
      )}
      {/* stop scanning */}
    </View>
  );
};

export default ScanScreen;
