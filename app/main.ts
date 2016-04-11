import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {appInjector} from './app-injector';
import {GuestService} from './guests/guests.service';
import {CookieService} from 'angular2-cookie/core';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    GuestService,
    CookieService
]).then(appRef => {
    appInjector(appRef.injector);
    let guestService: GuestService = appRef.injector.get(GuestService);
    let cookieService: CookieService = appRef.injector.get(CookieService);
    let userCookie = cookieService.get('user');
    if (userCookie) {
        guestService.getGuestById(parseInt(userCookie, 10))
            .then (user => guestService.loggedInGuest = user);
    }
});
