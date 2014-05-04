NODE_BIN=./node_modules/.bin

all: check build

check: test lint

test:
	$(NODE_BIN)/mocha --require should
lint:
	$(NODE_BIN)/jshint index.js

build: components index.js
	$(NODE_BIN)/component build --dev

components: component.json
	$(NODE_BIN)/component install --dev

clean:
	rm -fr build components

.PHONY: clean lint test check all
