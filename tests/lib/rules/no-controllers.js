//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-controllers');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('no-controllers', rule, {
  valid: [
    `
      import Controller from '@ember/controller';
      export default Controller.extend({
        someFunction() {},
        query: null,
        sortType: null,
        sortOrder: null,
        queryParams: ['query', 'sortType', 'sortOrder']
      });
    `,
    `
      import Controller from '@ember/controller';
      export default class ArticlesController extends Controller {
        get filteredArticles() {}
        @tracked category = null;
        queryParams = ['category'];
      }
    `,
  ],

  invalid: [
    // ***************
    // Legacy classes:
    // ***************

    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend();
      `,
      output: null,
      errors: [{ type: 'CallExpression', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend(SomeMixin);
      `,
      output: null,
      errors: [{ type: 'CallExpression', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({});
      `,
      output: null,
      errors: [{ type: 'CallExpression', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend({
          randomProperty: true,
          randomFunction() {}
        });
      `,
      output: null,
      errors: [{ type: 'CallExpression', message: ERROR_MESSAGE }],
    },
    {
      // With mixin.
      code: `
        import Controller from '@ember/controller';
        export default Controller.extend(SomeMixin, {
          randomProperty: true,
          randomFunction() {}
        });
      `,
      output: null,
      errors: [{ type: 'CallExpression', message: ERROR_MESSAGE }],
    },

    // ***************
    // Native classes:
    // ***************

    {
      code: `
        import Controller from '@ember/controller';
        export default class ArticlesController extends Controller {}
      `,
      output: null,
      errors: [{ type: 'ClassDeclaration', message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Controller from '@ember/controller';
        export default class ArticlesController extends Controller {
          randomProperty = true;
          get filteredArticles() {}
        }
      `,
      output: null,
      errors: [{ type: 'ClassDeclaration', message: ERROR_MESSAGE }],
    },
  ],
});
