import { centimeterToPixelConversor, convertDeegreToRadian } from "@/util/convertDeegreToRadian";
import { Orientation } from "./Orientation";

export abstract class Draw {
  public initialX = 0;
  public initialY = 0;
  public finalX = 0;
  public finalY = 0;
  constructor(
    public size: number,
    public angleToNextPoint: number,
    public clockwise: boolean,
    public arcProportion: number, //valor que vai de 0 a 1 que indica quanto do circulo vai ser desenhado
    public textOnSum: boolean,
    public displayAngle: boolean
  ) {}

  draw(
    canvasContext: CanvasRenderingContext2D,
    currentAngleReference: number
  ): { newX: number; newY: number; newAngle: number } {
    const angleCalculated = this.moveAngle(currentAngleReference);
    const newAngleInReadian = convertDeegreToRadian(angleCalculated);
    const { newX, newY } = this.calculateNextPoint(canvasContext, newAngleInReadian);
    
    if (this.displayAngle) {
      this.printAngle(canvasContext);
    }
    return { newX, newY, newAngle: angleCalculated };
  }
  abstract calculateNextPoint(canvasContext: CanvasRenderingContext2D, radianAngle: number): { newX: number; newY: number };
  moveAngle(currentAngleReference: number): number {
    const angleToSum = this.targetedAngle(this.angleToNextPoint, this.clockwise);
    return currentAngleReference + angleToSum;
  }

  targetedAngle(angle: number,orientation:boolean): number {
    return orientation ? angle - 180 : angle;
  }

  findPoint(initialCoordinate:{
    x:number,
    y:number
  }, sizeInPixels:number, radianAngle:number) : {
    x:number,
    y:number
  } {
    return {
      x: initialCoordinate.x + sizeInPixels * Math.cos(radianAngle),
      y: initialCoordinate.y - sizeInPixels * Math.sin(radianAngle)
    }
  }

  convertSizerToPixel(sizeInCentimeters:number):number {
    return sizeInCentimeters * centimeterToPixelConversor
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


  abstract printAngle(canvasContext: CanvasRenderingContext2D): void;
}
