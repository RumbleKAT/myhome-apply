import { getColor, leftPad, toStringByFormatting } from "../../server/utils/Color";

describe('Color Files Validation',()=>{
    test('서울 컬러 리턴 확인',()=>{
        expect(getColor("서울")).toBe("#27AE60");
    });

    test("leftPad Test",()=>{
        const November = 11;
        const September = 9;

        expect(leftPad(November)).toBe(11);
        expect(leftPad(September)).toBe("09");
    });

    test("Date TypeFormating Test return (2022-05-12)",()=>{
        const currentDate = new Date(2022, 4, 12);
        expect(toStringByFormatting(currentDate)).toBe("2022-05-12");
    });
});