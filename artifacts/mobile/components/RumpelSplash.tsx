import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";

import colors from "@/constants/colors";

interface Props {
  onDone: () => void;
}

export default function RumpelSplash({ onDone }: Props) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const useNative = Platform.OS !== "web";
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: useNative,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: useNative,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: useNative,
      }),
    ]).start();

    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone, opacity, scale, translateY]);

  const c = colors.light;

  return (
    <View style={[styles.container, { backgroundColor: c.orange }]}>
      <Animated.View
        style={[
          styles.content,
          { opacity, transform: [{ scale }, { translateY }] },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: c.yellow }]}>
          <Text style={[styles.iconLetter, { color: c.orangeDeep }]}>R</Text>
        </View>
        <Text style={[styles.wordmark, { color: c.yellow }]}>Rumpel</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  iconLetter: {
    fontSize: 52,
    fontWeight: "900",
  },
  wordmark: {
    fontSize: 52,
    fontWeight: "700",
    letterSpacing: 2,
  },
});
