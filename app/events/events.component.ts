import {Component} from 'angular2/core';
import {Guest} from '../guests/guest';
import {GuestService} from '../guests/guests.service';

@Component({
  templateUrl: 'app/events/events.html'
})
export class EventsComponent {
    
    welcomeMessage: string;
    guest: Guest
    
    constructor(private _guestService: GuestService) {
        this.guest = _guestService.loggedInGuest;
        this.welcomeMessage = _guestService.loggedInGuest.welcomeMessage;
    }
}