// 전역 변수
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let isAnswered = false;
let quizResult = null; // 퀴즈 결과 저장

// DOM 요소
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const contactScreen = document.getElementById('contact-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const contactBtn = document.getElementById('contact-btn');
const contactCancel = document.getElementById('contact-cancel');
const contactForm = document.getElementById('contact-form');
const sendEmailBtn = document.getElementById('send-email-btn');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const questionType = document.getElementById('question-type');
const optionsContainer = document.getElementById('options-container');
const inputContainer = document.getElementById('input-container');
const answerInput = document.getElementById('answer-input');
const submitAnswer = document.getElementById('submit-answer');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('score');
const questionNum = document.getElementById('question-num');
const totalQuestions = document.getElementById('total-questions');
const progress = document.getElementById('progress');
const finalScore = document.getElementById('final-score');
const finalTotal = document.getElementById('final-total');
const scorePercentage = document.getElementById('score-percentage');
const resultMessage = document.getElementById('result-message');

// 이벤트 리스너
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
submitAnswer.addEventListener('click', checkInputAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isAnswered) {
        checkInputAnswer();
    }
});
contactBtn.addEventListener('click', () => showScreen('contact-screen'));
contactCancel.addEventListener('click', () => showScreen('start-screen'));
contactForm.addEventListener('submit', handleContactSubmit);
sendEmailBtn.addEventListener('click', handleSendScoreEmail);

// 퀴즈 시작
function startQuiz() {
    currentQuiz = getRandomQuiz();
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showScreen('quiz-screen');
    displayQuestion();
}

// 화면 전환
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 문제 표시
function displayQuestion() {
    isAnswered = false;
    selectedAnswer = null;
    const question = currentQuiz[currentQuestionIndex];
    
    // 문제 정보 업데이트
    questionType.textContent = question.type;
    questionText.textContent = question.question;
    questionHint.textContent = question.hint || '';
    questionNum.textContent = currentQuestionIndex + 1;
    totalQuestions.textContent = currentQuiz.length;
    
    // 진행률 업데이트
    const progressPercent = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    progress.style.width = progressPercent + '%';
    
    // 피드백 초기화
    feedback.textContent = '';
    feedback.className = 'feedback';
    nextBtn.style.display = 'none';
    
    // 문제 유형에 따라 UI 변경
    if (question.answerType === 'multiple') {
        displayMultipleChoice(question);
    } else if (question.answerType === 'input') {
        displayInputQuestion(question);
    }
}

// 객관식 문제 표시
function displayMultipleChoice(question) {
    optionsContainer.style.display = 'grid';
    inputContainer.style.display = 'none';
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index, question));
        optionsContainer.appendChild(button);
    });
}

// 입력형 문제 표시
function displayInputQuestion(question) {
    optionsContainer.style.display = 'none';
    inputContainer.style.display = 'flex';
    answerInput.value = '';
    answerInput.focus();
}

// 옵션 선택
function selectOption(index, question) {
    if (isAnswered) return;
    
    selectedAnswer = index;
    isAnswered = true;
    
    // 모든 버튼 비활성화
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.add('disabled');
    });
    
    // 정답 확인
    const isCorrect = index === question.correct;
    const selectedBtn = document.querySelectorAll('.option-btn')[index];
    const correctBtn = document.querySelectorAll('.option-btn')[question.correct];
    
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
        updateScore();
        showFeedback('정답입니다! 🎉', true);
    } else {
        selectedBtn.classList.add('incorrect');
        correctBtn.classList.add('correct');
        showFeedback(`틀렸습니다. 정답은 "${question.options[question.correct]}"입니다.`, false);
    }
    
    showNextButton();
}

// 입력 답안 확인
function checkInputAnswer() {
    if (isAnswered) return;
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    const question = currentQuiz[currentQuestionIndex];
    const correctAnswer = question.answer.toLowerCase();
    
    isAnswered = true;
    
    // 정답 확인 (공백 무시, 대소문자 무시)
    const normalizedUserAnswer = userAnswer.replace(/\s+/g, ' ');
    const normalizedCorrectAnswer = correctAnswer.replace(/\s+/g, ' ');
    
    if (normalizedUserAnswer === normalizedCorrectAnswer) {
        score++;
        updateScore();
        showFeedback('정답입니다! 🎉', true);
    } else {
        showFeedback(`틀렸습니다. 정답은 "${question.answer}"입니다.`, false);
    }
    
    answerInput.disabled = true;
    submitAnswer.disabled = true;
    showNextButton();
}

