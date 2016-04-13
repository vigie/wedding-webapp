import {Injectable} from 'angular2/core';
import {Guest} from './guest';
import {GUESTS} from './mock-guests';
import {CookieService} from 'angular2-cookie/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable'

@Injectable()
export class GuestService {
    
    private static _guestsURL = 'api/guests'
    
    private _loggedInGuest: Guest;
    set loggedInGuest(value: Guest) {
        this._loggedInGuest = value;
        if (!value) {
            this._cookieService.remove('user');       
        } else {
            if (!value.welcomeMsg) {
                value.welcomeMsg = `Hi ${value.firstName}.`;
            }
            this._cookieService.put('user', value._id.toString());
        }

    }
    
    get loggedInGuest(): Guest {
        return this._loggedInGuest;
    }
    
    getLoggedInGuest(): Promise<any> {
        if (this._loggedInGuest) {
            return Promise.resolve(this._loggedInGuest);
        }
        // Check cookie
        let userCookie = this._cookieService.get('user');
        if (userCookie) {
            return this.getGuestById(userCookie)
                .toPromise()
                .then( user => {
                    this.loggedInGuest = user;
                    return user;
                })
        } else {
            return Promise.reject(null);
        }
    }
    
    // getGuests() {
    //     return Promise.resolve(GUESTS);
    // }
    
    getGuests() {
        return this._http.get(GuestService._guestsURL)
            .map(res => <Guest[]>res.json())
            .catch(this.handleError);
    }
    
    // getGuestById(id: string): Promise<Guest> {
    //     let guest = GUESTS.filter(guest => guest.id === id)[0];
    //     let promise = new Promise((resolve, reject) => {
    //         if (guest) {
    //             resolve(guest);
    //         } else {
    //             reject('no such guest');
    //         }
    //     });
    //     return promise;
    // }
    
    getGuestById(id: string) {
        return this._http.get(GuestService._guestsURL + `/${id}`)
            .map(res => <Guest>res.json())
            .catch(this.handleError);
    }

    // getGuestByEmail(email: string): Promise<Guest> {
    //     email = email.toLowerCase();
    //     let guest = GUESTS.filter(guest => guest.email.toLowerCase() === email)[0];
    //     let promise = new Promise((resolve, reject) => {
    //         if (guest) {
    //             resolve(guest);
    //         } else {
    //             reject('no such guest');
    //         }
    //     });
    //     return promise;
    // }
    
    updateGuests(guests: Guest[]) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify(guests);
        return this._http.put(GuestService._guestsURL, body, options);
    }
    
    getGuestByEmail(email: string) {
        email = email.toLowerCase();
        return this._http.get(GuestService._guestsURL + `?email=${email}`)
            .map(res => <Guest>res.json())
            .catch(this.handleError);
    }
    
    private handleError (error: Response) {
        console.error(error);
        return Observable.throw(error.json() || 'Server error');
    }
    
    constructor(private _cookieService: CookieService, private _http: Http) {}
}