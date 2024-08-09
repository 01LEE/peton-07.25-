const { log } = require('console');
const db = require('../db');
const path = require('path');
const fs = require('fs');

const sessionDir = path.join(__dirname, '..', '../sessions');

function checkSessionFiles() {
  fs.readdir(sessionDir, (err, files) => {
    if (err) {
      console.error('세션 디렉토리 읽기 중 에러 발생: ', err);
    } else {
      console.log('현재 세션 파일 목록: ', files);
    }
  });
}

exports.getMyInfo = (req, res) => {
  const query = `
    SELECT 
      user.user_id, user.login_id, user.nick_name, user.password, user.create_time, user.update_time, user.user_intro, user.pw_update_time, user.pw_find, user.email, user.profile_image_url
      FROM user
      WHERE user.login_id = ?`;
  db.query(query, [req.session.login_id], (err, results) => {
    if (err) {
      console.error("내 정보 조회 중 에러 발생: ", err);
      res.status(500).send('서버 에러');
      return;
    }

    const userInfo = results.length > 0 ? results[0] : {};
    res.render('myinfo', { myInfos:[userInfo]});
  });
};

exports.updateMyInfo = (req, res) => {
  const { user_id, nick_name, user_intro } = req.body;

  const userQuery = 'UPDATE user SET nick_name = ?, user_intro = ?, update_time = NOW() WHERE user_id = ?';


  db.query(userQuery, [nick_name, user_intro, user_id], (err, result) => {
    if (err) {
      console.error("내 정보 수정 중 에러 발생: ", err);
      return res.status(500).send('서버 에러');
    }
          res.send('<script>alert("정보 수정 성공!"); window.location.href = "/myinfo";</script>');
        });
      }
      
   

exports.renderaddpet = (req, res) => {
  console.log('Rendering Add Pet page');
  res.render('addpet'); // 'addpet' 템플릿을 렌더링
};


exports.updateaddpet = (req, res) => {
  console.log('Adding pet:', req.body); // 디버깅 로그 추가

  const { pet_name, pet_breed, pet_age, pet_intro, pet_image_url } = req.body;
  const userId = req.session.userid;
  console.log('세션에서 가져온 userId:', userId);

  if (!userId) {
    return res.status(400).send('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
  }

  const query = 'INSERT INTO pet (user_id, pet_name, pet_breed, pet_age, pet_intro, pet_image_url) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [userId, pet_name, pet_breed, pet_age, pet_intro, pet_image_url], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }

    console.log('Pet added successfully');
    res.redirect('/myinfo');
  });
};

exports.mypets = (req, res) => {
  const userId = req.session.userid;
  console.log('Fetching pets for user:', userId);

  if (!userId) {
    console.log(userId);
    return res.status(400).send('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
  }

  // pet_id를 기준으로 정렬하여 쿼리 실행
  db.query('SELECT * FROM pet WHERE user_id = ? ORDER BY pet_id', [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }

    console.log('Fetched pets:', results);
    res.render('mypets', { pets: results });
  });
};

exports.petdetail = (req, res) => {
  const petId = req.params.pet_id;
  const query = 'SELECT * FROM pet WHERE pet_id = ?';
  db.query(query, [petId], (err, results) => {
    if (err) {
      console.error("반려동물 정보 조회 중 에러 발생: ", err);
      return res.status(500).send('서버 에러');
    }

    if (results.length > 0) {
      res.render('petdetail', { pet: results[0] });
    } else {
      res.status(404).send('반려동물 정보를 찾을 수 없습니다.');
    }
  });
};

//   // 데이터베이스에서 반려동물의 상세 정보 가져오기
//   const query = 'SELECT * FROM pet WHERE pet_id = ?';
//   db.query(query, [petId], (err, results) => {
//     if (err) {
//       console.error('Database query error:', err);
//       return res.status(500).send('서버 오류가 발생했습니다.');
//     }

//     if (results.length > 0) {
//       res.render('petdetails', { pet: results[0] });
//     } else {
//       res.status(404).send('반려동물을 찾을 수 없습니다.');
//     }
//  });

// };

exports.updatepetdetail = (req, res) => {
  const petId = req.params.pet_id;
  const { pet_name, pet_breed, pet_age, pet_intro } = req.body;

  let query = `
    UPDATE pet
    SET pet_name = ?, pet_breed = ?, pet_age = ?, pet_intro = ?`;

  const queryParams = [pet_name, pet_breed, pet_age, pet_intro];

  // 이미지 파일이 업로드된 경우 이미지 URL도 업데이트
  if (req.file) {
    const pet_image_url = req.body.pet_image_url;
    query += `, pet_image_url = ?`;
    queryParams.push(pet_image_url);
  }

  query += ` WHERE pet_id = ?`;
  queryParams.push(petId);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }
    res.redirect(`/pet/${petId}`);
  });
};

exports.deletepetdetail = (req,res) => {
  const petId = req.params.pet_id;
  
  const query = `DELETE FROM pet WHERE pet_id = ?`;

  db.query(query, [petId], (err,result) => {
    console.log('ㅅㅄㅄㅄㅂ',result);
    if(err){
      console.err('err deleteing pet',err);
    return res.status(500).send('server error');
    }

    console.log('pet deleted successfully:', result);
    res.send('<script>alert("반려동물이 성공적으로 삭제되었습니다."); window.location.href = "/mypets";</script>');
  });
}


exports.deleteuser = (req, res) => {
  const userId = req.session.userid;

  req.session.destroy((err) => {
    if (err) {
      console.error("세션 파괴 중 에러 발생: ", err);
      return res.status(500).send('서버 에러');
    }

    console.log('세션 파괴 완료');
    res.clearCookie('connect.sid', { path: '/' });
    checkSessionFiles(); // 세션 파일 확인

    const participantsQuery = 'DELETE FROM participants WHERE user_id = ?';
    const sessionsQuery = 'DELETE FROM sessions WHERE user_id = ?';
    const petsQuery = 'DELETE FROM pet WHERE user_id = ?';
    const userQuery = 'DELETE FROM user WHERE user_id = ?';

    db.query(participantsQuery, [userId], (err, result) => {
      if (err) {
        console.error('Error deleting participants:', err);
        return res.status(500).send('Server error deleting participants');
      }
      console.log('Participants deleted successfully:', result);

      db.query(sessionsQuery, [userId], (err, result) => {
        if (err) {
          console.error('Error deleting sessions:', err);
          return res.status(500).send('Server error deleting sessions');
        }
        console.log('Sessions deleted successfully:', result);

        db.query(petsQuery, [userId], (err, result) => {
          if (err) {
            console.error('Error deleting pets:', err);
            return res.status(500).send('Server error deleting pets');
          }
          console.log('Pets deleted successfully:', result);

          db.query(userQuery, [userId], (err, result) => {
            if (err) {
              console.error('Error deleting user:', err);
              return res.status(500).send('Server error deleting user');
            }
            console.log('User deleted successfully:', result);
            res.send('<script>alert("회원이 성공적으로 삭제되었습니다."); window.location.href = "/login";</script>');
          });
        });
      });
    });
  });
};


exports.updatePetImage = (req, res) => {
  const petId = req.params.pet_id;
  const pet_image_url = req.body.pet_image_url;

  const query = `
    UPDATE pet
    SET pet_image_url = ?
    WHERE pet_id = ?
  `;

  db.query(query, [pet_image_url, petId], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }
    res.redirect(`/pet/${petId}`);
  });
};

