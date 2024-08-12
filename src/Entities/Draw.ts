import {
  centimeterToPixelConversor,
  convertDeegreToRadian,
} from "@/util/convertDeegreToRadian";
import { Orientation } from "./Orientation";

export abstract class Draw {
  public initialX = 0;
  public initialY = 0;
  public finalX = 0;
  public finalY = 0;
  public totalAddtionalAngle = 0;
  public currentAngleDiff = 0;
  public isNextFixed = true;

  constructor(
    public size: number,
    public angleToNextPoint: number,
    public clockwise: boolean,
    public arcProportion: number, //valor que vai de 0 a 1 que indica quanto do circulo vai ser desenhado
    public textOnSum: boolean,
    public displayAngle: boolean,
    public nextDraw: Draw | null = null,
    public previousDraw: Draw | null = null
  ) {}

  draw(
    canvasContext: CanvasRenderingContext2D,
    currentAngleReference: number
  ): { newX: number; newY: number; newAngle: number } {
    const angleCalculated = this.moveAngle(currentAngleReference);
    
    const newAngleInReadian = convertDeegreToRadian(angleCalculated);
   
    const { newX, newY } = this.calculateNextPoint(
      canvasContext,
      newAngleInReadian
    );

    if (this.displayAngle) {
      this.printAngle(canvasContext, currentAngleReference, angleCalculated);
    }
    return { newX, newY, newAngle: angleCalculated };
  }
  abstract calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number
  ): { newX: number; newY: number };

  moveAngle(currentAngleReference: number): number {
    const angleToSum = this.targetedAngle(
      this.angleToNextPoint + this.totalAddtionalAngle,
      this.clockwise
    );

    return currentAngleReference + angleToSum;
  }

  targetedAngle(angle: number, orientation: boolean): number {
    return orientation ? angle : angle - 180;
  }

  findPoint(
    initialCoordinate: {
      x: number;
      y: number;
    },
    sizeInPixels: number,
    radianAngle: number
  ): {
    x: number;
    y: number;
  } {
    return {
      x: initialCoordinate.x + sizeInPixels * Math.cos(radianAngle),
      y: initialCoordinate.y + sizeInPixels * Math.sin(radianAngle),
    };
  }

  convertSizerToPixel(sizeInCentimeters: number): number {
    return sizeInCentimeters * centimeterToPixelConversor;
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

  static createInstance<T extends Draw>(
    ctor: new (
      size: number,
      angleToNextPoint: number,
      clockwise: boolean,
      arcProportion: number,
      textOnSum: boolean,
      displayAngle: boolean,
      nextDraw?: Draw | null,
      previousDraw?: Draw | null
    ) => T,
    {
      size,
      angleToNextPoint,
      clockwise,
      arcProportion,
      textOnSum,
      displayAngle,
      nextDraw,
      previousDraw,
    }: {
      size: number;
      angleToNextPoint: number;
      clockwise: boolean;
      arcProportion: number;
      textOnSum: boolean;
      displayAngle: boolean;
      nextDraw?: Draw | null;
      previousDraw?: Draw | null;
    }
  ): T {
    return new ctor(
      size,
      angleToNextPoint,
      clockwise,
      arcProportion,
      textOnSum,
      displayAngle,
      nextDraw,
      previousDraw
    );
  }

  abstract printAngle(
    canvasContext: CanvasRenderingContext2D,
    oldAngleNumber: number,
    angleCalculated: number
  ): void;

  rotateImage(canvasContext: CanvasRenderingContext2D, x: number, y: number) {
    if (this.isNextFixed) {
      canvasContext.translate(x, y);
      const angleToRotateInRadian = convertDeegreToRadian(
        -this.currentAngleDiff
      );
      canvasContext.rotate(angleToRotateInRadian);
      canvasContext.translate(-x, -y);
    }
  }
}
