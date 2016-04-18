import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LoginComponent} from './login/login.component';
import {EventsComponent} from './events/events.component';
import {GuestService} from './guests/guests.service';
import {Router, Location} from 'angular2/router';
import {GuernseyComponent} from './guernsey/guernsey.component';
import {SFComponent} from './san-fran/sf.component';
import {SCComponent} from './santa-cruz/sc.component';
@Component({
    selector: 'mt-app',
    templateUrl: 'app/app.html',
    directives: [ROUTER_DIRECTIVES],
    styleUrls: ['app/app.css']
})
@RouteConfig([
  {path:'/login', name: 'Login', component: LoginComponent, useAsDefault: true},
  {path:'/rsvp', name: 'RSVP', component: EventsComponent},
  {path:'/guernsey', name: 'Guernsey', component: GuernseyComponent},
  {path:'/sf', name: 'SF', component: SFComponent},
  {path:'/sc', name: 'SC', component: SCComponent},
  {path: '/**', redirectTo: ['Login']}
])
export class AppComponent {
    
    logOut($event: Event) {
        this.guestService.loggedInGuest = null;
        this._router.navigate(['Login']);
        $event.stopPropagation();
        $event.preventDefault();
    }
    
    get headerImage() {
        if (this._location.path() === '/login') {
            return 'app/assets/images/login/knot.jpg';
        } else {
            return 'app/assets/images/header.png';
        }
    }
    
    constructor (public guestService: GuestService, private _router: Router, private _location: Location) {
        // Hack to scroll top top on navigate.
        // (autoscroll not yet implemented in ng2)
        _router.subscribe(() => {
            window.scrollTo(0, 0);
        });
    }
}
