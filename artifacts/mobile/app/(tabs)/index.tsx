import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TopBar from "@/components/TopBar";
import colors from "@/constants/colors";
import { useTasks } from "@/context/TasksContext";

const NOW = new Date();
const TODAY_KEY = `${NOW.getFullYear()}-${String(NOW.getMonth() + 1).padStart(2, "0")}-${String(NOW.getDate()).padStart(2, "0")}`;

export default function HomeScreen() {
  const { tasks } = useTasks();
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const todayTasks = tasks[TODAY_KEY] || [];
  const totalToday = todayTasks.length;

  const allDays = Object.keys(tasks);
  const totalTasks = allDays.reduce(
    (acc, key) => acc + (tasks[key] || []).length,
    0
  );
  const doneMock = Math.floor(totalTasks * 0.68);
  const progressPct = totalTasks > 0 ? Math.round((doneMock / totalTasks) * 100) : 0;

  const bottomPad =
    Platform.OS === "web" ? 120 : insets.bottom + 90;

  return (
    <View style={[styles.root, { backgroundColor: c.cream }]}>
      <TopBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.greetingRow, { borderBottomColor: c.orange }]}>
          <Feather name="sun" size={24} color={c.orange} />
          <Text style={[styles.greetingText, { color: c.brown }]}>
            What&apos;s kirking,{" "}
            <Text style={{ textDecorationLine: "underline", color: c.orange }}>
              Student
            </Text>
            ?
          </Text>
        </View>

        <View style={[styles.focusCard, { backgroundColor: c.orange }]}>
          <Text style={styles.focusLabel}>Today&apos;s Focus</Text>
          {todayTasks.length === 0 ? (
            <View style={styles.emptyPill}>
              <Text style={styles.emptyPillText}>
                No tasks for today — enjoy your day!
              </Text>
            </View>
          ) : (
            todayTasks.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={styles.taskPill}
                activeOpacity={0.75}
              >
                <View style={styles.taskPillLeft}>
                  <View
                    style={[styles.pillDot, { backgroundColor: c.yellow }]}
                  />
                  <Text style={styles.pillTitle} numberOfLines={1}>
                    {t.title}
                  </Text>
                </View>
                <Text style={styles.pillTime}>{t.time}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.bottomRow}>
          <View style={[styles.progressCard, { backgroundColor: c.orange }]}>
            <Text style={styles.cardLabelSm}>Weekly Progress</Text>
            <Text style={styles.cardValueLg}>{progressPct}%</Text>
            <Text style={styles.cardSub}>
              {doneMock} of {totalTasks} tasks done
            </Text>
            <View
              style={[styles.progressBar, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPct}%` as any,
                    backgroundColor: c.yellow,
                  },
                ]}
              />
            </View>
            <Text style={styles.cardSub}>Keep it up!</Text>
          </View>

          <View style={styles.rightCol}>
            <View style={[styles.miniCard, { backgroundColor: c.orange }]}>
              <Text style={styles.cardLabelSm}>Today</Text>
              <Text style={styles.cardValueMd}>{totalToday}</Text>
              <Text style={styles.cardSub}>tasks ahead</Text>
            </View>
            <View style={[styles.miniCard, { backgroundColor: c.orange }]}>
              <Text style={styles.cardLabelSm}>Streak</Text>
              <Text style={styles.cardValueMd}>5</Text>
              <Text style={styles.cardSub}>days</Text>
            </View>
          </View>
        </View>
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
    gap: 12,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 2.5,
    marginBottom: 2,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "600",
  },
  focusCard: {
    borderRadius: 20,
    minHeight: 180,
    padding: 18,
    gap: 10,
  },
  focusLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.5,
    fontWeight: "500",
  },
  emptyPill: {
    padding: 14,
  },
  emptyPillText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  taskPill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskPillLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  pillTitle: {
    fontSize: 14,
    color: "#fff",
    flex: 1,
  },
  pillTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12,
    height: 220,
  },
  progressCard: {
    flex: 1.1,
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  rightCol: {
    flex: 1,
    gap: 12,
  },
  miniCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    gap: 4,
  },
  cardLabelSm: {
    fontSize: 10,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardValueLg: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    lineHeight: 32,
  },
  cardValueMd: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
    lineHeight: 30,
  },
  cardSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: "auto",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
