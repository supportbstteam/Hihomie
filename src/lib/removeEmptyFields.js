const removeEmptyFields = async (obj) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];

        // 1. Remove if undefined, null, empty string, or NaN
        if (value === undefined || value === null || value === "" || Number.isNaN(value)) {
            delete obj[key];
        }
        // 2. If it's a nested object, clean it recursively
        else if (typeof value === "object" && !Array.isArray(value)) {
            removeEmptyFields(value);
            // If the nested object is now completely empty, delete the parent key too
            if (Object.keys(value).length === 0) {
                delete obj[key];
            }
        }
    });
    return obj;
};

export default removeEmptyFields;