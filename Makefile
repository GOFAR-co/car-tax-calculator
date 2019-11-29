pre-commit: prettier-staged eslint test-ci

eslint:
	npx eslint .

prettier-staged:
	npx pretty-quick --staged

test-ci:
	npm run test-ci

.PHONY: pre-commit prettier-staged eslint
