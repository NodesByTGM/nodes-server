import { Schema } from "mongoose";

function attachId(this: any, res: any) {
    if (res == null) {
        return
    }

    function replaceId(res: any) {
        if (Array.isArray(res)) {
            res.forEach(v => {
                if (isObjectId(v)) {
                    return;
                }
                if (v._id) {
                    v.id = v._id.toString();
                    // v._id = undefined
                }
                if(v.__v){
                    v.__v = undefined
                }
                Object.keys(v).map(k => {
                    if (Array.isArray(v[k])) {
                        replaceId(v[k]);
                    }
                });
            });
        } else {
            if (isObjectId(res)) {
                return res;
            }
            if (res._id) {
                res.id = res._id.toString();
            }
            if(res.__v){
                res.__v = undefined
            }
            Object.keys(res).map(k => {
                if (Array.isArray(res[k])) {
                    replaceId(res[k]);
                }
            });
        }
    }

    if (this._mongooseOptions.lean) {
        replaceId(res);
    }
}

function isObjectId(v: any) {
    if (v == null) {
        return false;
    }
    const proto = Object.getPrototypeOf(v);
    if (proto == null ||
        proto.constructor == null ||
        proto.constructor.name !== 'ObjectId') {
        return false;
    }
    return v._bsontype === 'ObjectId';
}

export function mongooseLeanId(schema: Schema) {
    schema.post('find', attachId);
    schema.post('findOne', attachId);
    schema.post('findOneAndUpdate', attachId);
    schema.post('findOneAndReplace', attachId);
    schema.post('findOneAndDelete', attachId);
}