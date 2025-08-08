// Typing Guru main script

// Lesson data (simplified example — can expand)
const lessons = {
    beginner: [
        "Life is beautiful.",
        "Life is beautiful full of colors.",
        "Life is beautiful full of colors and endless possibilities!",
        "Practice makes perfect."
    ],
    intermediate: [
        "Life is beautiful, full of colors.",
        "Practice daily, and you'll see improvement.",
        "Accuracy matters, but speed will come.",
        "Consistency is key, so keep going."
    ],
    pro: [
        "Life is beautiful, full of colors, and endless possibilities!",
        "Typing fast, yet accurately, is a valuable skill.",
        "Push your limits; practice beyond your comfort zone.",
        "Focus, dedication, and patience lead to mastery."
    ]
};

// Current lesson variables
let currentLessonType = null;
let currentIndex = 0;
let startTime, typedCharacters, errors;
let keyStats = {}; // {key: {count, timeSum}}

// DOM references
const landing = document.getElementById("landing-page");
const lessonPage = document.getElementById("lesson-page");
const lessonTitle = document.getElementById("lesson-title");
const lessonText = document.getElementById("lesson-text");
const typingInput = document.getElementById("typing-input");
const stats = {
    speed: document.getElementById("speed"),
    accuracy: document.getElementById("accuracy"),
    errors: document.getElementById("errors")
};
const heatmap = document.getElementById("heatmap");

// Start lesson
function startLesson(type) {
    currentLessonType = type;
    currentIndex = 0;
    keyStats = {};
    errors = 0;
    typedCharacters = 0;
    showLessonText();
    landing.classList.add("hidden");
    lessonPage.classList.remove("hidden");
    lessonTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1) + " Lesson";
    startTime = null;
    typingInput.value = "";
    typingInput.focus();
}

// Show lesson text
function showLessonText() {
    lessonText.textContent = lessons[currentLessonType][currentIndex];
}

// Handle typing
typingInput.addEventListener("input", () => {
    if (!startTime) startTime = Date.now();

    let expected = lessons[currentLessonType][currentIndex];
    let typed = typingInput.value;

    // Track keystrokes
    for (let i = 0; i < typed.length; i++) {
        let key = typed[i].toLowerCase();
        if (!keyStats[key]) keyStats[key] = {count: 0, timeSum: 0};
        keyStats[key].count++;
    }

    typedCharacters = typed.length;

    // Check errors
    let errorCount = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] !== expected[i]) errorCount++;
    }
    errors = errorCount;

    // If lesson done
    if (typed === expected) {
        calculateStats();
        updateHeatmap();
        if (currentIndex < lessons[currentLessonType].length - 1) {
            currentIndex++;
            typingInput.value = "";
            showLessonText();
        } else {
            alert("Lesson complete!");
            landing.classList.remove("hidden");
            lessonPage.classList.add("hidden");
        }
    }
});

// Calculate stats
function calculateStats() {
    let timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    let words = typedCharacters / 5;
    let wpm = Math.round(words / timeElapsed);
    let accuracy = Math.round(((typedCharacters - errors) / typedCharacters) * 100);

    stats.speed.textContent = `Speed: ${wpm} WPM`;
    stats.accuracy.textContent = `Accuracy: ${accuracy}%`;
    stats.errors.textContent = `Errors: ${errors}`;
}

// Update heatmap
function updateHeatmap() {
    heatmap.innerHTML = "";
    for (let letter in keyStats) {
        let color = getColorForSpeed(keyStats[letter].count);
        let div = document.createElement("div");
        div.textContent = letter;
        div.style.backgroundColor = color;
        heatmap.appendChild(div);
    }
}

// Simple color gradient for speed
function getColorForSpeed(count) {
    if (count > 10) return "darkgreen";
    if (count > 5) return "green";
    if (count > 2) return "orange";
    return "darkred";
}

// Button events
document.getElementById("btn-beginner").addEventListener("click", () => startLesson("beginner"));
document.getElementById("btn-intermediate").addEventListener("click", () => startLesson("intermediate"));
document.getElementById("btn-pro").addEventListener("click", () => startLesson("pro"));
