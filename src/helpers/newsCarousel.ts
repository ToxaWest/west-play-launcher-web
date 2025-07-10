const newsCarousel = () => {
    const sliders: NodeListOf<HTMLElement> = document.querySelectorAll("[data-slider=\"true\"]")
    sliders.forEach(slider => {
        const slides = Array.from(slider.childNodes as NodeListOf<HTMLElement>);
        slider.style.height = slides[0].offsetHeight + 'px';
        slider.style.overflow = 'hidden';
        slider.innerHTML = ''
        slider.appendChild(slides[0])
        const sliderChild = slider.childNodes[0] as HTMLElement;
        sliderChild.style.opacity = '1';
        sliderChild.style.transition = 'opacity 1s ease-out';
        setTimeout(() => {
            sliderChild.style.opacity = '0';
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
            const sliderChild = slider.childNodes[0] as HTMLElement;
            sliderChild.style.opacity = '1';
            sliderChild.style.transition = 'opacity 1s ease-out';
            setTimeout(() => {
                sliderChild.style.opacity = '0';

            }, 2600)
        }, 3000)
    })
}

export default newsCarousel