module.exports = function ayncMiddleware(handler) {
    return async (req, res, next) => {
        // Try and catch is for preventing the system terminate when an unexceptable error occur.
        try {
            await handler(req, res);
        } catch (ex) {
            // Log the exception here.

            // Show the error on the console.
            console.log(ex);
        }
    };
};
