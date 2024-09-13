export interface BaseDataInterface {
  idToList?: number;
}

export class Nod<T extends BaseDataInterface> {
  data: T;
  next: Nod<T> | null;
  prev: Nod<T> | null;

  constructor(data: T) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

export class DoublyLinkedList<T extends BaseDataInterface> {
  head: Nod<T> | null;
  tail: Nod<T> | null;
  counterToIndex = 0;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(data: T): void {
    data.idToList = this.counterToIndex;
    this.counterToIndex++;
    const newNode = new Nod(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    if (this.tail !== null) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  remove(key: T): void {
    if (this.head === null) return;

    if (this.head.data === key) {
      this.head = this.head.next;
      if (this.head !== null) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      return;
    }

    let currentNode: Nod<T> | null = this.head;

    while (currentNode !== null && currentNode.data !== key) {
      currentNode = currentNode.next;
    }

    if (currentNode === null) return;

    if (currentNode.next !== null) {
      currentNode.next.prev = currentNode.prev;
    } else {
      this.tail = currentNode.prev;
    }

    if (currentNode.prev !== null) {
      currentNode.prev.next = currentNode.next;
    }
  }

  search(key: number): { data: T; nod: Nod<T> } | null {
    let currentNode = this.head;
    while (currentNode !== null) {
      if (currentNode.data.idToList === key) {
        return { data: currentNode.data, nod: currentNode };
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  travel(action: (data: T | null) => void): void {
    let currentNode = this.head;
    let result = "";
    while (currentNode !== null) {
      action(currentNode.data);
      result += JSON.stringify(currentNode.data, null, 2) + " <-> ";

      currentNode = currentNode.next;
    }
    result += "null";
    console.log(result);
  }

  travelReverse(action: (data: T | null) => void): void {
    let currentNode = this.tail;
    let result = "";
    while (currentNode !== null) {
      action(currentNode.data);
      result += currentNode.data + " <-> ";
      currentNode = currentNode.prev;
    }
    result += "null";
  }

  travelFrom(
    key: number,
    actionForward: (data: T | null) => void,
    actionBackwards: (data: T | null) => void
  ): void {
    let currentNode = this.search(key)?.nod ?? null;
    if (currentNode === null) {
      console.log("Node not found");
      return;
    }

    // Display forward from the found node
    let forwardResult = "";
    let tempNode: Nod<T> | null = currentNode;
    while (tempNode !== null) {
      actionForward(tempNode.data);
      forwardResult += JSON.stringify(tempNode.data, null, 2) + " <-> ";
      tempNode = tempNode.next;
    }
    forwardResult += "null";
    console.log("Forward: " + forwardResult);

    // Display backward from the found node
    let backwardResult = "";
    tempNode = currentNode;
    while (tempNode !== null) {
      actionBackwards(tempNode.data);
      backwardResult += JSON.stringify(tempNode.data, null, 2) + " <-> ";
      tempNode = tempNode.prev;
    }
    backwardResult += "null";
    console.log("Backward: " + backwardResult);
  }
}

// Exemplo de uso
// const dll = new DoublyLinkedList<number>();
// dll.append(1);
// dll.append(2);
// dll.append(3);
// dll.append(4);
// dll.append(5);
// dll.display();  // Output: 1 <-> 2 <-> 3 <-> 4 <-> 5 <-> null
// dll.displayReverse();  // Output: 5 <-> 4 <-> 3 <-> 2 <-> 1 <-> null
// dll.displayFrom(3);  // Output: Forward: 3 <-> 4 <-> 5 <-> null
//                     //         Backward: 3 <-> 2 <-> 1 <-> null
