import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AddTaskModal from "@/components/AddTaskModal";
import TopBar from "@/components/TopBar";
import colors from "@/constants/colors";
import { useTasks } from "@/context/TasksContext";

// ─── Date helpers ────────────────────────────────────────────

const NOW = new Date();
const REAL_TODAY = {
  year: NOW.getFullYear(),
  month: NOW.getMonth(), // 0-indexed
  date: NOW.getDate(),
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalCell {
  date: number;
  month: number; // 0-indexed absolute month offset from epoch (year*12+month)
  year: number;
  type: "prev" | "current" | "next";
}

/** Build a 6×7 or 5×7 grid for a given year+month */
function buildGrid(year: number, month: number): CalCell[][] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Mon-first: getDay() 0=Sun→6, 1=Mon→0, ..., 6=Sat→5
  const firstDow = (firstDay.getDay() + 6) % 7;

  const cells: CalCell[] = [];

  // Previous month overflow
  for (let i = 0; i < firstDow; i++) {
    const d = prevMonthDays - (firstDow - 1 - i);
    const pm = month === 0 ? 11 : month - 1;
    const py = month === 0 ? year - 1 : year;
    cells.push({ date: d, month: pm, year: py, type: "prev" });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, month, year, type: "current" });
  }
  // Next month overflow
  let nd = 1;
  while (cells.length % 7 !== 0) {
    const nm = month === 11 ? 0 : month + 1;
    const ny = month === 11 ? year + 1 : year;
    cells.push({ date: nd++, month: nm, year: ny, type: "next" });
  }

  const rows: CalCell[][] = [];
  for (let r = 0; r < cells.length / 7; r++) {
    rows.push(cells.slice(r * 7, r * 7 + 7));
  }
  return rows;
}

function getWeekIdxForDate(rows: CalCell[][], date: number): number {
  for (let r = 0; r < rows.length; r++) {
    if (rows[r].some((c) => c.type === "current" && c.date === date)) return r;
  }
  return 0;
}

// ─── Task key: "YYYY-MM-DD" ──────────────────────────────────

function taskKey(year: number, month: number, date: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
}

// ─── Main screen ─────────────────────────────────────────────

