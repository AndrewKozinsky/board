import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'

export default [
	{
		parser: '@typescript-eslint/parser',
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parserOptions: {
				parser: tsParser,
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
			'no-unused-vars': "off",
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					printWidth: 100,
					semi: false,
					useTabs: true,
				},
			],
		},
		ignores: ['node_modules/**'],
	},
	eslintConfigPrettier,
]
