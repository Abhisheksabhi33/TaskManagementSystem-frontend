import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private http: HttpClient) {}

  public getTasks() {
    return this.http.get('https://ninjataskmaker-api.onrender.com/api/tasks');
  }

  public searchTasks(search: String) {
    return this.http.get('https://ninjataskmaker-api.onrender.com/api/tasks?search=' + search);


  }

  public addTask(
    title: String,
    status: String,
    Priority: String,
    date: Date,
    time: String,
    notes: String,
    statusChangedAt: Date
  ) {
    const userData = {
      title: title,
      status: status,
      Priority: Priority,
      date: date,
      time: time,
      notes: notes,
      statusChangedAt: new Date(),
    };
    return this.http.post('https://ninjataskmaker-api.onrender.com/api/tasks', userData);
  }

  public editTask(
    taskId: String,
    title: String,
    status: String,
    Priority: String,
    date: Date,
    time: String,
    notes: String,
    statusChangedAt: Date
  ) {
    const userData = {
      title: title,
      status: status,
      Priority: Priority,
      date: date,
      time: time,
      notes: notes,
      statusChangedAt: statusChangedAt,
    };

    return this.http.put('https://ninjataskmaker-api.onrender.com/api/tasks/' + taskId, userData);
  }

  public deleteTask(taskId: String) {
    return this.http.delete('https://ninjataskmaker-api.onrender.com/api/tasks/' + taskId);
  }
}
