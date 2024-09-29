

export default function DownloadAsPng({ ro,h,svgData }) {

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = ro?.width; 
    canvas.height = h;

    context.fillStyle = 'white'; 
    context.fillRect(0, 0, canvas.width, canvas.height); 

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0);

      const pngDataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngDataUrl;
      downloadLink.download = 'Temporal Distribution - Observed On.png'; 
      downloadLink.click(); 

      URL.revokeObjectURL(url);
    };
    img.src = url;
}