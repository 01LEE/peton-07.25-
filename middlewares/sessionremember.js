// 사용자가 Remember ME 옵션을 선택했는지 확인
// Remember ME 쿠키가 있는 경우 세션에 사용자 정보를 복원

function sessionremember(req, res, next) {
    if (!req.session.login_id && req.cookies && req.cookies.rememberMe) {
      req.session.login_id = req.cookies.rememberMe;
    }
    next();
  }
  
  module.exports = sessionremember;
  