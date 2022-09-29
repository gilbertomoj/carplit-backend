module.exports = {
    async checkPermission(user, id, message) {
        if (user != id) {
            return { message, isValid: false };
        } else {
            return { isValid: true };
        }
    }
}


