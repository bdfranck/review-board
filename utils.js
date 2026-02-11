// Utility functions shared between app.js and app-demo.js

// Calculate text color (dark or light) based on background color brightness
function getTextColorForBackground(hexColor) {
    const color = parseInt(hexColor, 16);
    const r = (color >> 16) & 255;
    const g = (color >> 8) & 255;
    const b = color & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#172b4d' : '#fff';
}
