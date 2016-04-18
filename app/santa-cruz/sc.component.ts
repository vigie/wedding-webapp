import {Component} from 'angular2/core';
import {CanActivate, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {appInjector} from '../app-injector';
import {GuestService} from '../guests/guests.service';

@Component({
    templateUrl: 'app/santa-cruz/sc.html',
    directives: [ROUTER_DIRECTIVES]
})
@CanActivate((next, prev) => {
    let injector = appInjector(false);
    let guestService = injector.get(GuestService);
    let router = injector.get(Router);
    return guestService.getLoggedInGuest()
        .then((guest) => {
            if(!guest.sc_invite || guest.sc_invite === 'no') {
                router.navigate(['RSVP']);
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