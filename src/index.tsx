import React, { FC, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Text,
  View,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
  Image,
} from "react-native";

interface IListProps {
  title: string;
}

interface IProps {
  headerTitle: string;
  titleStyle?: StyleProp<TextStyle>;
  headerBgColor?: string;
  headerBorderRadius?: number;
  listContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  icon?: () => React.ReactNode;
  list: (props: IListProps) => React.ReactNode;
  data: {
    title: string;
  }[];
}

const toggleAnimation = {
  duration: 300,
  update: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 1000,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export const Accordion: FC<IProps> = ({
  headerTitle,
  titleStyle,
  data: data1,
  headerBgColor,
  headerBorderRadius = 0,
  listContainerStyle,
  icon,
  iconColor,
  list,
}) => {
  const [showContent, setShowContent] = useState(true);
  const [data, setData] = useState(data1.slice(0, 4));
  const [clickCount, setClickCount] = useState<"FIRST" | "SECOND" | "THIRD">(
    "FIRST"
  );

  const animationController = useRef(new Animated.Value(0)).current;

  const handleAnimatedCollipsableOpen = () => {
    Animated.timing(animationController, {
      duration: 300,
      toValue: clickCount === "FIRST" ? 0 : clickCount === "SECOND" ? 1 : 0,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(toggleAnimation);
    if (clickCount === "FIRST") {
      setData(data1);
      setClickCount("SECOND");
    } else if (clickCount === "SECOND") {
      setShowContent(false);
      setClickCount("THIRD");
    } else if (clickCount === "THIRD") {
      setShowContent(true);
      setClickCount("SECOND");
    }
  };
  const arrowTransition = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={{ marginTop: 4, overflow: "hidden" }}>
      <View
        style={{
          borderRadius: headerBorderRadius,
          backgroundColor: headerBgColor,
        }}
      >
        <TouchableOpacity
          onPress={handleAnimatedCollipsableOpen}
          style={{
            width: "100%",
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={titleStyle}>{headerTitle}</Text>
          <Animated.View
            style={{
              transform: [{ rotateZ: arrowTransition }],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {icon ? (
              icon()
            ) : (
              <Image
                source={require("../assets/arrowDown.png")}
                style={{ width: 16, height: 16, tintColor: iconColor }}
              />
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      {showContent && (
        <View style={listContainerStyle}>{data.map((item) => list(item))}</View>
      )}
    </View>
  );
};
