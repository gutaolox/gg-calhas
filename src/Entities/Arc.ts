import {
  centimeterToPixelConversor,
  convertDeegreToRadian,
  convertRadianToDegree,
} from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { Orientation } from "./Orientation";
import { LineProps } from "@/app/page";

export class Arc extends Draw {
  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number,
    initialPoint: { x: number; y: number },
    isBackward?: boolean
  ): { newX: number; newY: number } {
    const radius =
      this.convertSizerToPixel(this.size) / this.arcProportion / (2 * Math.PI);
    const arcToAnngle = 360 * this.arcProportion;
    const returningToPointAnglein = this.targetedAngle(
      arcToAnngle,
      this.clockwise
    );
    const newAngleToRadian =
      convertDeegreToRadian(returningToPointAnglein) + radianAngle; // passar esse angulo pra printar
    // se for horario só subtrai e anti horario só soma o angulo
    const { x: newX, y: newY } = this.findPoint(
      { x: initialPoint.x, y: initialPoint.y },
      radius,
      isBackward ? newAngleToRadian : radianAngle
    );

    console.log("returningToPointAnglein", returningToPointAnglein);

    console.log("newAngleToRadian", convertRadianToDegree(newAngleToRadian));
    const { x: finalX, y: finalY } = this.findPoint(
      { x: newX, y: newY },
      radius,
      isBackward ? radianAngle : newAngleToRadian
    );

    const ajuda = isBackward ? this.clockwise : !this.clockwise;

    canvasContext.moveTo(finalX, finalY);
    const proportionRadianAngle = 2 * Math.PI * this.arcProportion;
    canvasContext.arc(
      newX,
      newY,
      radius,
      isBackward ? radianAngle : newAngleToRadian,
      isBackward ? newAngleToRadian - Math.PI : radianAngle - Math.PI,
      ajuda
    );
    this.printArcValue(
      canvasContext,
      newX,
      newY,
      radius,
      isBackward ? radianAngle -2* Math.PI : newAngleToRadian,
      proportionRadianAngle
    );

    return { newX: finalX, newY: finalY };
  }

  printArcValue(
    canvasContext: CanvasRenderingContext2D,
    newX: number,
    newY: number,
    radius: number,
    drawAngle: number,
    angle: number
  ): void {
    const distanceMinValue = 8;
    const distanceReference =
      radius +
      (radius < distanceMinValue ? radius : distanceMinValue) *
        (this.textOnSum ? 1 : -1);
    let angleReference = drawAngle +((angle / 2) * (this.clockwise ? -1 : 1));
    const orientation = this.getOrientation(
      convertRadianToDegree(angleReference)
    );

    console.log("angleReference", convertRadianToDegree(angleReference));

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
