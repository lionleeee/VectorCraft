/**
 * SVG는 벡터 기반 형식: 수학적 공식과 좌표로 이미지를 정의
 * PNG는 래스터 기반 형식: 픽셀의 격자로 이미지를 정의
 * 벡터 -> 레스터 이미지로 변환 과정
 * 1. 벡터 이미지를 데이터 URL로 변환
 * 2. 데이터 URL을 Blob으로 변환
 * 3. Blob을 이미지로 변환
 * 4. 이미지 캔버스에 그리기
 * 5. 캔버스 이미지로 변환
 * 6. 이미지 다운로드
 */
export const exportToPng = (element: HTMLDivElement) => {
  const svgData = new XMLSerializer().serializeToString(
    element.querySelector("svg")!
  );
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  //1. 캔버스 생성
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();

  //2. 이미지 로드 후 캔버스에 그리기
  img.onload = () => {
    canvas.width = element.clientWidth;
    canvas.height = element.clientHeight;

    //3. 배경색 적용
    ctx.fillStyle = getComputedStyle(element).backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //4. 이미지 그리기
    ctx.drawImage(img, 0, 0);

    // 다운로드
    const link = document.createElement("a");
    link.download = "vectorcraft.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    // 메모리 정리
    URL.revokeObjectURL(url);
  };

  img.src = url;
};
