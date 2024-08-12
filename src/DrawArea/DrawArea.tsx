import { Draw } from "@/Entities/Draw";
import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { useEffect, useRef, useState } from "react";

export interface DrawAreaProps {
  name: string;
  code: string;
  lines: Draw[];
  setLines: (lines: Draw[]) => void;
}

export const DrawArea = (props: DrawAreaProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    initialContextSetUp(context, canvas);
    let currentX = 330;
    let currentY = 100;
    let currentAngle = 0;
    context.beginPath();
    for (const index in props.lines) {
      const line = props.lines[index];
      line.initialX = currentX;
      line.initialY = currentY;

      const drawData = line.draw(context, currentAngle);

      currentX = drawData.newX;
      currentY = drawData.newY;
      line.finalX = currentX;
      line.finalY = currentY;
      currentAngle = drawData.newAngle;
    }

    context.stroke();
  }, [props.lines]);

  const initialContextSetUp = (
    context: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    context.clearRect(-2* canvas.width, -2*canvas.height, 4*canvas.width, 4*canvas.height);
    context.fillStyle = "#ffffff"; // Branco
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000"; // Preto
    context.rect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 3;
    context.font = "bold 16px Roboto";
    context.save();
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
          const valueInNumber = parseFloat(e.target.value || "90");
          const newLines = props.lines.map((line, index) => {
            const angleDiff =
              valueInNumber -
              (line.angleToNextPoint + line.totalAddtionalAngle);
            if (index === 2) {
              line.totalAddtionalAngle += angleDiff;
              line.currentAngleDiff = angleDiff;
            }
            return line;
          });

          props.setLines(newLines);
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
