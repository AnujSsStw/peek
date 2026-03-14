"use no memo";
import React from "react";
import { FlexWidget, ImageWidget, TextWidget } from "react-native-android-widget";

interface PeekWidgetProps {
  imageUrl: `https:${string}`;
  width: number;
  height: number;
}

export function PeekWidget({ imageUrl, width, height }: PeekWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: "#000000",
      }}
      clickAction="OPEN_APP"
      accessibilityLabel="Peek widget"
    >
      <ImageWidget
        image={imageUrl}
        imageWidth={width}
        imageHeight={height}
        style={{
          width: "match_parent",
          height: "match_parent",
        }}
      />
    </FlexWidget>
  );
}

export function PeekWidgetLoading() {
  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
      }}
      accessibilityLabel="Peek widget loading"
    >
      <TextWidget
        text="Loading..."
        style={{
          fontSize: 14,
          color: "#666666",
        }}
      />
    </FlexWidget>
  );
}
