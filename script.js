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
// ================== CONFIGURATION ==================
const lessons = {
    1: {
        title: "Home Row Basics",
        subs: {
            "1.1": "fff jjj fj fj jf jf fff jjj fj fj jf jf fff jjj fj fj jf jf".repeat(5),
            "1.2": "ddd kkk dk dk kd kd fff jjj fj fj jf jf".repeat(5),
            "1.3": "fad dad fad dad lad lad jad jad".repeat(5),
            "1.4": "ask flask jask lad jack fad dash".repeat(5)
        }
    },
    2: {
        title: "Top Row Introduction",
        subs: {
            "2.1": "rrr uuu ru ru ur ur".repeat(5),
            "2.2": "eee iii ei ei ie ie".repeat(5),
            "2.3": "red ride rude irk fire rude".repeat(5)
        }
    },
    3: {
        title: "Bottom Row Introduction",
        subs: {
            "3.1": "vvv mmm vm vm mv mv".repeat(5),
            "3.2": "ccc ,,, cm cm mc mc".repeat(5),
            "3.3": "vac cam mac vim mic cam".repeat(5)
        }
    },
    4: {
        title: "More Letters",
        subs: {
            "4.1": "ttt ggg tg tg gt gt".repeat(5),
            "4.2": "bbb yyy by by yb yb".repeat(5),
            "4.3": "big bag tag tug bug tug".repeat(5)
        }
    },
    5: {
        title: "Remaining Alphabet",
        subs: {
            "5.1": "ppp qqq pq pq qp qp".repeat(5),
            "5.2": "www xxx wx wx xw xw".repeat(5),
            "5.3": "wax pew paw web wow pew".repeat(5)
        }
    },
    6: {
        title: "Full Keyboard Practice",
        subs: {
            "6.1": "The quick brown fox jumps over the lazy dog".repeat(5)
        }
    },
    7: {
        title: "Mix & Review",
        subs: {
            "7.1": "Jackdaws love my big sphinx of quartz".repeat(5),
            "7.2": "Pack my box with five dozen liquor jugs".repeat(5)
        }
    },
    8: {
        title: "Capital Letters",
        subs: {
            "8.1": "The Sun Rises In The East".repeat(5),
            "8.2": "Life Is Beautiful Full Of Colors".repeat(5)
        }
    },
    9: {
        title: "Punctuation",
        subs: {
            "9.1": "Hello, how are you?".repeat(5),
            "9.2": "Wait... what?!".repeat(5),
            "9.3": "Stop! Look, listen.".repeat(5)
        }
    },
    10: {
        title: "Numbers",
        subs: {
            "10.1": "123 456 789 0".repeat(5),
            "10.2": "987 654 321 0".repeat(5),
            "10.3": "Call 123-456-7890 for info".repeat(5)
        }
    }
};

let currentLesson = null;
let currentSub = null;
let startTime = null;
let typedCharacters = 0;
let errors = 0;
let keySpeeds = {};
let keyCounts = {};

// ================== LOAD FROM STORAGE ==================
let progress = JSON.parse(localStorage.getItem("typingProgress")) || {
    totalTime: 0,
    avgSpeed: 0,
    topSpeed: 0,
    avgAccuracy: 0,
    topAccuracy: 0,
    lessonsCompleted: {}
};

// ================== FUNCTIONS ==================
function loadLesson(lessonNum, subKey) {
    currentLesson = lessonNum;
    currentSub = subKey;
    document.getElementById("text-display").innerText = lessons[lessonNum].subs[subKey];
    document.getElementById("input-area").value = "";
    startTime = null;
    typedCharacters = 0;
    errors = 0;
    keySpeeds = {};
    keyCounts = {};
}

function startTyping() {
    if (!startTime) startTime = Date.now();
}

function checkInput() {
    const target = lessons[currentLesson].subs[currentSub];
    const input = document.getElementById("input-area").value;
    typedCharacters++;
    
    let errorCount = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== target[i]) errorCount++;
    }
    errors = errorCount;

    if (input === target) {
        finishLesson();
    }
}

function finishLesson() {
    const timeTaken = (Date.now() - startTime) / 1000 / 60;
    const wpm = Math.round((lessons[currentLesson].subs[currentSub].split(" ").length) / timeTaken);
    const accuracy = Math.round(((typedCharacters - errors) / typedCharacters) * 100);

    // Update progress
    progress.totalTime += timeTaken;
    progress.avgSpeed = Math.round(((progress.avgSpeed + wpm) / 2) * 100) / 100;
    if (wpm > progress.topSpeed) progress.topSpeed = wpm;
    progress.avgAccuracy = Math.round(((progress.avgAccuracy + accuracy) / 2) * 100) / 100;
    if (accuracy > progress.topAccuracy) progress.topAccuracy = accuracy;
    progress.lessonsCompleted[`${currentLesson}-${currentSub}`] = true;

    localStorage.setItem("typingProgress", JSON.stringify(progress));

    alert(`Lesson Complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nErrors: ${errors}`);
}

function restartLesson() {
    loadLesson(currentLesson, currentSub);
}

function buildLessonList() {
    const list = document.getElementById("lesson-list");
    for (let lessonNum in lessons) {
        for (let sub in lessons[lessonNum].subs) {
            const btn = document.createElement("button");
            btn.textContent = `Lesson ${lessonNum} - ${sub}`;
            if (progress.lessonsCompleted[`${lessonNum}-${sub}`]) {
                btn.style.backgroundColor = "lightgreen";
            }
            btn.onclick = () => loadLesson(lessonNum, sub);
            list.appendChild(btn);
        }
    }
}

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
    buildLessonList();
    document.getElementById("input-area").addEventListener("input", checkInput);
    document.getElementById("input-area").addEventListener("focus", startTyping);
    document.getElementById("restart-btn").addEventListener("click", restartLesson);
});
