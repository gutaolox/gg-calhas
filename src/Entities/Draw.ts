import { convertDeegreToRadian } from "@/util/convertDeegreToRadian";

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

    console.log("initial x", this.initialX)
    console.log("initia y", this.initialY)
    const angleCalculated = this.moveAngle(currentAngleReference);
    console.log("current angle", angleCalculated)
    const newAngleInReadian = convertDeegreToRadian(angleCalculated);
    const { newX, newY } = this.calculateNextPoint(canvasContext, newAngleInReadian);
    
    if (this.displayAngle) {
      this.printAngle(canvasContext);
    }
    return { newX, newY, newAngle: angleCalculated };
  }
  abstract calculateNextPoint(canvasContext: CanvasRenderingContext2D, radianAngle: number): { newX: number; newY: number };
  moveAngle(currentAngleReference: number): number {
    const angleToSum = this.clockwise
      ? this.angleToNextPoint - 180
      : this.angleToNextPoint;
    return currentAngleReference + angleToSum;
  }
  abstract printAngle(canvasContext: CanvasRenderingContext2D): void;
}
