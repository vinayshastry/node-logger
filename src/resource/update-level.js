
module.exports = function(logger) {
    /**
     * PUT /logger
     * {log_level: "debug"}
     * Cookie: auth-token=validToken
     */
    return function(req, res) {
        var new_level = req.body.log_level;
        if(new_level) {
            Object.keys(logger.transports).forEach(function(transport) {
                logger.transports[transport].level = new_level;
            });
            logger.level = new_level;
            return res.send(200);
        } else {
            return res.send(422);
        }

    }
}
