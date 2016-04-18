import { Control} from 'angular2/common';

export class NameValidator{

    static nameFormat(control: Control): ValidationResult {

        var NAME_REGEXP = /^[a-z ,.'-]+$/i;

        if (!control.value || control.value === '' || !NAME_REGEXP.test(control.value)) {
            return { "incorrectNameFormat": true };
        }
        
        return null;
    }

}

interface ValidationResult {
 [key:string]:boolean;
}