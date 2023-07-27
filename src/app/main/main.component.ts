import { Component } from '@angular/core';

import { HeaderService } from '../shared/services/header.service';
import { TasksService } from '../shared/services/tasks.service';
import { Task } from '../shared/models/task';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', './main.component.media.css'],
})
export class MainComponent {
  constructor(
    public headerService: HeaderService,
    public tasksService: TasksService
  ) {}

  //Data
  tasks: Task[] = [];
  taskAddWindow: boolean = false;
  taskEditWindow: boolean = false;
  editTaskInput: Task;

  ngOnInit(): void {
    //Fixing the header
    this.headerService.changeState('main');

    //Getting all the tasks for the user
    this.tasksService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        // Fixing the date
        this.tasks.forEach((task) => {
          task.date = new Date(task.date);
        });
      },
      (error) => {
        //When something goes wrong
        switch (error.status) {
          case 404:
            //No tasks
            console.log('No Tasks Found');
            break;
          case 403:
            //Not authorizated
            console.log('Can not access these tasks');
            break;
          case 500:
            //When we have a server side error
            console.log('Something went wrong on the server');
            break;
        }
      }
    );
  }

  onSearch(search: any) {
    this.tasksService.searchTasks(search.value).subscribe(
      (data: Task[]) => {
        this.tasks = data;
        // Fixing the date
        this.tasks.forEach((task) => {
          task.date = new Date(task.date);
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addTask() {
    this.taskAddWindow = true;
  }

  addedNewTask(event) {
    console.log(event);
    this.tasks.push(event);
  }

  editedTask(event) {
    this.tasks.forEach((task, index) => {
      if (task._id === event._id) {
        this.tasks[index] = event;
      }
    });
  }

  //When user closes the tab for adding tasks
  addTaskStateChanged(event) {
    this.taskAddWindow = event;
  }

  //When user closes the tab for editing task
  editTaskStateChanged(event) {
    this.taskEditWindow = event;
  }

  sortSelected(select: any) {
    switch (select.value) {
      case 'date':
        // console.log(this.tasks);
        //When Date is selected
        this.tasks.sort(function (a, b) {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateA - dateB;
        });
        // console.log(this.tasks);
        break;
      case 'status':
        //When Status is selected
        this.tasks.sort(function (a, b) {
          const statusA = a.status.toUpperCase();
          const statusB = b.status.toUpperCase();

          if (statusA < statusB) {
            return -1;
          }

          if (statusA > statusB) {
            return 1;
          }

          return 0;
        });

        break;
      case 'name':
        //When Name is selected
        this.tasks.sort(function (a, b) {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();

          if (titleA < titleB) {
            return -1;
          }

          if (titleA > titleB) {
            return 1;
          }

          return 0;
        });
        break;

        case 'Priority':
          //When Priority is selected
          this.tasks.sort(function (a, b) {
            const priorityA = a.Priority;
            const priorityB = b.Priority;
  
            if (priorityA == "Low" && priorityB == "Medium") {
              return 1;
            }
  
            if (priorityA == "Low" && priorityB == "High") {
              return 1;
            }

            if (priorityA == "Medium" && priorityB == "High") {
              return 1;
            }

            if (priorityA == "Medium" && priorityB == "Low") {
              return -1;
            }

            if (priorityA == "High" && priorityB == "Low") {
              return -1;
            }

            if (priorityA == "High" && priorityB == "Medium") {
              return -1;
            }
            
  
            return 0;
          }
          );
          break;
    }
  }

  editTask(task: Task) {
    this.editTaskInput = task;
    this.taskEditWindow = true;
  }

  deleteTask(taskId: String) {
    const deleteTask = confirm('Are you sure you wish to delete this task? ');
    if (deleteTask) {
      this.tasksService.deleteTask(taskId).subscribe(
        (data) => {
          //Remove the task from array
          this.tasks = this.tasks.filter((task) => {
            return task._id != taskId;
          });
        },
        (error) => {
          alert('Failed to delete task\n' + error.status);
        }
      );
    }
  }

  importToCSV() {
    const csvData = this.convertTasksToCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'tasks.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  
  convertTasksToCSV() {
    // Format the date in "YYYY-MM-DD" format
    const formattedTasks = this.tasks.map((task) => ({
      ...task,
      date: this.formatDate(task.date),
      createdAt: this.formatDate(new Date(task.createdAt)),
      updatedAt: this.formatDate(new Date(task.updatedAt)),
      
    }));

    // Convert the tasks array to CSV format using papaparse
    const csvData = Papa.unparse(formattedTasks, {
      header: true, // Include header row

    });

    return csvData;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
