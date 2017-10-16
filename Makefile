clean:
	rm -rf build

build: clean
	npm run build

deploy: build
	netlify deploy
