const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (!process.env.RESEND_API_KEY) {
            console.error('❌ Resend API 키가 설정되지 않음');
            return res.status(500).json({ 
                error: 'Resend API 키가 설정되지 않았습니다.',
                details: 'Vercel 환경 변수에서 RESEND_API_KEY를 설정해주세요.'
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
};
