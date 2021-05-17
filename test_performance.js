const jsf = require('json-schema-faker');
jsf.extend('faker', () => require('faker'));

const schema = {
  '$schema': 'http://json-schema.org/draft-07/schema',
  '$id': 'http://example.com/example.json',
  'type': 'object',
  'title': 'The root schema',
  'description': 'Represents a valid listing that can be shown to public or not. User and system defined.',
  'default': {},
  'examples': [
    {
      'title': 'titlevsvsvsvsvsvs',
      'tags': [
        'tag1',
        'tag2',
        'autofocus',
      ],
      'desc': [
        255,
        13,
        216,
        168,
        216,
        167,
        217,
        132,
        216,
        186,
        216,
        177,
        216,
        168,
        217,
        138,
        40,
      ],
      'lat': '36.75',
      'lng': '3.05',
      'id': 1619916741,
      'pass': 'gohlrxvzv',
      'd': 0,
      'a': 1,
      'img': '1619916741686-778185982.PNG',
      'ara': false,
      'date': 'May 2, 2021',
    },
  ],
  'required': [
    'title',
    'tags',
    'desc',
    'lat',
    'lng',
    'id',
    'pass',
    'd',
    'a',
    'img',
    'ara',
    'date',
  ],
  'properties': {
    'title': {
      '$id': '#/properties/title',
      'type': 'string',
      'title': 'The title schema',
      'faker': 'lorem.sentence',
      'description': 'Title of a listing. (required) : a small string sentence in English or Arabic. User defined.',
      'default': '',
      'examples': [
        'titlevsvsvsvsvsvs',
      ],
    },
    'tags': {
      '$id': '#/properties/tags',
      'type': 'array',
      'title': 'The tags schema',
      'description': 'List of tags of a listing. User defined.',
      'default': [],
      'examples': [
        [
          'tag1',
          'tag2',
        ],
      ],
      'additionalItems': true,
      'items': {
        '$id': '#/properties/tags/items',
        'anyOf': [
          {
            '$id': '#/properties/tags/items/anyOf/0',
            'type': 'string',
            'title': 'The first anyOf schema',
            'faker': 'lorem.word',
            'description': 'An explanation about the purpose of this instance.',
            'default': '',
            'examples': [
              'tag1',
              'tag2',
            ],
          },
        ],
      },
    },
    'desc': {
      '$id': '#/properties/desc',
      'type': 'array',
      'title': 'The desc schema',
      'description': 'Description of a listing. (required) : a long string sentence in English or Arabic compressed in the optimised Uint8Array Array. User defined and encoded by system.',
      'default': [],
      'examples': [
        [
          255,
          13,
        ],
      ],
      'additionalItems': true,
      'items': {
        '$id': '#/properties/desc/items',
        'anyOf': [
          {
            '$id': '#/properties/desc/items/anyOf/0',
            'type': 'integer',
            'minimum': 1,
            'maximum': 255,
            'title': 'The first anyOf schema',
            'description': 'An explanation about the purpose of this instance.',
            'default': 0,
            'examples': [
              255,
              13,
            ],
          },
        ],
      },
    },
    'lat': {
      '$id': '#/properties/lat',
      'type': 'string',
      'title': 'The lat schema',
      'faker': 'address.latitude',
      'description': 'Latitude of a listing. (Optional) : a string number representing geolocation. User defined.',
      'default': '',
      'examples': [
        '36.75',
      ],
    },
    'lng': {
      '$id': '#/properties/lng',
      'type': 'string',
      'title': 'The lng schema',
      'faker': 'address.longitude',
      'description': 'Longitude of a listing. (Optional) : a string number representing geolocation. User defined.',
      'default': '',
      'examples': [
        '3.05',
      ],
    },
    'id': {
      '$id': '#/properties/id',
      'type': 'integer',
      'title': 'The id schema',
      'minimum': 1619916741,
      'maximum': 1621270923,
      'description': 'ID of a listing. (required) : a number representing epoch date of insertion. System defined.',
      'default': 0,
      'examples': [
        1619916741,
      ],
    },
    'pass': {
      '$id': '#/properties/pass',
      'type': 'string',
      'title': 'The pass schema',
      'faker': 'lorem.word',
      'description': 'password of a listing. (required) : a uniq random string for future deactivation. System defined.',
      'default': '',
      'examples': [
        'gohlrxvzv',
      ],
    },
    'd': {
      '$id': '#/properties/d',
      'type': 'integer',
      'title': 'The d schema',
      'minimum': 0,
      'maximum': 1,
      'description': 'Deactivated flag of a listing. (required) : System and Admin defined.',
      'default': 0,
      'examples': [
        0,
      ],
    },
    'a': {
      '$id': '#/properties/a',
      'type': 'integer',
      'title': 'The a schema',
      'minimum': 0,
      'maximum': 1,
      'description': 'Approved flag of a listing. (required) : System and Admin defined.',
      'default': 0,
      'examples': [
        1,
      ],
    },
    'img': {
      '$id': '#/properties/img',
      'type': 'string',
      'title': 'The img schema',
      'faker': 'system.filePath',
      'description': 'Image path in public folder. (optiona) : User and System defined.',
      'default': '',
      'examples': [
        '1619916741686-778185982.PNG',
      ],
    },
    'ara': {
      '$id': '#/properties/ara',
      'type': 'boolean',
      'title': 'The ara schema',
      'description': 'Arabic flag of a listing. (required) : if description is in Arabic. User and System defined.',
      'default': false,
      'examples': [
        false,
      ],
    },
    'date': {
      '$id': '#/properties/date',
      'type': 'string',
      'faker': 'date.recent',
      'title': 'The date schema',
      'description': 'Date of a listing. (generated) : System defined.',
      'default': '',
      'examples': [
        'May 2, 2021',
      ],
    },
  },
  'additionalProperties': true,
};

const items = [];
for (let index = 0; index < 10000; index++) {
  items.push(jsf.generate(schema));
}

// const syncValue = jsf.generate(schema);

