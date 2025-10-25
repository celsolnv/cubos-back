/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse, isValid } from 'date-fns';
import { convertMoneyToNumber } from './func';

export function validateRequiredFields(
  row: any,
  requiredFields: string[],
  translate?: { [key: string]: string },
) {
  const errors = requiredFields
    .filter((field) => {
      return (
        row[field] === null || row[field] === '' || row[field] === undefined
      );
    })
    .map(
      (field) =>
        `Campo obrigatório '${(translate && translate[field]) || field}' ausente ou vazio \n`,
    );

  return errors;
}

export function validateDateFields(
  row: any,
  dateFields: string[],
  dateFormat = 'DD/MM/YYYY',
  translate?: { [key: string]: string },
) {
  const errors = dateFields
    .filter((field) => {
      const date = parse(row[field], dateFormat, new Date());
      return !isValid(date);
    })
    .map(
      (field) =>
        `Campo '${(translate && translate[field]) || field}' deve ser uma data válida \n`,
    );

  return errors;
}

export function validateNumberFields(
  row: any,
  numberFields: string[],
  translate?: { [key: string]: string },
) {
  const errors = numberFields
    .filter((field) => {
      // check if the field has ? caracter
      if (field.includes('?')) {
        const fieldWithoutQuestionMark = field.replace('?', '');
        if (
          row[fieldWithoutQuestionMark] === undefined ||
          row[fieldWithoutQuestionMark] === null
        ) {
          return false; // If the field is optional and not present, skip validation
        }
      }
      const valueRow = row[field];
      const value = convertMoneyToNumber(valueRow);
      return value !== null && (isNaN(value) || typeof value !== 'number');
    })
    .map(
      (field) =>
        `Campo '${(translate && translate[field]) || field}' deve ser um número válido \n`,
    );

  return errors;
}
