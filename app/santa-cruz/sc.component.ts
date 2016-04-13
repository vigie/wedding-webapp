import {Component} from 'angular2/core';
import {CanActivate, Router} from 'angular2/router';
import {appInjector} from '../app-injector';
import {GuestService} from '../guests/guests.service';

@Component({
    template: `
    <h2>Santa Cruz</h2>
    `
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    return guestService.getLoggedInGuest()
        .then((guest) => {
            if(guest.sc_invite === 'no') {
                router.navigate(['Events']);
                return false;
            } else {
                return true;
            }
        })
        .catch(() => {
            router.navigate(['Login']);
            return false;
        });
})
export class SCComponent {}