module.exports = {
    async checkPermission(user, id, message) {
        if (user != id) {
            return { message, isValid: false, status: 403 };
        } else {
            return { isValid: true };
        }
    },
};
