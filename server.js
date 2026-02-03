const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// 연락 정보 전송
app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        
        if (!name || !phone || !email) {
            return res.status(400).json({ error: '모든 필수 항목을 입력해주세요.' });
        }
        
        const emailContent = `
            <h2>새로운 연락 요청</h2>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>연락처:</strong> ${phone}</p>
            <p><strong>이메일:</strong> ${email}</p>
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
            console.error('Resend error:', error);
            return res.status(500).json({ error: '이메일 전송 실패' });
        }
        
        res.json({ success: true, messageId: data.id });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// 성적표 이메일 전송
app.post('/api/send-score', async (req, res) => {
    try {
        const { email, score, total, percentage, message, date } = req.body;
        
        if (!email || score === undefined || !total) {
            return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
        }
        
        // 사용자에게 보낼 성적표 이메일
        const userEmailContent = `
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
        
        // 사용자에게 성적표 전송
        const { data: userData, error: userError } = await resend.emails.send({
            from: 'Japanese Quiz <onboarding@resend.dev>',
            to: [email],
            subject: '일본어 퀴즈 성적표',
            html: userEmailContent,
        });
        
        if (userError) {
            console.error('Resend error (user):', userError);
            return res.status(500).json({ error: '이메일 전송 실패' });
        }
        
        // 관리자에게도 알림 전송
        const adminEmailContent = `
            <h2>성적표 전송 알림</h2>
            <p><strong>받는 사람:</strong> ${email}</p>
            <p><strong>점수:</strong> ${score}/${total} (${percentage}%)</p>
            <p><strong>완료 시간:</strong> ${date}</p>
        `;
        
        await resend.emails.send({
            from: 'Japanese Quiz <onboarding@resend.dev>',
            to: ['donglesaen@gmail.com'],
            subject: `[일본어 퀴즈] 성적표 전송 - ${email}`,
            html: adminEmailContent,
        });
        
        res.json({ success: true, messageId: userData.id });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`Resend API 키가 설정되어 있는지 확인하세요.`);
});
