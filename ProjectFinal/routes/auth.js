var router = require('express').Router();
var passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));


// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});



// auth with facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }));
router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});


module.exports = router;
