const expect = require("chai").expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", function () {
	it("should throw an error if no authorization header is present", function () {
		const req = {
			get: function () {
				return null;
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
	});

	it("should throw an error if the authorization header is only one string", function () {
		const req = {
			get: function () {
				return "sdfasfd";
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it("should throw an error if the token cannot be verified", function () {
		const req = {
			get: function () {
				return "Bearer xyz";
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it("should yield a userId", function () {
		const req = {
			get: function () {
				return "Bearer xyz";
			},
		};
		sinon.stub(jwt, 'verify')
		jwt.verify.returns({userId: 'someid'})
		
		authMiddleware(req, {}, () => {})
		expect(req).to.have.property('userId');
		expect(req).to.have.property('userId', 'someid')
		expect(jwt.verify.called).to.be.true;
		jwt.verify.restore();
	});
});
