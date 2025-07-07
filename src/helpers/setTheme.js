function sRGBtoLinear(colorValue) {
    colorValue /= 255;
    return colorValue <= 0.03928 ? colorValue / 12.92 : Math.pow((colorValue + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(r, g, b) {
    const R = sRGBtoLinear(r);
    const G = sRGBtoLinear(g);
    const B = sRGBtoLinear(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(L1, L2) {
    return (L1 + 0.05) / (L2 + 0.05);
}

function adjustColorForContrast(backgroundColor) {
    let [fr, fg, fb] = [0, 104, 0]; // Assuming array [r,g,b]
    let [br, bg, bb] = backgroundColor;

    let Lf = getRelativeLuminance(fr, fg, fb);
    let Lb = getRelativeLuminance(br, bg, bb);

    let contrastRatio = calculateContrastRatio(Math.max(Lf, Lb), Math.min(Lf, Lb));
    const targetRatio = 3;

    let currContrast;


    while (contrastRatio < targetRatio) {
        fr = Math.min(255, fr + 5);
        fg = Math.min(255, fg + 5);
        fb = Math.min(255, fb + 5);

        Lf = getRelativeLuminance(fr, fg, fb);
        contrastRatio = calculateContrastRatio(Math.max(Lf, Lb), Math.min(Lf, Lb));
        if(contrastRatio === currContrast) {
            break;
        }
        currContrast = contrastRatio;
    }

    return `rgb(${fr}, ${fg}, ${fb})`; // Return the adjusted foreground color
}

const setTheme = (main = {r: 26, g: 27, b: 30}) => {

    const _dark = ((main.r * 99) + (main.g * 487) + (main.b * 114)) / 1000
    const isDark = _dark < 60;

    const getSecondary = (isDark) => {
        if (isDark) {
            return `rgb(${main.r + 19}, ${main.g + 21}, ${main.b + 24})`;
        }
        return `rgb(${main.r - 19}, ${main.g - 21}, ${main.b - 24})`;
    }

    const getButtons = (isDark) => {
        if (isDark) {
            return {
                '--button-bg-color': `rgb(${46 + main.r}, ${51 + main.g}, ${58 + main.b})`,
                '--button-bg-color-hover': `rgb(${main.r + 81}, ${main.g + 90}, ${main.b + 102})`
            }
        }
        return {
            '--button-bg-color': `rgb(${main.r - 46}, ${main.g - 51}, ${main.b - 58})`,
            '--button-bg-color-hover': `rgb(${main.r - 81}, ${main.g - 90}, ${main.b - 102})`
        }
    }

    const text = (isDark) => {
        if (isDark) {
            return {
                '--theme-text-color': `rgb(255, 255, 255)`,
                '--theme-text-color-seconary': `rgba(255, 255, 255, 0.65)`
            }
        }
        return {
            '--theme-text-color': `rgb(26, 27, 30)`,
            '--theme-text-color-seconary': `rgba(26, 27, 30, 0.65)`
        }
    }
    return {
        '--theme-color': `rgb(${main.r}, ${main.g}, ${main.b})`,
        '--theme-color-transparent': `rgb(${main.r}, ${main.g}, ${main.b}, 0.5)`,
        '--theme-secondary': getSecondary(isDark),
        '--earned-color': adjustColorForContrast([main.r, main.g, main.b]),
        ...text(isDark),
        ...getButtons(isDark)
    }
}

export default setTheme