import type { ConfigContext, ExpoConfig } from "expo/config";
import type { WithAndroidWidgetsParams } from "react-native-android-widget";

const widgetConfig: WithAndroidWidgetsParams = {
  widgets: [
    {
      name: "peek_small",
      label: "Peek Small",
      description: "Small peek widget (2×2)",
      minWidth: "110dp",
      minHeight: "110dp",
      targetCellWidth: 2,
      targetCellHeight: 2,
      previewImage: "./assets/widget-preview/preview-small.png",
      updatePeriodMillis: 1800000,
      resizeMode: "none",
      widgetFeatures: "reconfigurable",
    },
    {
      name: "peek_medium",
      label: "Peek Medium",
      description: "Medium peek widget (4×2)",
      minWidth: "250dp",
      minHeight: "110dp",
      targetCellWidth: 4,
      targetCellHeight: 2,
      previewImage: "./assets/widget-preview/preview-medium.png",
      updatePeriodMillis: 1800000,
      resizeMode: "none",
      widgetFeatures: "reconfigurable",
    },
    {
      name: "peek_large",
      label: "Peek Large",
      description: "Large peek widget (4×4)",
      minWidth: "250dp",
      minHeight: "180dp",
      targetCellWidth: 4,
      targetCellHeight: 3,
      previewImage: "./assets/widget-preview/preview-large.png",
      updatePeriodMillis: 1800000,
      resizeMode: "none",
      widgetFeatures: "reconfigurable",
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "app",
  slug: "app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "app",
  userInterfaceStyle: "automatic",
  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: "com.yourcompany.app",
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    package: "com.yourcompany.app",
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    "expo-background-task",
    ["react-native-android-widget", widgetConfig],
  ],
  experiments: {
    typedRoutes: true,
  },
});
