let currentFrame = 1;
let direction = 1;
const delay = 50;
const allFrames = Array.from(document.getElementsByTagName("g"));

for (let i = 1; i < allFrames.length; i++) {
	allFrames[i].style.display = "none";
}
function animateFrames() {
	if (currentFrame > 0 && currentFrame < allFrames.length) {
		allFrames[currentFrame].style.display = "inline";
		allFrames[currentFrame - direction].style.display = "none";
	}

	if (currentFrame === allFrames.length - 1 || currentFrame === 0) {
		direction *= -1;
	}

	currentFrame += direction;
	setTimeout(animateFrames, delay);
	// requestAnimationFrame(animateFrames);
}

animateFrames();
