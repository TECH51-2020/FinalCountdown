import { Component, OnInit } from '@angular/core';
import { Event } from './event.model';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';


@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Array<Event> = [];
  displayEvent = false;
  disableAddButton = false;
  disableEditButton = false;
  disableViewButton = false;
  disableStopButton = true;
  constructor(private http: HttpClient, private toastService: ToastService) { }

 async ngOnInit() {
this.loadEvents();  
}

async loadEvents() {
  const savedEvents = this.getItemsFromLocalStorage('events');
  if (savedEvents && savedEvents.length > 0) {
    this.events = savedEvents
  } else {
    this.loadItemsFromFile();
  }
}

  async loadItemsFromFile() {
    this.events.unshift(new Event({
      event: "Example Event",
        date: "12/31/2020",
        time: "10:00 PM",
        alertMessage: "Alert Message",
        editMode: false,
        displayEvent: false
    }));
  }
  addEvent() {
    this.events.unshift(new Event({
      event: null,
      date: null,
      time: null,
      alertMessage: null
    }));
    this.disableAddButton = true;
    this.disableEditButton = true;
  }

  saveItemsToLocalStorage(events: Array<Event>) {
    const savedEvents = localStorage.setItem('events', JSON.stringify(events));
    console.log('from saveItemsToLocalStorage savedEvents: ', savedEvents);
    return savedEvents;
  }
  
  getItemsFromLocalStorage(key: string) {
    const savedEvents = JSON.parse(localStorage.getItem(key));
    console.log('from getItemsFromLocalStorage savedEvents ', savedEvents);
    return savedEvents;
  }

deleteEvent(index: number) {
  this.events.splice(index, 1);
    this.saveItemsToLocalStorage(this.events);
    this.disableAddButton = false;
    this.disableEditButton = false;
    this.disableViewButton = false;

}

saveEvent(event: any) {
  let hasError = false;
  Object.keys(event).forEach((key: any) => {
    if (event[key] == null) {
      hasError = true;
      this.toastService.showToast('danger', '${key} required!', 4000)
      event.editMode = true;
    this.disableAddButton = true;
    this.disableEditButton = true;
    }
  });
  if (!hasError) {
    event.editMode = false;
    this.disableAddButton = false;
    this.disableEditButton = false;
    this.disableViewButton = false;
    this.saveItemsToLocalStorage(this.events);
  }
}

editEvent(event: Event) {
  event.editMode = true;
  this.disableAddButton = true;
  this.disableEditButton = true;
  this.disableViewButton = true;
}

killTimer(event: Event) {
  location.reload()
}


showCountdown(event: Event) {
  this.disableViewButton = true;
  this.disableStopButton = false;
  this.disableEditButton = true;


  let eventName = event.event;
  let countDownDate = new Date(event.date).getTime();

  let countdown = setInterval(function () {
    let now = new Date().getTime();
    let timeLeft = countDownDate - now;
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days + ""
    document.getElementById("hours").innerHTML = hours + ""
    document.getElementById("minutes").innerHTML = minutes + ""
    document.getElementById("seconds").innerHTML = seconds + ""
    document.getElementById("eventName").innerHTML = "Until " + eventName

    if (timeLeft < 0) {
      clearInterval(countdown);
      document.getElementById("days").innerHTML = "0"
      document.getElementById("hours").innerHTML = "0"
      document.getElementById("minutes").innerHTML = "0"
      document.getElementById("seconds").innerHTML = "0"
      
        this.toastService.showToast('success',  '${event.alertMessage}', 10000);
    }
  }, 1000)
} 

}