export default function CalendarScreen() {
  const { tasks, addTask, removeTask } = useTasks();
  const insets = useSafeAreaInsets();
  const c = colors.light;

  const [viewYear, setViewYear] = useState(REAL_TODAY.year);
  const [viewMonth, setViewMonth] = useState(REAL_TODAY.month);
  const [selYear, setSelYear] = useState(REAL_TODAY.year);
  const [selMonth, setSelMonth] = useState(REAL_TODAY.month);
  const [selDate, setSelDate] = useState(REAL_TODAY.date);

  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const expandAnim = useSharedValue(0);

  // ── Stable refs so gesture callbacks always see latest state ──
  const nextWeekRef = useRef<() => void>(() => {});
  const prevWeekRef = useRef<() => void>(() => {});
  const expandedRef = useRef(false);

  const rows = buildGrid(viewYear, viewMonth);
  const weekIdx = getWeekIdxForDate(rows, selYear === viewYear && selMonth === viewMonth ? selDate : -1);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      expandAnim.value = withTiming(next ? 1 : 0, { duration: 350 });
      return next;
    });
  }, [expandAnim]);

  // Navigate month
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Navigate week (collapsed mode) — works across all month/year boundaries
  const selectWeekRow = (row: CalCell[]) => {
    // Pick the first "current"-month cell; fall back to first cell in row
    const target = row.find((c) => c.type === "current") ?? row[0];
    setSelDate(target.date);
    setSelMonth(target.month);
    setSelYear(target.year);
    // Keep the full-grid view month in sync
    setViewMonth(target.month);
    setViewYear(target.year);
  };

  const prevWeek = () => {
    const newIdx = weekIdx - 1;
    if (newIdx < 0) {
      const pm = viewMonth === 0 ? 11 : viewMonth - 1;
      const py = viewMonth === 0 ? viewYear - 1 : viewYear;
      const prevRows = buildGrid(py, pm);
      selectWeekRow(prevRows[prevRows.length - 1]);
    } else {
      selectWeekRow(rows[newIdx]);
    }
  };

  const nextWeek = () => {
    const newIdx = weekIdx + 1;
    if (newIdx >= rows.length) {
      const nm = viewMonth === 11 ? 0 : viewMonth + 1;
      const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
      const nextRows = buildGrid(ny, nm);
      selectWeekRow(nextRows[0]);
    } else {
      selectWeekRow(rows[newIdx]);
    }
  };

  // Sync refs every render so gesture/wheel callbacks always call the latest version
  nextWeekRef.current = nextWeek;
  prevWeekRef.current = prevWeek;
  expandedRef.current = expanded;

  // Web: trackpad two-finger horizontal swipe (generates wheel events)
  useEffect(() => {
    if (Platform.OS !== "web") return;
    let acc = 0;
    let cooldown = false;
    const fire = (dir: "next" | "prev") => {
      if (cooldown) return;
      cooldown = true;
      acc = 0;
      if (dir === "next") nextWeekRef.current();
      else prevWeekRef.current();
      setTimeout(() => { cooldown = false; }, 550);
    };
    const onWheel = (e: Event) => {
      const we = e as WheelEvent;
      if (expandedRef.current) return;         // full grid visible — don't intercept
      if (Math.abs(we.deltaX) < Math.abs(we.deltaY)) return; // ignore vertical scroll
      acc += we.deltaX;
      if (acc > 70) fire("next");
      else if (acc < -70) fire("prev");
    };
    document.addEventListener("wheel", onWheel, { passive: true });
    return () => document.removeEventListener("wheel", onWheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once — stable via refs

  // Pan gesture for touch swipe (mobile) and pointer drag (web mouse/trackpad)
  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .failOffsetY([-25, 25])
    .onEnd((e) => {
      if (e.translationX < -50) nextWeekRef.current();
      else if (e.translationX > 50) prevWeekRef.current();
    });

  const selectCell = useCallback((cell: CalCell, fromFullGrid = false) => {
    setSelDate(cell.date);
    setSelMonth(cell.month);
    setSelYear(cell.year);
    // If clicking a prev/next month overflow cell, jump to that month
    if (cell.type !== "current") {
      setViewMonth(cell.month);
      setViewYear(cell.year);
    }
    if (fromFullGrid && expanded) toggleExpand();
  }, [expanded, toggleExpand]);

  const isToday = (cell: CalCell) =>
    cell.date === REAL_TODAY.date &&
    cell.month === REAL_TODAY.month &&
    cell.year === REAL_TODAY.year;
  const isSelected = (cell: CalCell) =>
    cell.date === selDate && cell.month === selMonth && cell.year === selYear;

  const currentKey = taskKey(selYear, selMonth, selDate);
  const currentTasks = (tasks as any)[currentKey] || (tasks as any)[selDate] || [];
  const bottomPad = Platform.OS === "web" ? 120 : insets.bottom + 90;

  const CELL_H = 38;
  const HEADER_H = 24;
  const ROW_GAP = 6;
  // collapsed: header + week row + dots + padding
  const collapsedH = HEADER_H + ROW_GAP + CELL_H + 20;
  const expandedH =
    HEADER_H + ROW_GAP + rows.length * CELL_H + (rows.length - 1) * ROW_GAP + 8;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: collapsedH + (expandedH - collapsedH) * expandAnim.value,
    overflow: "hidden",
  }));
  const weekViewOpacity = useAnimatedStyle(() => ({
    opacity: 1 - expandAnim.value,
    position: "absolute",
    left: 0,
    right: 0,
    top: HEADER_H + ROW_GAP,
  }));
  const fullGridOpacity = useAnimatedStyle(() => ({
    opacity: expandAnim.value,
  }));

  const DayCell = ({ cell, inFullGrid = false }: { cell: CalCell; inFullGrid?: boolean }) => {
    const sel = isSelected(cell);
    const today = isToday(cell);
    const isCurrent = cell.type === "current";
    const isPast =
      cell.year < REAL_TODAY.year ||
      (cell.year === REAL_TODAY.year && cell.month < REAL_TODAY.month) ||
      (cell.year === REAL_TODAY.year && cell.month === REAL_TODAY.month && cell.date < REAL_TODAY.date);
    const key = taskKey(cell.year, cell.month, cell.date);
    const hasTasks = ((tasks as any)[key] || []).length > 0;
    const taskCount = ((tasks as any)[key] || []).length;

    const textColor = sel
      ? "#fff"
      : !isCurrent
      ? "rgba(74,48,32,0.35)"
      : today
      ? c.orange
      : isPast
      ? c.brownMid
      : c.brown;

    return (
      <TouchableOpacity
        style={styles.dayCell}
        onPress={() => selectCell(cell, inFullGrid)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.dayCircle,
            { width: CELL_H, height: CELL_H, borderRadius: CELL_H / 2 },
            sel && { backgroundColor: c.orange },
            today && !sel && { borderWidth: 1.5, borderColor: c.orange },
          ]}
        >
          <Text style={[styles.dayNum, { color: textColor, fontWeight: today && !sel ? "700" : "400" }]}>
            {cell.date}
          </Text>
        </View>
        <View style={styles.dotRow}>
          {hasTasks &&
            Array.from({ length: Math.min(taskCount, 3) }).map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: sel ? "rgba(255,255,255,0.75)" : c.orange }]}
              />
            ))}
        </View>
      </TouchableOpacity>
    );
  };

  const currentWeekRow = rows[weekIdx] || rows[0];

  return (
    <View style={[styles.root, { backgroundColor: c.cream }]}>
      <TopBar />

      <View style={styles.calContainer}>
        {/* Month / Year navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navArrow} activeOpacity={0.7}>
            <Feather name="chevron-left" size={20} color={c.orange} />
          </TouchableOpacity>
          <View style={styles.monthTitleWrap}>
            <Text style={[styles.monthTitle, { color: c.brown }]}>
              {MONTH_NAMES[viewMonth]}
            </Text>
            <Text style={[styles.yearSub, { color: c.brownMid }]}>{viewYear}</Text>
          </View>
          <TouchableOpacity onPress={nextMonth} style={styles.navArrow} activeOpacity={0.7}>
            <Feather name="chevron-right" size={20} color={c.orange} />
          </TouchableOpacity>
        </View>

        <Animated.View style={animatedContainerStyle}>
          {/* Day-name row: arrows live here so they're always in-bounds */}
          <View style={[styles.dayNamesRow, { height: HEADER_H, marginBottom: ROW_GAP }]}>
            {/* Prev-week arrow — shown when collapsed, invisible spacer when expanded */}
            <TouchableOpacity
              onPress={prevWeek}
              style={styles.weekArrowInRow}
              activeOpacity={0.7}
              disabled={expanded}
            >
              <Feather
                name="chevron-left"
                size={15}
                color={expanded ? "transparent" : c.orange}
              />
            </TouchableOpacity>

            {DAYS.map((d) => (
              <Text key={d} style={[styles.dayName, { color: c.brownMid }]}>{d}</Text>
            ))}

            {/* Next-week arrow */}
            <TouchableOpacity
              onPress={nextWeek}
              style={styles.weekArrowInRow}
              activeOpacity={0.7}
              disabled={expanded}
            >
              <Feather
                name="chevron-right"
                size={15}
                color={expanded ? "transparent" : c.orange}
              />
            </TouchableOpacity>
          </View>

          {/* Collapsed: week cells — spacers match arrow button width so cells align with labels */}
          <Animated.View style={weekViewOpacity}>
            <GestureDetector gesture={swipeGesture}>
              <View style={styles.weekCells}>
                <View style={styles.weekArrowInRow} />
                {currentWeekRow.map((cell, ci) => (
                  <DayCell key={ci} cell={cell} inFullGrid={false} />
                ))}
                <View style={styles.weekArrowInRow} />
              </View>
            </GestureDetector>

            {/* Week position dots */}
            <View style={styles.weekDots}>
              {rows.map((_, ri) => (
                <View
                  key={ri}
                  style={[
                    styles.weekDot,
                    {
                      backgroundColor: ri === weekIdx ? c.orange : "rgba(244,123,32,0.25)",
                      width: ri === weekIdx ? 14 : 5,
                    },
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Expanded: full month grid — same arrow-width spacers so columns align */}
          <Animated.View style={[fullGridOpacity, { gap: ROW_GAP }]}>
            {rows.map((row, ri) => (
              <View key={ri} style={styles.weekRow}>
                <View style={styles.weekArrowInRow} />
                {row.map((cell, ci) => (
                  <DayCell key={ci} cell={cell} inFullGrid={true} />
                ))}
                <View style={styles.weekArrowInRow} />
              </View>
            ))}
          </Animated.View>
        </Animated.View>

        {/* Expand / collapse handle */}
        <TouchableOpacity style={styles.expandHandle} onPress={toggleExpand} activeOpacity={0.8}>
          <View style={[styles.expandLine, { backgroundColor: c.orange }]} />
          <View style={[styles.expandBtn, { borderColor: c.orange, backgroundColor: c.cream }]}>
            <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={c.orange} />
          </View>
        </TouchableOpacity>

        {/* Selected date info */}
        <View style={styles.dateHeader}>
          <View>
            <Text style={[styles.dateBig, { color: c.orange }]}>{selDate}</Text>
            <Text style={[styles.dateDay, { color: c.brown }]}>
              {DAYS[(new Date(selYear, selMonth, selDate).getDay() + 6) % 7]}
            </Text>
            <Text style={[styles.dateTime, { color: c.orange }]}>
              {currentTasks[0]?.time ?? "—"}
            </Text>
          </View>
          <View style={styles.dateRight}>
            <Text style={[styles.dateToday, { color: c.brown }]}>
              {isToday({ date: selDate, month: selMonth, year: selYear, type: "current" })
                ? "Today"
                : `${MONTH_NAMES[selMonth].slice(0, 3)} ${selDate}`}
            </Text>
            <Text style={[styles.dateTasks, { color: c.brownMid }]}>
              {currentTasks.length} task{currentTasks.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.taskScroll}
        contentContainerStyle={[styles.taskScrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {currentTasks.map((t: any) => (
          <View key={t.id} style={[styles.taskCard, { borderColor: c.orange }]}>
            <View style={styles.taskCardTop}>
              <Text style={[styles.taskCardTitle, { color: c.brown }]}>{t.title}</Text>
              <View style={styles.taskTimeRow}>
                <Feather name="clock" size={10} color={c.orange} />
                <Text style={[styles.taskTimeBadge, { color: c.orange }]}> {t.time}</Text>
              </View>
            </View>
            {t.desc ? <Text style={[styles.taskDesc, { color: c.brownMid }]}>{t.desc}</Text> : null}
            <View style={styles.taskFooter}>
              <View style={[styles.tagChip, { backgroundColor: c.orange }]}>
                <Text style={styles.tagText}>{t.tag}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeTask(currentKey, t.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="trash-2" size={14} color="rgba(74,48,32,0.4)" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addTaskBtn, { borderColor: c.orange }]}
          onPress={() => setShowModal(true)}
          activeOpacity={0.75}
        >
          <Feather name="plus" size={16} color={c.orange} />
          <Text style={[styles.addTaskText, { color: c.orange }]}>Add task</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddTaskModal
        visible={showModal}
        selectedDay={selDate}
        onClose={() => setShowModal(false)}
        onAdd={(task) => {
          addTask(currentKey, task);
          setShowModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  calContainer: { paddingHorizontal: 18 },

  // Month nav row
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  navArrow: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitleWrap: { alignItems: "center" },
  monthTitle: { fontSize: 36, fontWeight: "700", lineHeight: 40 },
  yearSub: { fontSize: 12, fontWeight: "500", letterSpacing: 0.5 },

  // Day names row + week cells — arrows live in the same row as labels
  dayNamesRow: { flexDirection: "row", alignItems: "center" },
  dayName: { flex: 1, textAlign: "center", fontSize: 10, fontWeight: "600", letterSpacing: 0.3 },
  weekArrowInRow: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  // Collapsed week cells
  weekCells: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Week dots
  weekDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    height: 8,
  },
  weekDot: { height: 5, borderRadius: 3 },

  // Full grid
  weekRow: { flexDirection: "row" },

  // Day cell
  dayCell: { flex: 1, alignItems: "center", gap: 2 },
  dayCircle: { justifyContent: "center", alignItems: "center" },
  dayNum: { fontSize: 14 },
  dotRow: { flexDirection: "row", gap: 2, height: 6, alignItems: "center" },
  dot: { width: 3.5, height: 3.5, borderRadius: 2 },

  // Expand handle
  expandHandle: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    position: "relative",
  },
  expandLine: { position: "absolute", left: 0, right: 0, height: 2, borderRadius: 2 },
  expandBtn: { borderWidth: 2, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 3, zIndex: 2 },

  // Date header
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 6,
  },
  dateBig: { fontSize: 42, fontWeight: "700", lineHeight: 46 },
  dateDay: { fontSize: 16, fontWeight: "600" },
  dateTime: { fontSize: 13 },
  dateRight: { alignItems: "flex-end" },
  dateToday: { fontSize: 18, fontWeight: "700" },
  dateTasks: { fontSize: 13 },

  // Tasks
  taskScroll: { flex: 1 },
  taskScrollContent: { padding: 18, gap: 10 },
  taskCard: { borderWidth: 2, borderRadius: 16, padding: 16, gap: 6 },
  taskCardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  taskCardTitle: { fontSize: 16, fontWeight: "600", flex: 1 },
  taskTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,123,32,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  taskTimeBadge: { fontSize: 11 },
  taskDesc: { fontSize: 13, lineHeight: 20 },
  taskFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  tagChip: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20 },
  tagText: { fontSize: 10, color: "#fff", fontWeight: "500" },
  addTaskBtn: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    opacity: 0.7,
  },
  addTaskText: { fontSize: 14, fontWeight: "500" },
});
