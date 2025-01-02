const cube = document.querySelector('.cube');
let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

cube.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  currentX += deltaY * 0.1;
  currentY += deltaX * 0.1;

  cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
