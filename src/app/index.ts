import "expo-router/entry";
import { widgetTaskHandler } from "@/widget/widget-task-handler";
import { WidgetConfigurationScreen } from "@/widget/WidgetConfigurationScreen";
import {
  registerWidgetTaskHandler,
  registerWidgetConfigurationScreen,
} from "react-native-android-widget";

registerWidgetTaskHandler(widgetTaskHandler);
registerWidgetConfigurationScreen(WidgetConfigurationScreen);
