require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const Spies = require('../lib/models/Spies');
const Villains = require('../lib/models/Villains');

describe.skip('Spies and Villains', () => {
    const spies = [
        { name: 'James Bond', weapon: 'PP9', vehicle: 'Aston Martin'},
        { name: 'Jack Ryan', weapon: 'Glock 19', vehicle: 'Bike'},
        { name: 'Jason Bourne', weapon: 'Fists', vehicle: 'Feet'}
    ];

    let createdSpies;

    const creator = spy => {
        return request(app).post('/spies')
            .send(spy);
    };

    beforeEach(() => {
        return Spies.drop();
    });

    beforeEach(() => {
        return Promise.all(spies.map(creator))
            .then(cs => {
                createdSpies = cs.map(s => s.body);
            });
    });

    it('gets all spies', () => {
        return request(app).get('/spies').set('Accept', 'application/json').then(res => {
            expect(res.body).toEqual(createdSpies);
        });
    });

    it('create a spy', () => {
        return request(app).post('/spies')
            .send({ name: 'Johnny English', weapon: 'Incompetence', vehicle: 'Parachute' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Johnny English',
                    weapon: 'Incompetence',
                    vehicle: 'Parachute'
                });
            });
    });

    it('get a spy by id', () => {
        return request(app).get(`/spies/${createdSpies[0]._id}`)
            .then(res => {
                expect(res.body).toEqual(createdSpies[0]);
            });
    });

    it('returns 404 when there is no method', () => {
        return request(app)
            .patch('/spies')
            .send({})
            .then(res => {
                expect(res.statusCode).toEqual(404);
            });
    });

    it('returns 404 when there is no route', () => {
        return request(app).get('/shelter').then(res => {
            expect(res.statusCode).toEqual(404);
        });
    });
});
