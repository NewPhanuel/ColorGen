import { deletePalette } from './deletePalette.js';
import { selectPalette } from './selectPalette.js';
import { tinycolor } from './tinycolor.js';
import {
    getAnalogousPalette,
    getTriadicPalette,
    getSplitComplementPalette,
    getTetradicPalette,
    getCompoundPalette,
    getShadesPalette,
} from './myColorLib.js';

// Global selections
const colors = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const controlButtons = document.querySelectorAll('div.controls');
const sliderPanels = document.querySelectorAll('div.sliders');
const copyContainer = document.querySelector('.copy-container');
const copyPopup = document.querySelector('.copy-popup');
const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.submit-save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryBtn = document.querySelector('button.library');
const closeLibrary = document.querySelector('button.close-library');
const libraryContainer = document.querySelector('.library-container');
const palettesDiv = document.querySelector('.palettes');
const list = document.querySelector('.palette-list');
const colorType = document.querySelector('.colortype');
const downloadBtn = document.querySelector('.download');
const submitDownload = document.querySelector('.submit-download');
const closeDownload = document.querySelector('.close-download');
const downloadContainer = document.querySelector('.download-container');
const downloadInput = document.querySelector('.download-container input');

// Global Variables
let savedPalettes = [];

// Functions
const generateHex = () => {
    let typeNum;
    if (colorType.value !== '0') {
        typeNum = parseInt(colorType.value);
    } else {
        typeNum = parseInt(Math.ceil(Math.random() * 7));
    }

    let colorList = [];
    let preColor = [];
    const randColor = tinycolor.random().toHex();

    switch (typeNum) {
        case 1:
            colorList = getAnalogousPalette(chroma(randColor).hsl());
            break;
        case 2:
            preColor = tinycolor(randColor).monochromatic();
            preColor.map((color) => {
                colorList.push(color.toHexString());
            });
            break;
        case 3:
            colorList = getSplitComplementPalette(chroma(randColor).hsl());
            break;
        case 4:
            colorList = getTriadicPalette(chroma(randColor).hsl());
            break;
        case 5:
            colorList = getTetradicPalette(chroma(randColor).hsl());
            break;
        case 6:
            colorList = getCompoundPalette(chroma(randColor).hsl());
            break;
        case 7:
            colorList = getShadesPalette(chroma(randColor).hsl());
            break;
    }

    return colorList;
};

