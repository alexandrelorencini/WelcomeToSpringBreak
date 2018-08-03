module.exports = (originalRender) => (req, res) => {
    switch (req.method) {
        case 'GET': {
            renderGet(req, res);
            break;
        }
        case 'POST': {
            renderPost(req, res);
            break;
        }
        case 'PUT': {
            renderPut(req, res);
            break;
        }
        case 'DELETE': {
            renderDelete(req, res);
            break;
        }
    }

    originalRender(req, res);
}

function renderGet(req, res) {
    const data = res.locals.data;
    if (res.statusCode === 200 && data && Array.isArray(data)) {
        res.locals.data = {
            items: data,
            count: data.length,
            page: 0,
            pageSize: 500,
        };
    }
}

function renderPost(req, res) {
    if (res.statusCode === 201) {
        res.locals.data = {
            id: res.locals.data.id,
        };
    }
}

function renderPut(req, res) {
    if (res.statusCode === 200) {
        res.locals.data = undefined;
    }
}

function renderDelete(req, res) {
    if (res.statusCode === 200) {
        res.locals.data = undefined;
    }
}
