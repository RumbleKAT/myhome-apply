export const getColor = (sido: string) => {
    switch(sido){
        case "서울" : return "#27AE60";
        case "경기" : return "#27AE60";
        case "인천" : return "#27AE60";

        case "강원" : return "#7DCEA0";

        case "광주" : return "#A9DFBF";
        case "전남" : return "#A9DFBF";
        case "전북" : return "#A9DFBF";

        case "대전" : return "#6495ED";
        case "충남" : return "#6495ED";
        case "충북" : return "#6495ED";
        case "세종" : return "#6495ED";

        case "경남" : return "#76D7C4";
        case "부산" : return "#76D7C4";
        case "대구" : return "#76D7C4";
        case "경북" : return "#76D7C4";
        case "울산" : return "#76D7C4";

        case "기타" : return "#40E0D0";
        case "제주" : return "#40E0D0";
    }
}

export const leftPad = (value:number) =>{
    if(value >= 10) return value;
    return `0${value}`;
}

export const toStringByFormatting = (source: Date, delimiter:string = '-') => {
    const year = source.getFullYear(); 
    const month = leftPad(source.getMonth() + 1); 
    const day = leftPad(source.getDate()); 
    return [year, month, day].join(delimiter); 
}
