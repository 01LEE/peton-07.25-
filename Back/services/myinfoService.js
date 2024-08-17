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
      user.user_id, user.login_id, user.nick_name, user.create_time, user.update_time, user.user_intro, user.pw_update_time, user.email, user.profile_image_url
    FROM user
    WHERE user.login_id = ?`;
        
  console.log("세션에서 가져온 로그인 ID:", req.session.login_id);

  db.query(query, [req.session.login_id], (err, results) => {
    if (err) {
      console.error("내 정보 조회 중 에러 발생: ", err);
      res.status(500).json({ success: false, message: '서버 에러' });
      return;
    }

    if (results.length > 0) {
      const userInfo = results[0];
      console.log('유저 정보:', userInfo);
      res.status(200).json({ success: true, userInfo });
    } else {
      res.status(404).json({ success: false, message: '사용자 정보를 찾을 수 없습니다.' });
    }
  });
};

exports.updateMyInfo = (req, res) => {
  const user_id = req.session.userid;
  const { login_id, nick_name, user_intro } = req.body;

  console.log("User Info (JSON):", JSON.stringify({ login_id, nick_name, user_intro, user_id }, null, 2));
  
  if (!user_id) {
    console.error("유저 ID가 세션에 없습니다.");
    return res.status(400).json({ success: false, message: "유저 ID가 세션에 없습니다." });
  }

  const userQuery = 'UPDATE user SET nick_name = ?, user_intro = ?, login_id  = ?, update_time = NOW() WHERE user_id = ?';
  
  db.query(userQuery, [nick_name, user_intro, login_id, user_id], (err, result) => {
    if (err) {
      console.error("유저 정보 업데이트 중 에러 발생: ", err);
      res.status(500).json({ success: false, message: '서버 에러' });
      return;
    }
    console.log('유저 정보 업데이트 성공:', result);
    res.status(200).json({ success: true, message: '유저 정보 업데이트 성공' });
  });
};

exports.updateaddpet = (req, res) => {
  console.log('Adding pet:', req.body);

  const { pet_name, pet_breed, pet_intro, pet_image_url, birth_date } = req.body;
  const userId = req.session.userid;
  console.log('세션에서 가져온 userId:', userId);

  if (!userId) {
    return res.status(400).send('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
  }

  const query = 'INSERT INTO pet (user_id, pet_name, pet_breed, pet_intro, pet_image_url, birth_date) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [userId, pet_name, pet_breed, pet_intro, pet_image_url, birth_date], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('서버 오류가 발생했습니다.');
    }

    console.log('Pet added successfully');
    res.status(200).json({ success: true, message: '반려동물 정보가 성공적으로 추가되었습니다.' });
  });
};

exports.mypets = (req, res) => {
  const userId = req.session.userid;
  console.log('Fetching pets for user:', userId);

  if (!userId) {
    return res.status(400).send('사용자 정보가 없습니다. 로그인 후 다시 시도해주세요.');
  }

  db.query('SELECT * FROM pet WHERE user_id = ? ORDER BY pet_id', [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    console.log('Fetched pets:', results);
    res.status(200).json({ success: true, pets: results });
  });
};  

exports.petdetail = (req, res) => {
  const petId = req.params.pet_id;
  console.log('펫 ID:', petId);
  
  const query = 'SELECT * FROM pet WHERE pet_id = ?';
  db.query(query, [petId], (err, results) => {
    if (err) {
      console.error("반려동물 정보 조회 중 에러 발생: ", err);
      return res.status(500).json({ success: false, message: '서버 에러' });
    }

    if(results != null){
      
    }
    if (results.length > 0) {
      res.status(200).json({ success: true, pet: results[0] });
      
    } else {
      res.status(404).json({ success: false, message: '반려동물 정보를 찾을 수 없습니다.' });
    }
  });
};

exports.updatepetdetail = (req, res) => {
  const petId = req.params.pet_id;
  const { pet_name, pet_breed, pet_intro, birth_date } = req.body;

  let query = `
    UPDATE pet
    SET pet_name = ?, pet_breed = ?, pet_intro = ?, birth_date = ?`;

  const queryParams = [pet_name, pet_breed, pet_intro, birth_date];

  if (req.body.pet_image_url) {
    const pet_image_url = req.body.pet_image_url;
    query += `, pet_image_url = ?`;
    queryParams.push(pet_image_url);
  }

  query += ` WHERE pet_id = ?`;
  queryParams.push(petId);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
    res.status(200).json({ success: true, message: '반려동물 정보가 성공적으로 수정되었습니다.' });
  });
};

exports.deletepetdetail = (req,res) => {
  const petId = req.params.pet_id;
  
  const query = `DELETE FROM pet WHERE pet_id = ?`;

  db.query(query, [petId], (err,result) => {
    console.log('Pet deleted:', result);
    if(err){
      console.error('Error deleting pet',err);
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }

    console.log('Pet deleted successfully:', result);
    res.status(200).json({ success: true, message: '반려동물이 성공적으로 삭제되었습니다.' });
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
      return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
    res.status(200).json({ success: true, message: '반려동물 이미지가 성공적으로 수정되었습니다.' });
  });
};