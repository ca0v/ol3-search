import { should, shouldEqual } from "ol3-fun/tests/base";
import {describe, it} from "mocha"; // why not get this from ol3-fun as well?
import { IOptions, SearchForm } from "../../index";

describe("SearchForm Tests", () => {
    it("SearchForm", () => {
        should(!!SearchForm, "SearchForm");
    });

    it("DEFAULT_OPTIONS", () => {
        let options = SearchForm.DEFAULT_OPTIONS;
        checkDefaultInputOptions(options);
    });

    it("options of an Input instance", () => {
        let input = SearchForm.create();
        checkDefaultInputOptions(input.options);
    });

});

function checkDefaultInputOptions(options: IOptions) {
    should(!!options, "options");
    shouldEqual(options.autoChange, false, "autoChange");
    shouldEqual(options.autoClear, false, "autoClear");
    shouldEqual(options.autoCollapse, true, "autoCollapse");
    shouldEqual(options.canCollapse, true, "canCollapse");
    shouldEqual(options.className, "ol-input", "className");
    should(options.closedText.length > 0, "closedText");
    shouldEqual(options.expanded, false, "expanded");
    shouldEqual(options.hideButton, false, "hideButton");
    shouldEqual(!!options.openedText, true, "openedText");
    shouldEqual(options.position, "bottom left", "position");
    shouldEqual(options.render, undefined, "render");
    shouldEqual(options.source, undefined, "source");
    shouldEqual(options.target, undefined, "target");
}
