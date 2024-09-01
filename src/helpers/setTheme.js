const setTheme = (main = {r: 26, g: 27, b: 30}) => {

    const isDark = (((main.r * 299) + (main.g * 587) + (main.b * 114)) / 1000) < 65;

    console.log(isDark)

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
        ...text(isDark),
        ...getButtons(isDark)
    }
}

export default setTheme