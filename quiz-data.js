// 일본어 퀴즈 데이터
const quizData = [
    {
        type: "단어 번역",
        question: "こんにちは",
        hint: "인사말",
        options: ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "단어 번역",
        question: "ありがとう",
        hint: "감사 표현",
        options: ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
        correct: 1,
        answerType: "multiple"
    },
    {
        type: "단어 번역",
        question: "すみません",
        hint: "사과 표현",
        options: ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
        correct: 2,
        answerType: "multiple"
    },
    {
        type: "단어 번역",
        question: "さようなら",
        hint: "작별 인사",
        options: ["안녕하세요", "감사합니다", "죄송합니다", "안녕히 가세요"],
        correct: 3,
        answerType: "multiple"
    },
    {
        type: "한자 읽기",
        question: "水",
        hint: "물과 관련된 한자",
        options: ["みず", "かぜ", "ひ", "つち"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "한자 읽기",
        question: "火",
        hint: "불과 관련된 한자",
        options: ["みず", "かぜ", "ひ", "つち"],
        correct: 2,
        answerType: "multiple"
    },
    {
        type: "문장 번역",
        question: "私は学生です。",
        hint: "직업을 나타내는 문장",
        options: ["나는 학생입니다", "나는 선생님입니다", "나는 의사입니다", "나는 요리사입니다"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "로마자 입력",
        question: "おはよう",
        hint: "아침 인사",
        answer: "ohayou",
        answerType: "input"
    },
    {
        type: "로마자 입력",
        question: "ありがとうございます",
        hint: "정중한 감사 표현",
        answer: "arigatou gozaimasu",
        answerType: "input"
    },
    {
        type: "단어 번역",
        question: "本",
        hint: "읽는 것",
        options: ["책", "연필", "의자", "책상"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "단어 번역",
        question: "猫",
        hint: "동물",
        options: ["개", "고양이", "새", "물고기"],
        correct: 1,
        answerType: "multiple"
    },
    {
        type: "문장 번역",
        question: "今日はいい天気です。",
        hint: "날씨에 관한 문장",
        options: ["오늘은 좋은 날씨입니다", "오늘은 비가 옵니다", "오늘은 춥습니다", "오늘은 더웁니다"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "로마자 입력",
        question: "こんばんは",
        hint: "저녁 인사",
        answer: "konbanwa",
        answerType: "input"
    },
    {
        type: "한자 읽기",
        question: "山",
        hint: "자연 지형",
        options: ["やま", "かわ", "うみ", "はな"],
        correct: 0,
        answerType: "multiple"
    },
    {
        type: "단어 번역",
        question: "食べる",
        hint: "동작",
        options: ["먹다", "마시다", "자다", "일어나다"],
        correct: 0,
        answerType: "multiple"
    }
];

// 퀴즈 데이터를 랜덤하게 섞고 10개만 선택
function getRandomQuiz() {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
}
