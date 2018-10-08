const Spies = require('../models/Spies');
const Villains = require('../models/Villains');
const notFound = require('./not-found');

const resources = {
    Spies,
    Villains
};

const get = (req, res) => {
    const { id, query, resource } = req;
    if(id) resources[resource].get(id).then((item) => {
        if(!item) notFound(req, res);
        else res.send(item);
    });
    else resources[resource].getAll(query).then(res.send);
};

const post = (req, res) => {
    const { body, resource } = req;
    resources[resource].create(body).then(res.send);
};

const put = (req, res) => {
    const { id, body, resource } = req;
    resources[resource].update(id, body).then(res.send);
};

const remove = (req, res) => {
    const { id, resource } = req;
    resources[resource].delete(id).then(res.send);
};

const methods = {
    get,
    post,
    put,
    delete: remove
};

module.exports = (req, res) => {
    const method = methods[req.method.toLowerCase()] || notFound;
    method(req, res);
};
