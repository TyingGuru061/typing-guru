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
/*
====================================================
Typing Guru - Interactive Typing Practice Platform
====================================================
Author: Your Name
Version: 1.0
Description:
Typing Guru is a fully interactive web-based typing
practice tool designed to guide users from beginner
to advanced levels. It offers structured lessons with 
multiple sub-lessons, real-time accuracy and speed 
tracking, error counting, and a heatmap that visually 
represents typing strengths and weaknesses.
*/

// ------------------ PERMISSION TO STORE LOCALLY ------------------
let allowStorage = false;
if (localStorage.getItem('typingGuruConsent') === null) {
    const consent = confirm("Do you allow this site to store your progress locally on your device?");
    localStorage.setItem('typingGuruConsent', consent);
    allowStorage = consent;
} else {
    allowStorage = localStorage.getItem('typingGuruConsent') === 'true';
}

// ------------------ LESSON DATA ------------------
const lessons = {
    beginner: [
        { title: "1.1 F and J", text: "fff jjj fj fj jf jf fff jjj fj fj jf jf fj fj fj fj fff jjj fj fj jf jf" },
        { title: "1.2 D and K", text: "ddd kkk dk dk kd kd fj dk fj dk fj dk fj dk" },
        { title: "1.3 Common Words", text: "fad dad add kid lid did jig dig fig fit fat far jar jam dam" },
        // Continue building until full asdfjkl row...
    ],
    intermediate: [
        { title: "5.1 Sentences with Commas", text: "The sun rose, the birds sang, and the day began." },
        { title: "5.2 Punctuation Practice", text: "Rain fell, thunder roared, yet the children played." }
        // Continue...
    ],
    pro: [
        { title: "8.1 Capitals", text: "Life Is Beautiful." },
        { title: "9.1 Complex Punctuation", text: "Wait! Did you see that? It’s amazing; truly amazing." }
        // Continue...
    ]
};

// ------------------ DOM ELEMENTS ------------------
const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const errorsDisplay = document.getElementById('errors');
const restartBtn = document.getElementById('restart-btn');
const lessonList = document.getElementById('lesson-list');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

let currentLessonIndex = 0;
let currentDifficulty = 'beginner';
let startTime, timerInterval;
let errors = 0;
let keySpeeds = {};
let typedChars = 0;

// ------------------ LOAD LESSON ------------------
function loadLesson(index) {
    const lesson = lessons[currentDifficulty][index];
    if (!lesson) return;
    textDisplay.textContent = lesson.text;
    textInput.value = "";
    textInput.focus();
    errors = 0;
    typedChars = 0;
    keySpeeds = {};
    startTime = null;
    if (timerInterval) clearInterval(timerInterval);
}

// ------------------ START TYPING ------------------
textInput.addEventListener('input', () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateStats, 1000);
    }

    const input = textInput.value;
    const target = textDisplay.textContent;

    // Track errors
    errors = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== target[i]) errors++;
    }

    // Track key speeds
    const now = Date.now();
    const char = input[input.length - 1];
    if (char) {
        if (!keySpeeds[char]) keySpeeds[char] = [];
        keySpeeds[char].push(now);
    }

    // Check completion
    if (input === target) {
        clearInterval(timerInterval);
        saveProgress();
        alert("Lesson complete!");
    }
});

// ------------------ UPDATE STATS ------------------
function updateStats() {
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const words = textInput.value.trim().split(/\s+/).length;
    const wpm = Math.round(words / timeElapsed);
    const accuracy = Math.round(((textInput.value.length - errors) / textInput.value.length) * 100);

    wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
    accuracyDisplay.textContent = isNaN(accuracy) ? 0 : accuracy;
    errorsDisplay.textContent = errors;
}

// ------------------ SAVE PROGRESS ------------------
function saveProgress() {
    if (!allowStorage) return;

    const stats = JSON.parse(localStorage.getItem('typingGuruStats')) || { lifetime: {}, daily: {} };

    const today = new Date().toISOString().split('T')[0];
    const wpm = parseInt(wpmDisplay.textContent);
    const accuracy = parseInt(accuracyDisplay.textContent);
    const timeSpent = (Date.now() - startTime) / 1000;

    // Lifetime stats
    stats.lifetime.totalTime = (stats.lifetime.totalTime || 0) + timeSpent;
    stats.lifetime.topSpeed = Math.max(stats.lifetime.topSpeed || 0, wpm);
    stats.lifetime.topAccuracy = Math.max(stats.lifetime.topAccuracy || 0, accuracy);

    // Daily stats
    if (!stats.daily[today]) stats.daily[today] = { totalTime: 0, topSpeed: 0, topAccuracy: 0 };
    stats.daily[today].totalTime += timeSpent;
    stats.daily[today].topSpeed = Math.max(stats.daily[today].topSpeed, wpm);
    stats.daily[today].topAccuracy = Math.max(stats.daily[today].topAccuracy, accuracy);

    // Mark lesson complete
    stats.lifetime.completedLessons = stats.lifetime.completedLessons || {};
    stats.lifetime.completedLessons[`${currentDifficulty}-${currentLessonIndex}`] = true;

    localStorage.setItem('typingGuruStats', JSON.stringify(stats));
}

// ------------------ RESTART LESSON ------------------
restartBtn.addEventListener('click', () => {
    loadLesson(currentLessonIndex);
});

// ------------------ SWITCH DIFFICULTY ------------------
difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentDifficulty = btn.dataset.difficulty;
        currentLessonIndex = 0;
        loadLesson(currentLessonIndex);
    });
});

// ------------------ INITIAL LOAD ------------------
loadLesson(currentLessonIndex);
