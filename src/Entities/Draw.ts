import {
  centimeterToPixelConversor,
  convertDeegreToRadian,
} from "@/util/convertDeegreToRadian";
import { Orientation } from "./Orientation";
import { BaseDataInterface } from "./BaseStructures/DoublyLinkedList";

export abstract class Draw implements BaseDataInterface {
  private initialX = 0;
  private initialY = 0;
  private finalX = 0;
  private finalY = 0;
  private angleOnDraw = 0;
  public moveRightSide = false;
  public totalAddtionalAngle = 0;
  public currentAngleDiff = 0;
  constructor(
    public size: number,
    public angleToNextPoint: number,
    public clockwise: boolean,
    public arcProportion: number, //valor que vai de 0 a 1 que indica quanto do circulo vai ser desenhado
    public textOnSum: boolean,
    public displayAngle: boolean,
    public nextDraw: Draw | null = null,
    public previousDraw: Draw | null = null,
    public idToList?: number
  ) {}

  setInitialPoint(x: number, y: number): void {
    this.initialX = x;
    this.initialY = y;
  }

  getInitialPoint(): { x: number; y: number } {
    return { x: this.initialX, y: this.initialY };
  }

  setFinalPoint(x: number, y: number): void {
    this.finalX = x;
    this.finalY = y;
  }

  getFinalPoint(): { x: number; y: number } {
    return { x: this.finalX, y: this.finalY };
  }

  setAngleOnDraw(angle: number): void {
    this.angleOnDraw = angle;
  }

  getAngleOnDraw(): number {
    return this.angleOnDraw;
  }

  drawLeftToRight(
    canvasContext: CanvasRenderingContext2D,
    currentAngleReference: number,
    multiplier = 1
  ): { newX: number; newY: number; newAngle: number } {
    console.log("currentAngleReference", currentAngleReference);

    const angleCalculated = this.moveAngle(
      currentAngleReference,
      this.clockwise,
      multiplier
    );
    console.log("angleCalculated", angleCalculated);
    const newAngleInReadian = convertDeegreToRadian(angleCalculated);

    const { newX, newY } = this.calculateNextPoint(
      canvasContext,
      newAngleInReadian,
      { x: this.initialX, y: this.initialY }
    );
    //console.log("newX", newX, "newY", newY);

    if (this.displayAngle) {
      this.printAngle(
        canvasContext,
        currentAngleReference,
        angleCalculated,
        this.getInitialPoint()
      );
    }
    return { newX, newY, newAngle: angleCalculated };
  }

  drawRightToLeft(
    canvasContext: CanvasRenderingContext2D,
    currentAngleReference: number
  ) {
    console.log("currentAngleReference", currentAngleReference);
    const newAngleInReadian = convertDeegreToRadian(
      currentAngleReference - 180
    );

    const { newX, newY } = this.calculateNextPoint(
      canvasContext,
      newAngleInReadian,
      { x: this.finalX, y: this.finalY }
    );

    const angleCalculated = this.moveAngle(
      currentAngleReference,
      this.clockwise,
      -1
    );

    if (this.displayAngle) {
      this.printAngle(canvasContext, angleCalculated, currentAngleReference, {
        x: newX,
        y: newY,
      });
    }

    return { newX, newY, newAngle: angleCalculated };
  }

  abstract calculateNextPoint(
    canvasContext: CanvasRenderingContext2D,
    radianAngle: number,
    initialPoint: { x: number; y: number }
  ): { newX: number; newY: number };

  moveAngle(
    currentAngleReference: number,
    clockwise: boolean,
    multiplier = 1
  ): number {
    const angleToSum = this.targetedAngle(
      this.angleToNextPoint + this.totalAddtionalAngle,
      clockwise
    );
    return currentAngleReference + angleToSum * multiplier;
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

  printAngle(
    canvasContext: CanvasRenderingContext2D,
    oldAngleNumber: number,
    angleCalculated: number,
    initialPoint: { x: number; y: number }
  ): void {
    // implementation goes here
  }
}
