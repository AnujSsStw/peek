import * as SecureStore from "expo-secure-store";

const LAYOUT_KEY_PREFIX = "widget_layout_";
const LOCATION_KEY = "widget_user_location";

export async function getWidgetLayout(
  widgetId: number,
): Promise<string | null> {
  return SecureStore.getItemAsync(`${LAYOUT_KEY_PREFIX}${widgetId}`);
}

export async function setWidgetLayout(
  widgetId: number,
  layout: string,
): Promise<void> {
  await SecureStore.setItemAsync(`${LAYOUT_KEY_PREFIX}${widgetId}`, layout);
}

export async function removeWidgetLayout(widgetId: number): Promise<void> {
  await SecureStore.deleteItemAsync(`${LAYOUT_KEY_PREFIX}${widgetId}`);
}

export async function getStoredLocation(): Promise<string | null> {
  return SecureStore.getItemAsync(LOCATION_KEY);
}

export async function setStoredLocation(location: string): Promise<void> {
  await SecureStore.setItemAsync(LOCATION_KEY, location);
}
