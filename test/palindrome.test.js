const { palindrome } = require('../utils/for_testing')

test.skip("Palindrome of brahiandev", () => {
    const result = palindrome('brahiandev')

    expect(result).toBe('vednaiharb')
})

test.skip("Palindrome of Empty",  () => {
    const result = palindrome("")

    expect(result).toBe("")
})

test.skip("Palindrome undefined", () => {
    const result = palindrome()

    expect(result).toBeUndefined()
})