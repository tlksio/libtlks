test:
	./node_modules/mocha/bin/mocha

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- -R spec

lint:
	./node_modules/.bin/gulp jshint

clean:
	./node_modules/.bin/gulp clean

.PHONY: test cover lint clean
