import { modifier } from "ember-modifier";
import { readDOM, mutateDOM } from "ember-batcher";
import { assert } from "@ember/debug";

export default modifier(
  (
    element,
    _positional,
    { when: shouldFocus = true, onSelector: selector, withCursorAtEnd = false }
  ) => {
    if (shouldFocus) {
      readDOM(() => {
        // query for element if `onSelector` is passed in
        // otherwise use 'this.element' directly
        assert(
          "`onSelector` must be a string",
          typeof selector === "string" || selector === undefined
        );

        const el = selector ? element.querySelector(selector) : element;
        assert(
          "You can only `focus` on an `HTMLElement`",
          el instanceof HTMLElement
        );

        if (el && document.activeElement !== el) {
          mutateDOM(() => {
            el.focus();

            if (withCursorAtEnd) {
              assert(
                "`withCursorAtEnd` should only be passed if element is an input element",
                el instanceof HTMLInputElement ||
                  el instanceof HTMLTextAreaElement
              );

              const inputLength = el.value.length;
              el.setSelectionRange(inputLength, inputLength);
            }
          });
        }
      });
    }
  }
);
