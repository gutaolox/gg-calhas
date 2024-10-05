import {
  DoublyLinkedList,
  Nod,
} from "@/Entities/BaseStructures/DoublyLinkedList";
import { Draw } from "@/Entities/Draw";
import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { useEffect, useRef, useState } from "react";
import AngleInput from "./AngleInput";

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
  const [lastLineChanged, setLastLineChanged] = useState<Nod<Draw>>();
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
      const drawData = line.drawLeftToRight(context, currentAngle);
      line.setAngleOnDraw(drawData.newAngle);
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

  const onAngleChange = (
    line: Nod<Draw>,
    context: CanvasRenderingContext2D
  ) => {
    const dataLine = line.data;
    // const setUpPositions = line.moveRightSide
    //   ? line.getInitialPoint()
    //   : line.getFinalPoint();
    if (!line.next || !line.prev) return;
    const leftToRightInfo = dataLine.moveRightSide
      ? {
          x: line.prev.data.getFinalPoint().x,
          y: line.prev.data.getFinalPoint().y,
          angle: line.prev.data.getAngleOnDraw(),
        }
      : {
          x: dataLine.getFinalPoint().x,
          y: dataLine.getFinalPoint().y,
          angle: dataLine.getAngleOnDraw(),
        };
    const rightToLeftInfo = dataLine.moveRightSide
      ? {
          x: line.prev.data.getFinalPoint().x,
          y: line.prev.data.getFinalPoint().y,
          angle: line.prev.data.getAngleOnDraw(),
        }
      : {
          x: dataLine.getFinalPoint().x,
          y: dataLine.getFinalPoint().y,
          angle: dataLine.getAngleOnDraw(),
        };
    const rightFunction = toRightDraw(
      leftToRightInfo.x,
      leftToRightInfo.y,
      leftToRightInfo.angle,
      context
    );

    const leftFunction = toLeftDraw(
      rightToLeftInfo.x,
      rightToLeftInfo.y,
      rightToLeftInfo.angle,
      context
    );

    props.lines.travelFrom(
      dataLine.idToList!,
      (data: Draw | null) => {
        if (data !== dataLine || dataLine.moveRightSide) {
          rightFunction(data);
        }
      },
      (data: Draw | null) => {
        if (data !== dataLine || !dataLine.moveRightSide) {
          leftFunction(data);
        }
      }
    );
  };

  useEffect(() => {    
    let currentX = 1500; // Fazer uma função que recebe por parametro
    let currentY = 1500;
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





  function changeAngleInput(event: React.ChangeEvent<HTMLInputElement>, checked: boolean, id: number) {
   
    const valueInNumber = parseFloat(event.target.value || "120");
    
    
    const lineNod = props.lines.search(id)!.nod;
      const newLine = lineNod.data;
      const angleDiff =
        valueInNumber -
        (newLine.angleToNextPoint + newLine.totalAddtionalAngle);

      newLine.totalAddtionalAngle += angleDiff;
      newLine.currentAngleDiff = angleDiff;

     
      lineNod.data.moveRightSide = !checked
      
      // newLine?.setAngleOnDraw(
      //   newLine.getAngleOnDraw() + newLine.totalAddtionalAngle
      // );
      setLastLineChanged(lineNod);
      setAngle(valueInNumber);
    
      return valueInNumber;
  }








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
      <canvas ref={canvasRef} id="canvas" width="4000" height="2500" />
      <AngleInput changeAngle={changeAngleInput}/>

      {/* <input
        style={{ borderWidth: "10px", borderColor: "black" }}
        type="number"
        defaultValue={120}
        onChange={changeAngleInput}
      /> */}
      
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
