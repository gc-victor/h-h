PHONY: examples

help: ## Show this help message
	@echo 'usage: make [target] <type> <name>'
	@echo
	@echo 'Targets:'
	@egrep '^(.+)\:\ ##\ (.+)' ${MAKEFILE_LIST} | column -t -c 2 -s ':#'

browser : static ## Run a browser example
	npx @dev-pack/dev-pack start;\

build : ## Build distribution files
	npx tsdx build --format cjs,esm,umd --name h-h || exit $? ; \

format : ## Enforces a consistent style by parsing your code and re-printing it
	npx prettier --write "{src,test}/**/*.ts" ;\

lint : ## Linting utility
	npx tsdx lint --fix ;\

precommit: lint format

static : ## Run a static site generator example
	node -r esm examples/static.js; \

watch : ## Execute dist and watch
	npx tsdx watch --format cjs,esm,umd --name h-h ; \

# catch anything and do nothing
%:
	@:
