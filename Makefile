.PHONY: clean

COMPILE_COMMAND ?= closure-compiler
TEMPLATE_COMMAND = mako-render --var script_file=$(SCRIPT_NAME)
UPLOAD_DIR := upload
TEMP_DIR := temp

JS_FILES = $(wildcard *.js)
TEMP_SCRIPT := $(TEMP_DIR)/script.js
TEMP_MAP := $(TEMP_DIR)/script.map
SCRIPT_NAME = script.$(VERSION).js
SCRIPT = $(UPLOAD_DIR)/$(SCRIPT_NAME)
SCRIPT_MAP = $(UPLOAD_DIR)/script.$(VERSION).map
INDEX_FILE := index.html

calc_hash = $(shell openssl dgst -sha1 $(1) | cut -d' ' -f2 | cut -b1-8)

all: $(UPLOAD_DIR) $(UPLOAD_DIR)/index.html $(COMPILED_JS_FILES) $(UPLOAD_DIR)/bootstrap.min.css

$(TEMP_SCRIPT) $(TEMP_MAP): $(JS_FILES) $(TEMP_DIR)
	$(COMPILE_COMMAND) --js $(JS_FILES) --js_output_file $(TEMP_SCRIPT) --create_source_map $(TEMP_MAP)

$(UPLOAD_DIR)/index.html $(UPLOAD_DIR)/script%.js $(UPLOAD_DIR)/script%.map: $(INDEX_FILE) $(UPLOAD_DIR) $(TEMP_SCRIPT)
	$(eval VERSION := $(call calc_hash,$(TEMP_SCRIPT)))
	cp -f $(TEMP_SCRIPT) $(SCRIPT)
	cp -f $(TEMP_MAP) $(SCRIPT_MAP)
	$(TEMPLATE_COMMAND) $(INDEX_FILE) > $(UPLOAD_DIR)/index.html

$(UPLOAD_DIR)/%.css: %.css $(UPLOAD_DIR)
	cp "$<" "$@"

$(UPLOAD_DIR):
	mkdir "$(UPLOAD_DIR)"

$(TEMP_DIR):
	mkdir "$(TEMP_DIR)"

clean:
	@$(RM) -r $(UPLOAD_DIR)
	@$(RM) -r $(TEMP_DIR)
