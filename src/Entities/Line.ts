import {
  centimeterToPixelConversor,
  convertDeegreToRadian,
  convertRadianToDegree,
} from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { Orientation } from "./Orientation";
import { LineProps } from "@/app/page";

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

    this.printValue(
      canvasContext,
      newX,
      newY,
      convertRadianToDegree(radianAngle),
      initialPoint
    );
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
    const numberToMove = 12;

    const middleX = (initialPoint.x + newX) / 2;
    const middleY = (initialPoint.y + newY) / 2;
    if (orientation === Orientation.HORIZONTAL) {
      const ditanceToLineAdditionOnX = -5 * this.sizeControl;
      const ditanceToLineAdditionOnY = 4 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX + ditanceToLineAdditionOnX,
        middleY - multiplier * numberToMove + ditanceToLineAdditionOnY
      );
    }
    if (orientation === Orientation.VERTICAL) {
      const ditanceToLineAddition = 4 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX + multiplier * numberToMove,
        middleY - ditanceToLineAddition
      );
    }
    if (orientation === Orientation.ASCENDING) {
      const ditanceToLineAddition = -6 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX - multiplier * numberToMove + ditanceToLineAddition,
        middleY + multiplier * numberToMove
      );
    }
    if (orientation === Orientation.DESCENDING) {
      canvasContext.fillText(
        `${this.size}`,
        middleX + multiplier * numberToMove,
        middleY - multiplier * numberToMove
      );
    }
  }

  printAngle(
    canvasContext: CanvasRenderingContext2D,
    oldAngleNumber: number,
    angleCalculated: number,
    initialPoint: { x: number; y: number }
  ): void {
    canvasContext.moveTo(initialPoint.x, initialPoint.y);

    const initalAngleRadian = convertDeegreToRadian(angleCalculated);
    const endAngleRadian = convertDeegreToRadian(oldAngleNumber - 180);
    canvasContext.arc(
      initialPoint.x,
      initialPoint.y,
      10,
      initalAngleRadian,
      endAngleRadian,
      !this.clockwise
    );
  }
}
