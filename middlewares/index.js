// Passport가 req 객체에 isAuthenticated 메서드를 추가함
// 로그인 상태면 ture, 로그아웃 상태면 false 를 반환
// 이 메서드로 로그인 상태 확인 가능

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};