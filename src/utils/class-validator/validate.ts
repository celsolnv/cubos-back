import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOneField(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName,
      constraints: fields,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const fields = args.constraints as string[];
          return fields.some((field) => args.object[field] !== undefined);
        },
        defaultMessage(args: ValidationArguments) {
          const fields = args.constraints as string[];
          return `Pelo menos um dos campos ${fields.join(' ou ')} deve ser enviado.`;
        },
      },
    });
  };
}
