import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {appInjector} from './app-injector';
import {GuestService} from './guests/guests.service';
import {CookieService} from 'angular2-cookie/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import 'rxjs/Rx';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    GuestService,
    CookieService
]).then(appRef => {
    appInjector(appRef.injector);
});
