import {
  Dimensions,
  Pressable,
  ScrollView,
  RefreshControl,
  useColorScheme,
  Modal,
  TextInput,
} from "react-native";
import { Text, View } from "../../components/Themed";
import QRCode from "react-native-qrcode-svg";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useState, useCallback, useMemo } from "react";
import { router } from "expo-router";
import { useBarCodeStore } from "../../stores/useBarCodeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { hapticFeedbackLight } from "../../constants/Haptics";
import React from "react";

type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
  date: string;
  data: string;
};

type SortType = "name" | "date";
type SortDirection = "asc" | "desc";

type SortOption = {
  label: string;
  type: SortType;
  direction: SortDirection;
  icon: keyof typeof Ionicons.glyphMap;
};

const sortOptions: SortOption[] = [
  { label: "Name (A-Z)", type: "name", direction: "asc", icon: "text" },
  { label: "Name (Z-A)", type: "name", direction: "desc", icon: "text" },
  { label: "Date (Old-New)", type: "date", direction: "asc", icon: "calendar" },
  {
    label: "Date (New-Old)",
    type: "date",
    direction: "desc",
    icon: "calendar",
  },
];

export default function CodesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [sortType, setSortType] = useState<SortType>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();

  const codes = useBarCodeStore((state) => state.barCode);

  const filteredAndSortedCodes = useMemo(() => {
    // First filter the codes based on search query
    const filtered = codes.filter((item: Item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    });

    // Then sort the filtered results
    return filtered.sort((a: Item, b: Item) => {
      if (sortType === "name") {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        // Sort by date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
  }, [codes, sortType, sortDirection, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleSort = (option: SortOption) => {
    hapticFeedbackLight();
    setSortType(option.type);
    setSortDirection(option.direction);
    setShowSortMenu(false);
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
  };

  // clearStorage();

  const qrCodes = (item: Item) => (
    <View
      key={item.id}
      className="flex flex-row justify-between items-center p-6 m-1 dark:bg-[#121212] rounded-xl"
    >
      <View className="flex-1 bg-transparent">
        <Text className="text-lg font-semibold text-red-400">{item.name}</Text>
        <Text>{item.description}</Text>
        <Text className="font-medium">Expires on {item.date}</Text>
      </View>
      <View className="bg-transparent">
        <QRCode value={item.data} size={50} />
      </View>
    </View>
  );

  const barCodes = (item: Item) => (
    <View
      key={item.id}
      className="flex flex-row justify-between items-center p-6 m-1 dark:bg-[#121212] rounded-xl"
    >
      <View className="flex-1 bg-transparent">
        <Text className="text-lg font-semibold text-red-400">{item.name}</Text>
        <Text>{item.description}</Text>
        <Text className="font-medium">Expires on {item.date}</Text>
      </View>
      <View className="bg-transparent">
        <Barcode
          format="CODE128"
          value={item.data}
          width={0.6}
          height={50}
          maxWidth={Dimensions.get("window").width / 2}
        />
      </View>
    </View>
  );

  const emptyPlaceholder = (
    <View className="flex items-center justify-center h-full bg-transparent opacity-25">
      <View>
        <Svg x="0px" y="0px" width="150px" height="150px" viewBox="0 0 50 50">
          <Path
            fill={useColorScheme() === "dark" ? "white" : "black"}
            d="M 4 4 L 4 5 L 4 18 L 18 18 L 18 4 L 4 4 z M 32 4 L 32 5 L 32 18 L 46 18 L 46 4 L 32 4 z M 6 6 L 16 6 L 16 16 L 6 16 L 6 6 z M 20 6 L 20 7 L 20 12 L 24 12 L 24 15 L 20 15 L 20 16 L 20 20 L 11 20 L 11 21 L 11 24 L 7 24 L 7 25 L 7 30 L 13 30 L 13 26 L 16 26 L 16 30 L 22 30 L 22 22 L 24 22 L 24 26 L 31 26 L 31 29 L 36 29 L 36 32 L 28 32 L 28 33 L 28 36 L 24 36 L 24 37 L 24 42 L 30 42 L 30 38 L 36 38 L 36 46 L 46 46 L 46 36 L 38 36 L 38 34 L 46 34 L 46 24 L 40 24 L 40 25 L 40 27 L 38 27 L 38 20 L 26 20 L 26 17 L 30 17 L 30 10 L 26 10 L 26 6 L 20 6 z M 34 6 L 44 6 L 44 16 L 34 16 L 34 6 z M 8 8 L 8 9 L 8 14 L 14 14 L 14 8 L 8 8 z M 22 8 L 24 8 L 24 10 L 22 10 L 22 8 z M 36 8 L 36 9 L 36 14 L 42 14 L 42 8 L 36 8 z M 10 10 L 12 10 L 12 12 L 10 12 L 10 10 z M 38 10 L 40 10 L 40 12 L 38 12 L 38 10 z M 26 12 L 28 12 L 28 15 L 26 15 L 26 12 z M 22 17 L 24 17 L 24 20 L 22 20 L 22 17 z M 13 22 L 20 22 L 20 28 L 18 28 L 18 24 L 13 24 L 13 22 z M 26 22 L 36 22 L 36 27 L 33 27 L 33 24 L 26 24 L 26 22 z M 9 26 L 11 26 L 11 28 L 9 28 L 9 26 z M 42 26 L 44 26 L 44 32 L 38 32 L 38 29 L 42 29 L 42 26 z M 4 32 L 4 33 L 4 46 L 18 46 L 18 32 L 4 32 z M 6 34 L 16 34 L 16 44 L 6 44 L 6 34 z M 30 34 L 36 34 L 36 36 L 30 36 L 30 34 z M 8 36 L 8 37 L 8 42 L 14 42 L 14 36 L 8 36 z M 10 38 L 12 38 L 12 40 L 10 40 L 10 38 z M 26 38 L 28 38 L 28 40 L 26 40 L 26 38 z M 38 38 L 44 38 L 44 44 L 38 44 L 38 38 z"
          ></Path>
        </Svg>
      </View>
      <Text className="text-xl font-medium">Scan a code to see it here.</Text>
    </View>
  );

  const currentSortOption = sortOptions.find(
    (option) => option.type === sortType && option.direction === sortDirection
  );

  return (
    <>
      {codes && codes.length === 0 && emptyPlaceholder}
      <View className="flex-row items-center gap-2 px-4 pt-2 bg-transparent">
        <View className="flex-row items-center flex-1 px-3 bg-gray-100 rounded-lg dark:bg-gray-800">
          <Ionicons
            name="search"
            size={20}
            color={colorScheme === "dark" ? "white" : "gray"}
          />
          <TextInput
            className="flex-1 px-2 py-2 text-black dark:text-white"
            placeholder="Search codes..."
            placeholderTextColor={colorScheme === "dark" ? "gray" : "gray"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => {
                hapticFeedbackLight();
                setSearchQuery("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colorScheme === "dark" ? "white" : "gray"}
              />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => {
            hapticFeedbackLight();
            setShowSortMenu(true);
          }}
          className="flex-row items-center px-3 py-2 bg-red-400 rounded-lg"
        >
          <Ionicons name="options" size={20} color="white" />
          <Text className="ml-2 font-medium text-white">
            {currentSortOption?.label || "Sort"}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setShowSortMenu(false)}
        >
          <View className="absolute right-4 top-16 w-48 bg-white dark:bg-[#121212] rounded-lg shadow-lg overflow-hidden">
            {sortOptions.map((option, index) => (
              <Pressable
                key={option.label}
                onPress={() => handleSort(option)}
                className={`flex-row items-center px-4 py-3 ${
                  index !== sortOptions.length - 1
                    ? "border-b border-gray-200 dark:border-gray-700"
                    : ""
                } ${
                  option.type === sortType && option.direction === sortDirection
                    ? "bg-red-50 dark:bg-red-900/20"
                    : ""
                }`}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
                <Text className="ml-3 text-black dark:text-white">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        className="px-4 py-2"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredAndSortedCodes.length === 0 ? (
          <View className="flex items-center justify-center py-8 opacity-50">
            <Ionicons
              name="search"
              size={48}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text className="mt-2 text-lg text-center">
              {searchQuery
                ? "No codes found matching your search"
                : "No codes available"}
            </Text>
          </View>
        ) : (
          filteredAndSortedCodes.map((item: any) => {
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  router.push({
                    pathname: "/qr_modal",
                    params: { id: item.id },
                  });
                }}
              >
                {item.type === "QRCode" ? qrCodes(item) : barCodes(item)}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </>
  );
}
