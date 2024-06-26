import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { centimeterToPixelConversor } from "@/app/page";

export class Arc extends Draw {
  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number
  ): { newX: number; newY: number } {
    
    const radius =
      (this.size * centimeterToPixelConversor) /
      this.arcProportion /
      (2 * Math.PI);
    
    const newX = this.initialX + radius * Math.cos(radianAngle);
    const  newY = this.initialY - radius * Math.sin(radianAngle);

    const arcToAnngle = 360 * this.arcProportion;
    const returningToPointAnglein = this.clockwise
      ? arcToAnngle
      : arcToAnngle - 180;
    const newAngleToRadian =
      convertDeegreToRadian(returningToPointAnglein) + radianAngle; // passar esse angulo pra printar
    // se for horario só subtrai e anti horario só soma o angulo
    const finalX = newX + radius * Math.cos(newAngleToRadian);
    const finalY = newY - radius * Math.sin(newAngleToRadian);

    canvasContext.moveTo(finalX, finalY);
    const proportionRadianAngle = 2 * Math.PI * this.arcProportion;
    canvasContext.arc(
      newX,
      newY,
      radius,
      0,
      proportionRadianAngle,
      this.clockwise
    );
    this.printValue(canvasContext, newX, newY, radius, proportionRadianAngle);
    
    return { newX:finalX, newY:finalY };
  }

  printValue(
    canvasContext: CanvasRenderingContext2D,
    newX: number,
    newY: number,
    radius: number,
    angle: number
  ): void {
    const distanceReference =
      radius + (radius < 8 ? radius : 8) * (this.textOnSum ? 1 : -1);
    const angleReference = (angle/2) * (this.clockwise ? -1 : 1);
    let printX = newX + distanceReference * Math.cos(angleReference);
    let printY = newY + distanceReference * Math.sin(angleReference);
    canvasContext.fillText(`${this.size}`, printX, printY);
  }
  printAngle(canvasContext: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}
