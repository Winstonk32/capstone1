document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskContainer = document.getElementById('taskContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
  
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Function to update progress bar
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
        
        taskCard.innerHTML = `
          <div class="task-details">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
          </div>
          <div class="task-actions">
            <button class="complete">${task.isComplete ? 'Completed' : 'Complete'}</button>
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
        description: document.getElementById('taskDescription').value,
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
  