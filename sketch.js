let audio, amp, fft

// Set the default to grayscale
let isGrayscale = true;

// Sphere to box logic
let isSphere = true;

let isPressed = false

let myShader 

// rotate sphere
let angle = 0.0
let jitter = 0.0

// slider for volume control
var slider;

// What loads on default. 
function preload() {
  audio = loadSound('audio/UNDER YOUR SPELL.mp3');
  myShader = loadShader('shader/vertex.vert', 'shader/fragment.frag');
  
  if (!myShader.isLoaded()) {
    console.error("Shader failed to load.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)

  // Control volume so it doesn's start so loud
  slider = createSlider(0, 1, 0.2, 0.2);
  slider.position(10, 210);

  // Create file input for audio upload
  let audioUpload = createFileInput(handleFile);
  audioUpload.attribute("accept", "audio/mp3");
  audioUpload.position(10, 10);
  audioUpload.style("opacity", "0");

  // Instead use a nicer looking button
  let customButton = createButton("Upload MP3");
  styleButton(customButton, 10, 10);

  let playback = createButton("Play/Pause");
  styleButton(playback, 10, 60);

  let colorScheme = createButton("Toggle Color Scheme");
  styleButton(colorScheme, 10, 110);

  let shape = createButton("Toggle Shape");
  styleButton(shape, 10, 160);

  // Allow play/pause button to function
  playback.mousePressed(togglePlayback)

  // Color Scheme change button
  colorScheme.mousePressed(toggleColorScheme)

  // toggle shape from sphere to box
  shape.mousePressed(toggleShape)

  shader(myShader)
  userStartAudio()

  amp = new p5.Amplitude()
  fft = new p5.FFT()

  customButton.mousePressed(() => audioUpload.elt.click());
}

function draw() {
  myShader.setUniform('uColorMode', isGrayscale ? 1.0 : 0.0);

  if (isGrayscale == false) {
    colored();
  } else {
    noColor();
  }

  audio.setVolume(slider.value());
}

function colored() {
  background('#a683c9') 
  
  drawingContext.filter = 'blur(px)'

  fft.analyze()

  const volume = amp.getLevel()
  let freq = fft.getCentroid()
  
  freq *= 0.001
  
  if (second() % 2 == 0) {
    jitter = random(0, 0.1)
    jitter += jitter
  }

  angle = angle + jitter

  // this is rotating the sphere - remove to make it still
  rotateX(sin(freq) + angle * 0.1)
  rotateY(cos(volume) + angle * 0.1)

  const mapF = map(freq, 0, 1, 0, 20)
  const mapV = map(volume, 0, 0.2, 0, 0.5)

  myShader.setUniform('uTime', frameCount)

  myShader.setUniform('uFreq', mapF)
  myShader.setUniform('uAmp', mapV)

  if (isSphere == true) {
    sphere(200, 400, 400)
  }
  else if (isSphere == false) {
    box(200)
  }
}

function noColor() {
  background('#434345') 
  
  drawingContext.filter = 'blur(px)'

  fft.analyze()

  const volume = amp.getLevel()
  let freq = fft.getCentroid()
  
  freq *= 0.001
  
  if (second() % 2 == 0) {
    jitter = random(0, 0.1)
    jitter += jitter
  }

  angle = angle + jitter

  rotateX(sin(freq) + angle * 0.1)
  rotateY(cos(volume) + angle * 0.1)

  const mapF = map(freq, 0, 1, 0, 20)
  const mapV = map(volume, 0, 0.2, 0, 0.5)

  myShader.setUniform('uTime', frameCount)

  myShader.setUniform('uFreq', mapF)
  myShader.setUniform('uAmp', mapV)

  if (isSphere == true) {
    sphere(200, 400, 400)
  }
  else if (isSphere == false) {
    box(200)
  }
}

function keyPressed() {
  if (key == 'g' || key == 'G') {
    isGrayscale = true;
  }
  else if (key == 'c' || key == 'C') {
    isGrayscale = false;
  }
  if (key == 'p' || key == 'P') {
    if (audio && audio.isPlaying()) {
      audio.pause();
      isPressed = false;
    } else if (audio) {
      audio.loop();
      isPressed = true;
    }
  }
  if (key == 's' || key == 'S') {
    isSphere = true;
  }
  else if (key == 'r' || key == 'R') {
    noStroke()
    isSphere = false;
  }
}

function styleButton(button, x, y) {
  button.position(x, y);
  button.style("background-color", "transparent");
  button.style("padding", "10px 10px");
  button.style("font-size", "16px"); 
  button.style("border", "2px solid #000000");
  button.style("border-radius", "15px");
  button.style("cursor", "pointer");
}

function togglePlayback() {
  if (audio && audio.isPlaying()) {
    audio.pause();
    isPressed = false;
  } else if (audio) {
    audio.loop();
    isPressed = true;
  }
}

function toggleColorScheme() {
  isGrayscale = !isGrayscale
}

function toggleShape() {
  isSphere = !isSphere;
}

function handleFile(file) {
  if (file.type === 'audio') {
    // Stop the preloaded audio if it's playing
    if (audio && audio.isPlaying()) {
      audio.stop();
    }

    // Load the new audio file
    audio = loadSound(file.data, () => {
      audio.loop(); // Play the uploaded audio in a loop
    });

    isPressed = true; // Set the isPressed flag to true since audio is now playing
  } else {
    console.error("Please upload a valid MP3 file.");
  }
}
