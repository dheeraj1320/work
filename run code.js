const headerDataArr = {
  'Data Upload Template': [
    {
      NAME: 'Data Element',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Is Unique Key',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['Yes', 'No'],
      MASTER_DATA_VALUES: ['Ha', 'Nahi'],
    },
    {
      NAME: 'Is Value Always Required',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['Yes', 'No'],
      MASTER_DATA_VALUES: ['Ha', 'Nahi'],
    },
    {
      NAME: 'Is Only Pre-Defined Value Allowed',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['Yes', 'No'],
      MASTER_DATA_VALUES: ['Ha', 'Nahi'],
    },
    {
      NAME: 'MASTER_DATA_SET_UUID',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'MASTER_DATA_SET_UUID',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'MASTER_DATA_SET_UUID',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
  ],
  'Second Template': [
    {
      NAME: 'Data Type',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['integer', 'bool', 'string', 'char'],
      MASTER_DATA_VALUES: ['INT', 'BOOLEAN', 'STRING', 'CHARACTER'],
    },
    {
      NAME: 'Mix Fruits',
      TYPE: 'MULTILIST',
      MASTER_DATA_LABELS: ['integer', 'bool', 'string', 'char'],
      MASTER_DATA_VALUES: ['INT', 'BOOLEAN', 'STRING', 'CHARACTER'],
    },
    {
      NAME: 'Fruits',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['integer', 'bool', 'string', 'char'],
      MASTER_DATA_VALUES: ['INT', 'BOOLEAN', 'STRING', 'CHARACTER'],
    },
    {
      NAME: 'Pre-Defined Values SelectOption',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Pre-Defined Values SelectOption',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'UI Component',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'UI Component for Type Boolean',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Length (Number only)',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Max Length for Text',
      TYPE: 'LIST',
      MASTER_DATA_LABELS: ['integer', 'bool', 'string', 'char'],
      MASTER_DATA_VALUES: ['INT', 'BOOLEAN', 'STRING', 'CHARACTER'],
    },
    {
      NAME: 'Length (Number with Decimal)',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Length (Number with Decimal After)',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Max Length field for Text Area',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Data Key',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
    {
      NAME: 'Physical Column Name Input Text',
      TYPE: 'TEXT',
      MASTER_DATA_LABELS: '',
      MASTER_DATA_VALUES: '',
    },
  ],
};




const readableStream = fs.createReadStream(filePath);