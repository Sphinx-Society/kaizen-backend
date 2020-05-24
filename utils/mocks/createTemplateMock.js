const createTemplateSuccess = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
      'required': false,
    },
    {
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 26.5,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': ['1 option', 2, {}],
      'disabled': false,
      'required': false,
      'id': '0002',
    },
    {
      'id': '0003',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'unit': 'ml',
      'options': ['1 option', 2, { 'other': 'thing' }],
      'disabled': false,
      'required': false,
    },
    {
      'id': '0004',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'unit': 'ml',
      'disabled': false,
      'required': false,
    },
  ],
};

const createTemplateNameError = {
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
      'required': false,
    },
  ],
};

const createTemplateTypeError = {
  'name': 'GLUCOSA EN SANGRE',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
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
      'disabled': false,
      'required': false,
    },
  ],
};

const createTemplateFieldsEmptyError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [],
};

const createTemplateFieldIdError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
      'required': false,
    },
  ],
};

const createTemplateFieldNameError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'type': 'number',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
      'required': false,
    },
  ],
};

const createTemplateFieldTypeError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
      'required': false,
    },
  ],
};

const createFieldMinimumLimitError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'createdBy': 'arantxa.rosas.1234',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'number',
      'minLimit': '126.50a',
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'disabled': false,
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
