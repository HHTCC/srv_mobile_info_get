// mysql CRUD
let sqlclient = module.exports;

let _pool;

let NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function (opt) {
    _pool = require('./mysql_pool').createMysqlPool(opt);
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {function} cb Callback function.
 *
 */
NND.query = function (sql, args, cb) {
    let promise = _pool.acquire();
    //console.de6bug("_pool size available pending", _pool.size,  _pool.available, _pool.pending)

    promise.then(function (client) {
        client.query(sql, args, function (error, results, fields) {
            if (error) {
                _pool.destroy(client);
                cb(error, results);
            }
            else {
                _pool.release(client);
                cb(error, results);
            }
        });
    }, function () {
        console.error("reject");
    }).catch(function (err) {
        cb(err);
        console.error(err);
    });
};

/**
 * Close connection pool.
 */
NND.shutdown = function () {
    _pool.drain().then(function () {
        _pool.clear();
    });
};

/**
 * init database
 */
sqlclient.init = function (opt) {
    if (!!_pool) {
        return sqlclient;
    } else {
        NND.init(opt);
        sqlclient.insert = NND.query;
        sqlclient.update = NND.query;
        sqlclient.delete = NND.query;
        sqlclient.query = NND.query;
        return sqlclient;
    }
};

/**
 * shutdown database
 */
sqlclient.shutdown = function (opt) {
    NND.shutdown(opt);
};
