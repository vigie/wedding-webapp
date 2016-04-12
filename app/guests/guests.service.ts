import {Injectable} from 'angular2/core';
import {Guest} from './guest';
import {GUESTS} from './mock-guests';
import {CookieService} from 'angular2-cookie/core';
import {Http, Response} from 'angular2/http';
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
            this._cookieService.put('user', value._id.toString());
        }

    }
    
    get loggedInGuest(): Guest {
        return this._loggedInGuest;
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