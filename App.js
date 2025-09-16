import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const GRAPHQL_URL = "https://countries.trevorblades.com/";
const QUERY = `
  query {
    countries {
      code
      name
      emoji
    }
  }
`;

export default function App() {
  const [data, setData] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });

  const load = async () => {
    try {
      setState({ loading: true, error: null });
      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: QUERY }),
      });
      const json = await res.json();
      if (json.errors) throw new Error(json.errors[0]?.message || "GraphQL error");
      setData(json.data.countries);
      setState({ loading: false, error: null });
    } catch (e) {
      setState({ loading: false, error: e.message });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (state.loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading…</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {state.error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        refreshing={state.loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.name} {item.emoji}
            </Text>
            <Text style={styles.code}>Code: {item.code}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  muted: { color: "#666" },
  error: { color: "#c00" },
  list: { padding: 16, gap: 12 },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f7f7f8",
    borderWidth: 1,
    borderColor: "#ececec",
  },
  title: { fontSize: 18, fontWeight: "700" },
  code: { marginTop: 8, fontFamily: "Menlo", color: "#333" },
});