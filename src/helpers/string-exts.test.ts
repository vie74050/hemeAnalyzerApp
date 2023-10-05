import "./string-exts";

// test utils scrub method
describe("scrub method", () => {
    test("should remove spaces and special chars", () => {
        const testString = "  It!@#$%^&*()_+  em";
        const result = testString.scrub();
        expect(result).toBe("item");
    });
});