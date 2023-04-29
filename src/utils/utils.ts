type XYObject = {
  x: number;
  y: number;
};

// Function to calculate the distance between two objects with x and y properties
export function distanceBetweenObjects(obj1: XYObject, obj2: XYObject): number {
  const position1 = new Phaser.Math.Vector2(obj1.x, obj1.y);
  const position2 = new Phaser.Math.Vector2(obj2.x, obj2.y);

  return position1.distance(position2);
}