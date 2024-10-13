document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskContainer = document.getElementById('taskContainer');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Function to update the overall progress bar
  function updateProgress() {
      const completedTasks = tasks.filter(task => task.isComplete).length;
      const totalTasks = tasks.length;
      const progressPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
      progressFill.style.width = `${progressPercentage}%`;
      progressText.innerText = `${Math.round(progressPercentage)}% Complete`;
  }

  // Function to render tasks
  function renderTasks() {
      taskContainer.innerHTML = '';
      tasks.forEach((task, index) => {
          const taskCard = document.createElement('div');
          taskCard.classList.add('task-card', task.priority);

          // Calculate the task's progress percentage based on the current progress vs target
          const progressPercentage = (task.currentProgress / task.description) * 100;

          taskCard.innerHTML = `
              <div class="task-details">
                  <h3>${task.title}</h3>
                  <p>Target: ${task.description}</p>
                  <p>Current Progress: ${task.currentProgress}</p>
                  <p>Date: ${task.dueDate}</p>
                  <p>Completion: ${Math.round(progressPercentage)}%</p>
              </div>
              <div class="task-actions">
                  <button class="complete">${task.isComplete ? 'Completed' : 'Complete'}</button>
                  <button class="edit">Edit Progress</button>
                  <button class="delete">Delete</button>
              </div>
          `;

          // Complete Task
          taskCard.querySelector('.complete').addEventListener('click', () => {
              tasks[index].isComplete = !tasks[index].isComplete;
              saveTasks();
              renderTasks();
              updateProgress();
          });

          // Edit Task Progress
          taskCard.querySelector('.edit').addEventListener('click', () => {
              const newProgress = prompt(`Enter new progress for "${task.title}" (Target: ${task.description})`, task.currentProgress);
              if (newProgress !== null && !isNaN(newProgress)) {
                  tasks[index].currentProgress = parseInt(newProgress, 10);
                  if (tasks[index].currentProgress >= tasks[index].description) {
                      tasks[index].isComplete = true; // Mark task as complete if target reached
                  }
                  saveTasks();
                  renderTasks();
                  updateProgress();
              }
          });

          // Delete Task
          taskCard.querySelector('.delete').addEventListener('click', () => {
              tasks.splice(index, 1);
              saveTasks();
              renderTasks();
              updateProgress();
          });

          taskContainer.appendChild(taskCard);
      });
  }

  // Save tasks to localStorage
  function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Handle task submission
  taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTask = {
          title: document.getElementById('taskTitle').value,
          description: parseInt(document.getElementById('taskDescription').value, 10), // Target value (integer)
          currentProgress: 0, // Initial progress
          dueDate: document.getElementById('taskDueDate').value,
          priority: document.getElementById('taskPriority').value,
          isComplete: false
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      updateProgress();
      taskForm.reset();
  });

  // Initial rendering and progress update
  renderTasks();
  updateProgress();
});
