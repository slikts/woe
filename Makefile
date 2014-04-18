REPORTER ?= dot

test: ;	@NODE_ENV=test ./node_modules/.bin/mocha \
	--timeout 1000 --reporter $(REPORTER) --recursive test

.PHONY: test