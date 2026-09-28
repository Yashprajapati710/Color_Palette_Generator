const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");
const themeToggle = document.getElementById("theme-toggle");

const colorBoxes = document.querySelectorAll(".color-box");

let lockedColors = [false, false, false, false, false];

generateBtn.addEventListener("click", generatePalette);

paletteContainer.addEventListener("click", function (e) {
  const colorBox = e.target.closest(".color-box");

  if (!colorBox) {
    return;
  }

  const index = Array.from(colorBoxes).indexOf(colorBox);

  if (e.target.classList.contains("copy-btn")) {
    const hexValue =
      e.target.parentElement.previousElementSibling.textContent;

    navigator.clipboard
      .writeText(hexValue)
      .then(() => showCopySuccess(e.target))
      .catch((err) => console.log(err));
  }

  else if (e.target.classList.contains("color")) {
    const hexValue =
      e.target.nextElementSibling.querySelector(".hex-value").textContent;

    navigator.clipboard
      .writeText(hexValue)
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
  const colors = [];

  colorBoxes.forEach((box, index) => {
    const hexValue = box.querySelector(".hex-value").textContent;

    if (lockedColors[index]) {
      colors.push(hexValue);
    } else {
      colors.push(generateRandomColor());
    }
  });

  updatePaletteDisplay(colors);
}


function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}


function updatePaletteDisplay(colors) {
  colorBoxes.forEach((box, index) => {
    const color = colors[index];

    const colorDiv = box.querySelector(".color");
    const hexValue = box.querySelector(".hex-value");

    colorDiv.style.backgroundColor = color;
    hexValue.textContent = color;
  });
}


/* DARK MODE */

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark");

    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.title = "Switch to light mode";
  } else {
    document.body.classList.remove("dark");

    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = "Switch to dark mode";
  }
}


themeToggle.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark");

  localStorage.setItem("darkMode", isDark);

  setTheme(isDark);
});


const savedTheme = localStorage.getItem("darkMode") === "true";

setTheme(savedTheme);