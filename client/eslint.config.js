import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					printWidth: 100,
					semi: false,
					useTabs: true,
				},
			],
			'no-undef': 'error',
		},
		ignores: ['node_modules/**'],
	},
	eslintConfigPrettier,
]
