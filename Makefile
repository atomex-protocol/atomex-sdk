.PHONY: test typedoc

build:
	npm run lint
	npm run compile

install:
	npm i
	
test:
	npm run test

typedoc:
	node_modules/.bin/typedoc --out typedoc

tutorial:
	npm run compile
	cd docs && jupyter notebook

spec-update:
	curl https://api.test.atomex.me/v1/swagger.json > test/swagger.json