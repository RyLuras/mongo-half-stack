require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app');
const Spies = require('../lib/models/Spies');
const Villains = require('../lib/models/Villains');

// describe.each
describe('Spies and Villains', () => {

    const spies = [
        { name: 'James Bond', weapon: 'PP9', vehicle: 'Aston Martin' },
        { name: 'Jack Ryan', weapon: 'Glock 19', vehicle: 'Bike' },
        { name: 'Jason Bourne', weapon: 'Fists', vehicle: 'Feet' }
    ];
    const villains = [
        { name: 'Alec Trevelyan', weapon: 'GoldenEye Satellite', motive: 'Money' },
        { name: 'Mr Terrorist', weapon: 'Nuclear Warhead', motive: 'Terror' },
        { name: 'Brian Cox', weapon: 'Hitmen', motive: 'Coverup' }
    ];

    let createdSpies;
    let createdVillains;

    const spyMaker = spy => {
        return request(app)
            .post('/spies')
            .send(spy);
    };
    const villainMaker = villain => {
        return request(app)
            .post('/villains')
            .send(villain);
    };

    beforeEach(() => {
        return Promise.all([
            Spies.drop(), 
            Villains.drop()
        ]);
    });
    beforeEach(() => {
        return Promise.all([
            Promise.all(spies.map(spyMaker))
                .then(cs => createdSpies = cs.map(s => s.body)),
            Promise.all(villains.map(villainMaker))
                .then(cv => createdVillains = cv.map(v => v.body))
        ]);
    });

    describe('get(id) routes', () => {
        it('get a spy by id', () => {
            return request(app)
                .get(`/spies/${createdSpies[0]._id}`)
                .then(res => expect(res.body).toEqual(createdSpies[0]));
        });
        it('get a villain by id', () => {
            return request(app)
                .get(`/villains/${createdVillains[0]._id}`)
                .then(res => expect(res.body).toEqual(createdVillains[0]));
        });
    });

    describe('getAll routes', () => {
        it('gets all spies', () => {
            return request(app)
                .get('/spies')
                .then(res => expect(res.body).toEqual(createdSpies));
        });
        it('gets all villains', () => {
            return request(app)
                .get('/villains')
                .then(res => expect(res.body).toEqual(createdVillains));
        });
    });

    describe('getAll with search', () => {
        it('gets all spies that meet certain criteria', () => {
            return request(app)
                .get('/spies')
                .query({ name: 'James Bond' })
                .then(res => expect(res.body).toEqual([createdSpies[0]]));
        });
        it('gets all villains that meet certain criteria', () => {
            return request(app)
                .get('/villains')
                .query({ name: 'Alec Trevelyan' })
                .then(res => expect(res.body).toEqual([createdVillains[0]]));
        });
    });

    describe('create routes', () => {
        it('creates a spy', () => {
            const recruit = { name: 'Johnny English', weapon: 'Incompetence', vehicle: 'Parachute' };
            const expected = { ...recruit, _id: expect.any(String) };
            return request(app)
                .post('/spies')
                .send(recruit)
                .then(res => expect(res.body).toEqual(expected));
        });
        it('create a villain', () => {
            const evilIncarnate = { name: 'Sauvage', weapon: 'Poison', motive: 'Hated Mr Bean' };
            const expected = { ...evilIncarnate, _id: expect.any(String) };
            return request(app)
                .post('/villains')
                .send(evilIncarnate)
                .then(res => expect(res.body).toEqual(expected));
        });
    });

    describe('delete routes', () => {
        it('kills a spy', () => {
            return request(app)
                .delete(`/spies/${createdSpies[0]._id}`)
                .then(deadSpy => request(app).get(`/spies/${deadSpy.body._id}`))
                .then(res => expect(res.body).toBeNull());
        });
        it('kills a villain', () => {
            return request(app)
                .delete(`/villains/${createdVillains[0]._id}`)
                .then(deadVillain => request(app).get(`/villains/${deadVillain.body._id}`))
                .then(res => expect(res.body).toBeNull());
        });
    });

    describe('update routes', () => {
        it('turns 007 into 008 (updates a spy)', () => {
            const additions = { weapon: 'Seduction', vehicle: 'Love Boat' };
            const expected = { ...additions, _id: expect.any(String), name: spies[0].name };
            return request(app)
                .put(`/spies/${createdSpies[0]._id}`)
                .send(additions)
                .then(res => expect(res.body).toEqual(expected));
        });
        it('villain resurfaces with new backstory (updates a villain)', () => {
            const additions = { weapon: 'The Armies of Mycenae', motive: 'Domination' };
            const expected = { ...additions, _id: expect.any(String), name: villains[2].name };
            return request(app)
                .put(`/villains/${createdVillains[2]._id}`)
                .send(additions)
                .then(res => expect(res.body).toEqual(expected));
        });
    });

    describe('404 routes', () => {
        it('returns 404 when there is no route', () => {
            return request(app)
                .get('/shelter')
                .then(res => expect(res.statusCode).toEqual(404));
        });

        it('returns 404 when there is no spy method', done => {
            return request(app)
                .patch('/spies')
                .send({})
                .then(res => expect(res.statusCode).toEqual(404))
                .then(() => done());
        });

        it('returns 404 when there is no villain method', done => {
            return request(app)
                .patch('/villains')
                .send({})
                .then(res => expect(res.statusCode).toEqual(404))
                .then(() => done());
        });
    });
});
