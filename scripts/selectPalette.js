import { colors, libraryContainer } from './app.js';
import { colorizeInput, checkTextContrast, modal } from './app.js';

export const selectPalette = (e) => {
    let paletteColors = [];
    let specifiedColors = [];

    localStorage.getItem('palettes') === null
        ? (paletteColors = [])
        : (paletteColors = JSON.parse(localStorage.getItem('palettes')));

    paletteColors.forEach((palette) => {
        if (e.target.innerText === palette.name) {
            specifiedColors = [...palette.colors];
        }
    });

    colors.forEach((color) => {
        const buttonDiv = color.childNodes[3].childNodes;
        const hexcode =
            specifiedColors[
                color.querySelectorAll('input')[0].getAttribute('data-hue')
            ];

        color.style.background = hexcode;
        color.childNodes[1].innerText = hexcode;
        color.style.transition = '0.5s';
        checkTextContrast(hexcode, color.childNodes[1], buttonDiv);

        color.setAttribute('hex', `${hexcode}`);

        const hexColor = chroma(hexcode);
        const inputSliders = color.querySelectorAll('.sliders input');
        const hue = inputSliders[0];
        const brightness = inputSliders[1];
        const saturation = inputSliders[2];

        const colorPositions = chroma(hexcode).hsl();

        brightness.value = colorPositions[2];
        hue.value = colorPositions[0];
        saturation.value = colorPositions[1];

        colorizeInput(hexColor, hue, brightness, saturation);
    });

    modal(libraryContainer);
};
