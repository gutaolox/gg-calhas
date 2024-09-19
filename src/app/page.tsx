"use client";
import { DrawArea } from "@/DrawArea/DrawArea";
import { Arc } from "@/Entities/Arc";
import { DoublyLinkedList } from "@/Entities/BaseStructures/DoublyLinkedList";
import { Draw } from "@/Entities/Draw";
import { Line } from "@/Entities/Line";
import { use, useEffect, useState } from "react";

export interface LineProps {
  size: number;
  angleToNextPoint: number;
  clockwise: boolean;
  isArc: boolean;
  arcProportion: number; //valor que vai de 0 a 1 que indica quanto do circulo vai ser desenhado
  textOnSum: boolean;
  displayAngle: boolean;
}
let count = 0;
const drawInfo = [
  {
    name: "Calhador",
    code: "123",
    lines: [
      {
        //somar angulo antes de somar
        size: 1,
        angleToNextPoint: 0,
        clockwise: true, // antiohorario somar o angulo atual com angulo -180 e sentido horario só somar o angulo
        isArc: false, //quando for arco adicionar o raio no display do texto dependendo da combinação de textOnSum e clockwise
        arcProportion: 0, //para achar o centro do circulo soma o raio na mesma direção pra achar o centro
        textOnSum: true,
        displayAngle: false, //Calcula o show angle com matematica nao precisa guardar
      },
      {
        size: 7,
        angleToNextPoint: 90,
        clockwise: true,
        isArc: false,
        arcProportion: 0,
        textOnSum: false,
        displayAngle: true,
      },
      {
        size: 10,
        angleToNextPoint: 90,
        clockwise: false,
        isArc: false,
        arcProportion: 0,
        textOnSum: true,
        displayAngle: true,
      },
      {
        size: 2,
        angleToNextPoint: 90,
        clockwise: false,
        isArc: false,
        arcProportion: 0,
        textOnSum: true,
        displayAngle: true,
      },
      {
        size: 6.5,
        angleToNextPoint: 0,
        clockwise: true,
        isArc: true,
        arcProportion: 0.25,
        textOnSum: true,
        displayAngle: false,
      },
      {
        size: 2,
        angleToNextPoint: 60,
        clockwise: true,
        isArc: false,
        arcProportion: 0,
        textOnSum: false,
        displayAngle: false,
      },
      {
        size: 2.5,
        angleToNextPoint: 120,
        clockwise: false,
        isArc: false,
        arcProportion: 0,
        textOnSum: true,
        displayAngle: true,
      },
      {
        size: 1,
        angleToNextPoint: 90,
        clockwise: false,
        isArc: false,
        arcProportion: 0,
        textOnSum: false,
        displayAngle: true,
      },
      {
        size: 1,
        angleToNextPoint: 90,
        clockwise: false,
        isArc: false,
        arcProportion: 0,
        textOnSum: false,
        displayAngle: true,
      },
    ],
  },
];

export default function Home() {
  const [lines, setLines] = useState<DoublyLinkedList<Draw>>(() => {
    const initiLines = new DoublyLinkedList<Draw>();
    drawInfo[0].lines.forEach((line) => {
      const selectedObj = line.isArc
        ? new Arc(
            line.size,
            line.angleToNextPoint,
            line.clockwise,
            line.arcProportion,
            line.textOnSum,
            line.displayAngle
          )
        : new Line(
            line.size,
            line.angleToNextPoint,
            line.clockwise,
            line.arcProportion,
            line.textOnSum,
            line.displayAngle
          );
      count++;
      initiLines.append(selectedObj);
    });
    return initiLines;
  });
  return (
    <div>
      <DrawArea
        name={drawInfo[0].name}
        code={drawInfo[0].code}
        lines={lines}
        setLines={setLines}
      />
    </div>
  );
}
