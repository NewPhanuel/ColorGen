import { libraryContainer } from './app.js';

const modal01 = (library) => {
    const libraryPopup = library.children[0];
    const palettesDiv = libraryPopup.children[2];
    if (palettesDiv.children[0].children.length === 0) {
        libraryPopup.children[1].innerText = 'You have no palette';
        palettesDiv.style.display = 'none';
    } else {
        palettesDiv.style.display = 'block';
        libraryPopup.children[1].innerText = 'Pick your palette';
    }
};

export const deletePalette = (e) => {
    const palette = e.target.parentElement;

    let localPalettes;
    let paletteNumber;

    localStorage.getItem('palettes') === null
        ? (localPalettes = [])
        : (localPalettes = JSON.parse(localStorage.getItem('palettes')));

    if (localPalettes !== null) {
        localPalettes.forEach((color) => {
            if (palette.children[0].innerText === color.name) {
                paletteNumber = localPalettes.indexOf(color);
            }
        });
    }

    localPalettes.splice(paletteNumber, 1);

    palette.style.opacity = '0';
    palette.style.display = 'none';
    palette.remove();

    localStorage.setItem('palettes', JSON.stringify(localPalettes));
    modal01(libraryContainer);
};
