
const player = document.querySelector("#player"),
    video = player.querySelector("#video"),
    playPause = player.querySelector("#play-pause"),
    skipForward = player.querySelector("#skip-forward"),
    skipBackward = player.querySelector("#skip-backward");


let isPlaying = false;
playPause.addEventListener("click", () => {

    if (!isPlaying) {
        playPause.classList.replace("fa-play", "fa-pause");
        video.play();
        isPlaying = true;
    }
    else {
        playPause.classList.replace("fa-pause", "fa-play");
        video.pause();
        isPlaying = false;
    }

});

skipForward.addEventListener("click", () => {
    video.currentTime += 20;
});

skipBackward.addEventListener("click", () => {
    video.currentTime -= 20;
});

video.addEventListener("ended", () => {
    playPause.classList.replace("fa-pause", "fa-play");
});

const mute = player.querySelector("#mute"),
    volumeRange = player.querySelector("#volume-range");

function setVolumeIcon() {

    let icon = "fa-volume-high";
    if (video.muted || video.volume === 0)
        icon = "fa-volume-xmark";
    else if (video.volume < .5)
        icon = "fa-volume-low";

    mute.className = mute.className.replace(/fa-volume-(xmark|high|low)/, icon);
}

mute.addEventListener("click", () => {

    if (!video.muted)
        video.muted = true;
    else
        video.muted = false;

    setVolumeIcon();

});

volumeRange.addEventListener("input", () => {
    video.volume = volumeRange.value;
    video.muted = false;
    setVolumeIcon();
});

const videoTime = player.querySelector("#time"),
    videoDuration = player.querySelector("#duration"),
    progressBar = player.querySelector("#progress-bar"),
    progress = progressBar.querySelector("#progress");

function getTimeFormat(totalSeconds) {

    let s = Math.floor(totalSeconds) % 60;
    let m = Math.floor(totalSeconds / 60) % 60;
    let h = Math.floor(totalSeconds / 60 / 60);

    s = s < 10 ? "0" + s : s;
    m = m < 10 ? "0" + m : m;
    h = h < 10 ? "0" + h : h;

    return `${h}:${m}:${s}`;
}

video.addEventListener("loadeddata", () => {
    videoDuration.textContent = getTimeFormat(video.duration);
});

video.addEventListener("timeupdate", () => {
    videoTime.textContent = getTimeFormat(video.currentTime);
    progress.style.width = video.currentTime / video.duration * 100 + "%";
});

let isDragging = false;
let clientXStart = 0;
let progressWidthStart = 0;

progressBar.addEventListener("mousedown", e => {
    video.currentTime = e.offsetX / progressBar.clientWidth * video.duration;
    clientXStart = e.clientX;
    progressWidthStart = e.offsetX;
    isDragging = true;
});

window.addEventListener("mouseup", () => {
    isDragging = false;

});

window.addEventListener("mousemove", e => {
    if (isDragging) {
        let movedDistance = e.clientX - clientXStart;
        let widthRatio = (progressWidthStart + movedDistance) / progressBar.clientWidth;
        if (widthRatio <= 1 && widthRatio >= 0) {
            video.currentTime = widthRatio * video.duration;
            videoTime.textContent = getTimeFormat(video.currentTime);
            progress.style.width = widthRatio * 100 + "%";
        }
    }
});

const maximizeMinimize = player.querySelector("#maximize-minimize"),
    pictureInPicture = player.querySelector("#picture-in-picture"),
    speed = player.querySelector("#speed"),
    speedOptions = player.querySelector("#speed-options");

function handleMinimizeMaximize() {
    if (document.fullscreenElement === null) {
        maximizeMinimize.classList.replace("fa-expand", "fa-compress");
        player.requestFullscreen();
    }
    else {
        maximizeMinimize.classList.replace("fa-compress", "fa-expand");
        document.exitFullscreen();
    }
}

maximizeMinimize.addEventListener("click", handleMinimizeMaximize);
video.addEventListener("dblclick", handleMinimizeMaximize);

pictureInPicture.addEventListener("click", () => {
    video.requestPictureInPicture();
});

speed.addEventListener("click", e => {
    speedOptions.classList.toggle("active");
});

[...speedOptions.children].forEach(option => {
    option.addEventListener("click", () => {
        option.classList.add("active");
        video.playbackRate = +option.getAttribute("speed");

        [...speedOptions.children].forEach(opt => {
            if (option != opt)
                opt.classList.remove("active");
        });
    });
});

const controls = player.querySelector("#controls");

video.addEventListener("click", () => {
    controls.classList.toggle("hide");
});