import {
  convertDeegreToRadian,
  convertRadianToDegree,
} from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";

export class Line extends Draw {
  sizeControl = 1;

  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number,
    initialPoint: { x: number; y: number }
  ): { newX: number; newY: number } {
    canvasContext.moveTo(initialPoint.x, initialPoint.y);
    const { x: newX, y: newY } = this.findPoint(
      { x: initialPoint.x, y: initialPoint.y },
      this.convertSizerToPixel(this.size),
      radianAngle
    );

    canvasContext.lineTo(newX, newY);

    this.printValue(canvasContext, newX, newY, radianAngle, initialPoint);
    return { newX, newY };
  }

  printValue(
    canvasContext: CanvasRenderingContext2D,
    newX: number,
    newY: number,
    angle: number,
    initialPoint: { x: number; y: number }
  ): void {
    const orientation = this.getOrientation(angle);
    const multiplier = this.textOnSum ? 1 : -1;

    const numberToMove = 20;

    const middleX = (initialPoint.x + newX) / 2;
    const middleY = (initialPoint.y + newY) / 2;
    const { x, y } = this.findPoint(
      { x: middleX, y: middleY },
      numberToMove,
      convertDeegreToRadian(this.getAngleOnDraw() + 90 * multiplier)
    );

    canvasContext.fillText(`${this.size}`, x, y);
  }

  printAngle(
    canvasContext: CanvasRenderingContext2D,
    oldAngleNumber: number,
    angleCalculated: number,
    initialPoint: { x: number; y: number }
  ): void {
    canvasContext.moveTo(initialPoint.x, initialPoint.y);
    const bissetriz = angleCalculated - (oldAngleNumber - angleCalculated) / 2;
    const endAngleRadian = convertDeegreToRadian(oldAngleNumber - 180);
    const initalAngleRadian = convertDeegreToRadian(angleCalculated);
    const novaAnalise =
      initalAngleRadian +
      ((Math.abs(endAngleRadian) - Math.abs(initalAngleRadian)) / 2) *
        (!this.clockwise ? -1 : 1);
    canvasContext.arc(
      initialPoint.x,
      initialPoint.y,
      20,
      initalAngleRadian,
      endAngleRadian,
      !this.clockwise
    );

    const { x, y } = this.findPoint(
      { x: initialPoint.x, y: initialPoint.y },
      40,
      novaAnalise
    );
    const quadrant = this.getAngleQuadrant(convertRadianToDegree(novaAnalise));
    let adaptedX = x;
    let adaptedY = y;
    if (quadrant === 1) {
      adaptedX = x - 15;
      adaptedY = y + 3;
    }
    if (quadrant === 2) {
      adaptedX = x - 5;
      adaptedY = y + 5;
    }
    if (quadrant === 4) {
      adaptedX = x - 10;
      adaptedY = y + 10;
    }
    canvasContext.fillText(
      `${this.angleToNextPoint + this.totalAddtionalAngle}`,
      adaptedX,
      adaptedY
    );
  }
}
