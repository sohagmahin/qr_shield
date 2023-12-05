import { View, Text, Platform } from "react-native";
import React, { useEffect } from "react";

import RNDateTimePicker from "@react-native-community/datetimepicker";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import useDatePickerStore from "../stores/useDatePickerStore";

const BottomSheets = ({ date, setDate }: any) => {
  // const [date, setDate] = React.useState(new Date());
  // const [show, setShow] = React.useState(false);

  const show = useDatePickerStore((state) => state.show);
  const toggle = useDatePickerStore((state) => state.toggle);

  // variables
  const snapPoints = React.useMemo(() => ["40%", "50%", "90%"], []);
  const sheetRef = React.useRef<BottomSheet>(null);

  const handleSheetOpen = React.useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleClosePress = React.useCallback(() => {
    sheetRef.current?.close();
    toggle();
  }, []);

  // renders
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={2}
        pressBehavior="close"
        onPress={handleClosePress}
      />
    ),
    []
  );
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      detached={true}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <RNDateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            // setShow(Platform.OS === "ios");
            setDate(currentDate);
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheets;
