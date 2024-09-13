import { DoublyLinkedList } from "@/Entities/BaseStructures/DoublyLinkedList";
import { Draw } from "@/Entities/Draw";
import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { useEffect, useRef, useState } from "react";

export interface DrawAreaProps {
  name: string;
  code: string;
  lines: DoublyLinkedList<Draw>;
  setLines: (lines: DoublyLinkedList<Draw>) => void;
}
//Função so pra direita

//Função que vai pros dois lados bem implementada, com o que foi pensado as 16:26 de 24 de agosto SO PRECISA INVERTER O ANGULO INICIAL
export const DrawArea = (props: DrawAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lastLineChanged, setLastLineChanged] = useState<Draw>();
  const [angle, setAngle] = useState(90);
  const toRightDraw = (
    initialXOnDraw: number,
    initialYOnDraw: number,
    angleOnDraw: number,
    context: CanvasRenderingContext2D
  ) => {
    let currentX = initialXOnDraw; // Fazer uma função que recebe por parametro
    let currentY = initialYOnDraw;
    let currentAngle = angleOnDraw;
    return (line: Draw | null) => {
      if (!line) return;
      line.setInitialPoint(currentX, currentY);
      line.setAngleOnDraw(currentAngle);
      const drawData = line.drawLeftToRight(context, currentAngle);
      currentX = drawData.newX;
      currentY = drawData.newY;
      line.setFinalPoint(currentX, currentY);
      currentAngle = drawData.newAngle;
    };
  };

  const toLeftDraw = (
    initialXOnDraw: number,
    initialYOnDraw: number,
    angleOnDraw: number,
    context: CanvasRenderingContext2D
  ) => {
    let currentX = initialXOnDraw; // Fazer uma função que recebe por parametro
    let currentY = initialYOnDraw;
    let currentAngle = angleOnDraw;
    return (line: Draw | null) => {
      if (!line) return;
      line.setFinalPoint(currentX, currentY);
      line.setAngleOnDraw(currentAngle);
      const drawData = line.drawRightToLeft(context, currentAngle);
      line.setInitialPoint(currentX, currentY);
      currentX = drawData.newX;
      currentY = drawData.newY;
      currentAngle = drawData.newAngle;
    };
  };

  const onAngleChange = (line: Draw, context: CanvasRenderingContext2D) => {
    const seyUpPositions = line.moveRightSide ? line.getInitialPoint() : line.getFinalPoint() ;
    console.log(line);
    const rightFunction = toRightDraw(
      seyUpPositions.x,
      seyUpPositions.y,
      line.getAngleOnDraw(),
      context
    );

    const leftFunction = toLeftDraw(
      seyUpPositions.x,
      seyUpPositions.y,
      line.getAngleOnDraw(),
      context
    );

    props.lines.travelFrom(
      line.idToList!,
      (data: Draw | null) => {
        if (data !== line || line.moveRightSide) {
          console.log(line.idToList);
          rightFunction(data);
        }
      },
      (data: Draw | null) => {
        if (data !== line || !line.moveRightSide) {
          console.log(line.idToList);
          leftFunction(data);
        }
      }
    );
  };

  useEffect(() => {
    console.log(props.lines);
    let currentX = 330; // Fazer uma função que recebe por parametro
    let currentY = 100;
    let currentAngle = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    initialContextSetUp(canvas, context);

    context.beginPath();
    const initialDrawFunction = toRightDraw(
      currentX,
      currentY,
      currentAngle,
      context
    );
    //adicionar função do loop como parametro
    props.lines.travel(initialDrawFunction);
    context.closePath();
    context.stroke();
  }, []);

  useEffect(() => {
    if (!lastLineChanged) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.beginPath();
    initialContextSetUp(canvas, context);
    onAngleChange(lastLineChanged, context);
    context.closePath();
    context.stroke();
  }, [angle]);

  const initialContextSetUp = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ): CanvasRenderingContext2D | undefined => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff"; // Branco
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000"; // Preto
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 3;
    context.font = "bold 16px Roboto";
    return context;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context === null) return;
      // Salva o estado atual do canvas antes de aplicar o fundo
      context.save();
      // Define a cor de fundo para branco e preenche o canvas

      const image = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.download = "canvas-image.jpeg";
      link.href = image;
      link.click();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px",
      }}
    >
      <canvas ref={canvasRef} id="canvas" width="1000" height="300" />
      <input
        style={{ borderWidth: "10px", borderColor: "black" }}
        type="number"
        defaultValue={90}
        onChange={(e) => {
          console.log(props.lines);
          const valueInNumber = parseFloat(e.target.value || "90");
          const newLine = props.lines.search(2)!.data;
          const angleDiff =
            valueInNumber -
            (newLine.angleToNextPoint + newLine.totalAddtionalAngle);

          newLine.totalAddtionalAngle += angleDiff;
          newLine.currentAngleDiff = angleDiff;

          // newLine?.setAngleOnDraw(
          //   newLine.getAngleOnDraw() + newLine.totalAddtionalAngle
          // );
          setLastLineChanged(newLine);
          setAngle(valueInNumber);
          // props.setLines(props.lines);
        }}
      />
      <button
        style={{
          borderWidth: "10px",
          borderColor: "black",
          backgroundColor: "blue",
          color: "white",
        }}
        onClick={handleDownload}
      >
        Exportar
      </button>
    </div>
  );
};
