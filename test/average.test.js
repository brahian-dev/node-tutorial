const { average } = require('../utils/for_testing')

describe.skip('Average Test', () => {
    test('One only value', () => {
        const result =  average([1])

        expect(result).toBe(1)
    })

    test('Multiple Values', () => {
        const result =  average([1, 2, 3, 4, 5, 6])

        expect(result).toBe(3.5)
    })

    test('Empty Values', () => {
        const result =  average([])

        expect(result).toBe(0)
    })

    test('Undefined value', () => {
        const result =  average()

        expect(result).toBeUndefined()
    })
});
