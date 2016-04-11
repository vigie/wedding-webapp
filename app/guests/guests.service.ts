import {Injectable} from 'angular2/core';
import {Guest} from './guest';
import {GUESTS} from './mock-guests';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class GuestService {
    
    private _loggedInGuest: Guest;
    set loggedInGuest(value: Guest) {
        this._loggedInGuest = value;
        if (!value) {
            this._cookieService.remove('user');       
        } else {
            this._cookieService.put('user', value.id.toString());
        }

    }
    
    get loggedInGuest(): Guest {
        return this._loggedInGuest;
    }
    
    getGuests() {
        return Promise.resolve(GUESTS);
    }
    
    getGuestById(id: number): Promise<Guest> {
        let guest = GUESTS.filter(guest => guest.id === id)[0];
        let promise = new Promise((resolve, reject) => {
            if (guest) {
                resolve(guest);
            } else {
                reject('no such guest');
            }
        });
        return promise;
    }

    getGuestByEmail(email: string): Promise<Guest> {
        email = email.toLowerCase();
        let guest = GUESTS.filter(guest => guest.email.toLowerCase() === email)[0];
        let promise = new Promise((resolve, reject) => {
            if (guest) {
                resolve(guest);
            } else {
                reject('no such guest');
            }
        });
        return promise;
    }
    
    constructor(private _cookieService: CookieService) {}
}