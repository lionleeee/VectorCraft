export const calculatePolygonPoints = (
  centerX: number,
  centerY: number,
  radius: number,
  sides: number
): string => {
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2; // -90도에서 시작
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
};
