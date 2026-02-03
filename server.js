const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
    console.error('⚠️  경고: RESEND_API_KEY 환경 변수가 설정되지 않았습니다.');
    console.error('PowerShell에서 다음 명령어로 설정하세요:');
    console.error('$env:RESEND_API_KEY="your_api_key_here"');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

app.use(cors());
app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        hasApiKey: !!RESEND_API_KEY,
        port: process.env.PORT || 3000
    });
});

// 연락 정보 전송
app.post('/api/contact', async (req, res) => {
    try {
        if (!resend) {
            console.error('❌ Resend API 키가 설정되지 않음');
            return res.status(500).json({ 
                error: 'Resend API 키가 설정되지 않았습니다. 서버 관리자에게 문의하세요.',
                details: 'RESEND_API_KEY 환경 변수를 설정해주세요.'
            });
        }
        
        const { name, phone, email, message } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ error: '이름과 연락처는 필수 항목입니다.' });
        }
        
        console.log(`📧 연락 요청 수신: ${name} (${phone})${email ? ` - ${email}` : ''}`);
        
        const emailContent = `
            <h2>새로운 연락 요청</h2>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>연락처:</strong> ${phone}</p>
            ${email ? `<p><strong>이메일:</strong> ${email}</p>` : '<p><strong>이메일:</strong> (입력하지 않음)</p>'}
            ${message ? `<p><strong>메시지:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
            <hr>
            <p style="color: #8E8E8E; font-size: 12px;">일본어 퀴즈 웹사이트에서 전송된 메시지입니다.</p>
        `;
        
        const { data, error } = await resend.emails.send({
            from: 'Japanese Quiz <onboarding@resend.dev>',
            to: ['donglesaen@gmail.com'],
            subject: `[일본어 퀴즈] 연락 요청 - ${name}`,
            html: emailContent,
        });
        
        if (error) {
            console.error('❌ Resend error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ 
                error: `이메일 전송 실패: ${error.message || '알 수 없는 오류'}`,
                details: error
            });
        }
        
        console.log(`✅ 이메일 전송 성공: ${data.id}`);
        res.json({ success: true, messageId: data.id });
    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ 
            error: `서버 오류가 발생했습니다: ${error.message}`,
            details: error.stack
        });
    }
});

// 성적표 이메일 전송
app.post('/api/send-score', async (req, res) => {
    try {
        if (!resend) {
            console.error('❌ Resend API 키가 설정되지 않음');
            return res.status(500).json({ 
                error: 'Resend API 키가 설정되지 않았습니다. 서버 관리자에게 문의하세요.',
                details: 'RESEND_API_KEY 환경 변수를 설정해주세요.'
            });
        }
        
        const { score, total, percentage, message, date } = req.body;
        
        if (score === undefined || !total) {
            return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
        }
        
        // 항상 donglesaen@gmail.com으로 전송
        const email = 'donglesaen@gmail.com';
        
        console.log(`📧 성적표 전송 요청: ${email} (${score}/${total})`);
        
        // 성적표 이메일 내용
        const emailContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #262626; text-align: center; margin-bottom: 30px;">🇯🇵 일본어 퀴즈 성적표</h1>
                
                <div style="background: #FAFAFA; border: 1px solid #DBDBDB; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(45deg, #E1306C 0%, #C13584 50%, #833AB4 100%); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 2em; font-weight: 600; margin-bottom: 20px;">
                        ${score}<span style="font-size: 0.5em; opacity: 0.9;">/${total}</span>
                    </div>
                    <p style="font-size: 1.5em; color: #262626; font-weight: 600; margin: 0;">${percentage}%</p>
                </div>
                
                <div style="background: #FFFFFF; border: 1px solid #DBDBDB; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <p style="color: #8E8E8E; font-size: 0.875em; margin: 0; line-height: 1.5;">${message}</p>
                </div>
                
                <div style="text-align: center; color: #8E8E8E; font-size: 0.75em; margin-top: 30px;">
                    <p>퀴즈 완료 시간: ${date}</p>
                    <p style="margin-top: 10px;">일본어 퀴즈 웹사이트</p>
                </div>
            </div>
        `;
        
        // donglesaen@gmail.com으로 성적표 전송
        const { data, error } = await resend.emails.send({
            from: 'Japanese Quiz <onboarding@resend.dev>',
            to: [email],
            subject: '일본어 퀴즈 성적표',
            html: emailContent,
        });
        
        if (error) {
            console.error('❌ Resend error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ 
                error: `이메일 전송 실패: ${error.message || '알 수 없는 오류'}`,
                details: error
            });
        }
        
        console.log(`✅ 성적표 이메일 전송 성공: ${data.id} → ${email}`);
        
        res.json({ success: true, messageId: data.id });
    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ 
            error: `서버 오류가 발생했습니다: ${error.message}`,
            details: error.stack
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`📍 API 엔드포인트: http://localhost:${PORT}`);
    console.log(`🔑 Resend API 키: ${RESEND_API_KEY ? '✅ 설정됨' : '❌ 설정되지 않음'}`);
    if (!RESEND_API_KEY) {
        console.log(`\n⚠️  Resend API 키를 설정하려면:`);
        console.log(`   PowerShell: $env:RESEND_API_KEY="your_api_key_here"`);
        console.log(`   그 다음 서버를 재시작하세요.\n`);
    }
});
