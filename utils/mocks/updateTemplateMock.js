const updateTemplateSuccess = {
  'name': 'EXAMEN DE HEPATITIS A',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'id': '0006',
      'name': 'Nivel de glucosa 6',
      'type': 'number',
      'unit': 'ml',
      'required': false,
    },
  ],
};

const updateTemplateTypeError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'other',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

const updateTemplateForbiddenPropertyError = {
  'name': 'GLUCOSA EN SANGRE',
  'type': 'EXAMEN DE LABORATORIO',
  'fields': [
    {
      'other': 'value',
      'id': '0001',
      'name': 'Nivel de glucosa',
      'type': 'string',
      'minLimit': 126.50,
      'maxLimit': 150.8,
      'unit': 'ml',
      'options': [],
      'required': false,
    },
  ],
};

module.exports = {
  updateTemplateSuccess,
  updateTemplateTypeError,
  updateTemplateForbiddenPropertyError,
};
