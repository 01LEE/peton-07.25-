// 사용자가 인증되었는지 확인
// 인증되어 있지 않을 경우 로그인 페이지로 리디렉션

function isAuthenticated(req, res, next) {
    if (req.session.login_id) {
      return next();
    } else {
      res.redirect('/login');
    }
  }
  
  module.exports = isAuthenticated;
 
  
