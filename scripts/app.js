// Global selections
const colors = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const controlButtons = document.querySelectorAll('div.controls');
const generateBtnIcon = document.querySelector('button.generate span');
const sliderPanels = document.querySelectorAll('div.sliders');
const copyContainer = document.querySelector('.copy-container');
const copyPopup = document.querySelector('.copy-popup');

// Global Variables

// Functions
const generateHex = () => {
    let hex = chroma.random();
    return hex;
};

const generateColor = () => {
    let initialColors = [];
    colors.forEach((color) => {
        buttonDiv = color.childNodes[3].childNodes;

        const hex = generateHex();

        if (color.classList.contains('locked')) {
            initialColors.push(color.childNodes[1].innerText);
            return;
        } else {
            initialColors.push(chroma(hex).hex());
        }

        hexcode =
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

    bgColor = colors[index].attributes.hex.value;
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

    colorValue = chroma(bgColor).hsl();

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

    // pop-up animation
    copyContainer.classList.add('active');
    copyPopup.classList.add('active');
};

const closeCopy = () => {
    copyPopup.classList.remove('active');
    copyContainer.classList.remove('active');
};

const lockColor = (e) => {
    const div = e.target.parentElement.parentElement;
    div.classList.toggle('locked');

    const icon = e.target.children[0];
    icon.classList.toggle('fa-lock-open');
    icon.classList.toggle('fa-lock');
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

copyContainer.addEventListener('click', closeCopy);
