const Sauce = require("../models/Sauce");
const fs = require("fs");
const { timeStamp } = require("console");

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=> res.status(201).json({message : "Objet Enregistré"}))
        .catch(error => res.status(400).json({error}));
}

exports.modifySauce = (req, res, next) =>{
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json("Objet modifié !"))
        .catch(error => res.status(400).json({error}));
}

exports.deleteSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id : req.params.id})
                    .then(() => res.status(200).json("Objet supprimé !"))
                    .catch(error => res.status(400).json({error}));
            });
        })    
        .catch(error => res.status(500).json({error}));
}

exports.getOneSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

exports.addOneVote = (req, res, next) => {
    // check the integrity of the vote format
    if(req.body.like <= 1 && req.body.like >= -1) {
        Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                console.time("test1");
                sauce.usersLiked = [...new Set(sauce.usersLiked)]; //enlève doublon
                sauce.usersDisliked = [...new Set(sauce.usersDisliked)]; //enlève doublon
                console.timeEnd("test1");
                console.time("test2");
                switch (req.body.like) {
                    // if unliked or undisliked
                    case 0 : 
                        if (sauce.usersLiked.includes(req.body.userId)) {
                            sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
                            sauce.likes = sauce.usersLiked.length;
                        } else if (sauce.usersDisliked.includes(req.body.userId)){
                            sauce.usersDisliked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
                            sauce.dislikes = sauce.usersDisliked.length;
                        } else {
                            throw err;
                        }
                        break;
                    case 1 : 
                        if (!sauce.usersLiked.includes(req.body.userId)){
                            sauce.usersLiked.push(req.body.userId);
                            sauce.likes = sauce.usersLiked.length;
                            break;
                        } else {
                            throw err;
                        }
                    case -1 :
                        if (!sauce.usersDisliked.includes(req.body.userId)) {
                            sauce.usersDisliked.push(req.body.userId);
                            sauce.dislikes = sauce.usersDisliked.length;
                            break;
                        } else {
                            throw err;
                        }
                }
                console.timeEnd("test2");
                console.time("test3");
                Sauce.updateOne({_id: req.params.id}, sauce)
                    .then(() => res.status(200).json("vote pris en compte !"))
                    .catch(error => res.status(400).json({error}));
                console.timeEnd("test3");
                })
            .catch(error => res.status(404).json({error}));         
    } else {
        throw err;
    }

}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}