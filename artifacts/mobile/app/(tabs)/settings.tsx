import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TopBar from "@/components/TopBar";
import colors from "@/constants/colors";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const [notifs, setNotifs] = useState(true);
  const [dark, setDark] = useState(false);
  const [sounds, setSounds] = useState(true);
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 90;

  const toggles = [
    {
      label: "Notifications",
      icon: "bell" as const,
      value: notifs,
      set: setNotifs,
    },
    {
      label: "Dark Mode",
      icon: "moon" as const,
      value: dark,
      set: setDark,
    },
    {
      label: "Sound Effects",
      icon: "volume-2" as const,
      value: sounds,
      set: setSounds,
    },
  ];

  const links = ["About Rumpel", "Privacy Policy", "Send Feedback", "Sign Out"];

  return (
    <View style={[styles.root, { backgroundColor: c.cream }]}>
      <TopBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileSection, { backgroundColor: c.orange }]}>
          <View
            style={[styles.profileAvatar, { backgroundColor: c.yellow }]}
          >
            <Text style={[styles.profileAvatarText, { color: c.orangeDeep }]}>
              R
            </Text>
          </View>
          <View>
            <Text style={styles.profileName}>Student</Text>
            <Text style={styles.profileSub}>Study Planner · Free Plan</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: c.creamDark }]}>
          {toggles.map(({ label, icon, value, set }, i) => (
            <View
              key={label}
              style={[
                styles.row,
                i < toggles.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                },
              ]}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[styles.iconWrap, { backgroundColor: c.orange }]}
                >
                  <Feather name={icon} size={15} color="#fff" />
                </View>
                <Text style={[styles.rowLabel, { color: c.brown }]}>
                  {label}
                </Text>
              </View>
              <Switch
                value={value}
                onValueChange={set}
                trackColor={{ false: "#ccc", true: c.orange }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: c.creamDark }]}>
          {links.map((label, i) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.row,
                i < links.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.rowLabel, { color: c.brown }]}>{label}</Text>
              <Text style={[styles.rowChevron, { color: c.brownMid }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.footer, { color: c.brownMid }]}>
          Rumpel v1.0.0 · Made with love
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 18,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarText: {
    fontSize: 22,
    fontWeight: "900",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  profileSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
  },
  section: {
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 15,
  },
  rowChevron: {
    fontSize: 20,
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 8,
  },
});
