function correlationId(req) {
    return (req.headers && req.headers['correlation id']) ? req.headers['correlation id'] : "";
}
module.exports.create=function(logger) {
    return function(req, res, next){
        var rEnd = res.end;
        req._rlStartTime = (new Date);

        var req_msg = {
            date: req._rlStartTime.toISOString(),
            method: req.method,
            url: req.url,
            queryParams: req['query'],
            'Correlation Id': correlationId(req)
        }
        logger.info('request: ', req_msg);

        res.end = function(chunk, encoding) {
            // Do the work expected
            res.end = rEnd;
            res.end(chunk, encoding);
            if(req.body) {
                req_msg.body = JSON.stringify(req.body);
                logger.debug('request: ', req_msg);
            }

            var res_msg = {
                date: req._rlStartTime.toISOString(),
                method: req.method,
                url: req.url,
                status: res.statusCode,
                'Correlation Id': correlationId(req),
                took: ((new Date) - req._rlStartTime) + 'ms'
            }
            logger.info('response: ', res_msg);

            if(chunk) {
                res_msg.body = chunk;
                logger.debug('response: ', res_msg);
            }
        }
        next();
    };
}