const request = require('supertest');
const express = require('express');
const app = require('./server');

jest.mock('sequelize');

describe('App > ', () => {
  describe('Testing Scenario > ', () => {
    const port = Math.floor(Math.random() * 4000) + 2000;
    const mockExpress = express();
    const server = app(port, mockExpress, true);

    it('should prepare the server and return a start function', () => {
      const expectedResult = ['start'];

      expect(Object.keys(server)).toEqual(expectedResult);
      expect(typeof server.start).toBe('function');
    });

    it('will return the list of available routes when GET / is called', async () => {
      await server.start();

      const response = await request(mockExpress).get('/').set('Accept', 'application/json');
      const expectedStatus = 200;
      const expectedResult = {
        availableRoutes: [
          '/',
          '/lists',
          '/lists/:id',
          '/lists',
          '/lists/:id',
          '/lists/:id',
          '/lists/delete',
        ],
      };

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toEqual(expectedResult);
    });
  });

  describe('Not Testing Scenario >', () => {
    const port = Math.floor(Math.random() * 4000) + 2000;
    const mockExpress = express();
    const server = app(port, mockExpress, false);

    it('should prepare the server and return a start function', async () => {
      const expectedResult = ['start'];

      expect(Object.keys(server)).toEqual(expectedResult);
      expect(typeof server.start).toBe('function');

      await server.start();
    });
  });
});
