import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, setupOnerror } from "@ember/test-helpers";
import type { TestContext as BaseTestContext } from "ember-test-helpers";
import { hbs } from "ember-cli-htmlbars";

interface TestContext extends BaseTestContext {
  testValue: string;
}

module("Integration | Modifier | focus", function (hooks) {
  setupRenderingTest(hooks);

  test("Element is immediately focused when invoked without `when`", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <input data-test-focus__input {{global-modifiers$focus}} />
    `);

    assert.dom("[data-test-focus__input]").isFocused("input is focused");
  });

  test("Button is immediately focused when invoked without `when`", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <button type='button' data-test-focus__button {{global-modifiers$focus}} />
    `);

    assert.dom("[data-test-focus__button]").isFocused("input is focused");
  });

  test("Element is focused when `when=true`", async function (assert) {
    assert.expect(1);
    await render(hbs`
      <input
        data-test-focus__input
        {{global-modifiers$focus when=true}}
      />
    `);

    assert.dom("[data-test-focus__input]").isFocused("input is focused");
  });

  test("Element is not focused when `when=false`", async function (assert) {
    assert.expect(1);
    await render(hbs`
      <input
        data-test-focus__input
        {{global-modifiers$focus when=false}}
      />
    `);

    assert.dom("[data-test-focus__input]").isNotFocused("input is not focused");
  });

  test("Button is focused when `when=true`", async function (assert) {
    assert.expect(1);
    await render(hbs`
      <button
        type='button'
        data-test-focus__button
        {{global-modifiers$focus when=true}}
      />
    `);

    assert.dom("[data-test-focus__button]").isFocused("button is focused");
  });

  test("Using modifier with `onSelector` works", async function (assert) {
    assert.expect(2);
    await render(hbs`
      <a
        href='#'
        data-test-focus__wrapper
        {{global-modifiers$focus
          when=true
          onSelector="input"
        }}
      >
        <input data-test-focus__input>
      </a>
    `);

    assert
      .dom("[data-test-focus__wrapper]")
      .isNotFocused("a wrapper is not focused");
    assert
      .dom("[data-test-focus__input")
      .isFocused("element with tag name is focused");
  });

  test("withCursorAtEnd works on input element", async function (this: TestContext, assert) {
    assert.expect(2);

    this.testValue = "test";

    await render(hbs`
      <input
        value={{this.testValue}}
        data-test-focus__input
        {{global-modifiers$focus
          when=true
          withCursorAtEnd=true
        }}
      />
    `);

    assert
      .dom("[data-test-focus__input]")
      .hasProperty(
        "selectionStart",
        this.testValue.length,
        "selection start is correct"
      );
    assert
      .dom("[data-test-focus__input]")
      .hasProperty(
        "selectionEnd",
        this.testValue.length,
        "selection end is correct"
      );
  });

  test("withCursorAtEnd works on textarea element", async function (this: TestContext, assert) {
    assert.expect(2);

    this.testValue = "test";

    await render(hbs`
      <textarea
        value={{this.testValue}}
        data-test-focus__textarea
        {{global-modifiers$focus
          when=true
          withCursorAtEnd=true
        }}
      />
    `);

    assert
      .dom("[data-test-focus__textarea]")
      .hasProperty("selectionStart", this.testValue.length);
    assert
      .dom("[data-test-focus__textarea]")
      .hasProperty("selectionEnd", this.testValue.length);
  });

  test("withCursorAtEnd should not be passed on non-input element", async function (assert) {
    assert.expect(2);

    setupOnerror(function (error: Error) {
      assert.equal(
        error.message,
        "Assertion Failed: withCursorAtEnd should only be passed if element is an input element",
        "correct error is thrown"
      );
    });

    await render(hbs`
      <button
        type='button'
        data-test-focus__button
        {{global-modifiers$focus
          when=true
          withCursorAtEnd=true
        }}
      />
    `);

    assert
      .dom("[data-test-focus__button]")
      .isFocused("button is still focused");
  });
});
