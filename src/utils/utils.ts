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

export function createHiddenInput(callback: (ev: Event) => void) {
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.style.position = 'absolute';
  hiddenInput.style.top = '0';
  hiddenInput.style.left = '0';
  hiddenInput.style.opacity = '0.01';
  hiddenInput.style.pointerEvents = 'auto';
  hiddenInput.style.zIndex = '1000';
  hiddenInput.autocapitalize = 'off';
  hiddenInput.spellcheck = false;
  document.body.appendChild(hiddenInput);
  hiddenInput.focus();

  // Listen to input events on the hidden input element
  hiddenInput.addEventListener('input', callback);
}
