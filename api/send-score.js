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
};
