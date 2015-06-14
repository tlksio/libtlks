test:
	./node_modules/mocha/bin/mocha

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec
	./node_modules/.bin/gulp coveralls
	CODECLIMATE_REPO_TOKEN=08ab0b206453b5f6ebe1973a729bdb0de3264b0ab28823228307939f65948d46 ./node_modules/.bin/codeclimate < coverage/lcov.info

lint:
	./node_modules/.bin/gulp jshint

clean:
	./node_modules/.bin/gulp clean

dist:
	./node_modules/.bin/gulp dist

all: lint test dist

.PHONY: test cover lint clean dist all
