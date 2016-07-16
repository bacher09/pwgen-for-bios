.PHONY: clean

COMPILE_COMMAND ?= closure-compiler
UPLOAD_DIR = upload

JS_FILES = $(wildcard *.js)
COMPILED_JS_FILES = $(JS_FILES:%.js=$(UPLOAD_DIR)/%.min.js)

INDEX_FILE = index.html

all: $(UPLOAD_DIR) $(UPLOAD_DIR)/index.html $(COMPILED_JS_FILES) $(UPLOAD_DIR)/bootstrap.min.css

$(UPLOAD_DIR)/%.min.js: %.js $(UPLOAD_DIR)
	$(COMPILE_COMMAND) $< --js_output_file $@

$(UPLOAD_DIR)/index.html: $(INDEX_FILE) $(UPLOAD_DIR)
	cp "$<" "$@"

$(UPLOAD_DIR)/%.css: %.css
	cp "$<" "$@"

$(UPLOAD_DIR):
	mkdir "$(UPLOAD_DIR)"

clean:
	@$(RM) -r $(UPLOAD_DIR)
