import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { Draw } from "./Draw";
import { Orientation } from "./Orientation";
import { centimeterToPixelConversor } from "@/app/page";

export class Line extends Draw {
  calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number
  ): { newX: number; newY: number } {
    canvasContext.moveTo(this.initialX, this.initialY);
    const newX =
      this.initialX +
      this.size * centimeterToPixelConversor * Math.cos(radianAngle);
    const newY =
      this.initialY -
      this.size * centimeterToPixelConversor * Math.sin(radianAngle);
    console.log("newX", newX);
    console.log("newY", newY);
    canvasContext.lineTo(newX, newY);
    this.printValue(canvasContext, newX, newY, (radianAngle * 180) / Math.PI);
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
      canvasContext.fillText(
        `${this.size}`,
        middleX - 2,
        middleY + multiplier * numberToMove+4
      );
    }
    if (orientation === Orientation.VERTICAL) {
      canvasContext.fillText(
        `${this.size}`,
        middleX + multiplier * numberToMove,
        middleY + 4
      );
    }
    if (orientation === Orientation.ASCENDING) {
      canvasContext.fillText(
        `${this.size}`,
        middleX - multiplier * numberToMove -6,
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

  getOrientation(currentAngle: number): Orientation {
    const angle = currentAngle < 0 ? 360 + currentAngle : currentAngle;
    if (angle === 0 || angle === 180) {
      return Orientation.HORIZONTAL;
    }
    if (angle === 90 || angle === 270) {
      return Orientation.VERTICAL;
    }
    if ((angle > 0 && angle < 90) || (angle > 180 && angle < 270)) {
      return Orientation.ASCENDING;
    }
    if ((angle > 90 && angle < 180) || (angle > 270 && angle < 360)) {
      return Orientation.DESCENDING;
    }
    return Orientation.HORIZONTAL;
  }

  printAngle(canvasContext: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}
