import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  Platform,
  useColorScheme,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "../../constants/Haptics";
import { Ionicons } from "@expo/vector-icons";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    Haptics.hapticSuccess();

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
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-lg">Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-lg text-red-400">No access to camera</Text>
      </View>
    );
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      try {
        const scannedResults = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );

        const data = scannedResults[0].data;
        const codeType = scannedResults[0].type;
        handleBarCodeScanned({ type: codeType, data: data });
      } catch (error) {
        Haptics.hapticError();
        alert("No QR Code Found");
      }
    }
  };

  return (
    // <SafeAreaView>
    <View className="flex items-center justify-end flex-1">
      {!scanned && (
        <BarCodeScanner
          className=""
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <View className="absolute w-full gap-3 px-4 bottom-32">
        <Pressable
          onPress={() => {
            Haptics.hapticFeedbackLight();
            setScanned((prev) => !prev);
          }}
          className="flex-row items-center justify-center p-4 bg-red-400 shadow-lg rounded-xl"
        >
          <Ionicons
            name={scanned ? "camera" : "camera-outline"}
            size={24}
            color="white"
          />
          <Text className="ml-2 text-xl font-semibold text-white">
            {scanned ? "Start Scanning" : "Stop Scanning"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Haptics.hapticFeedbackLight();
            pickImage();
          }}
          className="flex-row items-center justify-center p-4 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
        >
          <Ionicons
            name="images"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
          <Text className="ml-2 text-xl font-semibold text-black dark:text-white">
            Scan from Photos
          </Text>
        </Pressable>
      </View>
      {/* stop scanning */}
    </View>
    // </SafeAreaView>
  );
};

export default ScanScreen;
