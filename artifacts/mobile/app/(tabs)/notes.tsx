import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
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

interface Note {
  id: string;
  title: string;
  preview: string;
  date: string;
  featured?: boolean;
}

const NOTES: Note[] = [
  {
    id: "1",
    title: "Physics Formulas",
    preview: "F = ma, v² = u² + 2as, s = ut + ½at²…",
    date: "Mar 2",
    featured: true,
  },
  {
    id: "2",
    title: "Essay Outline",
    preview: "Thesis: The industrial revolution fundamentally altered…",
    date: "Mar 1",
  },
  {
    id: "3",
    title: "Vocab List",
    preview: "Ephemeral, ubiquitous, pernicious…",
    date: "Feb 28",
  },
  {
    id: "4",
    title: "Study Schedule",
    preview: "Mon–Wed: Science. Thu–Fri: Humanities.",
    date: "Feb 27",
  },
  {
    id: "5",
    title: "Math Shortcuts",
    preview: "Integration tricks & common integrals",
    date: "Feb 26",
  },
];

export default function NotesScreen() {
  const insets = useSafeAreaInsets();
  const c = colors.light;
  const [notes, setNotes] = useState(NOTES);
  const featured = notes.find((n) => n.featured);
  const rest = notes.filter((n) => !n.featured);
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 90;

  return (
    <View style={[styles.root, { backgroundColor: c.cream }]}>
      <TopBar />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: c.brownMid }]}>Pinned</Text>

        {featured && (
          <TouchableOpacity
            style={[styles.featuredCard, { backgroundColor: c.orange }]}
            activeOpacity={0.85}
          >
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.featuredPreview}>{featured.preview}</Text>
            <Text style={styles.featuredDate}>{featured.date}</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.sectionTitle, { color: c.brownMid, marginTop: 6 }]}>
          Recent
        </Text>

        <View style={styles.grid}>
          {rest.map((note) => (
            <TouchableOpacity
              key={note.id}
              style={[
                styles.noteCard,
                { backgroundColor: c.creamDark, borderColor: c.border },
              ]}
              activeOpacity={0.8}
            >
              <Text style={[styles.noteTitle, { color: c.brown }]}>
                {note.title}
              </Text>
              <Text style={[styles.notePreview, { color: c.brownMid }]} numberOfLines={2}>
                {note.preview}
              </Text>
              <Text style={[styles.noteDate, { color: c.brownMid }]}>
                {note.date}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.addNoteBtn,
            { borderColor: c.orange, backgroundColor: c.creamDark },
          ]}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={16} color={c.orange} />
          <Text style={[styles.addNoteText, { color: c.orange }]}>New Note</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  featuredCard: {
    borderRadius: 18,
    padding: 18,
    gap: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  featuredPreview: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  featuredDate: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  noteCard: {
    width: "47.5%",
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1.5,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  notePreview: {
    fontSize: 11,
    lineHeight: 16,
  },
  noteDate: {
    fontSize: 10,
  },
  addNoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 14,
    opacity: 0.75,
    marginTop: 4,
  },
  addNoteText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
