import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@/constants/colors";

const TAGS = ["Math", "Science", "English", "History", "Other"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CAL_OFFSET = 5;

interface Props {
  visible: boolean;
  selectedDay: number;
  onClose: () => void;
  onAdd: (task: { title: string; time: string; desc: string; tag: string }) => void;
}

export default function AddTaskModal({
  visible,
  selectedDay,
  onClose,
  onAdd,
}: Props) {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("Other");
  const c = colors.light;

  const dayName = DAYS[(CAL_OFFSET + selectedDay - 1) % 7];

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), time, desc, tag });
    setTitle("");
    setTime("");
    setDesc("");
    setTag("Other");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.sheet, { backgroundColor: c.cream }]}>
          <View style={[styles.handle, { backgroundColor: c.border }]} />
          <Text style={[styles.title, { color: c.brown }]}>
            New Task — {dayName} {selectedDay}
          </Text>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#fff", borderColor: c.border, color: c.brown },
            ]}
            placeholder="Task title…"
            placeholderTextColor={c.mutedForeground}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#fff", borderColor: c.border, color: c.brown },
            ]}
            placeholder="Time (e.g. 14:00)"
            placeholderTextColor={c.mutedForeground}
            value={time}
            onChangeText={setTime}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: "#fff", borderColor: c.border, color: c.brown },
            ]}
            placeholder="Description (optional)"
            placeholderTextColor={c.mutedForeground}
            value={desc}
            onChangeText={setDesc}
          />

          <Text style={[styles.label, { color: c.brownMid }]}>Tag</Text>
          <View style={styles.tagRow}>
            {TAGS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tagBtn,
                  {
                    backgroundColor: tag === t ? c.orange : c.creamDark,
                    borderColor: tag === t ? c.orange : c.border,
                  },
                ]}
                onPress={() => setTag(t)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.tagBtnText,
                    { color: tag === t ? "#fff" : c.brownMid },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.creamDark }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.btnText, { color: c.brown }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: c.orange }]}
              onPress={handleAdd}
              activeOpacity={0.8}
            >
              <Feather name="check" size={16} color="#fff" />
              <Text style={[styles.btnText, { color: "#fff", marginLeft: 6 }]}>
                Add Task
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(42,26,14,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  tagBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
