export function onFetch(state, action) {
    if (action.type == "FETCH"){

        state.fetching = true;
        state.saved = false;
        state.fetched = false;

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}

export function onFetchRejected(state, action) {
    if (action.type == "FETCH_REJECTED"){

        state.fetching = false;
        state.fetched = true;
        state.error = action.payload;

        try{
            action.meta.onError()
        }catch(e){}

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}

export function onFetchFulfilled(state, action) {
    if (action.type == "FETCH_FULFILLED"){

        state.fetching = false;
        state.fetched = true;
        state.data = action.payload;

        try{
            action.meta.onSuccess()
        }catch(e){}

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}

export function onSave(state, action) {
    if (action.type == "SAVE"){

        state.saving = true;
        state.saved = false;

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}

export function onSaveRejected(state, action) {
    if (action.type == "SAVE_REJECTED"){

        state.saving = false;
        state.error = action.payload;

        try{
            action.meta.onError()
        }catch(e){}

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}

export function onSaveFulfilled(state, action) {
    if (action.type == "SAVE_FULFILLED"){

        state.saving = false;
        state.saved = true;

        try{
            action.meta.onSuccess()
        }catch(e){}

        return function (data = {}) {
            Object.assign(state, data);
        }
    }

    return function () {}; //Noop function
}