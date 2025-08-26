import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { GenericRelationItemDto } from 'src/utils/helpers/dto/generic-relation-item.dto';

function IsGenericRelationItem(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultOptions: ValidationOptions = {
      message: `${propertyName} is invalid`,
    };

    registerDecorator({
      name: 'isGenericRelationItem',
      target: object.constructor,
      propertyName: propertyName,
      options: { ...defaultOptions, ...validationOptions },
      validator: {
        validate(value: unknown) {
          const transformedValue: GenericRelationItemDto | null =
            typeof value === 'string'
              ? JSON.parse(value)
              : (value as GenericRelationItemDto);

          return (
            !!transformedValue &&
            !!transformedValue.id &&
            !!transformedValue.name
          );
        },
      },
    });

    const itemSchema = {
      type: 'object' as const,
      properties: {
        id: {
          type: 'string' as const,
          example: '1',
        },
        name: {
          type: 'string' as const,
          example: 'Client 1',
        },
      },
      additionalProperties: false,
    };

    let properties: ApiPropertyOptions = {
      type: 'object',
      properties: itemSchema.properties,
      additionalProperties: false,
    };

    if (validationOptions?.each)
      properties = {
        type: 'array',
        items: itemSchema,
      };

    ApiProperty(properties)(object, propertyName);
  };
}

export { IsGenericRelationItem };
