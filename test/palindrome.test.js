const { palindrome } = require('../utils/for_testing')

test("Palindrome of brahiandev", () => {
    const result = palindrome('brahiandev')

    expect(result).toBe('vednaiharb')
})

test("Palindrome of Empty",  () => {
    const result = palindrome("")

    expect(result).toBe("")
})

test("Palindrome undefined", () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})