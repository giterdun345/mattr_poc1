import Konva from "konva";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Shape, Text, Group, Image } from "react-konva";
import useImage from "use-image";

const Stamp = ({ file, width, height }) => {
  const [image] = useImage(file);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Image image={image} />
        <Group
          name="group"
          x={225}
          y={295}
          width={120}
          height={60}
          fill="red"
          draggable
        >
          <Rect
            name="rect"
            // x={0}
            // y={0}
            fill="red"
            width={100}
            height={50}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
          <Text text={new Date()} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default Stamp;
