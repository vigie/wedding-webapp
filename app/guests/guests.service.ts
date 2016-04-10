import {Injectable} from 'angular2/core';
import {Guest} from './guest';
import {GUESTS} from './mock-guests';

@Injectable()
export class GuestService {
    
    loggedInGuest: Guest;
    
    getGuests() {
        return Promise.resolve(GUESTS);
    }

    getGuestByEmail(email: string): Promise<Guest> {
        let guest = GUESTS.filter(guest => guest.email === email)[0];
        let promise = new Promise((resolve, reject) => {
            if (guest) {
                resolve(guest);
            } else {
                reject('no such guest');
            }
        });
        return promise;
    }
}