const monthYearDisplay = document.getElementById("monthYear");
const calendarDates = document.getElementById("calendarDates");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

let currentDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Set header month/year text
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

  // First day and total days in month
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Previous month days (for alignment)
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Clear previous
  calendarDates.innerHTML = "";

  // Fill in days
  for (let i = 0; i < firstDay; i++) {
    const inactiveDate = document.createElement("div");
    inactiveDate.classList.add("date", "inactive");
    inactiveDate.textContent = prevMonthDays - firstDay + i + 1;
    calendarDates.appendChild(inactiveDate);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.textContent = day;

    // Highlight today
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dateDiv.classList.add("selected");
    }

    dateDiv.addEventListener("click", () => {
      document.querySelectorAll(".date").forEach(d => d.classList.remove("selected"));
      dateDiv.classList.add("selected");
      console.log(`Selected: ${month + 1}/${day}/${year}`);
    });

    calendarDates.appendChild(dateDiv);
  }
}

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

renderCalendar(currentDate);
