//const tasks: Task[] = [];
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Load jobs from localStorage or initialize an empty array
let jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}
// Load reminders from localStorage or initialize an empty array
let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}
let editingJobId = null;
console.log(jobs);
const jobTableBody = document.getElementById("jobTableBody");
// Display Jobs in Table
function displayJobs(jobList = jobs) {
    if (!jobTableBody)
        return;
    jobTableBody.innerHTML = "";
    jobList.forEach((job) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${job.company}</td>
            <td>${job.position}</td>
            <td>${job.location}</td>
            <td>${job.dateApplied}</td>
            <td>
                <span class="status ${job.status.toLowerCase()}">
                    ${job.status}
                </span>
            </td>
            <td>
                <button onclick="editJob(${job.id})">Edit</button>
                <button onclick="deleteJob(${job.id})">Delete</button>
            </td>
        `;
        jobTableBody.appendChild(row);
    });
}
displayJobs();
// Show/Hide Add Job Form
const addJobBtn = document.querySelector(".add-job-btn");
const jobFormContainer = document.getElementById("jobFormContainer");
const cancelBtn = document.getElementById("cancelBtn");
addJobBtn?.addEventListener("click", () => {
    editingJobId = null;
    jobForm?.reset();
    if (jobFormContainer) {
        jobFormContainer.style.display = "flex";
    }
});
cancelBtn?.addEventListener("click", () => {
    editingJobId = null;
    jobForm?.reset();
    if (jobFormContainer) {
        jobFormContainer.style.display = "none";
    }
});
// Add Job Form Submission
const jobForm = document.getElementById("jobForm");
jobForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;
    const location = document.getElementById("location").value;
    const dateApplied = document.getElementById("dateApplied").value;
    const status = document.getElementById("status").value;
    const nextAction = document.getElementById("nextAction").value;
    const reminderDate = document.getElementById("reminderDate").value;
    const newJob = {
        id: Date.now(),
        company: company,
        position: position,
        location: location,
        dateApplied: dateApplied,
        status: status,
        nextAction: nextAction,
        reminderDate: reminderDate
    };
    if (editingJobId !== null) {
        const job = jobs.find((job) => job.id === editingJobId);
        if (job) {
            job.company = company;
            job.position = position;
            job.location = location;
            job.dateApplied = dateApplied;
            job.status = status;
            job.nextAction = nextAction;
            job.reminderDate = reminderDate;
        }
        editingJobId = null;
    }
    else {
        jobs.push(newJob);
    }
    saveJobs();
    displayJobs();
    updateDashboard();
    updateWeeklyProgress();
    displayReminders();
    jobForm.reset();
    if (jobFormContainer) {
        jobFormContainer.style.display = "none";
    }
});
// Delete Job Function
function deleteJob(id) {
    const jobIndex = jobs.findIndex((job) => job.id === id);
    if (jobIndex !== -1) {
        jobs.splice(jobIndex, 1);
        saveJobs();
        displayJobs();
        updateDashboard();
        updateWeeklyProgress();
        displayReminders();
    }
}
// Edit Job Function
function editJob(id) {
    const job = jobs.find((job) => job.id === id);
    if (!job)
        return;
    document.getElementById("company").value = job.company;
    document.getElementById("position").value = job.position;
    document.getElementById("location").value = job.location;
    document.getElementById("dateApplied").value = job.dateApplied;
    document.getElementById("status").value = job.status;
    document.getElementById("nextAction").value =
        job.nextAction || "";
    document.getElementById("reminderDate").value =
        job.reminderDate || "";
    editingJobId = id;
    if (jobFormContainer) {
        jobFormContainer.style.display = "flex";
    }
}
// Search Functionality
const searchInput = document.getElementById("searchInput");
searchInput?.addEventListener("input", () => {
    const searchText = searchInput.value.toLowerCase();
    const filteredJobs = jobs.filter((job) => job.company.toLowerCase().includes(searchText) ||
        job.position.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText));
    displayJobs(filteredJobs);
});
// Filter by Status Functionality
const statusFilter = document.getElementById("statusFilter");
statusFilter?.addEventListener("change", () => {
    const selectedStatus = statusFilter.value;
    if (selectedStatus === "All") {
        displayJobs();
    }
    else {
        const filteredJobs = jobs.filter((job) => job.status === selectedStatus);
        displayJobs(filteredJobs);
    }
});
// Update Dashboard Functionality
function updateDashboard() {
    // Update the dashboard metrics based on the current jobs data
    const totalApplications = jobs.length;
    const totalInterviews = jobs.filter((job) => job.status === "Interview").length;
    const totalOffers = jobs.filter((job) => job.status === "Offer").length;
    const totalApplicationsElement = document.getElementById("totalApplications");
    const totalInterviewsElement = document.getElementById("totalInterviews");
    const totalOffersElement = document.getElementById("totalOffers");
    if (totalApplicationsElement) {
        totalApplicationsElement.textContent =
            totalApplications.toString();
    }
    if (totalInterviewsElement) {
        totalInterviewsElement.textContent =
            totalInterviews.toString();
    }
    if (totalOffersElement) {
        totalOffersElement.textContent =
            totalOffers.toString();
    }
    // Weekly Applications Count
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const weeklyApplications = jobs.filter((job) => {
        const appliedDate = new Date(job.dateApplied);
        return appliedDate >= sevenDaysAgo &&
            appliedDate <= today;
    }).length;
    const weeklyApplicationsElement = document.getElementById("weeklyApplications");
    if (weeklyApplicationsElement) {
        weeklyApplicationsElement.textContent =
            weeklyApplications.toString();
    }
}
updateDashboard();
// Show/Hide Add Task Form
const addTaskBtn = document.getElementById("addTaskBtn");
const taskFormContainer = document.getElementById("taskFormContainer");
const cancelTaskBtn = document.getElementById("cancelTaskBtn");
addTaskBtn?.addEventListener("click", () => {
    if (taskFormContainer) {
        taskFormContainer.style.display = "flex";
    }
});
// Cancel Task Form
cancelTaskBtn?.addEventListener("click", () => {
    if (taskFormContainer) {
        taskFormContainer.style.display = "none";
    }
});
// Display Tasks Functionality
function displayTasks() {
    const taskList = document.getElementById("taskList");
    const completedTaskList = document.getElementById("completedTaskList");
    if (!taskList || !completedTaskList)
        return;
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    tasks.forEach((task) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        if (task.completed) {
            taskItem.innerHTML = `
                <div class="completed-task-info">
                    <span class="completed">
                        ✓ ${task.name}
                    </span>
                    <small>
                        Completed: ${task.completedDate || ""}
                    </small>
                </div>
                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>
            `;
            completedTaskList.appendChild(taskItem);
        }
        else {
            taskItem.innerHTML = `
                <label>
                    <input
                        type="checkbox"
                        onchange="toggleTask(${task.id})">
                    <span>${task.name}</span>
                </label>
                <button onclick="deleteTask(${task.id})">
                    Delete
                </button>
            `;
            taskList.appendChild(taskItem);
        }
    });
}
// Save a task to the tasks array and update the display
const taskForm = document.getElementById("taskForm");
taskForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskName = document.getElementById("taskName").value;
    const newTask = {
        id: Date.now(),
        name: taskName,
        completed: false,
        createdDate: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    displayTasks();
    taskForm.reset();
    if (taskFormContainer) {
        taskFormContainer.style.display = "none";
    }
});
// toggleTask Functionality
function toggleTask(id) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
        task.completed = true;
        task.completedDate =
            new Date().toLocaleDateString();
        saveTasks();
        displayTasks();
        updateWeeklyProgress();
    }
}
// Delete Task Functionality
function deleteTask(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        saveTasks();
        displayTasks();
        updateWeeklyProgress();
    }
}
function updateWeeklyProgress() {
    const weeklyApplicationGoal = 5;
    // Calculate applications from the last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const weeklyApplications = jobs.filter((job) => {
        const appliedDate = new Date(job.dateApplied);
        return appliedDate >= sevenDaysAgo &&
            appliedDate <= today;
    }).length;
    // Calculate tasks
    const weeklyTasks = tasks.filter((task) => {
        if (!task.createdDate)
            return false;
        const createdDate = new Date(task.createdDate);
        return createdDate >= sevenDaysAgo &&
            createdDate <= today;
    });
    const totalTasks = weeklyTasks.length;
    const completedTasks = weeklyTasks.filter((task) => task.completed).length;
    // Get HTML elements
    const applicationProgress = document.getElementById("applicationProgress");
    const applicationProgressBar = document.getElementById("applicationProgressBar");
    const taskProgress = document.getElementById("taskProgress");
    const taskProgressBar = document.getElementById("taskProgressBar");
    // Update application progress
    if (applicationProgress) {
        applicationProgress.textContent =
            `${weeklyApplications} / ${weeklyApplicationGoal}`;
    }
    if (applicationProgressBar) {
        const applicationPercentage = Math.min((weeklyApplications / weeklyApplicationGoal) * 100, 100);
        applicationProgressBar.style.width =
            `${applicationPercentage}%`;
    }
    // Update task progress
    if (taskProgress) {
        taskProgress.textContent =
            `${completedTasks} / ${totalTasks}`;
    }
    if (taskProgressBar) {
        const taskPercentage = totalTasks === 0
            ? 0
            : (completedTasks / totalTasks) * 100;
        taskProgressBar.style.width =
            `${taskPercentage}%`;
    }
}
// Display saved tasks when page loads
displayTasks();
updateWeeklyProgress();
displayReminders();
// Display Job Reminders Functionality
function displayReminders() {
    const reminderList = document.getElementById("reminderList");
    if (!reminderList)
        return;
    reminderList.innerHTML = "";
    // Job-related reminders
    const jobReminders = jobs
        .filter((job) => job.nextAction &&
        job.reminderDate)
        .map((job) => ({
        id: job.id,
        title: job.nextAction,
        details: `${job.company} — ${job.position}`,
        date: job.reminderDate,
        type: "job"
    }));
    // General reminders
    const generalReminders = reminders.map((reminder) => ({
        id: reminder.id,
        title: reminder.title,
        details: "General Reminder",
        date: reminder.date,
        type: "general"
    }));
    // Combine both
    const allReminders = [
        ...jobReminders,
        ...generalReminders
    ];
    // Sort by date
    allReminders.sort((a, b) => new Date(a.date).getTime() -
        new Date(b.date).getTime());
    // Display
    allReminders.forEach((reminder) => {
        const reminderItem = document.createElement("div");
        reminderItem.className = "reminder-item";
        reminderItem.innerHTML = `
            <div class="reminder-info">

                <strong>
                    ${reminder.title}
                </strong>

                <span>
                    ${reminder.details}
                </span>

            </div>

            <div class="reminder-date">
                ${reminder.date}
            </div>
        `;
        reminderList.appendChild(reminderItem);
    });
}
// Show/Hide Add Reminder Form
const addReminderBtn = document.getElementById("addReminderBtn");
const reminderFormContainer = document.getElementById("reminderFormContainer");
const cancelReminderBtn = document.getElementById("cancelReminderBtn");
addReminderBtn?.addEventListener("click", () => {
    if (reminderFormContainer) {
        reminderFormContainer.style.display = "flex";
    }
});
cancelReminderBtn?.addEventListener("click", () => {
    if (reminderFormContainer) {
        reminderFormContainer.style.display = "none";
    }
});
//Save a reminder to the reminders array and update the display
const reminderForm = document.getElementById("reminderForm");
reminderForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const reminderTitle = document.getElementById("reminderTitle").value;
    const generalReminderDate = document.getElementById("generalReminderDate").value;
    const newReminder = {
        id: Date.now(),
        title: reminderTitle,
        date: generalReminderDate
    };
    reminders.push(newReminder);
    saveReminders();
    reminderForm.reset();
    if (reminderFormContainer) {
        reminderFormContainer.style.display = "none";
    }
});
//# sourceMappingURL=app.js.map