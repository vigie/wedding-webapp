import {Event} from '../events/event';

export class Guest {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    welcomeMessage: string;
    plusOne: number;
    events: any;
}