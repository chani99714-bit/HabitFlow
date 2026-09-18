const monthSelect = document.getElementById("month");

const savedHabits = JSON.parse(localStorage.getItem("habits"));

const habits = savedHabits || [
    "📚 Study",
    "🏋️ Exercise",
    "📖 Reading"
];


function getDaysInMonth() {

    const month = monthSelect.selectedIndex;
    const year = new Date().getFullYear();

    return new Date(year, month + 1, 0).getDate();
}


function createTracker() {

    const days = getDaysInMonth();

    const tableHead = document.getElementById("tableHead");
    const habitList = document.getElementById("habitList");

    tableHead.innerHTML = "";
    habitList.innerHTML = "";


    // Create heading row
    // Create week row

const weekRow = document.createElement("tr");

const emptyWeekCell = document.createElement("th");
emptyWeekCell.innerText = "";
weekRow.appendChild(emptyWeekCell);

for (let week = 0; week < 5; week++) {

    const startDay = week * 7 + 1;

    if (startDay > days) break;

    const endDay = Math.min(startDay + 6, days);

    const weekCell = document.createElement("th");

    weekCell.colSpan = endDay - startDay + 1;

    weekCell.innerText = "WEEK " + (week + 1);

    weekCell.className = "week-header week-" + (week + 1);

    weekRow.appendChild(weekCell);
}

tableHead.appendChild(weekRow);

    const headerRow = document.createElement("tr");

    const habitHeader = document.createElement("th");

    habitHeader.innerText = "Habit";

    headerRow.appendChild(habitHeader);


    for (let day = 1; day <= days; day++) {

        const th = document.createElement("th");

        const date = new Date(
    new Date().getFullYear(),
    monthSelect.selectedIndex,
    day
);

const weekday = date.toLocaleDateString("en-US", {
    weekday: "short"
});

th.innerHTML = day + "<br><span class='weekday'>" + weekday + "</span>";
        if (
    day === new Date().getDate() &&
    monthSelect.selectedIndex === new Date().getMonth()
) {
    th.classList.add("today");
}

        headerRow.appendChild(th);
    }

    tableHead.appendChild(headerRow);


    // Create habit rows

    habits.forEach(function(habit , index) {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");

nameCell.innerText = habit;
const actions = document.createElement("span");

actions.className = "name-actions";
const editButton = document.createElement("button");

editButton.innerText = "✏️";

editButton.addEventListener("click", function() {

    const newName = prompt("Edit your habit:", habit);

    if (newName && newName.trim() !== "") {

        habits[index] = newName.trim();

        localStorage.setItem(
            "habits",
            JSON.stringify(habits)
        );

        createTracker();
    }

});
const deleteButton = document.createElement("button");

deleteButton.innerText = "🗑️";

deleteButton.addEventListener("click", function() {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this habit?"
    );

    if (confirmDelete === false) {
        return;
    }

    habits.splice(index, 1);

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

    createTracker();

});

actions.appendChild(editButton);
actions.appendChild(deleteButton);
nameCell.appendChild(actions);

row.appendChild(nameCell);

row.appendChild(nameCell);


        for (let day = 1; day <= days; day++) {

            const cell = document.createElement("td");

            const button = document.createElement("button");

            button.className = "check";


            // Checkbox click

            button.addEventListener("click", function() {

                button.classList.toggle("done");

                if (button.classList.contains("done")) {

                    button.innerText = "✓";

                } else {

                    button.innerText = "";

                }


                // Save checkbox states

                const allBoxes =
                    document.querySelectorAll(".check");

                const trackerData =
                    [...allBoxes].map(function(box) {

                        return box.classList.contains("done");

                    });

                localStorage.setItem(
                    "trackerData",
                    JSON.stringify(trackerData)
                );


                calculateProgress();


            });


            cell.appendChild(button);

            row.appendChild(cell);

        }


        habitList.appendChild(row);

    });


    // Load saved checkbox states

    const savedTrackerData =
        JSON.parse(localStorage.getItem("trackerData")) || [];

    const boxes =
        document.querySelectorAll(".check");


    boxes.forEach(function(box, index) {

        if (savedTrackerData[index]) {

            box.classList.add("done");

            box.innerText = "✓";

        }

    });


    calculateProgress();
    calculateWeeklyProgress();

}


