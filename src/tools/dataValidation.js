function checkPasswordConfirmation(password, passwordConfirmation, setPasswordConfirmationMessage) {
    if (password !== passwordConfirmation) {
        setPasswordConfirmationMessage("Password and password confirmation do not match");
        return false;
    }
    return true;
}

function validatePassword(password, setPasswordMessage) {
    if (!/^[a-zA-Z0-9]+$/.test(password)) {
        setPasswordMessage("Password must containt only a-z, A-Z, 0-9");
        return false;
    }
    if (!/(?=.*\d)/.test(password)) {
        setPasswordMessage("Password must containt at least one digit");
        return false;
    }
    if (!/(?=.*[a-z])/.test(password)) {
        setPasswordMessage("Password must containt at least one lowercase letter");
        return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
        setPasswordMessage("Password must containt at least one uppercase letter");
        return false;
    }
    return true;
}

function validateLogin(login, setLoginMessage) {
    if (login.length < 2 || login.length > 50) {
        setLoginMessage("Login length must be from 2 to 50 characters");
        return false;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(login)) {
        setLoginMessage("Login must containt only a-z, A-Z, 0-9 or whitespace");
        return false;
    }
    return true;
}

function validateFullName(fullName, setFullNameMessage) {
    if (fullName.length < 2 || fullName.length > 50) {
        setFullNameMessage("Full name length must be from 2 to 50 characters");
        return false;
    }
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
        setFullNameMessage("Full name must containt only a-z, A-Z or whitespace");
        return false;
    }
    return true;
}

export {
    checkPasswordConfirmation,
    validatePassword,
    validateLogin,
    validateFullName,
    // validateRole
};

