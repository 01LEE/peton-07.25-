function isYoursNoticeboard(user_id, post_user_id) {
    return user_id === post_user_id;
}

module.exports = isYoursNoticeboard;