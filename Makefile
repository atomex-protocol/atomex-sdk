build:
	npm run lint
	npm run compile

install:
	npm i

docs:
	npm run gen-doc

test:
	npm run test

tutorial:
	cd docs && jupyter notebook