// 피드백 표시
function showFeedback(message, isCorrect) {
    feedback.textContent = message;
    feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
}

// 다음 버튼 표시
function showNextButton() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        nextBtn.style.display = 'inline-block';
    } else {
        nextBtn.textContent = '결과 보기';
    }
}

// 다음 문제
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        answerInput.disabled = false;
        submitAnswer.disabled = false;
        displayQuestion();
    } else {
        showResults();
    }
}

// 점수 업데이트
function updateScore() {
    scoreDisplay.textContent = score;
}

// 결과 화면 표시
function showResults() {
    showScreen('result-screen');
    finalScore.textContent = score;
    finalTotal.textContent = currentQuiz.length;
    
    const percentage = Math.round((score / currentQuiz.length) * 100);
    scorePercentage.textContent = percentage + '%';
    
    // 결과 메시지
    let message = '';
    if (percentage === 100) {
        message = '완벽합니다! 🏆 일본어 실력이 뛰어나시네요!';
    } else if (percentage >= 80) {
        message = '훌륭합니다! 👍 일본어를 잘 아시는군요!';
    } else if (percentage >= 60) {
        message = '좋습니다! 📚 조금 더 공부하면 더 좋아질 거예요!';
    } else if (percentage >= 40) {
        message = '괜찮습니다! 💪 계속 연습하면 실력이 늘 거예요!';
    } else {
        message = '조금 더 공부해보세요! 📖 포기하지 마세요!';
    }
    
    resultMessage.textContent = message;
    
    // 퀴즈 결과 저장
    quizResult = {
        score: score,
        total: currentQuiz.length,
        percentage: percentage,
        message: message,
        date: new Date().toLocaleString('ko-KR')
    };
}

// 퀴즈 다시 시작
function restartQuiz() {
    showScreen('start-screen');
    quizResult = null;
}

// 연락 폼 제출
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    const feedback = document.getElementById('contact-feedback');
    
    if (!name || !phone) {
        feedback.textContent = '이름과 연락처는 필수 항목입니다.';
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'flex';
        return;
    }
    
    // 버튼 비활성화
    const submitBtn = document.getElementById('contact-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = '전송 중...';
    
    try {
        // Vercel 배포 시 자동으로 올바른 URL 사용
        const apiUrl = window.location.origin;
        const response = await fetch(`${apiUrl}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone, email, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            feedback.textContent = '연락 정보가 donglesaen@gmail.com으로 전송되었습니다!';
            feedback.className = 'feedback correct';
            feedback.style.display = 'flex';
            contactForm.reset();
            
            setTimeout(() => {
                showScreen('start-screen');
                feedback.style.display = 'none';
            }, 2000);
        } else {
            throw new Error(data.error || '전송 실패');
        }
    } catch (error) {
        feedback.textContent = '전송 중 오류가 발생했습니다: ' + error.message;
        feedback.className = 'feedback incorrect';
        feedback.style.display = 'flex';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '제출하기';
    }
}

// 성적표 이메일 전송
async function handleSendScoreEmail() {
    if (!quizResult) {
        alert('퀴즈 결과가 없습니다.');
        return;
    }
    
    // 항상 donglesaen@gmail.com으로 전송
    const email = 'donglesaen@gmail.com';
    
    const btn = sendEmailBtn;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '전송 중...';
    
    try {
        // Vercel 배포 시 자동으로 올바른 URL 사용
        const apiUrl = window.location.origin;
        const response = await fetch(`${apiUrl}/api/send-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                score: quizResult.score,
                total: quizResult.total,
                percentage: quizResult.percentage,
                message: quizResult.message,
                date: quizResult.date
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('성적표가 donglesaen@gmail.com으로 전송되었습니다!');
        } else {
            throw new Error(data.error || '전송 실패');
        }
    } catch (error) {
        alert('이메일 전송 중 오류가 발생했습니다: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}
