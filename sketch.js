let audio, amp, fft

let isGrayscale = true;

let isPressed = false

let myShader 

let angle = 0.0
let jitter = 0.0

function preload() {
  audio = loadSound('audio/TIMELESS.mp3');
  myShader = loadShader('shader/vertex.vert', 'shader/fragment.frag');
  
  if (!myShader.isLoaded()) {
    console.error("Shader failed to load.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)

  // Create file input for audio upload
  let audioUpload = createFileInput(handleFile);
  audioUpload.attribute("accept", "audio/mp3");
  audioUpload.position(10, 10);
  audioUpload.style("opacity", "0");
  audioUpload.size(0, 0); // Hide crummy default file input prompt

  // Instead use a nicer looking button
  let customButton = createButton("Upload MP3");
  customButton.position(10, 10); 
  customButton.style("padding", "10px 10px");
  customButton.style("font-size", "16px");
  customButton.style("border", "2px solid #000000");
  customButton.style("border-radius", "15px");
  customButton.style("cursor", "pointer");
  customButton.mouseOver(() => {
    customButton.style("background-color", "#FFFFFF");
    customButton.style("color", "#000000");
  });
  customButton.mouseOut(() => {
    customButton.style("background-color", "transparent");
    customButton.style("color", "#000000");
  });

  let playback = createButton("Play/Pause");
  playback.position(10, 70);
  playback.style("padding", "10px 10px");
  playback.style("font-size", "16px");
  playback.style("border", "2px solid #000000");
  playback.style("border-radius", "15px");
  playback.style("cursor", "pointer");
  playback.mouseOver(() => {
    playback.style("background-color", "#FFFFFF");
    playback.style("color", "#000000");
  });
  playback.mouseOut(() => {
    playback.style("background-color", "transparent");
    playback.style("color", "#000000");
  });

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

  rotateX(sin(freq) + angle * 0.1)
  rotateY(cos(volume) + angle * 0.1)

  const mapF = map(freq, 0, 1, 0, 20)
  const mapV = map(volume, 0, 0.2, 0, 0.5)

  myShader.setUniform('uTime', frameCount)

  myShader.setUniform('uFreq', mapF)
  myShader.setUniform('uAmp', mapV)

  
  sphere(200, 400, 400)
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

  
  sphere(200, 400, 400)
}

function keyPressed() {
  if (key == 'g' || key == 'G') {
    isGrayscale = true;
  }
  else if (key == 'c' || key == 'C') {
    isGrayscale = false;
  }
  if (key == 'p' || key == 'P') {
    if (isPressed) {
      audio.pause()
      isPressed = false
    }
    else {
      isPressed = true
      audio.loop()
    }
  }
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
