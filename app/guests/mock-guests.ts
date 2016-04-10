import {Guest} from './guest';

export let GUESTS: Guest[] = [
    {
        id: 1,
        firstName: 'Kat',
        lastName: 'Corden',
        email: 'kat.corden@wonderful.com',        
        welcomeMessage: 'Hi bestie :-)',
        plusOne: -1,
        events: {
            'guernsey': {
                id: 'guernsey',
                invited: false,
                attending: 'unknown'
            },
            'sanFrancisco': {
                id: 'sanFrancisco',
                invited: true,
                attending: 'unknown'
            },
            'santaCruz': {
                id: 'santaCruz',
                invited: true,
                attending: 'unknown'
            }
        }
    },
    {
        id: 2,
        firstName: 'Dan',
        lastName: 'Colwill',
        email: 'dancolwill@hotmail.com',        
        welcomeMessage: 'Alright Mum you old tart?',
        plusOne: -1,
        events: {
            'guernsey': {
                id: 'guernsey',
                invited: true,
                attending: 'unknown'
            },
            'sanFrancisco': {
                id: 'sanFrancisco',
                invited: true,
                attending: 'unknown'
            },
            'santaCruz': {
                id: 'santaCruz',
                invited: true,
                attending: 'unknown'
            }
        }
    }
]