import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {appInjector} from './app-injector';
import {GuestService} from './guests/guests.service';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    GuestService
]).then(appRef => appInjector(appRef.injector));
