const {body, validationResult} = require('express-validator');
const bcryptJs = require('bcryptjs');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const asyncHandler = require('express-async-handler');

const validateFirstname = [
    body('firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('firstname').isAlpha().withMessage('First name must only contain letters'),
];

const validateLastname = [
    body('lastname').isLength({min: 3}).withMessage('Last name must be at least 3 characters long'),
    body('lastname').isAlpha().withMessage('Last name must only contain letters'),
];

const validateUsername = [
    body('username').isLength({min: 3}).withMessage('Username must be at least 3 characters long'),
    body('username').isAlphanumeric().withMessage('Username must only contain letters and numbers'),
    body('username').custom(async (value) => {
        const user = await prisma.user.findUnique({where: {user_name: value}});
        console.log(user);
        if(user) {
            return Promise.reject('Username already exists');
        }
        return Promise.resolve();
    }),
];

const validatePassword = [
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
];

const validateConfirmPassword = [
    body('confirmPassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            return Promise.reject();
        }
        return Promise.resolve();
    }).withMessage('Passwords do not match')
];

const signupController = {
    renderSignup: (req, res) => {
        res.render('signup');
    },

    signup: [
        validateFirstname,
        validateLastname,
        validateUsername,
        validatePassword,
        validateConfirmPassword,
        asyncHandler(async (req, res) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                res.render('signup', {errors: errors.array()});
            } else {
                const {firstname, lastname, username, password} = req.body;
                const hashedPassword = await bcryptJs.hash(password, 10);
                await prisma.user.create({
                    data: {
                        first_name: firstname,
                        last_name: lastname,
                        user_name: username,
                        password: hashedPassword
                    }
                });
                res.redirect('/login');
            }
        })
    ]

}

module.exports = signupController;