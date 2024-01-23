const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreen = document.getElementById("fullScreen");
const fullScreenIcon = fullScreen.querySelector("i");
const videoControls = document.getElementById("videoControls");

let volumeValue;
let controlsMovementTimeout = null;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(15, 4);

const handlePlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
    volumeRange.value = volumeValue ? volumeValue : 1;
  } else {
    video.muted = true;
    volumeRange.value = 0;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
};

const handleVolumeChange = (event) => {
  video.muted = false;
  muteBtnIcon.classList = "fas fa-volume-up";
  const {
    target: { value },
  } = event;

  if (value == 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
  } else {
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  volumeValue = value;
  video.volume = value;
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = video.currentTime.toFixed(2);
};

const hadleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const handleMouseMove = () => {
  showControls();
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const hideControls = () => {
  videoControls.classList.remove("showing");
};
const showControls = () => {
  videoControls.classList.add("showing");
};

const handleKeyDown = (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    handlePlay();
  }
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", hadleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", hideControls);
video.addEventListener("click", handlePlay);
video.addEventListener("ended", handleEnded);
document.addEventListener("keydown", handleKeyDown);
