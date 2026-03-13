import { Pressable, StyleSheet, View } from "react-native";

export function Toggle({
  on,
  onToggle,
  disabled,
  c,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
  c: { green: string; toggleOff: string };
}) {
  return (
    <Pressable
      style={[
        styles.toggle,
        { backgroundColor: on ? c.green : c.toggleOff },
        disabled && { opacity: 0.5 },
      ]}
      onPress={onToggle}
      disabled={disabled}
    >
      <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
  toggleThumbOn: { alignSelf: "flex-end" as const },
  disconnectBtn: {
    marginTop: 28,
    backgroundColor: "rgba(232,64,64,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,64,64,0.15)",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  disconnectText: { fontSize: 15, fontWeight: "600" },
});
