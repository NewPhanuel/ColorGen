import { tinycolor } from './tinycolor.js';

export const getAnalogousPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    for (let i = 0; i < count; i++) {
        let newHue = hue + 30 * i;

        if (newHue > 360) newHue -= 360;

        let hex = chroma.hsl(newHue, saturation, lightness).hex();
        palette.push(hex);
    }

    return palette;
};

export const getTriadicPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    for (let i = 0; i < count; i++) {
        let newHue = hue + 120 * i;

        if (newHue > 360) newHue -= 360;

        let hex = chroma.hsl(newHue, saturation, lightness).hex();
        palette.push(hex);
    }

    return palette;
};

export const getSplitComplementPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    const complementHue = (hue + 180) % 360;
    const hueIncrement = 60;

    for (let i = 0; i < count; i++) {
        let newHue = complementHue + hueIncrement * i;

        if (newHue > 360) newHue -= 360;

        let hex = chroma.hsl(newHue, saturation, lightness).hex();
        palette.push(hex);
    }

    return palette;
};

export const getTetradicPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    for (let i = 0; i < count; i++) {
        let newHue = hue + 90 * i;

        if (newHue > 360) newHue -= 360;

        let hex = chroma.hsl(newHue, saturation, lightness).hex();
        palette.push(hex);
    }

    return palette;
};

export const getCompoundPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    for (let i = 0; i < count; i++) {
        let newHue = hue + 150 * i;

        if (newHue > 360) newHue -= 360;

        let hex = chroma.hsl(newHue, saturation, lightness).hex();
        palette.push(hex);
    }

    return palette;
};

export const getShadesPalette = (hsl, count = 6) => {
    const palette = [];
    let [hue, saturation, lightness] = hsl;
    hue = Math.round(hue);
    saturation = parseFloat(saturation.toFixed(1));
    lightness = parseFloat(lightness.toFixed(1));

    if (saturation > 0.4) saturation = 0.4;

    let sortSaturation = [];

    for (let i = 0; i < count; i++) {
        let newSaturation = (saturation * 100 + 10 * i) / 100;

        if (newSaturation > 1) newSaturation -= 1;

        sortSaturation.push({ hue, newSaturation, lightness });
    }

    sortSaturation.sort((a, b) =>
        a.newSaturation > b.newSaturation
            ? 1
            : a.newSaturation < b.newSaturation
            ? -1
            : 0
    );

    sortSaturation.map((color) =>
        palette.push(
            chroma.hsl(color.hue, color.newSaturation, color.lightness).hex()
        )
    );

    return palette;
};