function calculateProgress() {

    const boxes =
        document.querySelectorAll(".check");

    const completed =
        document.querySelectorAll(".check.done").length;

    const total = boxes.length;


    if (total === 0) {

        document.getElementById("progress").innerText = "0%";

        document.getElementById("bar").style.width = "0%";

        return;
    }


    const percentage =
        Math.round((completed / total) * 100);


    document.getElementById("progress").innerText =
        percentage + "%";
        if (percentage === 100) {
    document.getElementById("motivation").innerText =
        "🎉 Amazing! You completed everything!";
} else if (percentage >= 50) {
    document.getElementById("motivation").innerText =
        "🔥 You're halfway there!";
} else if (percentage > 0) {
    document.getElementById("motivation").innerText =
        "💪 Keep going, you're doing great!";
} else {
    document.getElementById("motivation").innerText =
        "🌱 Every journey starts with one small step.";
}
        calculateStreak();
        calculateWeeklyProgress();
    document.getElementById("bar").style.width =
        percentage + "%";
document.getElementById("completed").innerText = completed;
}
function calculateWeeklyProgress() {
    const boxes = document.querySelectorAll(".check");
    const weeklyCards = document.getElementById("weeklyCards");

    if (!weeklyCards) return;

    weeklyCards.innerHTML = "";

    const days = getDaysInMonth();
    const habitCount = habits.length;

    for (let week = 0; week < 5; week++) {

        const startDay = week * 7;
        const endDay = Math.min(startDay + 7, days);

        if (startDay >= days) break;

        let completed = 0;
        let total = (endDay - startDay) * habitCount;

        for (let habit = 0; habit < habitCount; habit++) {

            for (let day = startDay; day < endDay; day++) {

                const index = habit * days + day;

                if (
                    boxes[index] &&
                    boxes[index].classList.contains("done")
                ) {
                    completed++;
                }
            }
        }

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        // Create week card
        const card = document.createElement("div");
        card.className = "week-card week-" + (week + 1);

        // Create circular progress
        const circle = document.createElement("div");
        circle.className = "progress-ring";

        circle.style.setProperty(
            "--progress",
            percentage + "%"
        );

        circle.innerHTML =
            "<div class='progress-ring-inner'>" +
            "<strong>" + percentage + "%</strong>" +
            "</div>";

        card.appendChild(circle);

        const title = document.createElement("h4");
        title.innerText = "WEEK " + (week + 1);

        card.appendChild(title);

        weeklyCards.appendChild(card);
    }
}

// Month change

monthSelect.addEventListener(
    "change",
    createTracker
);


// Add Habit
function addHabit() {

    const habitName =
        prompt("Enter your habit:");


    if (habitName && habitName.trim() !== "") {

        habits.push(
            "✨ " + habitName.trim()
        );


        localStorage.setItem(
            "habits",
            JSON.stringify(habits)
        );


        createTracker();

    }

}

// Start tracker
const today = new Date();

monthSelect.selectedIndex = today.getMonth();
createTracker();
function resetTracker() {

    const firstConfirm =
        confirm("Are you sure you want to reset all your ticks?");

    if (!firstConfirm) {
        return;
    }

    const secondConfirm =
        confirm("This will clear all completed days. Continue?");

    if (!secondConfirm) {
        return;
    }

    localStorage.removeItem("trackerData");

    createTracker();
}
function calculateStreak() {

    const boxes = document.querySelectorAll(".check");
    const days = getDaysInMonth();
    const habitCount = habits.length;

    let streak = 0;

    if (habitCount === 0) {
        document.getElementById("streak").innerText = 0;
        return;
    }

    // Find the latest day where ALL habits are completed
    let latestCompleteDay = -1;

    for (let day = days - 1; day >= 0; day--) {

        let allHabitsDone = true;

        for (let habit = 0; habit < habitCount; habit++) {

            const index = habit * days + day;

            if (
                !boxes[index] ||
                !boxes[index].classList.contains("done")
            ) {
                allHabitsDone = false;
                break;
            }
        }

        if (allHabitsDone) {
            latestCompleteDay = day;
            break;
        }
    }

    // Count consecutive days where ALL habits are completed
    for (let day = latestCompleteDay; day >= 0; day--) {

        let allHabitsDone = true;

        for (let habit = 0; habit < habitCount; habit++) {

            const index = habit * days + day;

            if (
                !boxes[index] ||
                !boxes[index].classList.contains("done")
            ) {
                allHabitsDone = false;
                break;
            }
        }

        if (allHabitsDone) {
            streak++;
        } else {
            break;
        }
    }

    document.getElementById("streak").innerText = streak;
}
const quotes = [
    "Small steps every day become big changes. 🌷",
    "You don't need to be perfect, just consistent. 🦋",
    "One habit at a time, one day at a time. 💗",
    "Your future self will thank you. 🌸",
    "Progress is still progress, even when it's tiny. ✨",
    "Keep going. You are doing better than you think. 🎀",
    "Little habits, big dreams. 🌱"
];

const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

document.querySelector(".quote-text").innerText = randomQuote;
function updateStreakBadge() {

    const streakElement = document.getElementById("streak");
    const badge = document.getElementById("streakBadge");

    if (!streakElement || !badge) return;

    const streak = Number(streakElement.innerText);

    if (streak >= 30) {
        badge.innerText = "👑 30-day legend!";
    } else if (streak >= 14) {
        badge.innerText = "✨ 2 weeks strong!";
    } else if (streak >= 7) {
        badge.innerText = "🦋 One week!";
    } else if (streak >= 3) {
        badge.innerText = "🌷 3-day streak!";
    } else {
        badge.innerText = "🌱 Keep starting!";
    }
}

updateStreakBadge();
document.getElementById("themeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});
const moodButtons = document.querySelectorAll(".mood-btn");

const todayMoodKey =
    "dailyMood-" + new Date().toISOString().split("T")[0];

moodButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        moodButtons.forEach(function (btn) {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        localStorage.setItem(
            todayMoodKey,
            button.dataset.mood
        );
    });
});

const savedMood = localStorage.getItem(todayMoodKey);

if (savedMood) {
    moodButtons.forEach(function (button) {
        if (button.dataset.mood === savedMood) {
            button.classList.add("selected");
        }
    });
}