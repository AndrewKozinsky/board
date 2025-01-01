import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import tsParser from '@typescript-eslint/parser'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
	{
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
			'@stylistic/js': stylisticJs,
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
			'object-curly-spacing': ['warn', 'always'],
			'@stylistic/js/no-multiple-empty-lines': 'error',
		},
		ignores: ['node_modules/**'],
	},
	eslintConfigPrettier,
]
