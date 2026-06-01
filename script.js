document.addEventListener("DOMContentLoaded", function () {
  const habitInput = document.getElementById("habitInput");
    const addHabitBtn = document.getElementById("addHabitBtn");
    const clearAllBtn = document.getElementById("clearAllBtn");
  const habitList = document.getElementById("habitList");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  const todayText = document.getElementById("todayText");
  const totalHabitsText = document.getElementById("totalHabits");
  const completedHabitsText = document.getElementById("completedHabits");
  const remainingHabitsText = document.getElementById("remainingHabits");

  let habits = JSON.parse(localStorage.getItem("habits")) || [];

  const today = new Date();

  todayText.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

    addHabitBtn.addEventListener("click", addHabit);
    clearAllBtn.addEventListener("click", clearAllHabits);

  habitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addHabit();
    }
  });

  function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
  }

  function addHabit() {
    const habitName = habitInput.value.trim();

    if (habitName === "") {
      alert("Isi habit dulu bro.");
      return;
    }

    const newHabit = {
      id: Date.now(),
      name: habitName,
      completed: false
    };

    habits.push(newHabit);
    saveHabits();

    habitInput.value = "";
    renderHabits();
  }

  function renderHabits() {
    habitList.innerHTML = "";

    if (habits.length === 0) {
      habitList.innerHTML = `
        <div class="empty-state">
          <h3>No habits yet</h3>
          <p>Start with one small habit. Jangan langsung banyak, nanti malah males sendiri.</p>
        </div>
      `;

      updateProgress();
      return;
    }

    habits.forEach(function (habit) {
      const habitCard = document.createElement("div");
      habitCard.className = "habit-card";

      if (habit.completed) {
        habitCard.classList.add("completed");
      }

      habitCard.innerHTML = `
        <span>${habit.name}</span>

        <div class="habit-actions">
          <button class="done-btn">
            ${habit.completed ? "Done ✓" : "Done"}
          </button>

          <button class="delete-btn">
            Delete
          </button>
        </div>
      `;

      const doneBtn = habitCard.querySelector(".done-btn");
      const deleteBtn = habitCard.querySelector(".delete-btn");

      doneBtn.addEventListener("click", function () {
        toggleHabit(habit.id);
      });

deleteBtn.addEventListener("click", function () {
  const confirmDelete = confirm(`Hapus habit "${habit.name}"?`);

  if (confirmDelete) {
    deleteHabit(habit.id);
  }
});

      habitList.appendChild(habitCard);
    });

    updateProgress();
  }

  function toggleHabit(id) {
    habits = habits.map(function (habit) {
      if (habit.id === id) {
        return {
          ...habit,
          completed: !habit.completed
        };
      }

      return habit;
    });

    saveHabits();
    renderHabits();
  }

  function deleteHabit(id) {
    habits = habits.filter(function (habit) {
      return habit.id !== id;
    });

    saveHabits();
    renderHabits();
    }
    
    function clearAllHabits() {
  if (habits.length === 0) {
    alert("Belum ada habit yang bisa dihapus.");
    return;
  }

  const confirmClear = confirm("Yakin mau hapus semua habit?");

  if (!confirmClear) {
    return;
  }

  habits = [];

  saveHabits();
  renderHabits();
}

  function updateProgress() {
    const totalHabits = habits.length;

    const completedHabits = habits.filter(function (habit) {
      return habit.completed;
    }).length;

    const remainingHabits = totalHabits - completedHabits;

    totalHabitsText.textContent = totalHabits;
    completedHabitsText.textContent = completedHabits;
    remainingHabitsText.textContent = remainingHabits;

    if (totalHabits === 0) {
      progressText.textContent = "0% completed";
      progressFill.style.width = "0%";
      return;
    }

    const progress = Math.round((completedHabits / totalHabits) * 100);

    progressText.textContent = `${progress}% completed`;
    progressFill.style.width = `${progress}%`;
  }

  renderHabits();
});