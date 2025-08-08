// Typing Guru - Full Lessons & Tracking
// Save progress in localStorage

let lessons = {
    1: {
        title: "Home Row Keys",
        subLessons: {
            "1.1": "jjj fff fj fj jf jf jfj fjf fff jjj fjf fjj fff jfj jff jjj fff jf fjf jjj jff jfj fff jf fjf jjj fjf fjf jfj jf jf fj jf fj jf jf jf jf jf jf jf",
            "1.2": "ddd kkk dk dk kd kd kdk dkd kkk ddd dkk kdd dkd kdk kkk ddd kdk dkd kkk ddd kd dk kd kd kd kd kd kd kd kd kd kd kd kd",
            "1.3": "dad fad lad sad fad lad dad fad lad sad lad fad dad sad lad fad lad dad sad lad fad lad dad fad lad sad fad lad dad sad",
            "1.4": "asdf jkl; asdf jkl; asdf jkl; jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl; asdf jkl;",
            "1.5": "ask fad lad sad dash flask salad dash flask salad ask dash flask salad ask dash flask salad"
        }
    },
    2: {
        title: "Top Row Keys",
        subLessons: {
            "2.1": "rrr uuu ru ur ur ur uru rur uuu rrr rur uru rrr uuu uru rur uru rur ur ur ur ur ur ur ur ur ur ur ur ur ur ur",
            "2.2": "eee iii ei ie ei ie eie iei iii eee iei eie eee iii iei eie eee eie iei eie iei eie iei eie iei eie iei eie",
            "2.3": "tree free fire tire ride rude true fire ride rude tree free fire ride rude true fire ride rude tree free",
            "2.4": "qwe rty uio asd jkl qwe rty uio asd jkl qwe rty uio asd jkl",
            "2.5": "read ride tire rude fire rude true ride tire rude true fire rude true ride tire rude true fire rude"
        }
    },
    3: {
        title: "Bottom Row Keys",
        subLessons: {
            "3.1": "vvv mmm vm mv mv mv vmv mvm mmm vvv mvm vmv vvv mmm vmv mvm mmm vvv mv mv mv mv mv mv mv mv mv mv mv mv mv",
            "3.2": "ccc nnn cn nc cn nc cnc ncn nnn ccc ncn cnc ccc nnn cnc ncn ccc cnc ncn cnc ncn cnc ncn cnc ncn cnc ncn",
            "3.3": "can man van ran fan tan pan man van ran can man van ran fan tan pan man van ran can man van ran",
            "3.4": "zxc vbn asd jkl zxc vbn asd jkl zxc vbn asd jkl",
            "3.5": "camp name fame game same came name fame game same came name fame game same"
        }
    },
    4: {
        title: "Full Alphabet Practice",
        subLessons: {
            "4.1": "the quick brown fox jumps over the lazy dog the quick brown fox jumps over the lazy dog",
            "4.2": "pack my box with five dozen liquor jugs pack my box with five dozen liquor jugs",
            "4.3": "sphinx of black quartz judge my vow sphinx of black quartz judge my vow"
        }
    },
    5: {
        title: "Common Words",
        subLessons: {
            "5.1": "and the for you are with his they this have from one had word but not what all were we when your can said",
            "5.2": "there use an each which she do how their if will up other about out many then them these so some her would make",
            "5.3": "like him into time has look two more write go see number no way could people my than first water been call"
        }
    },
    6: {
        title: "Longer Words",
        subLessons: {
            "6.1": "beautiful wonderful discovery learning improvement knowledge strength happiness",
            "6.2": "adventure curiosity imagination opportunity confidence determination inspiration",
            "6.3": "motivation celebration concentration flexibility responsibility capability"
        }
    },
    7: {
        title: "Mixed Practice",
        subLessons: {
            "7.1": "when you have a dream you have got to grab it and never let go",
            "7.2": "success is not final failure is not fatal it is the courage to continue that counts",
            "7.3": "believe you can and you are halfway there"
        }
    },
    8: {
        title: "Capital Letters",
        subLessons: {
            "8.1": "Apple Banana Cat Dog Elephant Fish Goat Hat Igloo Jar",
            "8.2": "Kite Lion Monkey Nest Owl Pig Queen Rat Sun Tree",
            "8.3": "Umbrella Van Whale Xylophone Yak Zebra"
        }
    },
    9: {
        title: "Punctuation",
        subLessons: {
            "9.1": "Hello, how are you? I am fine.",
            "9.2": "Wow! That is amazing, really amazing.",
            "9.3": "Please bring bread, milk, and eggs; do not forget sugar."
        }
    },
    10: {
        title: "Numbers",
        subLessons: {
            "10.1": "12345 67890 13579 24680",
            "10.2": "1 2 3 4 5 6 7 8 9 0 12 34 56 78 90",
            "10.3": "Call 123-456-7890 for more info."
        }
    }
};

// Lesson tracking
let currentLesson = null;
let startTime, typedText = "", errors = 0;

function loadLesson(lessonId, subLessonId) {
    currentLesson = lessons[lessonId].subLessons[subLessonId];
    document.getElementById("lessonText").textContent = currentLesson;
    typedText = "";
    errors = 0;
    startTime = null;
    document.getElementById("typedText").value = "";
    document.getElementById("results").textContent = "";
}

function handleTyping(e) {
    if (!startTime) startTime = new Date();
    typedText = e.target.value;

    let expected = currentLesson.substring(0, typedText.length);
    if (typedText !== expected) {
        errors++;
    }

    if (typedText.length === currentLesson.length) {
        endLesson();
    }
}

function endLesson() {
    let timeTaken = (new Date() - startTime) / 1000 / 60;
    let wordsTyped = currentLesson.split(" ").length;
    let wpm = Math.round(wordsTyped / timeTaken);
    let accuracy = Math.round(((currentLesson.length - errors) / currentLesson.length) * 100);

    document.getElementById("results").innerHTML =
        `WPM: ${wpm}, Accuracy: ${accuracy}%<br>Errors: ${errors}`;

    saveProgress(wpm, accuracy);
}

function saveProgress(wpm, accuracy) {
    let progress = JSON.parse(localStorage.getItem("typingProgress")) || [];
    progress.push({
        date: new Date().toLocaleString(),
        wpm: wpm,
        accuracy: accuracy
    });
    localStorage.setItem("typingProgress", JSON.stringify(progress));
}

document.getElementById("typedText").addEventListener("input", handleTyping);
