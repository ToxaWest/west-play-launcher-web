const resizeAchievements = (src) => new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const img = new Image(96, 96);
    img.onload = () => {
        canvas.height = canvas.width * (img.height / img.width);
        const oc = document.createElement('canvas'),
            octx = oc.getContext('2d');
        oc.width = 96;
        oc.height = 96;
        octx.drawImage(img, 0, 0, oc.width, oc.height);
        octx.drawImage(oc, 0, 0, 96, 96);
        ctx.drawImage(oc, 0, 0, 96, 96,
            0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
    }
    img.src = src;
})

export default resizeAchievements;