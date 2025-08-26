import {
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isDateAfter', async: false })
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Desestruturação com valor padrão
    const [relatedPropertyName = 'startPeriodDate'] = args.constraints;

    // Verificações de segurança
    if (!value || !args.object) return false;

    const currentValue = new Date(value);
    const relatedValue = new Date((args.object as any)[relatedPropertyName]);

    // Validações de data
    if (isNaN(currentValue.getTime()) || isNaN(relatedValue.getTime())) {
      return false;
    }

    return currentValue > relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName = 'data inicial'] = args.constraints;
    return `${args.property} deve ser posterior a ${relatedPropertyName}`;
  }
}
