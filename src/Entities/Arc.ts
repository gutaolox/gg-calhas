import {
  centimeterToPixelConversor,
  convertDeegreToRadian,
  convertRadianToDegree,
} from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { Orientation } from "./Orientation";

export class Arc extends Draw {
  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number
  ): { newX: number; newY: number } {
    const radius =
      this.convertSizerToPixel(this.size) / this.arcProportion / (2 * Math.PI);

    const { x: newX, y: newY } = this.findPoint(
      { x: this.initialX, y: this.initialY },
      radius,
      radianAngle
    );

    const arcToAnngle = 360 * this.arcProportion;
    const returningToPointAnglein = this.targetedAngle(
      arcToAnngle,
      !this.clockwise
    );
    const newAngleToRadian =
      convertDeegreToRadian(returningToPointAnglein) + radianAngle; // passar esse angulo pra printar
    // se for horario só subtrai e anti horario só soma o angulo
    const { x: finalX, y: finalY } = this.findPoint(
      { x: newX, y: newY },
      radius,
      newAngleToRadian
    );

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

    return { newX: finalX, newY: finalY };
  }

  printValue(
    canvasContext: CanvasRenderingContext2D,
    newX: number,
    newY: number,
    radius: number,
    angle: number
  ): void {
    const distanceMinValue = 8;
    const distanceReference =
      radius +
      (radius < distanceMinValue ? radius : distanceMinValue) *
        (this.textOnSum ? 1 : -1);
    let angleReference = (angle / 2) * (this.clockwise ? -1 : 1);
    const orientation = this.getOrientation(
      convertRadianToDegree(angleReference)
    );

    if (orientation === Orientation.ASCENDING) {
      angleReference = angleReference - Math.PI / 2;
    }
    if (orientation === Orientation.DESCENDING) {
      angleReference = angleReference + Math.PI / 2;
    }

    const { x: printX, y: printY } = this.findPoint(
      { x: newX, y: newY },
      distanceReference,
      angleReference
    );

    canvasContext.fillText(`${this.size}`, printX, printY);
  }

  printAngle(canvasContext: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}
