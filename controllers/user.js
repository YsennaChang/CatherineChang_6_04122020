const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const passwordValidator = require ("password-validator");

const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

const User = require("../models/User");

const regex = {
    password : /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/ // Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial et une longueur d'au moins 10 
};

exports.signup = (req, res, next) => {
    if(!emailValidator.validate(req.body.email)) {
        console.log("email invalide");
        return res.status(401).json({error : "Veuillez entrer une adresse mail valide"});
    } else if (!passwordSchema.validate(req.body.password)) {
        return res.status(401).json({error : "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 2 chiffre, sans espace et une longueur d'au moins 8"});
    } else if (emailValidator.validate(req.body.email) && passwordSchema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email : req.body.email,
                    password : hash
                });
                user.save()
                    .then(() => res.status(201).json({message : "Utilisateur créé"}))
                    .catch(error => res.status(400).json({message :error}));
            })  
            .catch(error => res.status(500).json({error}))
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({error : "Utilisateur non trouvé !"})
            }
            bcrypt.compare( req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error : "Mot de passe incorrect !"})
                    }
                    res.status(200).json({
                        userId : user._id,
                        token : jwt.sign(
                            { userId : user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn : "24h"}
                            )
                    });
                })
                .catch(error => res.status(500).json({error}))
            })
        .catch(error => res.status(500).json({error}))
};