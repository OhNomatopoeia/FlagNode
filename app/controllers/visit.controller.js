const { parseJwt } = require("../helpers/auth.helper");
const Visit = require("../models/visit.model")

exports.getVisits = (req, res) => {
    const token = req.auth
    const decodedToken = parseJwt(token)

    // authenticate token. if token is wrong send error

    const user_ID = decodedToken.user_ID
    const userType = decodedToken.type

    if (userType == "Admin") {
        return Visit.find().then(data => {
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    if (userType == "Mediator") {
        return Visit.find(visit => {
            if (visit.mediator_ID == user_ID) { return true }
            return false
        }).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    if (userType == "Client") {
        return Visit.find(visit => {
            if (visit.user_ID == user_ID) { return true }
            return false
        }).then(data => {
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    res.status(401).send({
        message: "User must be registered to have access to visits"
    })

    
};

exports.getVisit = (req, res) => {
    const token = req.auth
    const decodedToken = parseJwt(token)

    // authenticate token. if token is wrong send error

    const user_ID = decodedToken.user_ID
    const userType = decodedToken.type

    const params = req.params

    if (!params || !params.visitId || params.visitId.trim().length < 0) {
        res.status(400).send({
            message: "Missing visit id"
        })
    } 

    if (userType == "Admin") {
        return Visit.findById(params.visitId).then(data => {
            if (!data) { return res.status(404).send( { message: "Could not find visit with that id" } )}
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    if (userType == "Mediator") {
        return Visit.findOne({ mediator_ID: user_ID, visitId: params.visitId}).then(data => {
            if (!data) { return res.status(404).send( { message: "Could not find visit with that id" } )}
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    if (userType == "Client") {
        return Visit.findOne({ user_ID: user_ID, visitId: params.visitId}).then(data => {
            if (!data) { return res.status(404).send( { message: "Could not find visit with that id" } )}
            res.send(data)
        }).catch(err => {
            res.status(error.code).send({
                message: err.message || err.err || "There was an error fetching visits"
            })
        })
    }

    res.status(401).send({
        message: "User must be registered to have access to visits"
    })

};

exports.createVisit = (req, res) => {
    const token = req.auth
    const decodedToken = parseJwt(token)
    //authenticate user here

    const body = req.body
    if (!body) {
        return res.status(400).send({
            message: "Missing body from visit creation request"
        });
    }

    if (!body.user_ID || !body.realEstate_ID || !body.mediator_ID) {
        return res.status(400).send({
            message: "Missing data from body"
        })
    }

    const visit = new Visit({
        realEstate_ID: body.realEstate_ID,
        user_ID: body.user_ID,
        mediator_ID: body.mediator_ID,
        date: undefined,
        accepted: false
    })

    visit.save().then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.status(err.code).send({
            message: err.message || err.err || "There was an error creating a visit"
        })
    })
};

exports.acceptVisit = (req, res) => {
    const token = req.auth
    const decodedToken = parseJwt(token)

    // authenticate token. if token is wrong send error

    const user_ID = decodedToken.user_ID
    const userType = decodedToken.type

    if (userType != "Mediator") { return res.status(401).send({ message: "User must be a Mediator to accept a visit" }) }

    const params = req.params
    const body = req.body

    if (!body.date || body.accepted == undefined) {
        return res.status(400).send({
            message: "Missing data from body"
        })
    }

    if (new Date(body.date) < new Date() || body.date < Date.now()) { 
        return res.status(400).send({
            message: "Wrong date format"
        })
    }

    Visit.findOneAndUpdate({ _id: params.visitId, mediator_ID: user_ID }, {
        date: body.date,
        accepted: body.accepted
    }).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
        res.status(err.code).send({
            message: err.message || err.err || "There was an error accepting this visit"
        })
    })
};