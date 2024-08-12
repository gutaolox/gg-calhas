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
    radianAngle: number
  ): { newX: number; newY: number } {
    const { x: newX, y: newY } = this.findPoint(
      { x: this.initialX, y: this.initialY },
      this.convertSizerToPixel(this.size),
      radianAngle
    );

    this.rotateImage(canvasContext, this.initialX, this.initialY);
    canvasContext.moveTo(this.initialX, this.initialY);
    canvasContext.lineTo(newX, newY);
    
    this.printValue(
      canvasContext,
      newX,
      newY,
      convertRadianToDegree(radianAngle)
    );
    return { newX, newY };
  }

  printValue(
    canvasContext: CanvasRenderingContext2D,
    newX: number,
    newY: number,
    angle: number
  ): void {
    const orientation = this.getOrientation(angle);
    const multiplier = this.textOnSum ? 1 : -1;
    const numberToMove = 12;

    const middleX = (this.initialX + newX) / 2;
    const middleY = (this.initialY + newY) / 2;
    //this.rotateImage(canvasContext, middleX, middleY);
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
    angleCalculated: number
  ): void {
    canvasContext.moveTo(this.initialX, this.initialY);

    const initalAngleRadian = convertDeegreToRadian(angleCalculated);
    const endAngleRadian = convertDeegreToRadian(oldAngleNumber - 180);
    canvasContext.arc(
      this.initialX,
      this.initialY,
      10,
      initalAngleRadian,
      endAngleRadian,
      !this.clockwise
    );
  }
}
