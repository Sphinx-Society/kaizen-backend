const createTemplateSuccess = {
  'name': '5ec9fb04330b3b30157c31daS',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'options': [],
      'required': false,
    },
    {
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 26.5,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': ['1 option', 2, {}],
      'required': false,
      'id': '0002',
    },
    {
      'id': '0003',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'unit': 'ml',
      'options': ['1 option', 2, { 'other': 'thing' }],
      'required': false,
    },
    {
      'id': '0004',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'required': false,
    },
  ],
};

const createTemplateNameError = {
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

const createTemplateTypeError = {
  'name': 'GLUCOSA EN SANGRE',

  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],

      'required': false,
    },
  ],
};

const createTemplateCreatedByError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],

      'required': false,
    },
  ],
};

const createTemplateFieldsEmptyError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [],
};

const createTemplateFieldIdError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

const createTemplateFieldNameError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',

  'fields': [
    {
      'id': '0001',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

const createTemplateFieldTypeError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',

  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

const createFieldMinimumLimitError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',

  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': '126.50a',
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

module.exports = {
  createTemplateSuccess,
  createTemplateNameError,
  createTemplateTypeError,
  createTemplateCreatedByError,
  createTemplateFieldsEmptyError,
  createTemplateFieldIdError,
  createTemplateFieldNameError,
  createTemplateFieldTypeError,
  createFieldMinimumLimitError,
};
