// Typing Guru - Full Script
// Stores progress in localStorage

// ==================== LESSON DATA ====================
const lessons = {
    1: {
        name: "Home Row Keys",
        sub: {
            "1.1": "fff jjj fj fj jf jf jfj fjf jfj fff jjj fj fj jf jf jfj fjf jfj",
            "1.2": "ddd kkk dk dk kd kd dkd kdk dk dk dd kk dk dk kd kd dkd kdk",
            "1.3": "dad fad jad lad fad jak kad dak fad lad jad dad fad jak kad",
            "1.4": "as as as sa sa as as sa as as as sa sa as as sa as as as sa",
            "1.5": "ask fad lad jak sad fad lad ask ask dad fad lad jak sad fad"
        }
    },
    2: {
        name: "Top Row Keys",
        sub: {
            "2.1": "rrr uuu ru ru ur ur rur uru ru ru rr uu ru ru ur ur rur uru",
            "2.2": "eee iii ei ei ie ie eie iei ei ei ee ii ei ei ie ie eie iei",
            "2.3": "red rid rug rib ice rug red rug rib rug red rug rib ice rug",
            "2.4": "read ride rude rice idea rice ride rude ride rice rude idea",
            "2.5": "ice red rug ride rude rice idea ice red rug ride rude rice"
        }
    },
    3: {
        name: "Bottom Row Keys",
        sub: {
            "3.1": "vvv mmm vm vm mv mv vmv mvm vm vm vv mm vm vm mv mv vmv mvm",
            "3.2": "ccc nnn cn cn nc nc cnc ncn cn cn cc nn cn cn nc nc cnc ncn",
            "3.3": "van man can ran fan map nap cap rap fan man van ran nap map",
            "3.4": "cave name came fame game same name came fame game same name",
            "3.5": "van name came fame game same cave name fame game same came"
        }
    },
    8: {
        name: "Capital Letters",
        sub: {
            "8.1": "Cat Dog Sun Fan Man Van",
            "8.2": "Rain Moon Star Fish Ball Hat",
            "8.3": "Apple Banana Carrot Mango Kiwi",
            "8.4": "Green Blue Pink Red Black White"
        }
    },
    9: {
        name: "Punctuation",
        sub: {
            "9.1": "Hello, world. This is fun!",
            "9.2": "Can you type this? Yes, you can.",
            "9.3": "Wow! Amazing, isn't it?",
            "9.4": "Practice makes perfect; keep going."
        }
    },
    10: {
        name: "Numbers",
        sub: {
            "10.1": "123 456 789 0 321 654 987 0",
            "10.2": "12 34 56 78 90 98 76 54 32 10",
            "10.3": "100 200 300 400 500 600 700 800 900"
        }
    }
};

// ==================== VARIABLES ====================
let currentLesson = null;
let currentText = "";
let startTime = null;
let typedChars = 0;
let errors = 0;

// ==================== DOM ELEMENTS ====================
const lessonList = document.getElementById("lesson-list");
const textDisplay = document.getElementById("text-display");
const inputArea = document.getElementById("input-area");
const restartBtn = document.getElementById("restart-btn");

// ==================== FUNCTIONS ====================

// Load lessons into sidebar
function loadLessons() {
    for (let lessonNum in lessons) {
        let lesson = lessons[lessonNum];
        let lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `<strong>${lesson.name}</strong>`;
        
        for (let sub in lesson.sub) {
            let btn = document.createElement("button");
            btn.textContent = `Lesson ${sub}`;
            btn.onclick = () => startLesson(lessonNum, sub);
            lessonDiv.appendChild(btn);
        }
        
        lessonList.appendChild(lessonDiv);
    }
}

// Start selected lesson
function startLesson(lessonNum, sub) {
    currentLesson = `${lessonNum}-${sub}`;
    currentText = lessons[lessonNum].sub[sub];
    textDisplay.textContent = currentText;
    inputArea.value = "";
    inputArea.focus();
    startTime = null;
    typedChars = 0;
    errors = 0;
}

// Check typing progress
inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();
    let typed = inputArea.value;
    typedChars++;

    if (typed.length <= currentText.length) {
        let correctPart = currentText.slice(0, typed.length);
        if (typed[typed.length - 1] !== correctPart[typed.length - 1]) {
            errors++;
        }
    }

    if (typed === currentText) {
        finishLesson();
    }
});

// Finish lesson
function finishLesson() {
    let timeTaken = (new Date() - startTime) / 1000 / 60; // in minutes
    let wpm = Math.round((currentText.split(" ").length / timeTaken));
    let accuracy = Math.round(((typedChars - errors) / typedChars) * 100);

    alert(`Lesson Complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%`);

    saveProgress(wpm, accuracy, timeTaken);
}

// Save progress in localStorage
function saveProgress(wpm, accuracy, time) {
    let progress = JSON.parse(localStorage.getItem("typingProgress")) || {
        today: { time: 0, avgSpeed: 0, topSpeed: 0, avgAcc: 0, topAcc: 0 },
        allTime: { time: 0, avgSpeed: 0, topSpeed: 0, avgAcc: 0, topAcc: 0 }
    };

    // Update today
    progress.today.time += time;
    progress.today.avgSpeed = Math.round((progress.today.avgSpeed + wpm) / 2);
    progress.today.topSpeed = Math.max(progress.today.topSpeed, wpm);
    progress.today.avgAcc = Math.round((progress.today.avgAcc + accuracy) / 2);
    progress.today.topAcc = Math.max(progress.today.topAcc, accuracy);

    // Update all time
    progress.allTime.time += time;
    progress.allTime.avgSpeed = Math.round((progress.allTime.avgSpeed + wpm) / 2);
    progress.allTime.topSpeed = Math.max(progress.allTime.topSpeed, wpm);
    progress.allTime.avgAcc = Math.round((progress.allTime.avgAcc + accuracy) / 2);
    progress.allTime.topAcc = Math.max(progress.allTime.topAcc, accuracy);

    localStorage.setItem("typingProgress", JSON.stringify(progress));
    loadStats();
}

// Load stats into page
function loadStats() {
    let progress = JSON.parse(localStorage.getItem("typingProgress"));
    if (!progress) return;

    document.getElementById("today-time").textContent = Math.round(progress.today.time) + " min";
    document.getElementById("today-avg-speed").textContent = progress.today.avgSpeed + " WPM";
    document.getElementById("today-top-speed").textContent = progress.today.topSpeed + " WPM";
    document.getElementById("today-avg-acc").textContent = progress.today.avgAcc + "%";
    document.getElementById("today-top-acc").textContent = progress.today.topAcc + "%";

    document.getElementById("all-time-time").textContent = Math.round(progress.allTime.time) + " min";
    document.getElementById("all-time-avg-speed").textContent = progress.allTime.avgSpeed + " WPM";
    document.getElementById("all-time-top-speed").textContent = progress.allTime.topSpeed + " WPM";
    document.getElementById("all-time-avg-acc").textContent = progress.allTime.avgAcc + "%";
    document.getElementById("all-time-top-acc").textContent = progress.allTime.topAcc + "%";
}

// Restart button
restartBtn.addEventListener("click", () => {
    if (currentLesson) {
        let parts = currentLesson.split("-");
        startLesson(parts[0], parts[1]);
    }
});

// Initialize
loadLessons();
loadStats();
