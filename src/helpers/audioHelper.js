const audioHelper = ({audioRef, src, audioVolume, canvasRef}) => {
    if (!src) {
        return
    }

    audioRef.src = src
    audioRef.loop = true;
    audioRef.volume = audioVolume;

    audioRef.play().then(() => {
        var context = new AudioContext();
        var src = context.createMediaElementSource(audioRef);
        var analyser = context.createAnalyser();

        var canvas = canvasRef.current;
        console.log(canvasRef)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                ctx.fillStyle = getComputedStyle(document.querySelector(':root')).getPropertyValue('--theme-text-color');
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        renderFrame();
    })
}

export default audioHelper;