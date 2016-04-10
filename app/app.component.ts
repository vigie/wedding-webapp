import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginComponent} from './login/login.component';
import {EventsComponent} from './events/events.component';
import {GuestService} from './guests/guests.service';
import {Router} from 'angular2/router';

@Component({
    selector: 'my-app',
    template: `
    <nav>
        <h1>Matt and Tamara's Wedding Website</h1>
        <p *ngIf="guestService.loggedInGuest">Not {{guestService.loggedInGuest.firstName}}? <a (click)="logOut($event)">log out</a>
    </nav>
    <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES],
    providers: [GuestService],
    styleUrls: ['app/app.css']
})
@RouteConfig([
  {path:'/login', name: 'Login', component: LoginComponent, useAsDefault: true},
  {path:'/events', name: 'Events', component: EventsComponent},
])
export class AppComponent { 
    
    logOut($event: Event) {
        this.guestService.loggedInGuest = null;
        $event.stopPropagation();
        $event.preventDefault();
        this._router.navigate(['Login']);
    }
    
    constructor (public guestService: GuestService, private _router: Router) {}
}
