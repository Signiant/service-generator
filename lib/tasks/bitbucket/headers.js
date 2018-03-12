const headers = (token) => {
    return { Authorization: `Bearer ${token}` };
};

module.exports = headers;