const generateColor = () => {
    let initialColors = [];
    const hex = generateHex();

    colors.forEach((color) => {
        const buttonDiv = color.childNodes[3].childNodes;

        if (color.classList.contains('locked')) {
            initialColors.push(color.childNodes[1].innerText);
            return;
        } else {
            initialColors.push(
                hex[color.querySelectorAll('input')[0].getAttribute('data-hue')]
            );
        }

        const hexcode =
            initialColors[
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
};

const checkTextContrast = (color, text, buttons) => {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = 'rgb(1, 3, 21)';
        buttons[1].style.color = 'rgb(1, 3, 21)';
        buttons[3].style.color = 'rgb(1, 3, 21)';
    } else {
        text.style.color = '#fff';
        buttons[1].style.color = '#fff';
        buttons[3].style.color = '#fff';
    }
};

const colorizeInput = (color, hue, brightness, saturation) => {
    // Scales
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);

    const noBrightness = color.set('hsl.l', 0);
    const fullBrightness = color.set('hsl.l', 1);
    const scaleBrightness = chroma.scale([noBrightness, color, fullBrightness]);

    const scaleHue = chroma.scale([
        'ff0000',
        'fcff00',
        '00ff00',
        '00f6ff',
        '0600ff',
        '0600ff',
        'ff0000',
    ]);

    //Update input
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat.colors(
        12
    )})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness.colors(
        12
    )})`;
    hue.style.backgroundImage = `linear-gradient(to right, ${scaleHue.colors(
        30
    )})`;
};

const hslControls = (e) => {
    const index =
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-hue') ||
        e.target.getAttribute('data-saturation');

    const sliders = e.target.parentElement.querySelectorAll(
        'input[type="range"]'
    );

    const colorDiv = e.target.parentElement.parentElement.children;

    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = colors[index].attributes.hex.value;
    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);

    colors[index].style.background = color;
    colors[index].children[0].innerText = color.hex();
    colorizeInput(color, hue, brightness, saturation);
    checkTextContrast(color, colorDiv[0], colorDiv[1].childNodes);
};

const resetInput = (e) => {
    const index =
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-hue') ||
        e.target.getAttribute('data-saturation');

    let bgColor = colors[index].attributes.hex.value;

    const sliders = e.target.parentElement.querySelectorAll(
        'input[type="range"]'
    );

    const colorDiv = e.target.parentElement.parentElement.children;

    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const colorValue = chroma(bgColor).hsl();

    if (e.target.name === 'hue') {
        e.target.value = colorValue[0];
    }

    if (e.target.name === 'saturation') {
        e.target.value = colorValue[1];
    }

    if (e.target.name === 'brightness') {
        e.target.value = colorValue[2];
    }

    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);

    colors[index].style.background = color;
    colorizeInput(color, hue, brightness, saturation);
    checkTextContrast(color, colorDiv[0], colorDiv[1].childNodes);
};

const openSliders = (e) => {
    e.target.parentElement.parentElement
        .querySelector('div.sliders')
        .classList.add('active');
};

const closeSliders = (e) => {
    e.target.parentElement.classList.remove('active');
};

const copyToClipboard = (hex) => {
    const el = document.createElement('textarea');
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // Pop-up animation
    copyContainer.classList.add('active');
    copyPopup.classList.add('active');
    setTimeout(() => {
        copyContainer.classList.remove('active');
        copyPopup.classList.remove('active');
    }, 1000);
};

const lockColor = (e) => {
    const div = e.target.parentElement.parentElement;
    div.classList.toggle('locked');

    const icon = e.target.children[0];
    icon.classList.toggle('fa-lock-open');
    icon.classList.toggle('fa-lock');
};

const loadPalettes = () => {
    let localPalettes;
    localStorage.getItem('palettes') === null
        ? (localPalettes = [])
        : (localPalettes = JSON.parse(localStorage.getItem('palettes')));

    if (localPalettes.length > 0) {
        localPalettes.forEach((palette) => {
            const childList = document.createElement('li');
            const paletteName = document.createElement('p');
            const paletteColors = document.createElement('div');
            const deleteBtn = document.createElement('button');
            const icon = document.createElement('i');

            icon.classList.add('fa-regular', 'fa-trash-can');
            deleteBtn.classList.add('delete-palette');
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.addEventListener('click', deletePalette);

            childList.classList.add('palette-list__child');
            paletteName.innerText = palette.name;
            paletteName.classList.add('palette-list__child-name');
            childList.setAttribute('paletteNumber', `${palette.paletteNumber}`);

            palette.colors.forEach((color) => {
                const palColor = document.createElement('div');
                palColor.classList.add(
                    `palette-color${palette.colors.indexOf(color)}`
                );
                palColor.classList.add('palette-col');
                palColor.style.background = color;
                paletteColors.appendChild(palColor);
            });

            deleteBtn.appendChild(icon);
            childList.appendChild(paletteName);
            childList.appendChild(paletteColors);
            childList.appendChild(deleteBtn);
            list.appendChild(childList);
        });

        palettesDiv.appendChild(list);
    }
};

const modal = (modal) => {
    const modalPopup = modal.children[0];
    if (!modal.classList.contains('active')) {
        modal.classList.add('active');
        modalPopup.classList.add('active');
        if (modal.classList.contains('library-container')) {
            const libraryPopup = libraryContainer.children[0];
            if (palettesDiv.children[0].children.length === 0) {
                libraryPopup.children[1].innerText = 'You have no palette';
                palettesDiv.style.display = 'none';
            } else {
                palettesDiv.style.display = 'block';
                libraryPopup.children[1].innerText = 'Pick your palette';
            }
        }
    } else {
        modal.classList.remove('active');
        modalPopup.classList.remove('active');
    }
};

const addPalette = (name, colors, paletteNumber) => {
    const childList = document.createElement('li');
    const paletteName = document.createElement('p');
    const paletteColors = document.createElement('div');
    const deleteBtn = document.createElement('button');
    const icon = document.createElement('i');

    childList.classList.add('palette-list__child');
    paletteName.innerText = name;
    paletteName.classList.add('palette-list__child-name');
    childList.setAttribute('paletteNumber', `${paletteNumber}`);

    icon.classList.add('fa-regular', 'fa-trash-can');
    deleteBtn.classList.add('delete-palette');
    deleteBtn.style.cursor = 'pointer';

    colors.forEach((color) => {
        const palColor = document.createElement('div');
        palColor.classList.add(`palette-color${colors.indexOf(color)}`);
        palColor.classList.add('palette-col');
        palColor.style.background = color;
        paletteColors.appendChild(palColor);
    });

    deleteBtn.addEventListener('click', deletePalette);
    paletteName.addEventListener('click', selectPalette);

    deleteBtn.appendChild(icon);
    childList.appendChild(paletteName);
    childList.appendChild(paletteColors);
    childList.appendChild(deleteBtn);
    list.appendChild(childList);
    palettesDiv.appendChild(list);
};

const savePalette = () => {
    const name = saveInput.value;
    saveInput.value = '';
    let colors = [];
    currentHexes.forEach((hex) => {
        colors.push(hex.innerText);
    });

    const paletteNumber = savedPalettes.length;
    const paletteObject = {
        name,
        colors,
        paletteNumber,
    };
    saveToLocal(paletteObject);
    savedPalettes.push(paletteObject);
    addPalette(name, colors, paletteNumber);
};

const saveToLocal = (paletteObject) => {
    let palettes;

    localStorage.getItem('palettes') === null
        ? (palettes = [])
        : (palettes = JSON.parse(localStorage.getItem('palettes')));

    palettes.push(paletteObject);
    localStorage.setItem('palettes', JSON.stringify(palettes));
};

const isTextField = (el) => {
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
};

const downloadPalette = () => {
    console.log('Not ready for now!');
};

// Statements
document.addEventListener('DOMContentLoaded', generateColor);
generateBtn.addEventListener('click', generateColor);

generateBtn.addEventListener('click', () => {
    generateBtn.childNodes[0].style.animation =
        'rotate 0.5s alternate ease-in-out';
});
generateBtn.addEventListener('animationend', () => {
    generateBtn.childNodes[0].style.animation = '';
});

sliders.forEach((slider) => {
    slider.addEventListener('input', hslControls);
    slider.addEventListener('dblclick', resetInput);
});

controlButtons.forEach((buttonDiv) => {
    buttonDiv.children[0].addEventListener('click', openSliders);
    buttonDiv.children[1].addEventListener('click', lockColor);
});

sliderPanels.forEach((sliderPanel) => {
    sliderPanel.children[0].addEventListener('click', closeSliders);
});

currentHexes.forEach((hex) => {
    hex.addEventListener('dblclick', () => {
        copyToClipboard(hex);
    });
});

// Implementing save to palette and localStorage
saveBtn.addEventListener('click', () => {
    modal(saveContainer);
});
closeSave.addEventListener('click', () => {
    modal(saveContainer);
});
submitSave.addEventListener('click', () => {
    if (
        saveInput.value.match(/[a-z]/g) ||
        saveInput.value.match(/[A-Z]/g) ||
        saveInput.value.match(/[0-9]/g)
    ) {
        if (saveInput.value.length >= 3) {
            savePalette();
            modal(saveContainer);
        } else {
            alert('Name must be up to 3 letters.');
        }
    } else {
        alert('Name must contain one letter or number.');
    }
});

downloadBtn.addEventListener('click', () => {
    modal(downloadContainer);
});
closeDownload.addEventListener('click', () => {
    modal(downloadContainer);
});
submitSave.addEventListener('click', () => {
    if (
        downloadInput.value.match(/[a-z]/g) ||
        downloadInput.value.match(/[A-Z]/g) ||
        downloadInput.value.match(/[0-9]/g)
    ) {
        if (downloadInput.value.length >= 3) {
            downloadPalette();
            modal(downloadContainer);
        } else {
            alert('Name must be up to 3 letters.');
        }
    } else {
        alert('Name must contain one letter or number.');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
    }
});

saveInput.addEventListener('keydown', (e) => {
    if (saveContainer.classList.contains('active')) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            savePalette();
            modal(saveContainer);
        }
    }
});

// Implementing library
libraryBtn.addEventListener('click', () => {
    modal(libraryContainer);
});
closeLibrary.addEventListener('click', () => {
    modal(libraryContainer);
});

document.addEventListener('DOMContentLoaded', loadPalettes);

document.addEventListener('DOMContentLoaded', () => {
    let listChild = list.querySelectorAll('.palette-list__child');

    listChild.forEach((child) => {
        const deleteButton = child.lastChild;
        deleteButton.addEventListener('click', deletePalette);
    });
});

// Space key
document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32 && !isTextField(e.target)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode === 32 && !isTextField(e.target)) {
        e.preventDefault();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
        if (
            !saveContainer.classList.contains('active') &&
            !libraryContainer.classList.contains('active')
        ) {
            generateColor();
            generateBtn.childNodes[0].style.animation =
                'rotate 0.5s alternate ease-in-out';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const paletteNames = document.querySelectorAll('.palette-list__child-name');

    paletteNames.forEach((paletteName) => {
        paletteName.addEventListener('click', selectPalette);
    });
});

export { modal, libraryContainer, colors, colorizeInput, checkTextContrast };
