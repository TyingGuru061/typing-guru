// ========================
// Typing Guru - script.js
// ========================

// Store user progress in localStorage
let userProgress = JSON.parse(localStorage.getItem("typingGuruProgress")) || {
    totalTime: 0,
    avgSpeed: 0,
    topSpeed: 0,
    avgAccuracy: 0,
    topAccuracy: 0,
    completedLessons: {}
};

let startTime, currentLesson, currentText, typedText = "";
let errors = 0, timerRunning = false;
let totalCharsTyped = 0;

// Sample lessons data (10 lessons with sub-lessons)
const lessons = {
    1: {
        title: "Home Row - F and J",
        sub: {
            1: "fff jjj fj fj jf jf fff jjj fj jf jf fj fj jf jf jf fff jjj",
            2: "fff jjj fj fj jf jf ddd kkk dk kd dk kd dk dk dk kkk ddd fj jf jf",
            3: "dad fad lad fad lad fad fad lad dad fad fad lad fad dad lad"
        }
    },
    2: {
        title: "Add S and L",
        sub: {
            1: "sss lll sl ls sl ls sss lll sl ls sl ls",
            2: "sad lad lad sad lad sad lad sad lad sad",
            3: "lass lass lad lad sad sad lass lad"
        }
    }
    // Add lessons 3–10 in similar format
};

// Load lesson
function loadLesson(lessonNum, subNum) {
    currentLesson = `${lessonNum}.${subNum}`;
    currentText = lessons[lessonNum].sub[subNum];
    typedText = "";
    errors = 0;
    document.getElementById("lesson-title").innerText = lessons[lessonNum].title + " - " + currentLesson;
    document.getElementById("text-to-type").innerText = currentText;
    document.getElementById("typed-text").innerText = "";
    timerRunning = false;
    startTime = null;
}

// Handle typing
document.addEventListener("keydown", function (e) {
    if (!currentText) return;

    if (!timerRunning) {
        timerRunning = true;
        startTime = new Date();
    }

    if (e.key.length === 1) {
        typedText += e.key;
        totalCharsTyped++;

        let expectedChar = currentText[typedText.length - 1];
        if (e.key !== expectedChar) {
            errors++;
        }

        document.getElementById("typed-text").innerText = typedText;
    }

    if (typedText.length === currentText.length) {
        finishLesson();
    }
});

// Finish lesson
function finishLesson() {
    let timeTaken = (new Date() - startTime) / 1000 / 60; // minutes
    let wpm = Math.round((currentText.length / 5) / timeTaken);
    let accuracy = Math.round(((currentText.length - errors) / currentText.length) * 100);

    // Update progress
    userProgress.totalTime += timeTaken;
    userProgress.avgSpeed = Math.round(((userProgress.avgSpeed + wpm) / 2));
    if (wpm > userProgress.topSpeed) userProgress.topSpeed = wpm;
    userProgress.avgAccuracy = Math.round(((userProgress.avgAccuracy + accuracy) / 2));
    if (accuracy > userProgress.topAccuracy) userProgress.topAccuracy = accuracy;
    userProgress.completedLessons[currentLesson] = true;

    localStorage.setItem("typingGuruProgress", JSON.stringify(userProgress));

    alert(`Lesson complete!\nWPM: ${wpm}\nAccuracy: ${accuracy}%\nErrors: ${errors}`);
}

// Restart
function restartLesson() {
    loadLesson(parseInt(currentLesson.split(".")[0]), parseInt(currentLesson.split(".")[1]));
}

// Populate lessons list
function populateLessons() {
    let lessonList = document.getElementById("lesson-list");
    for (let l in lessons) {
        for (let s in lessons[l].sub) {
            let li = document.createElement("li");
            li.innerText = `Lesson ${l}.${s}`;
            if (userProgress.completedLessons[`${l}.${s}`]) {
                li.style.color = "green";
            }
            li.onclick = () => loadLesson(parseInt(l), parseInt(s));
            lessonList.appendChild(li);
        }
    }
}

window.onload = () => {
    populateLessons();
};
