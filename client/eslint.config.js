import tseslint from 'typescript-eslint'

export default tseslint.config({
	files: ['**/*.ts', '**/*.tsx'],
	languageOptions: {
		parser: tseslint.parser
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
		'comma-dangle': ['warn', {
			arrays: 'never',
			objects: 'always',
			imports: 'never',
			exports: 'always',
			functions: 'never',
		}],
		'no-multi-spaces': 'error',
		'space-in-parens': 'error',
		'prefer-const': 'warn',
	}
})
