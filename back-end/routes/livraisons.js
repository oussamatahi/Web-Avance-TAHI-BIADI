const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Livraison, validate} = require('../models/livraison');
const {Facture} = require('../models/facture');
const _ = require("lodash");
const express = require('express');
const router = express.Router();

router.get('/',auth, async (req, res) => {
    const livraison = await Livraison.find().populate("facture").sort('-dateOn');
    res.send(livraison);
});

router.post('/',[auth,admin], async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    for (let index = 0; index < req.body.facture.length; index++) {
        let fac = await Facture.findById(req.body.facture[index])
  
        if (!fac)
        return res.status(404).send(`This commande was not found!`); 
    }

    let livraison = new Livraison(
        _.pick(req.body,["facture"])
    );
    
    livraison = await livraison.save();

    res.send(livraison.populate("livraison"));
});

router.delete('/:id',[auth,admin], async (req, res) => {
    const livraison = await Livraison.findByIdAndRemove(req.params.id);
  
    if (!livraison) return res.status(404).send('The livraison with the given ID was not found.');
  
    res.send(livraison);
});
  
router.get('/:id',auth, async (req, res) => {
    const livraison = await Livraison.findById(req.params.id).populate("facture");
  
    if (!livraison) return res.status(404).send('The livraison with the given ID was not found.');
  
    res.send(livraison);
});
  
module.exports = router; 