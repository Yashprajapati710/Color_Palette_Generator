const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");
const themeToggle = document.getElementById("theme-toggle");
const colorFormat = document.getElementById("color-format");

const colorBoxes = document.querySelectorAll(".color-box");

let lockedColors = [false, false, false, false, false];

generateBtn.addEventListener("click", generatePalette);

colorFormat.addEventListener("change", function () {
  updateColorFormats();
});

paletteContainer.addEventListener("click", function (e) {
  const colorBox = e.target.closest(".color-box");

  if (!colorBox) {
    return;
  }

  const index = Array.from(colorBoxes).indexOf(colorBox);

  if (e.target.classList.contains("copy-btn")) {
    const colorValue =
      e.target.parentElement.previousElementSibling.textContent;

    navigator.clipboard
      .writeText(colorValue)
      .then(() => showCopySuccess(e.target))
      .catch((err) => console.log(err));
  }

  else if (e.target.classList.contains("color")) {
    const colorValue =
      e.target.nextElementSibling.querySelector(".hex-value").textContent;

    navigator.clipboard
      .writeText(colorValue)
      .then(() =>
        showCopySuccess(
          e.target.nextElementSibling.querySelector(".copy-btn")
        )
      )
      .catch((err) => console.log(err));
  }

  else if (e.target.classList.contains("lock-btn")) {
    toggleLock(index, e.target);
  }
});

function toggleLock(index, lockButton) {
  lockedColors[index] = !lockedColors[index];

  if (lockedColors[index]) {
    lockButton.classList.remove("fa-lock");
    lockButton.classList.add("fa-lock-open");
    lockButton.classList.add("locked");
    lockButton.title = "Unlock color";
  } else {
    lockButton.classList.remove("fa-lock-open");
    lockButton.classList.add("fa-lock");
    lockButton.classList.remove("locked");
    lockButton.title = "Lock color";
  }
}

function showCopySuccess(element) {
  element.classList.remove("far", "fa-copy");
  element.classList.add("fas", "fa-check");

  element.style.color = "#48bb78";

  setTimeout(() => {
    element.classList.remove("fas", "fa-check");
    element.classList.add("far", "fa-copy");
    element.style.color = "";
  }, 1500);
}

function generatePalette() {
  colorBoxes.forEach((box, index) => {
    if (lockedColors[index]) {
      return;
    }

    const newColor = generateRandomColor();

    const colorDiv = box.querySelector(".color");

    colorDiv.style.backgroundColor = newColor;
  });

  updateColorFormats();
}

function generateRandomColor() {
  const letters = "0123456789ABCDEF";

  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function updateColorFormats() {
  const selectedFormat = colorFormat.value;

  colorBoxes.forEach((box) => {
    const colorDiv = box.querySelector(".color");
    const colorValue = box.querySelector(".hex-value");

    const hexColor = rgbToHex(
      getComputedStyle(colorDiv).backgroundColor
    );

    let formattedColor;

    if (selectedFormat === "hex") {
      formattedColor = hexColor;
    }

    else if (selectedFormat === "rgb") {
      formattedColor = hexToRgb(hexColor);
    }

    else if (selectedFormat === "hsl") {
      formattedColor = hexToHsl(hexColor);
    }

    colorValue.textContent = formattedColor;
  });
}

function rgbToHex(rgb) {
  const values = rgb.match(/\d+/g);

  if (!values) {
    return "#000000";
  }

  const r = Number(values[0]);
  const g = Number(values[1]);
  const b = Number(values[2]);

  return (
    "#" +
    [r, g, b]
      .map((value) =>
        value.toString(16).padStart(2, "0")
      )
      .join("")
      .toUpperCase()
  );
}

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;
  let s;

  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  }

  else {
    const difference = max - min;

    s =
      l > 0.5
        ? difference / (2 - max - min)
        : difference / (max + min);

    switch (max) {
      case r:
        h =
          ((g - b) / difference +
            (g < b ? 6 : 0)) /
          6;
        break;

      case g:
        h =
          ((b - r) / difference + 2) /
          6;
        break;

      case b:
        h =
          ((r - g) / difference + 4) /
          6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);

  const lightness = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${lightness}%)`;
}

/* DARK MODE */

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark");

    themeToggle.innerHTML =
      '<i class="fas fa-sun"></i>';

    themeToggle.title = "Switch to light mode";
  }

  else {
    document.body.classList.remove("dark");

    themeToggle.innerHTML =
      '<i class="fas fa-moon"></i>';

    themeToggle.title = "Switch to dark mode";
  }
}

themeToggle.addEventListener("click", function () {
  const isDark =
    document.body.classList.toggle("dark");

  localStorage.setItem("darkMode", isDark);

  setTheme(isDark);
});

const savedTheme =
  localStorage.getItem("darkMode") === "true";

setTheme(savedTheme);