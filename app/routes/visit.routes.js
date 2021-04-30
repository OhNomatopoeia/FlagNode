module.exports = (app) => {
    const visit = require('../controllers/visit.controller.js');

    /**
     * @description Gets visit with visitId
     * @param visitId Unique ID for visit
     */
     app.get("/visits/:visitId", visit.getVisit)

    /**
     * @description Gets all visits for user (validate user with authentication token)
     */
    app.get("/visits", visit.getVisits)

    /**
     * @description Creates visit
     */
    app.post("/visits", visit.createVisit)

    /**
     * @description Accepts visit
     */
    app.put("/visits/:visitId/accept", visit.acceptVisit)

}