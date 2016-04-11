import {Component} from 'angular2/core';
import {CanActivate, Router} from 'angular2/router';
import {appInjector} from '../app-injector';
import {GuestService} from '../guests/guests.service';

@Component({
    template: `
    <h2>San Francisco</h2>
    `
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    if(!guestService.loggedInGuest) {
        router.navigate(['Login']);
        return false;
    }
    if (!guestService.loggedInGuest.events.sanFrancisco.invited) {
        router.navigate(['Events']);
        return false;
    }
    return true;
})
export class SFComponent {}