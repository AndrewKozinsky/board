import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config([{
	files: ['**/*.ts', '**/*.tsx'],
	languageOptions: {
		parser: tseslint.parser
	},
	plugins: {
		prettier: prettierPlugin,
	},
	rules: {
		'no-multiple-empty-lines': ['error', {
			max: 1,
			maxEOF: 1,
			maxBOF: 0
		}],
		'object-curly-spacing': ['warn', 'always'],
		indent: ['warn', 'tab'],
		quotes: ['warn', 'single'],
		'jsx-quotes': ['warn', 'prefer-single'],
		semi: ['warn', 'never'],
		/*'comma-dangle': ['warn', {
			arrays: 'never',
			objects: 'always',
			imports: 'never',
			exports: 'always',
			functions: 'never',
		}],*/
		'no-multi-spaces': 'error',
		'space-in-parens': 'error',
		'prettier/prettier': ['error', {
			semi: false,
			singleQuote: true,
			tabWidth: 4,
			useTabs: true,
			printWidth: 120,
			trailingComma: 'all',
			jsxSingleQuote: true,
		}],
	}
}])

