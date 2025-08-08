import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidateIf } from 'class-validator';

export function IsNullable(validationOptions?: ValidationOptions) {
    return ValidateIf((_object, value) => value !== null, validationOptions);
}

@ValidatorConstraint({ async: false })
export class IsHttpStringConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        // Implement your custom validation logic here
        // Return true if validation is successful, false otherwise
        return typeof value === 'string' && value.startsWith("http");
    }

    defaultMessage(args: ValidationArguments) {
        return 'URL must be start with http/https';
    }
}

export function IsHttpString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsHttpStringConstraint,
        });
    };
}
