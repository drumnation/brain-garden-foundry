export default function (plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Generate a new themed UI component with tests and stories',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
        validate: (value) => {
          if (/.+/.test(value)) {
            return /^[A-Z][a-zA-Z0-9]*$/.test(value)
              ? true
              : 'Component name must be in PascalCase (e.g., MyComponent)';
          }
          return 'Component name is required';
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'Component category:',
        choices: [
          'Data Display',
          'Inputs',
          'Layout',
          'Navigation',
          'Feedback',
          'Buttons',
          'Typography',
        ],
      },
    ],
    actions: [
      // Create component file
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.tsx',
        templateFile: '.generator/templates/component.tsx.hbs',
      },
      // Create test file
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.test.tsx',
        templateFile: '.generator/templates/component.test.tsx.hbs',
      },
      // Create story file
      {
        type: 'add',
        path: 'packages/ui-components/src/components/{{pascalCase name}}.stories.tsx',
        templateFile: '.generator/templates/component.stories.tsx.hbs',
      },
      // Update package index
      {
        type: 'append',
        path: 'packages/ui-components/src/index.ts',
        pattern: /(\/\/ COMPONENT EXPORTS)/,
        template:
          "export { {{pascalCase name}} } from './components/{{pascalCase name}}';\nexport type { {{pascalCase name}}Props } from './components/{{pascalCase name}}';",
      },
      // Success message
      function (data) {
        return `
✅ Component generated successfully!

Created files:
  - packages/ui-components/src/components/${data.name}.tsx
  - packages/ui-components/src/components/${data.name}.test.tsx
  - packages/ui-components/src/components/${data.name}.stories.tsx

Next steps:
  1. Run tests: pnpm --filter=@bg-kit/ui-components test
  2. View in Storybook: pnpm storybook (http://localhost:6006)
  3. Customize the component implementation
  4. Add more tests as needed

Category: ${data.category}
        `;
      },
    ],
  });
}
