import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import colors from "@/constants/colors";

interface Props {
  title?: string;
}

export default function TopBar({ title = "Rumpel" }: Props) {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const topPad = Platform.OS === "web" ? 67 : insets.top + 8;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <Text style={[styles.wordmark, { color: c.orange }]}>{title}</Text>
      <TouchableOpacity
        style={[
          styles.logoBtn,
          { backgroundColor: c.yellow, shadowColor: c.orangeDeep },
        ]}
        activeOpacity={0.8}
      >
        <Text style={[styles.logoBtnText, { color: c.orangeDeep }]}>R</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  wordmark: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  logoBtnText: {
    fontSize: 18,
    fontWeight: "900",
  },
});
