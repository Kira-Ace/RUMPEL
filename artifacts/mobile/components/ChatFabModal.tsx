import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
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

const RESPONSES = [
  "Got it! I'll add that to your schedule.",
  "Great idea! Want me to set a reminder too?",
  "Done! Anything else you'd like to plan?",
  "Added to your study list. You've got this!",
  "Noted! Your schedule is looking productive.",
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ChatFabModal({ visible, onClose }: Props) {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const c = colors.light;

  const send = () => {
    if (!msg.trim()) return;
    const r = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    setReply(r);
    setMsg("");
    setTimeout(() => setReply(""), 4000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
        <View style={styles.container}>
          <View style={[styles.panel, { backgroundColor: "#fff" }]}>
            <View style={styles.headerRow}>
              <Text style={[styles.panelTitle, { color: c.brown }]}>
                Ask Rumpel
              </Text>
              <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Feather name="x" size={20} color={c.brownMid} />
              </TouchableOpacity>
            </View>

            {reply ? (
              <View
                style={[styles.replyBubble, { backgroundColor: c.creamDark }]}
              >
                <Text style={[styles.replyEmoji]}>🧙</Text>
                <Text style={[styles.replyText, { color: c.brown }]}>
                  {reply}
                </Text>
              </View>
            ) : null}

            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: c.cream,
                    borderColor: c.border,
                    color: c.brown,
                    flex: 1,
                  },
                ]}
                placeholder="Ask Rumpel anything…"
                placeholderTextColor={c.mutedForeground}
                value={msg}
                onChangeText={setMsg}
                onSubmitEditing={send}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.sendBtn, { backgroundColor: c.orange }]}
                onPress={send}
                activeOpacity={0.8}
              >
                <Feather name="zap" size={15} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "web" ? 120 : 100,
  },
  panel: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  replyBubble: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  replyEmoji: {
    fontSize: 16,
  },
  replyText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
});
