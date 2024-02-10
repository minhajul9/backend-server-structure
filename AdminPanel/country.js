const { getDatabase } = require('../database/mongodb')



exports.insertCountry = async (req, res) => {
    // countryTable.createIndex({ "name": 1 }, { unique: true });
    const body = req.body;
    const database = await getDatabase();

    const countryTable = database.collection("countryTable");
    // console.log(body)
    const result = await countryTable.insertOne(body);
    res.send(result);
}

exports.getCountry = async (req, res) => {

    const database = await getDatabase();

    const countryTable = database.collection("countryTable");
    console.log('object')
    const result = await countryTable.find().toArray();

    res.send(result);
}




