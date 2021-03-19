'use strict';

const fs = require('fs');
const express = require('express');
const Collection = require('../models/data-collection.js');

// MIDDLEWARE

const basicAuth = require('../auth/middleware/basic.js');
const bearerAuth = require('../auth/middleware/bearer.js')
const permissions = require('../auth/middleware/acl.js')

const v2router = express.Router();

const models = new Map();

v2router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (models.has(modelName)) {
    req.model = models.get(modelName);
    next();
  } else {
    const fileName = `${__dirname}/../models/${modelName}/model.js`;
    if (fs.existsSync(fileName)) {
      const model = require(fileName);
      models.set(modelName, new Collection(model));
      req.model = models.get(modelName);
      next();
    }
    else {
      next("Invalid Model");
    }
  }
});

v2router.get('/:model', bearerAuth, handleGetAll);
v2router.get('/:model/:id', bearerAuth, handleGetOne);
v2router.post('/:model', bearerAuth, permissions('create'), handleCreate);
v2router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
v2router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id)
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj)
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}


module.exports = v2router;
