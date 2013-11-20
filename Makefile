
COMPILE_COMMAND = closure-compiler

JS_FILES = $(filter-out %.min.js, $(wildcard *.js))
COMPILED_JS_FILES = $(JS_FILES:%.js=%.min.js)

%.min.js: $(JS_FILES)
	$(COMPILE_COMMAND) $< --js_output_file $@

all: $(COMPILED_JS_FILES)
