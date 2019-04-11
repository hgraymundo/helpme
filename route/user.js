var User = require('../models').user;
var cerrors = require('../helpers/custom-errors');

module.exports = function(app) {
//   Validations
//   app.post('/validations', (req, res) => {
//     console.log( req.body )
//     req.checkBody("email", 'Email is required').isEmail().withMessage("E-mail not valid");
//     req.checkBody("firstname", 'Firstname is required, 3 characters minimum').notEmpty().isLength({ min: 3 }).trim().escape();
//     //more strong
//     req.checkBody("birthday").matches(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/).withMessage('The birthday field require the next format: YYYY-MM-DD');
//     //req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase, one number and one special character.');
//     req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase and one number.');
//     req.checkBody("confirm_password","The confirmation of the password does not match the password").equals(req.body.password);
//     req.checkBody("telephone").matches(/^01-\d{3}-\d{7}$/).trim().withMessage("The format of the telephone field is: 01-###-#######");
//     req.checkBody("cellphone").matches(/^\d{3}-\d{3}-\d{7}$/).trim().withMessage("The format of the cellphone field is: ###-###-#######");
//     req.checkBody("hour").matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).trim().withMessage("The format of the hour field is : ##:## , 24hrs format");
//     var errors = req.validationErrors();
//     if(errors){
//       let e = cerrors.getErrors(errors, "default");
//       res.json({ errors: e });
//     }
//     else { //not errors
//      res.json( req.body);
//     }
//   })
// CREATE
  app.post('/api/user/new', (req, res) => {
      console.log(req.body);
    req.checkBody("firstname", 'Firstname is required, 3 characters minimum').notEmpty().isLength({ min: 3 }).trim().escape();
    req.checkBody("lastname", 'Last name is required, 3 characters minimum').notEmpty().isLength({ min: 3 }).trim().escape();
    req.checkBody("email", 'Email is required').isEmail().withMessage("E-mail not valid");
    req.checkBody("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,15}$/).trim().withMessage('The password must be between 6-15 characters long, with at least one uppercase and one number.');
    req.checkBody("repeat-password","The confirmation of the password does not match the password").equals(req.body.password);
    // req.checkBody("cellphone").matches(/^\d{3}-\d{3}-\d{4}$/).trim().withMessage("The format of the cellphone field is: ###-###-####")
    req.checkBody("cellphone").matches(/^\d{10}$/).trim().withMessage("The format of the cellphone field is: ########## (7 digits)")

//  
    var errs = req.validationErrors();
    if(errs){
        let e = cerrors.getErrors(errs, "default");
        res.json({ errors: e });
    } else { 
        let { firstname, lastname, cellphone, email, password } = req.body;
        User.create({ firstname, lastname, cellphone, email, password })
            .then ( result => {
                let msg = "User created successfully";
                res.json({ status: 200, message: msg });
            })
            .catch( err =>{
                let e = cerrors.getErrors(err);
                // console.log(err)
                // let e = "There is an error, please contact the administrator";
                res.json({ errors: e });
            })
    }
  })

  app.get('/api/user/by/:cellphone', (req, res) => {
    User.findAll({ where: { cellphone: req.params.cellphone }, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
        .then( result => {
            res.json({status: 200, result })    
        })
        .catch( err => {
            console.log(err);
            let e = "There is an error, please contact the administrator";
            res.json({ status: 400,  errors: e });
        })
  })

  app.put('/api/user/edit', (req, res) => {

    let { firstname, lastname, mlastname, birthday, blood, gender, weight, height, cellphone, email } = req.body;

    User.update(
        { 
            firstname, lastname, mlastname, birthday, blood,  gender, weight, height
        },
        {
            where: { "cellphone": cellphone, "email": email}
        }
        )
    .then( result => {
        console.log(result)
        let msg = "Successful update";
        res.json({ status: 200, message: msg })
    })
    .catch( err => {
        console.log(err);
        let e = cerrors.getErrors(err);
        res.json({ status: 404, err })
    })
 
  })

}
