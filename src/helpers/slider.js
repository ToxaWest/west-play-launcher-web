const slider = () => {
    const sliders = document.querySelectorAll("[data-slider=\"true\"]")
    sliders.forEach(slider => {
        const slides = [...slider.childNodes]
        slider.style.height = slides[0].offsetHeight + 'px';
        slider.style.overflow = 'hidden';
        slider.innerHTML = ''
        slider.appendChild(slides[0])
        slider.childNodes[0].style.opacity = '1';
        slider.childNodes[0].style.transition = 'opacity 1s ease-out';
        setTimeout(() => {
            slider.childNodes[0].style.opacity = '0';
        }, 2600)
        let current = 0;
        setInterval(() => {
            slider.innerHTML = ''
            if (slides[current + 1]) {
                slider.appendChild(slides[current + 1])
                current++
            } else {
                slider.appendChild(slides[0])
                current = 0
            }
            slider.childNodes[0].style.opacity = '1';
            slider.childNodes[0].style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                slider.childNodes[0].style.opacity = '0';

            }, 2600)
        }, 3000)
    })
}

export default slider