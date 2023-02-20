const passport = require('passport');
const local = require('./localStrategy');
const kakao = require("./kakaoStrategy");
const User = require('../models/user');

module.exports = () => {
    // 처음 로그인시에만 실행
    // req.session 객체에 저장할 데이터를 정의
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 각 요청때 마다 라우터에 도달하기 전 passport.session 미들웨어가 실행
    // serializeUser의 done에 두번째 인자가
    // deserializeUser의 첫번째 인자가 됨
    // serializeUser에서 전달 받은 id로 DB에 사용자 정보 조회
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }]
        })
            // 조회한 정보를 req.user에 저장
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
    kakao();
};