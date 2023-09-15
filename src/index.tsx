import { FC, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

interface IProps {
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

export const Accordion: FC<IProps> = ({ data: data1 }) => {
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
          borderRadius: 8,
          backgroundColor: "#3d4058",
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
          <Text style={{ color: "#fff" }}>Open Accordion</Text>
          <Animated.View style={{ transform: [{ rotateZ: arrowTransition }] }}>
            <Text style={{ color: "#fff" }}>v</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {showContent && (
        <View>
          {data.map((item, index) => (
            <View key={index} style={{ padding: 10 }}>
              <Text style={{ color: "#fff" }}>{item.title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
