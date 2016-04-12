import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable'

@Injectable()
export class EmailService {
    private EMAIL_API = 'api/email';
    
    sendEmail(email: string, name: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let body = JSON.stringify({ 
            email: email,
            name: name 
        });
        return this._http.post(this.EMAIL_API, body, options);
    }
    
    constructor(private _http: Http) {}
}