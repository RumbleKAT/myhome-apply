export default defineNuxtPlugin(() => {
    return {
      provide: {
        hello: (param) => {
          //화면 단에 필요한 플러그인 추가시 사용
          return `${param} world`;
        }
      }
    }
  })