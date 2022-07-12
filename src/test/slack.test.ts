import { sendMessage } from "../../server/utils/Slack";

describe('slack test',()=>{
    test('테스트 메시지 전송',()=>{
        // expect(sendMessage("서울")).toBe("#27AE60");
        sendMessage('test...');
    });
});

/*
특정 파일만 돌릴 땐
$ jest --detectOpenHandles --forceExit slack.test.ts
*/