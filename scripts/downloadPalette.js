import { colorParent, downloadInput } from './app.js';

export const downloadPalette = () => {
    html2canvas(colorParent).then((canvas) => {
        const base64image = canvas.toDataURL('image/png');
        let anchor = document.createElement('a');
        anchor.setAttribute('href', base64image);
        anchor.setAttribute('download', `${downloadInput.value}.png`);
        downloadInput.value = '';
        anchor.click();
        anchor.remove();
    });
};
