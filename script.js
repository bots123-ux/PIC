// script.js
const video = document.getElementById('video');
const startButton = document.getElementById('start');
const countdownDisplay = document.getElementById('countdownDisplay');
const photosContainer = document.getElementById('photos');
const heartButton = document.getElementById('heartButton');
const collageContainer = document.getElementById('collage');
const collagePhotosContainer = document.getElementById('collagePhotos');
const saveButton = document.getElementById('saveButton');

let capturedPhotos = []; // Array to store captured photos

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // Correct method
        video.srcObject = stream;
    } catch (error) {
        console.error("Error accessing the camera: ", error);
    }
}

function takePhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    photosContainer.appendChild(img);
    capturedPhotos.push(img.src); // Store captured photo in array
}

function countdownAndTakePhoto(shotsTaken) {
    let count = 3;
    countdownDisplay.textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        countdownDisplay.textContent = count > 0 ? count : "Smile babi!";
        if (count < 0) {
            clearInterval(countdownInterval);
            takePhoto();
            countdownDisplay.textContent = "";
            shotsTaken++;
            if (shotsTaken < 6) {
                setTimeout(() => countdownAndTakePhoto(shotsTaken), 3000); // Wait 3 seconds before next photo
            } else {
                showHeartButton();
            }
        }
    }, 1000);
}

function showHeartButton() {
    heartButton.style.display = 'block';
}

function createCollage() {
    collagePhotosContainer.innerHTML = ''; // Clear any existing photos
    capturedPhotos.forEach(photoSrc => {
        const img = document.createElement('img');
        img.src = photoSrc;
        collagePhotosContainer.appendChild(img);
    });
    collageContainer.style.display = 'flex';
    video.style.display = 'none'; // Hide the video element
    photosContainer.style.display = 'none'; // Hide the photos container
    heartButton.style.display = 'none'; // Hide the heart button
    startButton.style.display = 'none'; // Hide the start button
    saveButton.style.display = 'block'; // Show the save button
}

function saveCollage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const collageImages = collagePhotosContainer.querySelectorAll('img');
    const collageWidth = collagePhotosContainer.clientWidth;
    const collageHeight = collagePhotosContainer.clientHeight;

    canvas.width = collageWidth;
    canvas.height = collageHeight;

    collageImages.forEach((img, index) => {
        const x = (index % 3) * (collageWidth / 3);
        const y = Math.floor(index / 3) * (collageHeight / 2);
        context.drawImage(img, x, y, collageWidth / 3, collageHeight / 2);
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'collage.png';
    link.click();
}

// Event listeners
startButton.addEventListener('click', () => {
    startCamera();
    countdownAndTakePhoto(0);
});

heartButton.addEventListener('click', createCollage);
saveButton.addEventListener('click', saveCollage);