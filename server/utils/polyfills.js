import pkg from "canvas";
const { DOMMatrix, createCanvas } = pkg;

// Provide browser-like API for PDF.js
global.DOMMatrix = DOMMatrix;
global.DOMMatrixReadOnly = DOMMatrix;

// We don't need DOMPoint and DOMRect as they're not available in the canvas package
// Instead, we can create simple polyfills if needed
global.DOMPoint = class DOMPoint {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
};

global.DOMRect = class DOMRect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
};

// Console message to confirm polyfills are loaded
console.log("Browser API polyfills loaded successfully");
