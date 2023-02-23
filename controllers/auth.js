const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const existUser = await User.findOne({ where: { email } });
        if (existUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash
        });
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

exports.login = (req, res, next) => {
    // 첫번째 인자가 어떤 전략으로 로그인 할지 선택
    // 성공 또는 실패시 두번째 콜백함수 호출
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        // Passport가 req에 login과 logout메서드를 호출하기 때문에 login 메서드 호출 가능
        // login 메서드를 호출하면 passports/index.js에 설정해 놓은 serializeUser를 호출함
        // 이 때 user 객체가 serializeUser로 전달됨
        // connect.sid 세션 쿠키가 브라우저에 전달됨
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    // Passport가 req에 생성한 logout 메서드는 req.user(serializeUser에서 만들어짐)객체와 
    // req.session(deSerializeUser에서 만들어짐) 객체를 제거함
    // 세션 정보를 제거한 뒤 콜백함수 호출
    req.logout(() => {
        res.redirect('/');
    });
};