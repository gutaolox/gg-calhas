import { centimeterToPixelConversor, convertRadianToDegree } from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { Orientation } from "./Orientation";

export class Line extends Draw {
  sizeControl = 1;
  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number
  ): { newX: number; newY: number } {
    canvasContext.moveTo(this.initialX, this.initialY);
    const { x: newX, y: newY } = this.findPoint(
      { x: this.initialX, y: this.initialY },
      this.convertSizerToPixel(this.size),
      radianAngle
    );

    canvasContext.lineTo(newX, newY);
    this.printValue(canvasContext, newX, newY, convertRadianToDegree(radianAngle));
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
    if (orientation === Orientation.HORIZONTAL) {
      const ditanceToLineAdditionOnX = -5 * this.sizeControl;
      const ditanceToLineAdditionOnY = 4 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX + ditanceToLineAdditionOnX,
        middleY + multiplier * numberToMove + ditanceToLineAdditionOnY
      );
    }
    if (orientation === Orientation.VERTICAL) {
      const ditanceToLineAddition = 4 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX + multiplier * numberToMove,
        middleY + ditanceToLineAddition
      );
    }
    if (orientation === Orientation.ASCENDING) {
      const ditanceToLineAddition = -6 * this.sizeControl;
      canvasContext.fillText(
        `${this.size}`,
        middleX - multiplier * numberToMove + ditanceToLineAddition,
        middleY - multiplier * numberToMove
      );
    }
    if (orientation === Orientation.DESCENDING) {
      canvasContext.fillText(
        `${this.size}`,
        middleX + multiplier * numberToMove,
        middleY + multiplier * numberToMove
      );
    }
  }

  

  printAngle(canvasContext: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}
