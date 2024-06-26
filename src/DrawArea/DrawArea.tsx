import { Draw } from "@/Entities/Draw";
import { LineProps } from "@/app/page";
import { useEffect, useRef } from "react";

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
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff'; // Branco
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000'; // Preto
    context.lineWidth = 3;
    let currentX = 375;
    let currentY = 500;
    let currentAngle = 0;
    context.beginPath();
    for (const line of props.lines) {
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

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if(context === null) return;
      // Salva o estado atual do canvas antes de aplicar o fundo
      context.save();
      // Define a cor de fundo para branco e preenche o canvas
     
      const image = canvas.toDataURL("image/jpeg")
      const link = document.createElement('a');
      link.download = 'canvas-image.jpeg';
      link.href = image;
      link.click();
    }
  };


  return (
    <div style={{display:"flex",flexDirection:"column", alignItems:"center",justifyContent:"center", border:"1px"}}>
      <canvas  ref={canvasRef} id="canvas" width="1000" height="700" />
      <input style={{borderWidth:"10px",borderColor:"black"}} type="text" onChange={(e)=> {
        console.log(e.target.value)
        const newLines = props.lines.map((line, index) => {
          if(index === 2){
            line.size = parseFloat(e.target.value || 
              "10");
          }
          return line;
        })
        props.setLines(newLines);
      }} />
      <button style={{borderWidth:"10px",borderColor:"black",backgroundColor:"blue",color:"white"}}onClick={handleDownload}>Exportar</button>
    </div>
  );
};
